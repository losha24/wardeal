/* ==========================================
   WARDEAL v0.1.0
   מערכת עיר
   לוח מחוונים + חדשות ואירועים אקראיים
========================================== */
const CITY_EVENT_COOLDOWN = 20000;
let lastCityEventTime = 0;
let cityNewsLog = [];
// ==========================================
// מאגר אירועים
// ==========================================
const CITY_EVENTS = [
    // חיוביים - כלליים
    { text:"🎁 מצאת ארנק אבוד ברחוב", money:150 },
    { text:"💵 קיבלת טיפ נדיב מתושב מקומי", money:250 },
    { text:"📈 השקעה קטנה הניבה רווח נאה", money:400 },
    { text:"🎉 חגיגה בעיר הביאה איתה הזדמנות עסקית", money:300 },
    // שליליים - כלליים
    { text:"🚗 קנס חנייה הפתיע אותך", money:-150 },
    { text:"💸 הוצאה בלתי צפויה פגעה בתקציב", money:-200 },
    { text:"🔧 תיקון ציוד עלה יותר מהצפוי", money:-120 },
    // ספציפי משטרה
    { text:"👮 פשיטה מוצלחת הניבה החרמות", money:350, side:"police" },
    { text:"🚔 דוח משמעת קטן הוריד מהתקציב", money:-180, side:"police" },
    // ספציפי עבריינים
    { text:"🕶️ עסקה חשאית הניבה רווח נאה", money:500, side:"criminal" },
    { text:"🚨 כמעט נתפסת - שוחד קטן נדרש", money:-300, side:"criminal" },
    // מציאות נדירות - זהב/יהלומים
    { text:"🥇 מצאת מטבע זהב נדיר ברחוב", gold:8 },
    { text:"🥇 עסקה קטנה שולמה לך בזהב", gold:12 },
    { text:"💎 מצאת יהלום נוצץ באשפה", diamonds:1 },
    { text:"💎 קיבלת יהלום כתשלום על שירות", diamonds:1 },
    // שוחד - כסף שחור, זמין לשני הצדדים
    { text:"🖤 מישהו שילם לך שוחד תמורת שתיקה", blackMoney:15 },
    { text:"🖤 עסקה חשאית תחת השולחן", blackMoney:22 }
];
// ==========================================
// סינון אירועים לפי צד
// ==========================================
function getCityEventsForSide(side){
    return CITY_EVENTS.filter(
        event =>
        !event.side
        ||
        event.side === side
    );
}
// ==========================================
// ניסיון להפעיל אירוע אוטומטי (נקרא מ-gameTick)
// ==========================================
function maybeTriggerCityEvent(){
    if(!player){
        return;
    }
    const now = Date.now();
    if(now - lastCityEventTime < CITY_EVENT_COOLDOWN){
        return;
    }
    // סיכוי נמוך בכל בדיקה, כך שהאירועים לא יהיו תכופים מדי
    if(Math.random() > 0.05){
        return;
    }
    triggerCityEvent(false);
}
// ==========================================
// הפעלת אירוע (force=true להפעלה ידנית מכפתור)
// ==========================================
function triggerCityEvent(force){
    if(!player){
        return null;
    }
    const now = Date.now();
    if(
        !force
        &&
        now - lastCityEventTime < CITY_EVENT_COOLDOWN
    ){
        return null;
    }
    if(
        force
        &&
        now - lastCityEventTime < CITY_EVENT_COOLDOWN
    ){
        showMessageSafeCity(
            "⏳ חכה קצת לפני אירוע חדש בעיר"
        );
        return null;
    }
    const pool =
    getCityEventsForSide(player.side);
    if(pool.length === 0){
        return null;
    }
    const event =
    pool[
        Math.floor(
            Math.random() * pool.length
        )
    ];
    if(typeof event.money === "number"){
        player.money += event.money;
        if(player.money < 0){
            player.money = 0;
        }
    }
    if(typeof event.gold === "number"){
        if(typeof player.gold !== "number"){
            player.gold = 0;
        }
        player.gold += event.gold;
    }
    if(typeof event.diamonds === "number"){
        if(typeof player.diamonds !== "number"){
            player.diamonds = 0;
        }
        player.diamonds += event.diamonds;
    }
    if(typeof event.blackMoney === "number"){
        if(typeof player.blackMoney !== "number"){
            player.blackMoney = 0;
        }
        player.blackMoney += event.blackMoney;
    }
    lastCityEventTime = now;
    cityNewsLog.unshift({
        text:event.text,
        money:event.money || 0,
        gold:event.gold || 0,
        diamonds:event.diamonds || 0,
        blackMoney:event.blackMoney || 0,
        time:now
    });
    if(cityNewsLog.length > 5){
        cityNewsLog = cityNewsLog.slice(0,5);
    }
    showMessageSafeCity(event.text);
    if(typeof saveGame === "function"){
        saveGame();
    }
    if(typeof updateUI === "function"){
        updateUI();
    }
    if(
        typeof currentPage !== "undefined"
        &&
        currentPage === "home"
    ){
        const content =
        document.getElementById("gameContent");
        if(
            content
            &&
            typeof renderCity === "function"
        ){
            renderCity(content);
        }
    }
    return event;
}
// ==========================================
// מתנה כל 4 שעות
// ==========================================
const GIFT_COOLDOWN =
4 * 60 * 60 * 1000;
const GIFT_MONEY_MIN = 1;
const GIFT_MONEY_MAX = 10000;
const GIFT_GOLD_MIN = 1;
const GIFT_GOLD_MAX = 15;
const GIFT_DIAMOND_CHANCE = 0.1;
// ==========================================
// סטטוס המתנה - האם זמינה וכמה זמן נותר
// ==========================================
function getGiftStatus(){
    if(!player){
        return { ready:false, timeText:"" };
    }
    const lastClaim =
    player.lastGiftClaim || 0;
    const elapsed =
    Date.now() - lastClaim;
    if(elapsed >= GIFT_COOLDOWN){
        return { ready:true, timeText:"" };
    }
    const remain =
    GIFT_COOLDOWN - elapsed;
    const hours =
    Math.floor(remain / (60*60*1000));
    const minutes =
    Math.floor(
        (remain % (60*60*1000)) / (60*1000)
    );
    return {
        ready:false,
        timeText: hours + " שע' " + minutes + " דק'"
    };
}
// ==========================================
// איסוף המתנה
// ==========================================
// ==========================================
// גביית שוחד - זמינה תמיד, לא תופסת משבצת
// עבודה, עולה רק אנרגיה
// מוגבלת ל-10 פעמים בכל חלון של 4 שעות
// ==========================================
const BRIBE_ENERGY_COST = 15;
const BRIBE_MONEY_MIN = 100;
const BRIBE_MONEY_MAX = 300;
const BRIBE_BLACKMONEY_MIN = 5;
const BRIBE_BLACKMONEY_MAX = 15;
const BRIBE_XP = 20;
const BRIBE_WINDOW = 4 * 60 * 60 * 1000;
const BRIBE_MAX_USES = 10;
const BRIBE_DIAMOND_CHANCE = 0.05;
// ==========================================
// סטטוס גביית שוחד - כמה נשארו וכמה זמן לאיפוס
// ==========================================
function getBribeStatus(){
    if(!player){
        return { remaining:0, resetText:"" };
    }
    const now = Date.now();
    const windowStart =
    player.bribeWindowStart || 0;
    if(now - windowStart >= BRIBE_WINDOW){
        return { remaining: BRIBE_MAX_USES, resetText:"" };
    }
    const used =
    player.bribeCount || 0;
    const remaining =
    Math.max(0, BRIBE_MAX_USES - used);
    const remainMs =
    BRIBE_WINDOW - (now - windowStart);
    const hours =
    Math.floor(remainMs / (60*60*1000));
    const minutes =
    Math.floor(
        (remainMs % (60*60*1000)) / (60*1000)
    );
    return {
        remaining:remaining,
        resetText: hours + " שע' " + minutes + " דק'"
    };
}
function collectBribe(){
    if(!player){
        return false;
    }
    const now = Date.now();
    // איפוס חלון אם עברו 4 שעות מתחילת החלון הנוכחי
    if(
        !player.bribeWindowStart
        ||
        now - player.bribeWindowStart >= BRIBE_WINDOW
    ){
        player.bribeWindowStart = now;
        player.bribeCount = 0;
    }
    if((player.bribeCount || 0) >= BRIBE_MAX_USES){
        const status = getBribeStatus();
        showMessageSafeCity(
            "🖤 ניצלת את כל " + BRIBE_MAX_USES +
            " גביות השוחד - עוד " + status.resetText
        );
        return false;
    }
    if(player.energy < BRIBE_ENERGY_COST){
        showMessageSafeCity("⚡ אין מספיק אנרגיה לגביית שוחד");
        return false;
    }
    player.energy -= BRIBE_ENERGY_COST;
    player.bribeCount = (player.bribeCount || 0) + 1;
    if(typeof dailyAddProgress === "function") dailyAddProgress("specialActions", 1);
    const money =
    Math.floor(
        Math.random() * (BRIBE_MONEY_MAX - BRIBE_MONEY_MIN + 1)
    ) + BRIBE_MONEY_MIN;
    const blackMoney =
    Math.floor(
        Math.random() * (BRIBE_BLACKMONEY_MAX - BRIBE_BLACKMONEY_MIN + 1)
    ) + BRIBE_BLACKMONEY_MIN;
    let diamonds = 0;
    if(Math.random() < BRIBE_DIAMOND_CHANCE){
        diamonds = 1;
    }
    player.money += money;
    if(typeof player.blackMoney !== "number"){
        player.blackMoney = 0;
    }
    player.blackMoney += blackMoney;
    if(diamonds > 0){
        if(typeof player.diamonds !== "number"){
            player.diamonds = 0;
        }
        player.diamonds += diamonds;
    }
    if(typeof addXP === "function"){
        addXP(BRIBE_XP);
    }
    showMessageSafeCity(
        "🖤 גבית שוחד: ₪" + money + " ו-" + blackMoney + " 🖤" +
        (diamonds > 0 ? " ועוד 💎 יהלום נדיר!" : "")
    );
    if(typeof saveGame === "function"){
        saveGame();
    }
    if(typeof updateUI === "function"){
        updateUI();
    }
    if(
        typeof currentPage !== "undefined"
        &&
        currentPage === "actions"
    ){
        const content =
        document.getElementById("gameContent");
        if(
            content
            &&
            typeof renderActions === "function"
        ){
            renderActions(content);
        }
    }
    return true;
}
// ==========================================
// המרת כסף רגיל לכסף שחור
// סיכוי הצלחה עולה עם הסכום שמסתכנים בו
// (1% בסכום המינימלי, עד 10% בסכום המקסימלי)
// שיעור המרה בהצלחה: 200 כסף = 1 כסף שחור
// מוגבל ל-4 פעמים בכל חלון של 4 שעות
// ==========================================
const CONVERT_MIN_AMOUNT = 500;
const CONVERT_MAX_AMOUNT_BASE = 20000;
// ==========================================
// גבול המרה מקסימלי - עולה 10% בכל רמה
// ==========================================
function getConvertMaxAmount(){
    const level =
    player && typeof player.level === "number"
    ?
    player.level
    :
    1;
    return Math.round(
        CONVERT_MAX_AMOUNT_BASE * Math.pow(1.1, level - 1)
    );
}
const CONVERT_RATE = 200;
const CONVERT_WINDOW = 4 * 60 * 60 * 1000;
const CONVERT_MAX_USES = 4;
// ==========================================
// סטטוס המרה - כמה נותרו וכמה זמן לאיפוס
// ==========================================
function getConvertStatus(){
    if(!player){
        return { remaining:0, resetText:"" };
    }
    const now = Date.now();
    const windowStart =
    player.convertWindowStart || 0;
    if(now - windowStart >= CONVERT_WINDOW){
        return { remaining: CONVERT_MAX_USES, resetText:"" };
    }
    const used =
    player.convertCount || 0;
    const remaining =
    Math.max(0, CONVERT_MAX_USES - used);
    const remainMs =
    CONVERT_WINDOW - (now - windowStart);
    const hours =
    Math.floor(remainMs / (60*60*1000));
    const minutes =
    Math.floor(
        (remainMs % (60*60*1000)) / (60*1000)
    );
    return {
        remaining:remaining,
        resetText: hours + " שע' " + minutes + " דק'"
    };
}
// ==========================================
// חישוב סיכוי הצלחה לפי הסכום שנבחר
// ==========================================
function getConvertChance(amount){
    const maxAmount =
    typeof getConvertMaxAmount === "function"
    ?
    getConvertMaxAmount()
    :
    CONVERT_MAX_AMOUNT_BASE;
    const clamped =
    Math.min(
        maxAmount,
        Math.max(CONVERT_MIN_AMOUNT, amount)
    );
    const ratio =
    (clamped - CONVERT_MIN_AMOUNT) /
    (maxAmount - CONVERT_MIN_AMOUNT);
    // 1% עד 10%
    return 0.01 + ratio * 0.09;
}
// ==========================================
// ביצוע ההמרה
// ==========================================
function convertMoneyToBlackMoney(amount){
    if(!player){
        return false;
    }
    amount =
    Math.floor(Number(amount));
    if(
        !amount
        ||
        isNaN(amount)
        ||
        amount < CONVERT_MIN_AMOUNT
    ){
        showMessageSafeCity(
            "💱 סכום מינימלי להמרה: ₪" + CONVERT_MIN_AMOUNT
        );
        return false;
    }
    const maxAllowed =
    typeof getConvertMaxAmount === "function"
    ?
    getConvertMaxAmount()
    :
    CONVERT_MAX_AMOUNT_BASE;
    if(amount > maxAllowed){
        showMessageSafeCity(
            "💱 סכום מקסימלי להמרה ברמה שלך: ₪" + maxAllowed
        );
        return false;
    }
    const now = Date.now();
    if(
        !player.convertWindowStart
        ||
        now - player.convertWindowStart >= CONVERT_WINDOW
    ){
        player.convertWindowStart = now;
        player.convertCount = 0;
    }
    if((player.convertCount || 0) >= CONVERT_MAX_USES){
        const status = getConvertStatus();
        showMessageSafeCity(
            "💱 ניצלת את כל " + CONVERT_MAX_USES +
            " ניסיונות ההמרה - עוד " + status.resetText
        );
        return false;
    }
    if(player.money < amount){
        showMessageSafeCity("💰 אין מספיק כסף להמרה");
        return false;
    }
    // הכסף יורד תמיד, גם אם ההמרה נכשלת
    player.money -= amount;
    player.convertCount = (player.convertCount || 0) + 1;
    if(typeof dailyAddProgress === "function") dailyAddProgress("specialActions", 1);
    const chance =
    getConvertChance(amount);
    if(Math.random() < chance){
        const blackMoneyGained =
        Math.max(1, Math.floor(amount / CONVERT_RATE));
        if(typeof player.blackMoney !== "number"){
            player.blackMoney = 0;
        }
        player.blackMoney += blackMoneyGained;
        showMessageSafeCity(
            "💱 ההמרה הצליחה! קיבלת " + blackMoneyGained + " 🖤"
        );
    }
    else{
        showMessageSafeCity(
            "💱 ההמרה נכשלה - ₪" + amount + " נעלם"
        );
    }
    if(typeof saveGame === "function"){
        saveGame();
    }
    if(typeof updateUI === "function"){
        updateUI();
    }
    if(
        typeof currentPage !== "undefined"
        &&
        currentPage === "actions"
    ){
        const content =
        document.getElementById("gameContent");
        if(
            content
            &&
            typeof renderActions === "function"
        ){
            renderActions(content);
        }
    }
    return true;
}
function claimCityGift(){
    if(!player){
        return false;
    }
    const status =
    getGiftStatus();
    if(!status.ready){
        showMessageSafeCity(
            "⏳ המתנה עוד לא זמינה - עוד " + status.timeText
        );
        return false;
    }
    // פילוג פעמון סביב האמצע (ממוצע של 3 הגרלות)
    // כדי שרוב המתנות יהיו סביב האמצע, עם מעט מקרי קצה
    const roll1 =
    GIFT_MONEY_MIN + Math.random() * (GIFT_MONEY_MAX - GIFT_MONEY_MIN);
    const roll2 =
    GIFT_MONEY_MIN + Math.random() * (GIFT_MONEY_MAX - GIFT_MONEY_MIN);
    const roll3 =
    GIFT_MONEY_MIN + Math.random() * (GIFT_MONEY_MAX - GIFT_MONEY_MIN);
    let money =
    Math.round((roll1 + roll2 + roll3) / 3);
    if(typeof getHeadquartersGiftMultiplier === "function") {
        money = Math.floor(money * getHeadquartersGiftMultiplier());
    }
    const gold =
    Math.floor(
        Math.random() * (GIFT_GOLD_MAX - GIFT_GOLD_MIN + 1)
    ) + GIFT_GOLD_MIN;
    let diamonds = 0;
    if(Math.random() < GIFT_DIAMOND_CHANCE){
        diamonds = 1;
    }
    player.money += money;
    if(typeof player.gold !== "number"){
        player.gold = 0;
    }
    player.gold += gold;
    if(diamonds > 0){
        if(typeof player.diamonds !== "number"){
            player.diamonds = 0;
        }
        player.diamonds += diamonds;
    }
    player.lastGiftClaim = Date.now();
    if(typeof dailyAddProgress === "function") dailyAddProgress("specialActions", 1);
    showMessageSafeCity(
        "🎁 קיבלת ₪" + money + " ו-" + gold + " 🥇" +
        (diamonds > 0 ? " ועוד 💎 יהלום נדיר!" : "")
    );
    if(typeof saveGame === "function"){
        saveGame();
    }
    if(typeof updateUI === "function"){
        updateUI();
    }
    if(
        typeof currentPage !== "undefined"
        &&
        currentPage === "actions"
    ){
        const content =
        document.getElementById("gameContent");
        if(
            content
            &&
            typeof renderActions === "function"
        ){
            renderActions(content);
        }
    }
    return true;
}
// ==========================================
// סיכום אימפריה ללוח המחוונים
// ==========================================
function getEmpireSummary(){
    if(!player){
        return {
            properties:0,
            businesses:0,
            units:0,
            income:0
        };
    }
    return {
        properties:
        typeof getOwnedPropertiesCount === "function"
        ?
        getOwnedPropertiesCount()
        :
        0,
        businesses:
        typeof getOwnedBusinessesCount === "function"
        ?
        getOwnedBusinessesCount()
        :
        0,
        units:
        typeof getUnits === "function"
        ?
        getUnits()
        :
        0,
        income:
        typeof calculatePassiveIncome === "function"
        ?
        calculatePassiveIncome()
        :
        0
    };
}
// ==========================================
// ציור מסך העיר
// ==========================================
function renderActions(content){
    if(!player || !content) return;
    const isPolice = player.side === "police";
    const sideName = isPolice ? "משטרה" : "עבריינים";
    const targetName = isPolice ? "עבריינים" : "שוטרים";
    const bribeStatus = typeof getBribeStatus === "function" ? getBribeStatus() : {remaining:0,resetText:""};
    const convertStatus = typeof getConvertStatus === "function" ? getConvertStatus() : {remaining:0,resetText:""};
    const convertMaxAmount = typeof getConvertMaxAmount === "function" ? getConvertMaxAmount() : 1000;
    const money = Number(player.money || 0);
    const energy = Math.max(0, Number(player.energy || 0));
    const intel = getOperationStatus("intel", 4 * 60 * 60 * 1000);
    const raid = getOperationStatus("raid", 4 * 60 * 60 * 1000);
    const bonus = getOperationStatus("bonus", 4 * 60 * 60 * 1000);
    const gold = getOperationStatus("gold", 4 * 60 * 60 * 1000);
    const patrol = getOperationStatus("patrol", 4 * 60 * 60 * 1000);
    const target = getOperationStatus("target", 4 * 60 * 60 * 1000);
    const supply = getOperationStatus("supply", 4 * 60 * 60 * 1000);
    const escape = getOperationStatus("escape", 4 * 60 * 60 * 1000);
    content.innerHTML = `
        <div class="contentCard specialActionsPanel">
            <h3>🎯 פעולות נוספות — ${sideName}</h3>
            <p class="actionsIntro">פעולות ומבצעים נגד ${targetName}, בהתאם לצד שבחרת.</p>
            <div class="specialActionsGrid operationGrid">
                <div class="specialActionCard"><div class="specialActionIcon">🖤</div><div class="specialActionTitle">מבצע גבייה</div><div class="specialActionText">גביית שוחד תמורת ${BRIBE_ENERGY_COST} ⚡. נותרו ${bribeStatus.remaining}/${BRIBE_MAX_USES} שימושים.</div><button class="upgradeBtn specialActionBtn" ${(energy < BRIBE_ENERGY_COST || bribeStatus.remaining <= 0) ? "disabled" : ""} onclick="collectBribe()">🖤 גבה</button></div>
                <div class="specialActionCard"><div class="specialActionIcon">💱</div><div class="specialActionTitle">מבצע המרה</div><div class="specialActionText">המר כסף לכסף שחור. <b>מקסימום לרמה שלך: ₪${convertMaxAmount.toLocaleString()}</b></div><input type="number" id="convertAmountInput" min="${CONVERT_MIN_AMOUNT}" max="${convertMaxAmount}" step="100" value="${Math.min(CONVERT_MIN_AMOUNT, Math.max(0, Math.floor(money)))}" class="convertInput"><div class="specialActionStatus">עד ${convertStatus.remaining} המרות בחלון הנוכחי</div><button class="upgradeBtn specialActionBtn" ${(convertStatus.remaining <= 0 || money < CONVERT_MIN_AMOUNT) ? "disabled" : ""} onclick="handleConvertClick()">💱 המר</button></div>
                <div class="specialActionCard"><div class="specialActionIcon">🕵️</div><div class="specialActionTitle">מבצע מודיעין נגד ${targetName}</div><div class="specialActionText">איסוף מידע על ${targetName} תמורת כסף ו־XP.</div><div class="specialActionStatus">${intel.ready ? "✅ זמין" : "⏳ " + intel.text}</div><button class="upgradeBtn specialActionBtn" ${intel.ready ? "" : "disabled"} onclick="runSpecialOperation('intel')">🕵️ הפעל</button></div>
                <div class="specialActionCard"><div class="specialActionIcon">💰</div><div class="specialActionTitle">פשיטה על ${targetName}</div><div class="specialActionText">מבצע התקפי מסוכן עם תגמול גבוה יותר.</div><div class="specialActionStatus">${raid.ready ? "✅ זמין" : "⏳ " + raid.text}</div><button class="upgradeBtn specialActionBtn" ${raid.ready ? "" : "disabled"} onclick="runSpecialOperation('raid')">💰 הפעל</button></div>
                <div class="specialActionCard"><div class="specialActionIcon">📦</div><div class="specialActionTitle">אספקת ${sideName}</div><div class="specialActionText">קבלת אספקה שמחזירה אנרגיה ומביאה כסף.</div><div class="specialActionStatus">${bonus.ready ? "✅ זמין" : "⏳ " + bonus.text}</div><button class="upgradeBtn specialActionBtn" ${bonus.ready ? "" : "disabled"} onclick="runSpecialOperation('bonus')">📦 הפעל</button></div>
                <div class="specialActionCard"><div class="specialActionIcon">🥇</div><div class="specialActionTitle">מבצע זהב</div><div class="specialActionText">פעולה יומית להשגת זהב נוסף.</div><div class="specialActionStatus">${gold.ready ? "✅ זמין" : "⏳ " + gold.text}</div><button class="upgradeBtn specialActionBtn" ${gold.ready ? "" : "disabled"} onclick="runSpecialOperation('gold')">🥇 הפעל</button></div>
                <div class="specialActionCard"><div class="specialActionIcon">🚨</div><div class="specialActionTitle">מבצע ${isPolice ? "מעצר" : "התחמקות"}</div><div class="specialActionText">${isPolice ? "מבצע מעצר ממוקד נגד עבריינים." : "מבצע התחמקות ממוקד מכוחות משטרה."}</div><div class="specialActionStatus">${patrol.ready ? "✅ זמין" : "⏳ " + patrol.text}</div><button class="upgradeBtn specialActionBtn" ${patrol.ready ? "" : "disabled"} onclick="runSpecialOperation('patrol')">🚨 הפעל</button></div>
                <div class="specialActionCard"><div class="specialActionIcon">🎯</div><div class="specialActionTitle">${isPolice ? "חיסול יעד פשע" : "פגיעה ביעד משטרתי"}</div><div class="specialActionText">מבצע ממוקד נגד ${targetName} עם תגמול מוגדל.</div><div class="specialActionStatus">${target.ready ? "✅ זמין" : "⏳ " + target.text}</div><button class="upgradeBtn specialActionBtn" ${target.ready ? "" : "disabled"} onclick="runSpecialOperation('target')">🎯 הפעל</button></div>
                <div class="specialActionCard"><div class="specialActionIcon">🧰</div><div class="specialActionTitle">ציוד מבצעי</div><div class="specialActionText">חבילת ציוד שמחזירה אנרגיה ומשפרת מוכנות.</div><div class="specialActionStatus">${supply.ready ? "✅ זמין" : "⏳ " + supply.text}</div><button class="upgradeBtn specialActionBtn" ${supply.ready ? "" : "disabled"} onclick="runSpecialOperation('supply')">🧰 הפעל</button></div>
                <div class="specialActionCard"><div class="specialActionIcon">🛡️</div><div class="specialActionTitle">מבצע הישרדות</div><div class="specialActionText">פעולה הגנתית שמספקת כסף ו־XP.</div><div class="specialActionStatus">${escape.ready ? "✅ זמין" : "⏳ " + escape.text}</div><button class="upgradeBtn specialActionBtn" ${escape.ready ? "" : "disabled"} onclick="runSpecialOperation('escape')">🛡️ הפעל</button></div>
            </div>
        </div>`;
}
function isPoliceSide(){
    return !!(player && player.side === "police");
}
function getOperationStatus(key, cooldown){
    const last = Number((player && player.specialOperations && player.specialOperations[key]) || 0);
    const remain = Math.max(0, cooldown - (Date.now() - last));
    if(remain <= 0) return {ready:true,text:""};
    const h=Math.floor(remain/3600000), m=Math.floor((remain%3600000)/60000);
    return {ready:false,text:(h ? h+" שע' " : "") + m + " דק'"};
}
function runSpecialOperation(type){
    if(!player) return false;
    const cooldowns={intel:4*3600000,raid:4*3600000,bonus:4*3600000,gold:4*3600000,patrol:4*3600000,target:4*3600000,supply:4*3600000,escape:4*3600000};
    const status=getOperationStatus(type,cooldowns[type]||3600000);
    if(!status.ready){ showMessageSafeCity("⏳ המבצע עדיין בהמתנה"); return false; }
    if(!player.specialOperations || typeof player.specialOperations !== "object") player.specialOperations={};
    player.specialOperations[type]=Date.now();
    let message="";
    if(type==="intel"){ player.money=(Number(player.money)||0)+450; player.xp=(Number(player.xp)||0)+35; message="🕵️ מודיעין נאסף: +₪450 ו־35 XP"; }
    if(type==="raid"){ const reward=700+Math.floor(Math.random()*601); player.money=(Number(player.money)||0)+reward; player.xp=(Number(player.xp)||0)+50; message="💰 המבצע הצליח: +₪"+reward.toLocaleString()+" ו־50 XP"; }
    if(type==="bonus"){ player.money=(Number(player.money)||0)+350; player.energy=Math.min(100,(Number(player.energy)||0)+15); message="📦 האספקה הגיעה: +₪350 ו־15 ⚡"; }
    if(type==="gold"){ player.gold=(Number(player.gold)||0)+5; player.xp=(Number(player.xp)||0)+25; message="🥇 מבצע הזהב הצליח: +5 זהב ו־25 XP"; }
    if(type==="patrol"){ const reward=900+Math.floor(Math.random()*501); player.money=(Number(player.money)||0)+reward; player.xp=(Number(player.xp)||0)+70; message=isPoliceSide() ? "🚨 מבצע מעצר הצליח: +₪"+reward.toLocaleString()+" ו־70 XP" : "🚨 התחמקת מהמשטרה: +₪"+reward.toLocaleString()+" ו־70 XP"; }
    if(type==="target"){ const reward=1400+Math.floor(Math.random()*1001); player.money=(Number(player.money)||0)+reward; player.xp=(Number(player.xp)||0)+110; message="🎯 המבצע הממוקד הצליח נגד היעד: +₪"+reward.toLocaleString()+" ו־110 XP"; }
    if(type==="supply"){ player.energy=Math.min(100,(Number(player.energy)||0)+25); player.money=(Number(player.money)||0)+500; player.xp=(Number(player.xp)||0)+45; message="🧰 הציוד המבצעי הגיע: +25 ⚡, +₪500 ו־45 XP"; }
    if(type==="escape"){ player.energy=Math.min(100,(Number(player.energy)||0)+10); player.money=(Number(player.money)||0)+800; player.xp=(Number(player.xp)||0)+60; message="🛡️ מבצע הישרדות הצליח: +10 ⚡, +₪800 ו־60 XP"; }
    if(typeof dailyAddProgress === "function") dailyAddProgress("specialActions",1);
    if(typeof saveGame === "function") saveGame();
    if(typeof showMessageSafeCity === "function") showMessageSafeCity(message);
    if(typeof updateUI === "function") updateUI();
    if(typeof currentPage !== "undefined" && currentPage === "actions") renderActions(document.getElementById("gameContent"));
    return true;
}
function renderCity(content){
    if(!player || !content){
        return;
    }
    const summary = getEmpireSummary();
    const stationTitle = player.side === "police" ? "תחנת משטרה" : "מפקדת עבריינים";
    const stationIcon = player.side === "police" ? "👮" : "🕶️";
    const targetName = player.side === "police" ? "עבריינים" : "שוטרים";
    const hqLevel = typeof getHeadquartersLevel === "function" ? getHeadquartersLevel() : 1;
    const hqBenefits = typeof getHeadquartersBenefits === "function" ? getHeadquartersBenefits() : {incomePercent:0,giftPercent:0};
    const hqCost = typeof getHeadquartersUpgradeCost === "function" ? getHeadquartersUpgradeCost() : 0;
    const giftStatus = typeof getGiftStatus === "function" ? getGiftStatus() : {ready:false,timeText:""};
    let html = `
    <div class="contentCard">
    <h3>${stationIcon} ${stationTitle} WARDEAL</h3>
    <div class="headquartersPanel">
        <div class="headquartersTop">
            <div>${stationIcon} <b>רמת ${player.side === "police" ? "תחנה" : "מפקדה"}</b><span class="headquartersLevel">${hqLevel} / 50</span></div>
            <div class="headquartersBadge">+${hqBenefits.incomePercent}% הכנסה</div>
        </div>
        <div class="headquartersProgress"><div style="width:${(hqLevel / 50) * 100}%"></div></div>
        <div class="headquartersBenefits">
            <span>💰 הכנסה פסיבית +${hqBenefits.incomePercent}%</span>
            <span>🎁 מתנה +${hqBenefits.giftPercent}%</span>
        </div>
        ${hqLevel < 50 ? `
        <button class="smallButton headquartersUpgradeBtn" onclick="upgradeHeadquarters()">🏗️ שדרג תחנה · ₪${hqCost.toLocaleString()}</button>
        ` : `<div class="headquartersMax">🏆 התחנה הגיעה לרמה 50 — מקסימום!</div>`}
    </div>
    <div class="headquartersGiftCard">
        <div class="headquartersGiftIcon">🎁</div>
        <div class="headquartersGiftInfo">
            <b>מתנת התחנה</b>
            <span>${giftStatus.ready ? "✅ המתנה זמינה עכשיו" : "⏳ המתנה הבאה בעוד " + giftStatus.timeText}</span>
        </div>
        <button class="smallButton" onclick="claimCityGift()" ${giftStatus.ready ? "" : "disabled"}>${giftStatus.ready ? "🎁 אסוף" : "⏳ המתנה"}</button>
    </div>
    <div class="cityStatsGrid">
        <div class="cityStatBox">
            🏠 נכסים
            <span>${summary.properties}</span>
        </div>
        <div class="cityStatBox">
            🏢 עסקים
            <span>${summary.businesses}</span>
        </div>
        <div class="cityStatBox">
            👥 יחידות
            <span>${summary.units}</span>
        </div>
        <div class="cityStatBox">
            📈 הכנסה/דקה
            <span>₪${summary.income}</span>
        </div>
    </div>
    <button
    class="smallButton"
    style="width:100%;margin-top:8px;max-width:none"
    onclick="triggerCityEvent(true)">
        📰 מה קורה ב${player.side === "police" ? "תחנה" : "מפקדה"}? נגד ${targetName}
    </button>
    <h4>📰 חדשות אחרונות</h4>
    `;
    if(cityNewsLog.length === 0){
        html += `
        <p class="cityNoNews">
            אין אירועים עדיין... משהו בטח יקרה בקרוב
        </p>
        `;
    }
    else{
        html += `<div class="cityNewsList">`;
        cityNewsLog.forEach(item=>{
            const sign =
            item.money > 0
            ?
            "+"
            :
            "";
            const cls =
            item.money > 0 || item.gold > 0 || item.diamonds > 0 || item.blackMoney > 0
            ?
            "cityNewsPositive"
            :
            (
                item.money < 0
                ?
                "cityNewsNegative"
                :
                ""
            );
            let amountHtml = "";
            if(item.money !== 0){
                amountHtml += `<span class="cityNewsAmount">${sign}₪${item.money}</span>`;
            }
            if(item.gold > 0){
                amountHtml += `<span class="cityNewsAmount">+${item.gold} 🥇</span>`;
            }
            if(item.diamonds > 0){
                amountHtml += `<span class="cityNewsAmount">+${item.diamonds} 💎</span>`;
            }
            if(item.blackMoney > 0){
                amountHtml += `<span class="cityNewsAmount">+${item.blackMoney} 🖤</span>`;
            }
            html += `
            <div class="cityNewsItem ${cls}">
                <span>${item.text}</span>
                ${amountHtml}
            </div>
            `;
        });
        html += `</div>`;
    }
    html += `</div>`;
    content.innerHTML = html;
}
// ==========================================
// הודעה בטוחה
// ==========================================
function showMessageSafeCity(message){
    if(typeof showMessage === "function"){
        showMessage(message);
    }
}
console.log(
    "WARDEAL CITY v0.1.0 READY"
);
