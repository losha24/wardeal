/* ==========================================
   WARDEAL v0.1.0
   קרבות מיוחדים - מפלצות
   10 מפלצות, קושי גדל לפי רמה, ללא קירור -
   רק עלות אנרגיה. פרסים: כסף שחור + יהלומים,
   וסיכוי קטן לשלל ציוד בלעדי.
   שונות מוטה 60/40 לטובת ניצחון כשהכוח תואם.
========================================== */
const MONSTERS = [
    { id:1,  name:"זאב צללים",     icon:"🐺", desc:"טורף לילה שצץ מהחשיכה",              minLevel:1,  difficulty:0.60, energyCost:15,
      blackMoneyMin:10,  blackMoneyMax:20,  diamondsMin:0, diamondsMax:0, xp:20,  lootChance:0.06,
      loot:{ category:"weapon", name:"🔫 טופר הזאב", statKey:"power", statValue:60 } },
    { id:2,  name:"עכביש ענק",     icon:"🕷️", desc:"יצור רב-רגליים עם ארס משתק",          minLevel:3,  difficulty:0.80, energyCost:20,
      blackMoneyMin:15,  blackMoneyMax:30,  diamondsMin:0, diamondsMax:1, xp:30,  lootChance:0.06,
      loot:{ category:"armor", name:"🛡️ קורי-שריון", statKey:"defense", statValue:55 } },
    { id:3,  name:"גולם אבן",      icon:"🗿", desc:"פסל קדום שקם לתחייה",                 minLevel:6,  difficulty:1.00, energyCost:28,
      blackMoneyMin:25,  blackMoneyMax:45,  diamondsMin:0, diamondsMax:1, xp:45,  lootChance:0.07,
      loot:{ category:"armor", name:"🛡️ שריון אבן", statKey:"defense", statValue:90 } },
    { id:4,  name:"רוח רפאים",     icon:"👻", desc:"נשמה אבודה שנודדת בין הבניינים",       minLevel:9,  difficulty:1.20, energyCost:35,
      blackMoneyMin:35,  blackMoneyMax:60,  diamondsMin:1, diamondsMax:2, xp:60,  lootChance:0.08,
      loot:{ category:"vehicle", name:"🚗 רכב רפאים", statKey:"speed", statValue:95 } },
    { id:5,  name:"זומבי מוטציה",  icon:"🧟", desc:"ניסוי גנטי שיצא משליטה",               minLevel:13, difficulty:1.45, energyCost:45,
      blackMoneyMin:50,  blackMoneyMax:85,  diamondsMin:1, diamondsMax:2, xp:80,  lootChance:0.08,
      loot:{ category:"weapon", name:"🔫 מקל מוטציה", statKey:"power", statValue:130 } },
    { id:6,  name:"ערפד עתיק",     icon:"🧛", desc:"יצור לילה בן מאות שנים",              minLevel:17, difficulty:1.70, energyCost:55,
      blackMoneyMin:70,  blackMoneyMax:110, diamondsMin:1, diamondsMax:3, xp:100, lootChance:0.09,
      loot:{ category:"armor", name:"🛡️ גלימת הערפד", statKey:"defense", statValue:150 } },
    { id:7,  name:"דרקון קטן",     icon:"🐉", desc:"גוזל דרקון עדיין מסוכן מאוד",          minLevel:22, difficulty:2.00, energyCost:68,
      blackMoneyMin:95,  blackMoneyMax:150, diamondsMin:2, diamondsMax:3, xp:130, lootChance:0.10,
      loot:{ category:"weapon", name:"🔫 טופר דרקון", statKey:"power", statValue:190 } },
    { id:8,  name:"מפלצת הביצה",   icon:"🐊", desc:"טורף ענק שמסתתר במים עכורים",         minLevel:27, difficulty:2.30, energyCost:78,
      blackMoneyMin:130, blackMoneyMax:200, diamondsMin:3, diamondsMax:4, xp:160, lootChance:0.10,
      loot:{ category:"vehicle", name:"🚗 סירת ביצות", statKey:"speed", statValue:180 } },
    { id:9,  name:"שד אש",         icon:"👹", desc:"ישות בוערת מהעולם התחתון",            minLevel:33, difficulty:2.65, energyCost:88,
      blackMoneyMin:175, blackMoneyMax:260, diamondsMin:4, diamondsMax:6, xp:200, lootChance:0.11,
      loot:{ category:"weapon", name:"🔫 להב אש שדי", statKey:"power", statValue:240 } },
    { id:10, name:"טיטאן אפל",     icon:"🌑", desc:"הענק הכי מפחיד שנראה אי פעם",         minLevel:40, difficulty:3.00, energyCost:98,
      blackMoneyMin:230, blackMoneyMax:340, diamondsMin:6, diamondsMax:9, xp:250, lootChance:0.12,
      loot:{ category:"armor", name:"🛡️ שריון הטיטאן", statKey:"defense", statValue:300 } }
];
// ==========================================
// רשימת מפלצות מותאמת לרמת השחקן (נעילה/קושי)
// ==========================================
function getMonsterList(){
    if(!player) return [];
    const level = Math.max(1, Number(player.level) || 1);
    return MONSTERS.map((monster, index) => {
        const unlock = Math.max(1, monster.minLevel || 1);
        const scaledDifficulty = monster.difficulty * (1 + Math.max(0, level - unlock) * 0.035);
        return { ...monster, index, scaledDifficulty, locked: level < unlock };
    });
}
// ==========================================
// תקיפת מפלצת - ללא קירור, רק עלות אנרגיה
// ==========================================
function attackMonster(monsterIndex){
    if(!player){
        return false;
    }
    const monster =
    MONSTERS[monsterIndex];
    if(!monster){
        return false;
    }
    const level =
    Math.max(1, Number(player.level) || 1);
    const unlock =
    Math.max(1, monster.minLevel || 1);
    if(level < unlock){
        showMessage("🔒 המפלצת נעולה - נדרשת רמה " + unlock);
        return false;
    }
    if(player.energy < monster.energyCost){
        showMessage("⚡ אין מספיק אנרגיה למפלצת " + monster.name);
        return false;
    }
    player.energy -= monster.energyCost;
    const attackPower =
    typeof getAttackPower === "function"
    ? getAttackPower()
    : (player.power || 0);
    const scaledDifficulty =
    monster.difficulty * (1 + Math.max(0, level - unlock) * 0.035);
    const monsterPowerBase =
    (10 + level * 6) * Math.max(0.5, scaledDifficulty);
    // שונות מוטה 60/40 לטובת ניצחון כשהכוח תואם בערך
    const variance =
    0.76 + Math.random() * 0.4;
    const monsterPower =
    Math.max(1, monsterPowerBase * variance);
    if(attackPower >= monsterPower){
        const blackMoney =
        Math.floor(Math.random() * (monster.blackMoneyMax - monster.blackMoneyMin + 1)) + monster.blackMoneyMin;
        const diamonds =
        monster.diamondsMax > 0
        ? Math.floor(Math.random() * (monster.diamondsMax - monster.diamondsMin + 1)) + monster.diamondsMin
        : 0;
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
            addXP(monster.xp);
        }
        let lootMessage = "";
        if(!Array.isArray(player.bossLoot)){
            player.bossLoot = [];
        }
        const alreadyHasLoot =
        player.bossLoot.find(l=>l.monsterId===monster.id);
        if(!alreadyHasLoot && Math.random() < monster.lootChance){
            player.bossLoot.push({
                monsterId:monster.id,
                category:monster.loot.category,
                name:monster.loot.name,
                statKey:monster.loot.statKey,
                statValue:monster.loot.statValue
            });
            if(typeof player[monster.loot.statKey] !== "number"){
                player[monster.loot.statKey] = 0;
            }
            player[monster.loot.statKey] += monster.loot.statValue;
            lootMessage =
            " | 🎁 שלל נדיר! קיבלת " + monster.loot.name + " (+" + monster.loot.statValue + ")";
        }
        showMessage(
            "🏆 ניצחת את " + monster.name + "! " +
            "+" + blackMoney + " 🖤" +
            (diamonds > 0 ? " +" + diamonds + " 💎" : "") +
            lootMessage
        );
        if(typeof dailyAddProgress === "function"){
            dailyAddProgress("battlesWon", 1);
        }
    }
    else{
        const baseDamagePercent =
        0.15 + Math.random() * 0.15;
        const rawDamage =
        Math.floor((player.maxHealth || 100) * baseDamagePercent);
        const defense =
        player.defense || 0;
        const reducedDamage =
        Math.max(5, rawDamage - Math.floor(defense * 0.4));
        player.health -= reducedDamage;
        if(player.health < 0){
            player.health = 0;
        }
        showMessage(
            "💥 הפסדת מול " + monster.name + " (-" + reducedDamage + " חיים)"
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
        currentPage === "battle"
        &&
        typeof renderBattle === "function"
    ){
        const content =
        document.getElementById("gameContent");
        if(content){
            renderBattle(content);
        }
    }
    return true;
}
// ==========================================
// רינדור רשימת המפלצות - 2 בשורה
// ==========================================
function renderMonsterList(content){
    if(!player || !content){
        return;
    }
    let html = `
    <div class="contentCard battlePage">
    <h3>🐉 קרבות מיוחדים</h3>
    <div class="quickActionsRow">
        <button class="smallButton quickActionBtn menuButton" onclick="setBattleTab('normal')">⚔️ קרב רגיל</button>
        <button class="smallButton quickActionBtn menuButton" onclick="setBattleTab('boss')">🏆 בוסים</button>
        <button class="smallButton quickActionBtn menuButton active" onclick="setBattleTab('monsters')">🐉 מיוחדים</button>
    </div>
    <div class="battleGrid">`;
    getMonsterList().forEach(monster=>{
        const monsterPowerBase =
        Math.round((10 + Math.max(1, player.level||1) * 6) * Math.max(0.5, monster.scaledDifficulty));
        const disabled =
        monster.locked || player.energy < monster.energyCost;
        html += `
        <div class="battleCard ${monster.locked ? "locked" : ""}">
            <div class="battleIcon">${monster.icon}</div>
            <h4>${monster.name}</h4>
            <p>${monster.desc}</p>
            <div class="battleMeta">💪 כוח <b>${monsterPowerBase}</b></div>
            <div class="battleMeta">🔓 ${monster.locked ? `נפתח ברמה ${monster.minLevel}` : `רמה ${monster.minLevel}+`}</div>
            <div class="battleMeta">🖤 ${monster.blackMoneyMin}-${monster.blackMoneyMax}${monster.diamondsMax > 0 ? " · 💎 " + monster.diamondsMin + "-" + monster.diamondsMax : ""}</div>
            <button
            class="battleFightBtn"
            ${disabled ? "disabled" : ""}
            onclick="attackMonster(${monster.index})">
                ${
                    monster.locked
                    ? "🔒 נעול"
                    : "⚔️ תקוף · ⚡ " + monster.energyCost
                }
            </button>
        </div>
        `;
    });
    html += `</div></div>`;
    content.innerHTML = html;
}
