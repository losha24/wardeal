/* ==========================================
   WARDEAL v2.8
   מערכת קרבות
   יחידות מוסיפות כוח התקפה
   הגנה מפחיתה נזק שנספג
========================================== */
const ENEMIES = {
    forPolice: [
        { name:"כנופיית רחוב", desc:"עבריינים מקומיים חמושים בסכינים", difficulty:0.70, minLevel:1, icon:"🥷" },
        { name:"סוחר סמים", desc:"דילר עם שומרי ראש", difficulty:0.85, minLevel:1, icon:"💊" },
        { name:"שודד בנקים", desc:"מבוקש ומסוכן", difficulty:1.00, minLevel:2, icon:"🏦" },
        { name:"כנופיה מאורגנת", desc:"חבורה חמושה ומאומנת", difficulty:1.15, minLevel:4, icon:"🔫" },
        { name:"ראש ארגון פשע", desc:"בוס תת-קרקעי עם צבא פרטי", difficulty:1.35, minLevel:7, icon:"👑" },
        { name:"קרטל עוצמתי", desc:"ארגון פשע כבד עם כוח גדול", difficulty:1.60, minLevel:10, icon:"💀" }
    ],
    forCriminal: [
        { name:"סיור משטרתי", desc:"שוטרים על הרגל באזור", difficulty:0.70, minLevel:1, icon:"🚓" },
        { name:"בלש חשאי", desc:"חוקר סמוי שעוקב אחריך", difficulty:0.85, minLevel:1, icon:"🕵️" },
        { name:"יחידה מיוחדת", desc:"כוח משטרתי כבד עם ציוד מתקדם", difficulty:1.00, minLevel:2, icon:"🛡️" },
        { name:"יחידת עילית", desc:"לוחמים מיומנים עם ציוד מתקדם", difficulty:1.15, minLevel:4, icon:"⚔️" },
        { name:"סוכן פדרלי", desc:"חוקר בכיר עם תקציב בלתי מוגבל", difficulty:1.35, minLevel:7, icon:"🎯" },
        { name:"כוח מיוחד", desc:"יחידה מיוחדת מהמסוכנות ביותר", difficulty:1.60, minLevel:10, icon:"💀" }
    ]
};
// ==========================================
// נוסחת הסתברות ניצחון משותפת - קרב רגיל/בוס/מפלצת
// עקומה חלקה (לא "צוק" בינארי): גם בכוח מקסימלי
// יש עדיין סיכוי קטן להפסיד, וגם בכוח מינימלי יש
// עדיין סיכוי קטן לנצח. ביחס כוחות שווה (1:1) הסיכוי
// הוא בדיוק באמצע בין floor ל-ceiling.
// dangerous=true (מצב "קרב מסוכן") מוריד את הסיכוי
// עוד יותר, בתמורה לתגמול גבוה יותר אם מנצחים.
// ==========================================
const DANGEROUS_WIN_CHANCE_PENALTY = 0.20;
const DANGEROUS_WIN_FLOOR = 0.03;
const DANGEROUS_REWARD_MULTIPLIER = 1.75;
let dangerousBattleMode = false;
function getWinChance(powerRatio, floor, ceiling, dangerous){
    const safeRatio = Math.max(0, Number(powerRatio) || 0);
    const t = safeRatio / (safeRatio + 1);
    let chance = floor + (ceiling - floor) * t;
    if(dangerous){
        chance = Math.max(DANGEROUS_WIN_FLOOR, chance - DANGEROUS_WIN_CHANCE_PENALTY);
    }
    return Math.max(0, Math.min(1, chance));
}
// ==========================================
// הפעלה/כיבוי של מצב "קרב מסוכן"
// ==========================================
function toggleDangerousMode(){
    dangerousBattleMode = !dangerousBattleMode;
    showMessage(
        dangerousBattleMode
        ? "☠️ מצב קרב מסוכן הופעל - סיכוי ניצחון נמוך יותר, אך תגמול גבוה פי " + DANGEROUS_REWARD_MULTIPLIER
        : "🛡️ מצב קרב מסוכן כובה - חזרה לסיכויים הרגילים"
    );
    if(typeof currentPage !== "undefined" && typeof document !== "undefined"){
        const content = document.getElementById("gameContent");
        if(content){
            if(currentPage === "battle" && typeof renderBattle === "function"){
                renderBattle(content);
            }
        }
    }
}
const BATTLE_WIN_FLOOR = 0.12;
const BATTLE_WIN_CEILING = 0.88;
// ==========================================
// סיכוי ניצחון משוער מול אויב - לתצוגה מראש בממשק
// ==========================================
function getBattleWinPercent(enemy){
    if(!player || !enemy) return 0;
    const attackPower = getAttackPower();
    const targetLevel = getBattleTargetLevel(enemy);
    const enemyPower = Math.max(1, (10 + targetLevel * 4.2) * Math.max(0.55, Number(enemy.difficulty) || 1));
    const ratio = attackPower / enemyPower;
    return Math.round(getWinChance(ratio, BATTLE_WIN_FLOOR, BATTLE_WIN_CEILING, dangerousBattleMode) * 100);
}
function getBattleEnemies(){
    if(!player) return [];
    const pool = player.side === "police" ? ENEMIES.forPolice : ENEMIES.forCriminal;
    const level = Math.max(1, Number(player.level) || 1);
    return pool.map((enemy, index) => {
        const unlock = Math.max(1, enemy.minLevel || 1);
        const scaledDifficulty = enemy.difficulty * (1 + Math.max(0, level - unlock) * 0.035);
        return { ...enemy, index, scaledDifficulty, locked: level < unlock };
    });
}
// ==========================================
// חישוב כוח התקפה כולל (כוח בסיס + יחידות)
// ==========================================
function getAttackPower(){
    if(!player){
        return 0;
    }
    // כוח היחידות שגויסו כבר נכלל בתוך player.power
    // (מתעדכן שם ברגע הגיוס עצמו) - אין להוסיף אותו שוב כאן
    // בונוס מהירות מרכבים כן מתווסף בנפרד, כי הוא לא חלק מ-power
    const speedBonus =
    typeof getSpeedCombatBonus === "function"
    ?
    getSpeedCombatBonus()
    :
    0;
    return (player.power || 0) + speedBonus;
}
// ==========================================
// בחירת אויב אקראי לפי צד השחקן
// ==========================================
function getRandomEnemy(){
    const available = getBattleEnemies().filter(enemy => !enemy.locked);
    if(!available.length) return null;
    return available[Math.floor(Math.random() * available.length)];
}
function getBattleEnemyByIndex(index){
    const enemies = getBattleEnemies();
    const enemy = enemies[Number(index)];
    if(!enemy || enemy.locked) return null;
    return enemy;
}
// ==========================================
// עלות אנרגיה לקרב לפי רמת היריב
// ==========================================
function getBattleTargetLevel(enemy){
    if(!player || !enemy) return 1;
    const playerLevel = Math.max(1, Number(player.level) || 1);
    const unlockLevel = Math.max(1, Number(enemy.minLevel) || 1);
    // האויב מתקדם יחד עם השחקן, אבל לא מדביק אותו מיד.
    // כך גם ברמות גבוהות הקרבות נשארים ניתנים לניצחון.
    return Math.max(
        unlockLevel,
        Math.min(
            playerLevel,
            Math.floor(unlockLevel + Math.max(0, playerLevel - unlockLevel) * 0.65)
        )
    );
}
function getBattleEnergyCost(enemy){
    if(!enemy) return 10;
    const targetLevel = getBattleTargetLevel(enemy);
    const difficulty = Math.max(0.5, Number(enemy.difficulty) || 1);
    // יותר רמה + יותר קושי = יותר אנרגיה.
    return Math.min(60, Math.max(10, Math.round(8 + targetLevel * 2.5 + difficulty * 5)));
}
// ==========================================
// קרב
// ==========================================
function startBattle(enemyIndex){
    if(!player){
        return;
    }
    if(
        typeof isHospitalized === "function"
        &&
        isHospitalized()
    ){
        const status =
        typeof getHospitalStatus === "function"
        ?
        getHospitalStatus()
        :
        { timeText:"" };
        showMessage(
            "🏥 אתה בבית החולים - עוד " + status.timeText +
            " (אפשר לשלם כדי לצאת מוקדם)"
        );
        return;
    }
    const enemy =
    enemyIndex === undefined || enemyIndex === null
    ? getRandomEnemy()
    : getBattleEnemyByIndex(enemyIndex);
    if(!enemy){
        showMessage("🔒 הקרב נעול לפי רמת השחקן");
        return;
    }
    // קרבות חזקים יותר צורכים יותר אנרגיה.
    // כך קרב מתקדם הוא גם מסוכן וגם יקר יותר למשאבים.
    const battleEnergyCost = getBattleEnergyCost(enemy);
    if(player.energy < battleEnergyCost){
        showMessage("⚡ הקרב דורש " + battleEnergyCost + " אנרגיה - יש לך רק " + Math.max(0, Number(player.energy)||0));
        return;
    }
    const isDangerous = dangerousBattleMode;
    player.energy -= battleEnergyCost;
    const attackPower =
    getAttackPower();
    const targetLevel = getBattleTargetLevel(enemy);
    // כוח האויב גדל לפי רמת הקרב והקושי. הניצחון/הפסד
    // עצמם לא נקבעים בצורה בינארית אלא לפי עקומת הסתברות
    // חלקה (getWinChance) - גם בכוח מקסימלי יש סיכוי קטן
    // להפסיד, וגם בכוח מינימלי יש סיכוי קטן לנצח.
    const enemyPower =
        Math.max(1, (10 + targetLevel * 4.2) *
        Math.max(0.55, Number(enemy.difficulty) || 1));
    const powerRatio = attackPower / enemyPower;
    const battleWinChance = getWinChance(powerRatio, BATTLE_WIN_FLOOR, BATTLE_WIN_CEILING, isDangerous);
    const battleWon = Math.random() < battleWinChance;
    const rewardMultiplier = isDangerous ? DANGEROUS_REWARD_MULTIPLIER : 1;
    const minReward =
    typeof BATTLE_MIN_REWARD !== "undefined"
    ?
    BATTLE_MIN_REWARD
    :
    500;
    const maxReward =
    typeof BATTLE_MAX_REWARD !== "undefined"
    ?
    BATTLE_MAX_REWARD
    :
    1500;
    const xpReward =
    typeof BATTLE_XP_REWARD !== "undefined"
    ?
    BATTLE_XP_REWARD
    :
    25;
    if(battleWon){
        // אויב קשה יותר = פרס גדול יותר. במצב "קרב מסוכן" התגמול מוכפל.
        const baseReward =
        Math.floor(
            Math.random() * (maxReward - minReward + 1)
        ) + minReward;
        const reward =
        Math.floor(
            baseReward * enemy.scaledDifficulty * rewardMultiplier
        );
        player.money += reward;
        // זהב על כל ניצחון - 1 עד 15, מושפע מקושי האויב (ומוכפל במצב מסוכן)
        const goldReward =
        Math.max(
            1,
            Math.round(
                Math.min(15, Math.random() * 15 * enemy.scaledDifficulty) * rewardMultiplier
            )
        );
        if(typeof player.gold !== "number"){
            player.gold = 0;
        }
        player.gold += goldReward;
        // מעקב אחרי סך הניצחונות + בונוס יהלום כל 10 ניצחונות
        if(typeof player.totalWins !== "number"){
            player.totalWins = 0;
        }
        player.totalWins++;
        if(typeof dailyAddProgress === "function"){
            dailyAddProgress("battlesWon", 1);
            dailyAddProgress("moneyEarned", Math.max(0, Number(reward)||0));
        }
        let diamondBonus = 0;
        if(player.totalWins % 10 === 0){
            if(typeof player.diamonds !== "number"){
                player.diamonds = 0;
            }
            diamondBonus = 1;
            player.diamonds += diamondBonus;
        }
        // סיכוי קטן לכסף שחור ("שוחד") בכל ניצחון
        let blackMoneyBonus = 0;
        if(Math.random() < 0.05){
            if(typeof player.blackMoney !== "number"){
                player.blackMoney = 0;
            }
            blackMoneyBonus =
            Math.round((5 + Math.random() * 10) * enemy.difficulty);
            player.blackMoney += blackMoneyBonus;
        }
        addXP(
            Math.floor(xpReward * enemy.difficulty)
        );
        // גם בניצחון יש סיכוי קטן לפציעה קלה - אף קרב לא "חינם" לגמרי
        let winDamage = 0;
        if(Math.random() < 0.25){
            const rawWinDamage = Math.floor(Math.random() * 6) + 3; // 3-8
            winDamage = Math.max(1, rawWinDamage - Math.floor((player.defense || 0) * 0.5));
            player.health -= winDamage;
            if(player.health < 0) player.health = 0;
        }
        showMessage(
            "⚔️ ניצחת את " +
            enemy.name +
            " (רמת קרב " + targetLevel + ") וקיבלת ₪" +
            reward +
            " ו-" + goldReward + " 🪎" +
            (isDangerous ? " | ☠️ בונוס קרב מסוכן" : "") +
            (
                blackMoneyBonus > 0
                ?
                " | 🖤 שוחד! +" + blackMoneyBonus
                :
                ""
            ) +
            (
                diamondBonus > 0
                ?
                " | 🎖️ ניצחון מס' " + player.totalWins + " - זכית ביהלום! 💎"
                :
                ""
            ) +
            (
                winDamage > 0
                ?
                " | 🩸 נפצעת קלות גם בניצחון -" + winDamage + " חיים"
                :
                ""
            )
        );
    }
    else{
        const baseDamage =
        Math.floor(
            Math.random() * 10
        ) + 15;
        const defense =
        player.defense || 0;
        const reducedDamage =
        Math.max(
            3,
            baseDamage - Math.floor(defense * 0.5)
        );
        player.health -= reducedDamage;
        let sentToHospital = false;
        if(player.health <= 0){
            if(typeof sendToHospital === "function"){
                sendToHospital();
            }
            else{
                player.health = 0;
            }
            sentToHospital = true;
        }
        // סיכוי לאבד מעט זהב גם בהפסד - לא תמיד
        let goldLost = 0;
        if(
            Math.random() < 0.35
            &&
            (player.gold || 0) > 0
        ){
            goldLost =
            Math.min(
                player.gold,
                Math.floor(Math.random() * 8) + 1
            );
            player.gold -= goldLost;
        }
        // סיכוי לאבד גם קצת כסף רגיל בהפסד
        let moneyLost = 0;
        if(
            Math.random() < 0.4
            &&
            (player.money || 0) > 0
        ){
            moneyLost =
            Math.min(
                player.money,
                Math.floor(Math.random() * 200) + 50
            );
            player.money -= moneyLost;
        }
        // סיכוי לאבד יחידה אחת בהפסד - מפחית כוח בהתאם
        let unitsLost = 0;
        let unitsPowerLost = 0;
        let unitsDefenseLost = 0;
        if(
            Math.random() < 0.15
            &&
            typeof getUnits === "function"
            &&
            getUnits() > 0
        ){
            const totalUnits =
            getUnits();
            const avgPowerPerUnit =
            Math.max(
                1,
                Math.round((player.unitsPower || 0) / totalUnits)
            );
            const avgDefensePerUnit =
            (player.unitsDefense || 0) > 0
            ?
            Math.max(
                1,
                Math.round((player.unitsDefense || 0) / totalUnits)
            )
            :
            0;
            if(player.side === "police"){
                player.policeUnits = Math.max(0, player.policeUnits - 1);
            }
            else{
                player.criminalUnits = Math.max(0, player.criminalUnits - 1);
            }
            player.power =
            Math.max(1, player.power - avgPowerPerUnit);
            player.unitsPower =
            Math.max(0, (player.unitsPower || 0) - avgPowerPerUnit);
            if(avgDefensePerUnit > 0){
                player.defense =
                Math.max(1, player.defense - avgDefensePerUnit);
                player.unitsDefense =
                Math.max(0, (player.unitsDefense || 0) - avgDefensePerUnit);
            }
            unitsLost = 1;
            unitsPowerLost = avgPowerPerUnit;
            unitsDefenseLost = avgDefensePerUnit;
        }
        showMessage(
            "💥 הפסדת מול " +
            enemy.name +
            " (רמת קרב " + targetLevel + ") (" +
            enemy.desc +
            ") -" +
            reducedDamage +
            " חיים" +
            (
                goldLost > 0
                ?
                " ואיבדת " + goldLost + " 🪎"
                :
                ""
            ) +
            (
                moneyLost > 0
                ?
                " ואיבדת ₪" + moneyLost
                :
                ""
            ) +
            (
                unitsLost > 0
                ?
                " ואיבדת יחידה אחת! (-" + unitsPowerLost + " כוח" + (unitsDefenseLost > 0 ? ", -" + unitsDefenseLost + " הגנה" : "") + ")"
                :
                ""
            ) +
            (
                sentToHospital
                ?
                " | 🏥 נפצעת קשה ונשלחת לבית החולים ל-4 שעות!"
                :
                ""
            )
        );
    }
    if(player.health < 0){
        player.health = 0;
    }
    if(typeof saveGame === "function"){
        saveGame();
    }
    updateUI();
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
}
console.log(
    "WARDEAL COMBAT v2.8 READY"
);
