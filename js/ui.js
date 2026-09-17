/* ==========================================
   WARDEAL v0.3.3
   User Interface System
   Compact Stats + Progress Bars
========================================== */
let currentPage = "home";
let battleSubTab = "normal";
let activeMenuButton = null;
// ==========================================
// עדכון ממשק ראשי
// ==========================================
function updateUI() {
    if (!player) {
        return;
    }
    updateResources();
    updatePlayerInfo();
    updateSideBadge();
    updateLevel();
    updateProgressBars();
}
// ==========================================
// משאבים
// ==========================================
function updateResources() {
    setText(
        "money",
        player.money
    );
    setText(
        "gold",
        player.gold
    );
    setText(
        "diamonds",
        player.diamonds
    );
    setText(
        "blackMoney",
        player.blackMoney
    );
}
// ==========================================
// פרטי שחקן
// ==========================================
function updatePlayerInfo() {
    setText(
        "playerNameDisplay",
        player.name
    );
    setText(
        "playerSide",
        player.side === "police"
        ?
        "👮 משטרה"
        :
        "🕶️ עבריינים"
    );
    setText(
        "playerID",
        player.uid
    );
}
// ==========================================
// עדכון צד
// ==========================================
function updateSideBadge() {
    const badge =
        document.getElementById(
            "sideBadge"
        );
    if (!badge) {
        return;
    }
    if (player.side === "police") {
        badge.textContent = "👮";
    }
    else if (player.side === "criminal") {
        badge.textContent = "🕶️";
    }
    else {
        badge.textContent = "⚔️";
    }
}
// ==========================================
// עדכון רמה ונתוני שחקן
// ==========================================
function updateLevel(){
    setText(
        "levelCard",
        player.level
    );
    setText(
        "xp",
        player.xp
    );
    setText(
        "health",
        player.health
    );
    setText(
        "energy",
        player.energy
    );
    setText(
        "power",
        player.power
    );
    setText(
        "units",
        getUnits()
    );
}
// ==========================================
// מערכת פסי התקדמות
// ==========================================
function updateProgressBars(){
    if(!player){
        return;
    }
    updateBar(
        "healthBar",
        player.health,
        player.maxHealth
    );
    updateBar(
        "energyBar",
        player.energy,
        player.maxEnergy
    );
    updateBar(
        "powerBar",
        player.power,
        getPowerMax()
    );
    updateBar(
        "unitsBar",
        getUnits(),
        getUnitsMax()
    );
    updateBar(
        "xpBar",
        player.xp,
        player.nextLevelXp
    );
    updateBar(
        "levelBar",
        player.level,
        getLevelMax()
    );
}
// ==========================================
// עדכון פס בודד
// ==========================================
function updateBar(id,value,max){
    const bar =
    document.getElementById(id);
    if(!bar){
        return;
    }
    if(
        typeof value !== "number"
        ||
        typeof max !== "number"
        ||
        max <= 0
    ){
        bar.style.width = "0%";
        return;
    }
    let percent =
    (value / max) * 100;
    if(percent < 0){
        percent = 0;
    }
    if(percent > 100){
        percent = 100;
    }
    bar.style.width =
    percent + "%";
}
// ==========================================
// מקסימום כוח לתצוגה
// ==========================================
function getPowerMax(){
    if(!player){
        return 100;
    }
    return Math.max(
        player.power,
        100
    );
}
// ==========================================
// מקסימום יחידות לתצוגה
// ==========================================
function getUnitsMax(){
    if(!player){
        return 100;
    }
    return Math.max(
        getUnits(),
        100
    );
}
// ==========================================
// מקסימום רמה לתצוגה
// ==========================================
function getLevelMax(){
    if(!player){
        return 10;
    }
    return Math.max(
        player.level,
        10
    );
}
// ==========================================
// שינוי טקסט בטוח
// ==========================================
function setText(id,value){
    const element =
    document.getElementById(id);
    if(element){
        element.textContent =
        value ?? 0;
    }
}
// ==========================================
// פתיחת מערכת מהתפריט
// ==========================================
function openPage(page,button){
    currentPage = page;
    if(activeMenuButton){
        activeMenuButton.classList.remove(
            "active"
        );
    }
    if(button){
        button.classList.add(
            "active"
        );
        activeMenuButton = button;
    }
    const content =
    document.getElementById(
        "gameContent"
    );
    if(!content){
        return;
    }
    switch(page){
        case "home":
            if(typeof renderCity === "function"){
                renderCity(content);
            }
            else{
                content.innerHTML = `
                <div class="contentCard">
                🏰
                <h3>
                מפקדת WARDEAL
                </h3>
                <p>
                נהל את האימפריה שלך
                </p>
                </div>
                `;
            }
        break;
        case "work":
            renderWork(content);
        break;
        case "recruit":
            renderRecruit(content);
        break;
        case "property":
            renderProperties(content);
        break;
        case "business":
            renderBusiness(content);
        break;
        case "battle":
            renderBattle(content);
        break;
        case "shop":
            renderShop(content);
        break;
        case "actions":
            renderActions(content);
        break;
        case "daily":
            renderDailyMissions(content);
        break;
    }
}
// ==========================================
// מערכת עבודה
// ==========================================
function renderWork(content){
    if(!player){
        return;
    }
    const activeJobs =
    typeof getActiveJobsArray === "function"
    ?
    getActiveJobsArray()
    :
    [];
    let html = `
    <div class="contentCard">
    <h3>
    💼 עבודות
    </h3>
    `;
    // עבודות פעילות עם התקדמות
    if(
        activeJobs.length > 0
    ){
        html += `<h4>🕒 עבודות פעילות</h4>`;
        activeJobs.forEach((job,index)=>{
            const percent =
            typeof getJobProgress === "function"
            ?
            getJobProgress(index)
            :
            0;
            const timeLeft =
            typeof getJobTime === "function"
            ?
            getJobTime(index)
            :
            "";
            html += `
            <div class="activeJobCard">
                <div class="activeJobName">💼 ${job.name}</div>
                <div class="progress">
                    <div class="progressFill jobFill" style="width:${percent}%"></div>
                </div>
                <div class="jobTimeLeft">⏳ ${timeLeft}</div>
            </div>
            `;
        });
    }
    // עבודות זמינות
    const jobsList =
    typeof getAvailableJobs === "function"
    ?
    getAvailableJobs()
    :
    [];
    const activeIds =
    activeJobs.map(j=>j.id);
    const maxSlots =
    typeof MAX_ACTIVE_JOBS !== "undefined"
    ?
    MAX_ACTIVE_JOBS
    :
    2;
    const slotsFull =
    activeJobs.length >= maxSlots;
    html += `
    <h4>📋 עבודות זמינות (${activeIds.length}/${maxSlots})</h4>
    <div class="optionGrid">
    `;
    jobsList.forEach(job=>{
        const isRunning =
        activeIds.includes(job.id);
        const disabled =
        isRunning || slotsFull;
        html += `
        <button
        class="optionCard"
        ${disabled ? "disabled" : ""}
        onclick="startJob('${job.id}')">
        💼 ${job.name}
        <br>
        💰 ₪${job.money}
        <br>
        ⭐ ${job.xp} XP
        <br>
        ⚡ ${job.energy} | ⏱️ ${job.time} שנ'
        ${job.gold ? `<br>🥇 +${job.gold}` : ""}${job.diamonds ? ` 💎 +${job.diamonds}` : ""}${job.blackMoney ? ` 🖤 +${job.blackMoney}` : ""}
        ${isRunning ? "<br>🔄 פעילה" : ""}
        </button>
        `;
    });
    html += `
    </div>
    </div>
    `;
    content.innerHTML = html;
}
// ==========================================
// מערכת גיוס
// ==========================================
function renderRecruit(content){
    if(!player){
        return;
    }
    let html = `
    <div class="contentCard">
    <h3>
    👥 גיוס יחידות
    </h3>
    <p class="cityNoNews" style="margin-top:-6px">
    יחידות בשירותך: ${typeof getUnits === "function" ? getUnits() : 0}
    | כוח מיחידות: ${player.unitsPower || 0}
    </p>
    <div class="optionGrid">
    `;
    Object.keys(RECRUIT_TYPES).forEach(key=>{
        const unit = RECRUIT_TYPES[key];
        html += `
        <div class="ownedCard">
            <div class="ownedCardName">
                ${unit.icon || "👤"} ${unit.name}
                <span class="ownedCardLevel">אימון רמה ${(player.unitTraining && player.unitTraining[key]) || 1}</span>
            </div>
            <div class="ownedCardRow">
                💰 ₪${unit.cost} לגיוס | 💪 +${unit.power} כוח${unit.defense ? " | 🛡️ +" + unit.defense + " הגנה" : ""} | ⭐ ${unit.xp} XP
            </div>
            <button
            class="upgradeBtn"
            style="margin-bottom:6px"
            ${player.money < unit.cost ? "disabled" : ""}
            onclick="recruitUnit('${key}')">
                👥 גייס יחידה נוספת
            </button>
            <button
            class="upgradeBtn blackUpgradeBtn"
            ${player.money < ((player.unitTraining && player.unitTraining[key]) || 1) * Math.max(1, Math.ceil(unit.cost*0.5)) ? "disabled" : ""}
            onclick="upgradeRecruit('${key}')">
                ⬆️ שדרג אימון | ₪${((player.unitTraining && player.unitTraining[key]) || 1) * Math.max(1, Math.ceil(unit.cost*0.5))} | +${Math.max(1, Math.ceil(unit.power*0.2))} כוח והגנה
            </button>
        </div>
        `;
    });
    html += `
    </div>
    </div>
    `;
    content.innerHTML = html;
}
// ==========================================
// מערכת נכסים
// ==========================================
function renderProperties(content){
    if(!player){
        return;
    }
    const owned =
    typeof getOwnedProperties === "function"
    ?
    getOwnedProperties()
    :
    [];
    let html = `
    <div class="contentCard">
    <h3>
    🏠 נדל״ן
    </h3>
    <div class="realEstateTabs">
        <button class="realEstateTab active" onclick="openPage('property',this)">🏠 נכסים</button>
        <button class="realEstateTab" onclick="openPage('business',this)">🏢 עסקים</button>
    </div>
    `;
    // נכסים בבעלות + שדרוג
    if(owned.length > 0){
        html += `<h4>🏠 נכסים בבעלותך</h4><div class="realEstateItemsGrid">`;
        owned.forEach((property,index)=>{
            const level =
            property.level || 1;
            const income =
            property.income || 0;
            const upgradeCost =
            level *
            Math.floor(
                (property.price || 50000) * 0.15
            );
            const upgradeXp =
            typeof property.upgradeXp === "number"
            ?
            property.upgradeXp
            :
            50;
            const specialCost =
            typeof property.specialUpgradeCost === "number"
            ?
            property.specialUpgradeCost
            :
            50;
            const specialBonus =
            typeof property.specialUpgradeBonus === "number"
            ?
            property.specialUpgradeBonus
            :
            50;
            html += `
            <div class="ownedCard">
                <div class="ownedCardName">
                    ${property.name}
                    <span class="ownedCardLevel">רמה ${level}</span>
                </div>
                <div class="ownedCardRow">
                    📈 הכנסה: ₪${income}/דקה
                </div>
                <button
                class="upgradeBtn"
                ${player.money < upgradeCost ? "disabled" : ""}
                onclick="upgradeProperty(${index})">
                    ⬆️ שדרג | ₪${upgradeCost} | +₪${property.upgradeIncome || 0}/דקה | +${upgradeXp} XP
                </button>
                ${
                    property.specialUpgrade === true
                    ?
                    `<div class="specialUpgradeBadge">🖤 שודרג במיוחד</div>`
                    :
                    `<button
                    class="upgradeBtn blackUpgradeBtn"
                    ${(player.blackMoney || 0) < specialCost ? "disabled" : ""}
                    onclick="buyPropertySpecialUpgrade(${index})">
                        🖤 שדרוג מיוחד | ${specialCost} 🖤 | +₪${specialBonus} לצמיתות
                    </button>`
                }
            </div>
            `;
        });
        html += `</div>`;
    }
    // נכסים לרכישה
    const ownedIds =
    owned.map(p=>p.id);
    const availableToBuy =
    typeof PROPERTY_LIST !== "undefined"
    ?
    PROPERTY_LIST.filter(p=>!ownedIds.includes(p.id))
    :
    [];
    html += `<h4>🛒 נכסים לרכישה</h4>`;
    if(availableToBuy.length === 0){
        html += `<p class="cityNoNews">רכשת את כל הנכסים הזמינים!</p>`;
    }
    else{
        html += `<div class="optionGrid">`;
        availableToBuy.forEach(property=>{
            html += `
            <button
            class="optionCard"
            ${player.money < property.price ? "disabled" : ""}
            onclick="buyProperty(${property.id})">
            ${property.name}
            <br>
            💰 ₪${property.price}
            <br>
            📈 ₪${property.income}
            <br>
            ⭐ ${property.buyXp || 0} XP
            </button>
            `;
        });
        html += `</div>`;
    }
    html += `</div>`;
    content.innerHTML = html;
}
// ==========================================
// מערכת עסקים
// ==========================================
function renderBusiness(content){
    if(!player){
        return;
    }
    const owned =
    typeof getOwnedBusinesses === "function"
    ?
    getOwnedBusinesses()
    :
    [];
    let html = `
    <div class="contentCard">
    <h3>
    🏠 נדל״ן
    </h3>
    <div class="realEstateTabs">
        <button class="realEstateTab" onclick="openPage('property',this)">🏠 נכסים</button>
        <button class="realEstateTab active" onclick="openPage('business',this)">🏢 עסקים</button>
    </div>
    <h4>🏢 עסקים</h4>
    `;
    // עסקים בבעלות + שדרוג
    if(owned.length > 0){
        html += `<h4>🏢 עסקים בבעלותך</h4><div class="realEstateItemsGrid">`;
        owned.forEach((business,index)=>{
            const level =
            business.level || 1;
            const income =
            business.income || 0;
            const upgradeCost =
            level *
            Math.floor(
                (business.price || 100000) * 0.15
            );
            const upgradeXp =
            typeof business.upgradeXp === "number"
            ?
            business.upgradeXp
            :
            100;
            const specialCost =
            typeof business.specialUpgradeCost === "number"
            ?
            business.specialUpgradeCost
            :
            50;
            const specialBonus =
            typeof business.specialUpgradeBonus === "number"
            ?
            business.specialUpgradeBonus
            :
            50;
            html += `
            <div class="ownedCard">
                <div class="ownedCardName">
                    ${business.name}
                    <span class="ownedCardLevel">רמה ${level}</span>
                </div>
                <div class="ownedCardRow">
                    📈 הכנסה: ₪${income}/דקה
                </div>
                <button
                class="upgradeBtn"
                ${player.money < upgradeCost ? "disabled" : ""}
                onclick="upgradeBusiness(${index})">
                    ⬆️ שדרג | ₪${upgradeCost} | +₪${business.upgradeIncome || 0}/דקה | +${upgradeXp} XP
                </button>
                ${
                    business.specialUpgrade === true
                    ?
                    `<div class="specialUpgradeBadge">🖤 שודרג במיוחד</div>`
                    :
                    `<button
                    class="upgradeBtn blackUpgradeBtn"
                    ${(player.blackMoney || 0) < specialCost ? "disabled" : ""}
                    onclick="buyBusinessSpecialUpgrade(${index})">
                        🖤 שדרוג מיוחד | ${specialCost} 🖤 | +₪${specialBonus} לצמיתות
                    </button>`
                }
            </div>
            `;
        });
        html += `</div>`;
    }
    // עסקים לרכישה
    const ownedIds =
    owned.map(b=>b.id);
    const availableToBuy =
    typeof BUSINESS_LIST !== "undefined"
    ?
    BUSINESS_LIST.filter(b=>!ownedIds.includes(b.id))
    :
    [];
    html += `<h4>🛒 עסקים לרכישה</h4>`;
    if(availableToBuy.length === 0){
        html += `<p class="cityNoNews">רכשת את כל העסקים הזמינים!</p>`;
    }
    else{
        html += `<div class="optionGrid">`;
        availableToBuy.forEach(business=>{
            html += `
            <button
            class="optionCard"
            ${player.money < business.price ? "disabled" : ""}
            onclick="buyBusiness(${business.id})">
            ${business.name}
            <br>
            💰 ₪${business.price}
            <br>
            📈 ₪${business.income}
            <br>
            ⭐ ${business.buyXp || 0} XP
            </button>
            `;
        });
        html += `</div>`;
    }
    html += `</div>`;
    content.innerHTML = html;
}
// ==========================================
// מערכת קרב
// ==========================================
// ==========================================
// בית חולים
// ==========================================
function renderHospital(content){
    if(!player){
        return;
    }
    const status =
    typeof getHospitalStatus === "function"
    ?
    getHospitalStatus()
    :
    { locked:false, timeText:"" };
    const costs = {
        money: typeof getHospitalSkipCost === "function" ? getHospitalSkipCost("money") : 2000,
        gold: typeof getHospitalSkipCost === "function" ? getHospitalSkipCost("gold") : 20,
        diamonds: typeof getHospitalSkipCost === "function" ? getHospitalSkipCost("diamonds") : 2,
        blackMoney: typeof getHospitalSkipCost === "function" ? getHospitalSkipCost("blackMoney") : 50
    };
    content.innerHTML = `
    <div class="contentCard">
    <h3>🏥 בית חולים</h3>
    <p class="cityNoNews">
    נפצעת קשה בקרב ואתה מחלים.
    <br>
    זמן שנותר: <b>${status.timeText}</b>
    </p>
    <p class="battleInfoSub" style="text-align:center;display:block;margin-bottom:10px">
        אפשר לשלם כדי לצאת מוקדם ולהחלים לגמרי (העלות עולה עם הרמה - כרגע רמה ${player.level}):
    </p>
    <div class="optionGrid">
    <button
    class="optionCard"
    ${player.money < costs.money ? "disabled" : ""}
    onclick="payToSkipHospital('money')">
        💰 שלם ₪${costs.money}
    </button>
    <button
    class="optionCard"
    ${(player.gold || 0) < costs.gold ? "disabled" : ""}
    onclick="payToSkipHospital('gold')">
        🥇 שלם ${costs.gold} זהב
    </button>
    <button
    class="optionCard"
    ${(player.diamonds || 0) < costs.diamonds ? "disabled" : ""}
    onclick="payToSkipHospital('diamonds')">
        💎 שלם ${costs.diamonds} יהלומים
    </button>
    <button
    class="optionCard"
    ${(player.blackMoney || 0) < costs.blackMoney ? "disabled" : ""}
    onclick="payToSkipHospital('blackMoney')">
        🖤 שלם ${costs.blackMoney} כסף שחור
    </button>
    </div>
    </div>
    `;
}
function renderBattle(content){
    if(!player) return;
    if(typeof isHospitalized === "function" && isHospitalized()){
        renderHospital(content);
        return;
    }
    if(battleSubTab === "boss"){
        renderBossList(content);
        return;
    }
    if(battleSubTab === "monsters"){
        renderMonsterList(content);
        return;
    }
    const attackPower = typeof getAttackPower === "function" ? getAttackPower() : (player.power || 0);
    const unitsBonus = typeof getRecruitPower === "function" ? getRecruitPower() : 0;
    const speedBonus = typeof getSpeedCombatBonus === "function" ? getSpeedCombatBonus() : 0;
    const level = Math.max(1, Number(player.level) || 1);
    content.innerHTML = `
    <div class="contentCard battlePage">
        <h3>⚔️ קרבות רגילים</h3>
        <div class="quickActionsRow">
            <button class="smallButton quickActionBtn menuButton active" onclick="setBattleTab('normal')">⚔️ קרב רגיל</button>
            <button class="smallButton quickActionBtn menuButton" onclick="setBattleTab('boss')">🏆 בוסים</button>
            <button class="smallButton quickActionBtn menuButton" onclick="setBattleTab('monsters')">🐉 מיוחדים</button>
        </div>
        <div class="battleInfo">
            <div>💪 כוח התקפה: <b>${attackPower}</b><span class="battleInfoSub">${unitsBonus} יחידות · ${speedBonus} מהירות</span></div>
            <div>🛡️ הגנה: <b>${player.defense || 0}</b></div>
            <div>⭐ רמת שחקן: <b>${level}</b></div>
        </div>
        <div class="battleGrid">
        ${getBattleEnemies().map(enemy => `
            <div class="battleCard ${enemy.locked ? "locked" : ""}">
                <div class="battleIcon">${enemy.icon}</div>
                <h4>${enemy.name}</h4>
                <p>${enemy.desc}</p>
                <div class="battleMeta">🎯 קושי <b>${enemy.scaledDifficulty.toFixed(2)}x</b></div>
                <div class="battleMeta">🔓 ${enemy.locked ? `נפתח ברמה ${enemy.minLevel}` : `רמה ${enemy.minLevel}+`}</div>
                <div class="battleMeta">⚡ דרושות ${typeof getBattleEnergyCost === "function" ? getBattleEnergyCost(enemy) : 10} אנרגיה</div>
                <button class="battleFightBtn" ${enemy.locked || player.energy < (typeof getBattleEnergyCost === "function" ? getBattleEnergyCost(enemy) : 10) ? "disabled" : ""} onclick="startBattle(${enemy.index})">
                    ${enemy.locked ? "🔒 נעול" : `⚔️ תקוף · ⚡ ${typeof getBattleEnergyCost === "function" ? getBattleEnergyCost(enemy) : 10}`}
                </button>
            </div>
        `).join("")}
        </div>
    </div>
    `;
}
// ==========================================
// טאב קרב - החלפה בין רגיל לבוסים
// ==========================================
function setBattleTab(tab){
    battleSubTab = tab;
    const content =
    document.getElementById("gameContent");
    if(content && typeof renderBattle === "function"){
        renderBattle(content);
    }
}
// ==========================================
// רשימת בוסים
// ==========================================
function renderBossList(content){
    if(!player){
        return;
    }
    let html = `
    <div class="contentCard">
    <h3>🏆 בוסים</h3>
    <div class="quickActionsRow">
        <button class="smallButton quickActionBtn menuButton" onclick="setBattleTab('normal')">⚔️ קרב רגיל</button>
        <button class="smallButton quickActionBtn menuButton active" onclick="setBattleTab('boss')">🏆 בוסים</button>
        <button class="smallButton quickActionBtn menuButton" onclick="setBattleTab('monsters')">🐉 מיוחדים</button>
    </div>
    `;
    if(typeof BOSSES === "undefined"){
        html += `</div>`;
        content.innerHTML = html;
        return;
    }
    html += `<div class="bossGrid">`;
    BOSSES.forEach(boss=>{
        const status =
        typeof getBossStatus === "function"
        ?
        getBossStatus(boss.id)
        :
        { ready:false, timeText:"" };
        const threshold =
        typeof getBossThreshold === "function"
        ?
        getBossThreshold(boss)
        :
        0;
        const bossLevel =
        typeof getBossLevelRequirement === "function"
        ? getBossLevelRequirement(boss)
        : 1;
        const unlocked =
        typeof isBossUnlocked === "function"
        ? isBossUnlocked(boss)
        : true;
        const bossStats =
        typeof getBossCombatStats === "function"
        ? getBossCombatStats(boss)
        : {power:threshold, defense:0};
        const hasLoot =
        Array.isArray(player.bossLoot) &&
        player.bossLoot.find(l=>l.bossId===boss.id);
        const disabled =
        !unlocked
        ||
        !status.ready
        ||
        player.energy < boss.energyCost;
        html += `
        <div class="ownedCard">
            <div class="ownedCardName">
                ${boss.icon} ${boss.name}
                <span class="ownedCardLevel">${unlocked ? "רמה " + bossLevel : "🔒 רמה " + bossLevel}</span>
            </div>
            <div class="ownedCardRow">
                ${boss.desc}
                <br>
                💪 כוח ${bossStats.power} | 🛡️ הגנה ${bossStats.defense}
                <br>🖤 ${boss.rewardBlackMoneyMin}-${boss.rewardBlackMoneyMax} | 💎 ${boss.rewardDiamondsMin}-${boss.rewardDiamondsMax}
                ${hasLoot ? " | ✅ שלל כבר התקבל" : " | 🎁 " + Math.round(boss.lootChance*100) + "% לשלל בלעדי"}
            </div>
            <button
            class="upgradeBtn"
            ${disabled ? "disabled" : ""}
            onclick="attackBoss(${boss.id})">
                ${
                    !unlocked
                    ?
                    "🔒 נפתח ברמה " + bossLevel
                    :
                    status.ready
                    ?
                    "⚔️ תקוף | ⚡" + boss.energyCost
                    :
                    "⏳ עוד " + status.timeText
                }
            </button>
        </div>
        `;
    });
    html += `</div>`;
    html += `</div>`;
    content.innerHTML = html;
}
// ==========================================
// הודעת מערכת
// ==========================================
let messageClearTimeout = null;
function showMessage(message){
    const box =
    document.getElementById(
        "welcomeBox"
    );
    if(!box){
        return;
    }
    // ביטול טיימר קודם - כדי שהודעה חדשה לא תימחק
    // מוקדם מדי בגלל טיימר של הודעה קודמת
    if(messageClearTimeout){
        clearTimeout(messageClearTimeout);
        messageClearTimeout = null;
    }
    box.textContent = message;
    box.classList.add(
        "showMessage"
    );
    messageClearTimeout = setTimeout(()=>{
        box.classList.remove(
            "showMessage"
        );
        box.textContent = "";
        messageClearTimeout = null;
    },3000);
}
// ==========================================
// אנימציית עליית רמה
// ==========================================
function checkLevelAnimation() {
    const level =
        document.getElementById(
            "levelCard"
        );
    if (!level) {
        return;
    }
    level.classList.add(
        "levelUp"
    );
    setTimeout(() => {
        level.classList.remove(
            "levelUp"
        );
    }, 1000);
}
// ==========================================
// הדגשת צד שחקן
// ==========================================
function highlightSide(side) {
    const police =
        document.getElementById(
            "policeChoice"
        );
    const criminal =
        document.getElementById(
            "criminalChoice"
        );
    if (police) {
        police.classList.remove(
            "active"
        );
    }
    if (criminal) {
        criminal.classList.remove(
            "active"
        );
    }
    if (
        side === "police"
        &&
        police
    ) {
        police.classList.add(
            "active"
        );
    }
    if (
        side === "criminal"
        &&
        criminal
    ) {
        criminal.classList.add(
            "active"
        );
    }
}
// ==========================================
// עדכון פסי התקדמות ידני
// ==========================================
function refreshProgress() {
    updateProgressBars();
}
// ==========================================
// טעינת ממשק ראשונית
// ==========================================
function initUI() {
    if (!player) {
        return;
    }
    updateUI();
}
// ==========================================
// חנות ציוד (נשק, שריון, רכבים)
// ==========================================
let activeShopCategory = "attack";
function setShopCategory(category){
    const allowed = ["defense","attack","speed"];
    activeShopCategory = allowed.includes(category) ? category : "attack";
    const content = document.getElementById("gameContent");
    if(content){
        renderShop(content);
    }
}
function renderShop(content){
    if(!player){
        return;
    }
    const categoryButtons = `
        <div class="shopCategoryGrid">
            <button class="shopCategoryBtn ${activeShopCategory === "defense" ? "active" : ""}" onclick="setShopCategory('defense')">🛡️<span>הגנה</span></button>
            <button class="shopCategoryBtn ${activeShopCategory === "attack" ? "active" : ""}" onclick="setShopCategory('attack')">🔫<span>התקפה</span></button>
            <button class="shopCategoryBtn ${activeShopCategory === "speed" ? "active" : ""}" onclick="setShopCategory('speed')">⚡<span>מהירות</span></button>
        </div>
    `;
    let html = `
        <div class="contentCard shopCard">
            <h3>🛒 חנות WARDEAL</h3>
            <p class="cityNoNews shopBalance">
                🥇 ${player.gold || 0} &nbsp; 💎 ${player.diamonds || 0} &nbsp; 🖤 ${player.blackMoney || 0}
            </p>
            ${categoryButtons}
    `;
    if(activeShopCategory === "attack"){
        html += buildShopSection("🔫 נשקים", WEAPONS_LIST, Array.isArray(player.weapons) ? player.weapons : [], "buyWeapon", "power", "כוח", "upgradeWeapon", "weaponGrid");
    }
    else if(activeShopCategory === "defense"){
        html += buildShopSection("🛡️ הגנה", ARMOR_LIST, Array.isArray(player.armor) ? player.armor : [], "buyArmor", "defense", "הגנה", "upgradeArmor", "shopGridTwo");
    }
    else if(activeShopCategory === "speed"){
        html += buildShopSection("⚡ מהירות", VEHICLES_LIST, Array.isArray(player.vehicles) ? player.vehicles : [], "buyVehicle", "speed", "מהירות", "upgradeVehicle", "shopGridTwo");
    }
    else{
        html += buildShopSection("🔫 נשקים", WEAPONS_LIST, Array.isArray(player.weapons) ? player.weapons : [], "buyWeapon", "power", "כוח", "upgradeWeapon", "weaponGrid");
    }
    html += `</div>`;
    content.innerHTML = html;
}
function buildShopSection(title, list, ownedList, buyFn, statKey, statLabel, upgradeFn, gridClass){
    const ownedIds = ownedList.map(item => item.id);
    let html = `<h4 class="shopSectionTitle">${title}</h4>`;
    if(ownedList.length > 0){
        html += `<div class="${gridClass || "shopGridTwo"} shopOwnedGrid">`;
        ownedList.forEach((item,index)=>{
            const definition = list.find(i => i.id === item.id);
            const level = item.level || 1;
            const upgradeCost = level * Math.max(1, Math.ceil((definition ? definition.cost : 20) * 0.8));
            const upgradeBonus = Math.max(1, Math.ceil((definition ? definition[statKey] : item[statKey]) * 0.2));
            const currencyIcon = definition && definition.currency === "diamonds" ? "💎" : (definition && definition.currency === "blackMoney" ? "🖤" : "🥇");
            const affordable = definition ? (definition.currency === "diamonds" ? (player.diamonds || 0) >= upgradeCost : definition.currency === "blackMoney" ? (player.blackMoney || 0) >= upgradeCost : (player.gold || 0) >= upgradeCost) : false;
            html += `
                <div class="ownedCard shopItemCard">
                    <div class="ownedCardName shopItemName">${item.name}</div>
                    <div class="shopWeaponLevel">רמה ${level}</div>
                    <div class="ownedCardRow">+${item[statKey]} ${statLabel}</div>
                    <button class="upgradeBtn" ${affordable ? "" : "disabled"} onclick="${upgradeFn}(${index})">
                        ⬆️ שדרג | ${currencyIcon} ${upgradeCost} | +${upgradeBonus} ${statLabel}
                    </button>
                </div>
            `;
        });
        html += `</div>`;
    }
    const availableToBuy = list.filter(item => !ownedIds.includes(item.id));
    if(availableToBuy.length === 0){
        html += `<p class="cityNoNews">רכשת את כל הפריטים בקטגוריה זו!</p>`;
    } else {
        html += `<div class="${gridClass || "shopGridTwo"} shopBuyGrid">`;
        availableToBuy.forEach(item=>{
            const affordable = typeof canAffordShopItem === "function" ? canAffordShopItem(item) : false;
            const currencyIcon = item.currency === "diamonds" ? "💎" : (item.currency === "blackMoney" ? "🖤" : "🥇");
            html += `
                <button class="optionCard shopItemCard shopBuyCard" ${affordable ? "" : "disabled"} onclick="${buyFn}(${item.id})">
                    <div class="shopItemName">${item.name}</div>
                    <div class="shopWeaponLevel">רמה 1</div>
                    <div class="shopPrice">${currencyIcon} ${item.cost}</div>
                    <div class="shopStat">💪 +${item[statKey]} ${statLabel}</div>
                </button>
            `;
        });
        html += `</div>`;
    }
    return html;
}
// ==========================================
// עטיפה: קריאת סכום ההמרה משדה הקלט
// ==========================================
function handleConvertClick(){
    const input =
    document.getElementById("convertAmountInput");
    if(!input){
        return;
    }
    const amount =
    parseInt(input.value, 10);
    if(typeof convertMoneyToBlackMoney === "function"){
        convertMoneyToBlackMoney(amount);
    }
}
// ==========================================
// מסך עזרה
// ==========================================
const HELP_SECTIONS = [
    { icon:"🏰", title:"תחנה", text:"לוח התחנה - נכסים, עסקים, יחידות והכנסה. ניתן לפתח את התחנה עד רמה 50 ולקבל בונוסים ומתנה." },
    { icon:"🎯", title:"פעולות", text:"מתנה כל 4 שעות, גביית שוחד (10 פעמים/4 שעות), והמרת כסף לכסף שחור בהימור." },
    { icon:"💼", title:"עבודה", text:"עד 2 עבודות במקביל, כל אחת לוקחת זמן ונותנת כסף, XP, ולפעמים זהב/יהלומים/כסף שחור." },
    { icon:"👥", title:"צבא", text:"גיוס יחידות שמוסיפות כוח (וחלקן גם הגנה), ואפשר לשדרג אימון לכל סוג יחידה." },
    { icon:"🏠", title:"נכסים", text:"קנייה, שדרוג רמה (מעלה הכנסה), ושדרוג מיוחד בכסף שחור לבונוס קבוע." },
    { icon:"🏢", title:"עסקים", text:"בדיוק כמו נכסים, אבל תשואה קצת גבוהה יותר יחסית למחיר." },
    { icon:"⚔️", title:"קרב", text:"שוטרים נלחמים בעבריינים ולהפך. ניצחון נותן כסף וזהב. הפסד עלול לעלות חיים, זהב, כסף, ואפילו יחידה." },
    { icon:"🛒", title:"חנות", text:"נשק (כוח), שריון (הגנה), רכבים (מהירות) - קונים ומשדרגים רמה. חלק מהפריטים בזהב, חלק ביהלומים או בשוק שחור." }
];
const CURRENCY_HELP = [
    { icon:"💵", title:"כסף", text:"המטבע הראשי - מעבודות, קרבות, הכנסה פסיבית." },
    { icon:"🥇", title:"זהב", text:"מקרבות, מתנות, ושוחד. עולה לרוב פריטי החנות." },
    { icon:"💎", title:"יהלומים", text:"נדירים - מרמות, אבני דרך בקרב, ומזל. לפריטים הכי חזקים." },
    { icon:"🖤", title:"כסף שחור", text:"משוחד, הימורים, ועבודות מתקדמות. לשוק שחור ולשדרוגים מיוחדים." }
];
function buildHelpContent(){
    let html = '<h4 style="margin:6px 0">🗺️ מערכות המשחק</h4>';
    HELP_SECTIONS.forEach(section=>{
        html += `
        <div class="helpItem">
            <b>${section.icon} ${section.title}</b>
            <span>${section.text}</span>
        </div>
        `;
    });
    html += '<h4 style="margin:14px 0 6px">💰 המטבעות</h4>';
    CURRENCY_HELP.forEach(c=>{
        html += `
        <div class="helpItem">
            <b>${c.icon} ${c.title}</b>
            <span>${c.text}</span>
        </div>
        `;
    });
    return html;
}
function openHelp(){
    const overlay =
    document.getElementById("helpOverlay");
    const contentEl =
    document.getElementById("helpContent");
    if(contentEl){
        contentEl.innerHTML = buildHelpContent();
    }
    if(overlay){
        overlay.classList.add("modalOpen");
    }
}
function closeHelp(){
    const overlay =
    document.getElementById("helpOverlay");
    if(overlay){
        overlay.classList.remove("modalOpen");
    }
}
// ==========================================
// מסך ברוך שובך
// ==========================================
function formatElapsedTime(ms){
    if(!ms || ms <= 0){
        return "";
    }
    const hours =
    Math.floor(ms / (60*60*1000));
    const minutes =
    Math.floor((ms % (60*60*1000)) / (60*1000));
    if(hours > 0){
        return hours + " שעות ו-" + minutes + " דקות";
    }
    return minutes + " דקות";
}
function showWelcomeBackScreen(data){
    if(!data || !player){
        return;
    }
    const now = Date.now();
    const elapsed =
    data.previousLogin
    ?
    now - data.previousLogin
    :
    0;
    // לא מציגים על היעדרות קצרה מדי (רענון רגיל של הדף)
    const MIN_ELAPSED_TO_SHOW = 3 * 60 * 1000;
    const hasJobs =
    Array.isArray(data.jobs) && data.jobs.length > 0;
    const hasIncome =
    data.income > 0;
    if(
        elapsed < MIN_ELAPSED_TO_SHOW
        &&
        !hasJobs
        &&
        !hasIncome
    ){
        return;
    }
    let html = "";
    html += `
    <div class="welcomeBackRow">
        <span>⏱️ נעדרת</span>
        <b>${formatElapsedTime(elapsed) || "זמן קצר"}</b>
    </div>
    `;
    if(hasIncome){
        html += `
        <div class="welcomeBackRow">
            <span>💰 הכנסה פסיבית שנצברה</span>
            <b>₪${data.income.toLocaleString()}</b>
        </div>
        `;
    }
    if(data.energyGained > 0){
        html += `
        <div class="welcomeBackRow">
            <span>⚡ אנרגיה ששוחזרה</span>
            <b>+${Math.floor(data.energyGained)}</b>
        </div>
        `;
    }
    if(data.healthGained > 0){
        html += `
        <div class="welcomeBackRow">
            <span>❤️ בריאות ששוחזרה</span>
            <b>+${Math.floor(data.healthGained)}</b>
        </div>
        `;
    }
    if(hasJobs){
        html += `<h4 style="margin:12px 0 6px">✅ עבודות שהושלמו</h4>`;
        html += `<div class="welcomeBackJobsList">`;
        data.jobs.forEach(job=>{
            html += `
            <div class="welcomeBackRow">
                <span>${job.name}</span>
                <b>₪${job.money}${job.gold ? " +"+job.gold+"🥇" : ""}${job.diamonds ? " +"+job.diamonds+"💎" : ""}${job.blackMoney ? " +"+job.blackMoney+"🖤" : ""}</b>
            </div>
            `;
        });
        html += `</div>`;
    }
    const giftStatus =
    typeof getGiftStatus === "function"
    ?
    getGiftStatus()
    :
    { ready:false };
    if(giftStatus.ready){
        html += `
        <div class="welcomeBackRow" style="color:#facc15">
            <span>🎁 מתנה זמינה!</span>
            <b>לך למסך פעולות</b>
        </div>
        `;
    }
    const hospitalStatus =
    typeof getHospitalStatus === "function"
    ?
    getHospitalStatus()
    :
    { locked:false };
    if(hospitalStatus.locked){
        html += `
        <div class="welcomeBackRow" style="color:#f87171">
            <span>🏥 עדיין בבית חולים</span>
            <b>עוד ${hospitalStatus.timeText}</b>
        </div>
        `;
    }
    const contentEl =
    document.getElementById("welcomeBackContent");
    if(contentEl){
        contentEl.innerHTML = html;
    }
    const overlay =
    document.getElementById("welcomeBackOverlay");
    if(overlay){
        overlay.classList.add("modalOpen");
    }
}
function closeWelcomeBack(){
    const overlay =
    document.getElementById("welcomeBackOverlay");
    if(overlay){
        overlay.classList.remove("modalOpen");
    }
}
console.log(
    "WARDEAL UI v0.3.3 READY"
);
