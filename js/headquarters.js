/* ==========================================
   WARDEAL v0.6.0
   מערכת תחנה
   שדרוג עד רמה 50 + בונוסים + מתנה
========================================== */
const HQ_MAX_LEVEL = 50;
const HQ_BASE_UPGRADE_COST = 5000;
const HQ_COST_GROWTH = 1.16;
const HQ_INCOME_BONUS_PER_LEVEL = 0.02;
const HQ_GIFT_BONUS_PER_LEVEL = 0.02;
function ensureStation(){
    if(!player) return null;
    if(!player.headquarters || typeof player.headquarters !== "object"){
        player.headquarters = { level: 1 };
    }
    let level = Number(player.headquarters.level);
    if(!Number.isFinite(level)) level = 1;
    player.headquarters.level = Math.max(1, Math.min(HQ_MAX_LEVEL, Math.floor(level)));
    return player.headquarters;
}
function getStationLevel(){
    const hq = ensureStation();
    return hq ? hq.level : 1;
}
function getStationUpgradeCost(){
    const level = getStationLevel();
    if(level >= HQ_MAX_LEVEL) return 0;
    return Math.floor(HQ_BASE_UPGRADE_COST * Math.pow(HQ_COST_GROWTH, level - 1));
}
function getStationIncomeMultiplier(){
    return 1 + ((getStationLevel() - 1) * HQ_INCOME_BONUS_PER_LEVEL);
}
function getStationGiftMultiplier(){
    return 1 + ((getStationLevel() - 1) * HQ_GIFT_BONUS_PER_LEVEL);
}
function getStationBenefits(){
    const level = getStationLevel();
    return {
        incomePercent: Math.round((getStationIncomeMultiplier() - 1) * 100),
        giftPercent: Math.round((getStationGiftMultiplier() - 1) * 100),
        maxLevel: HQ_MAX_LEVEL
    };
}
function upgradeStation(){
    if(!player) return false;
    const hq = ensureStation();
    if(hq.level >= HQ_MAX_LEVEL){
        if(typeof showMessage === "function") showMessage("🏰 התחנה כבר ברמה המקסימלית 50!");
        return false;
    }
    const cost = getStationUpgradeCost();
    const money = Number(player.money || 0);
    if(money < cost){
        if(typeof showMessage === "function") showMessage("💰 חסרים לך ₪" + (cost - money).toLocaleString() + " לשדרוג התחנה.");
        return false;
    }
    player.money = money - cost;
    hq.level += 1;
    if(typeof saveGame === "function") saveGame();
    if(typeof dailyAddProgress === "function") dailyAddProgress("hqUpgrades", 1);
    if(typeof showMessage === "function"){
        showMessage((player.side === "police" ? "👮 תחנת המשטרה" : "🕶️ המפקדה") + " שודרגה לרמה " + hq.level + "! ההכנסה והמתנה קיבלו בונוס.");
    }
    if(typeof updateUI === "function") updateUI();
    if(typeof currentPage !== "undefined" && currentPage === "home"){
        const content = document.getElementById("gameContent");
        if(content && typeof renderCity === "function") renderCity(content);
    }
    return true;
}
function getStationGiftMultiplierSafe(){
    return typeof getStationGiftMultiplier === "function" ? getStationGiftMultiplier() : 1;
}
// תאימות למערכת ה-UI הישנה: כל קריאה בשם Headquarters מופנית לתחנה.
function getHeadquartersLevel(){
    return getStationLevel();
}
function getHeadquartersUpgradeCost(){
    return getStationUpgradeCost();
}
function getHeadquartersBenefits(){
    return getStationBenefits();
}
function upgradeHeadquarters(){
    return upgradeStation();
}
