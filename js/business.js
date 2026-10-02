/* ==========================================
   WARDEAL v2.2
   Business System
   8 עסקים, XP וכסף תואמים במדויק למוצג ב-UI
========================================== */
const BUSINESS_LIST = [
    {
        id:1,
        name:"🏪 חנות טכנולוגיה",
        price:4000,
        income:50,
        upgradeIncome:25,
        buyXp:40,
        upgradeXp:20,
        specialUpgradeCost:25,
        specialUpgradeBonus:30
    },
    {
        id:2,
        name:"☕ בית קפה",
        price:15000,
        income:100,
        upgradeIncome:50,
        buyXp:100,
        upgradeXp:50,
        specialUpgradeCost:45,
        specialUpgradeBonus:100
    },
    {
        id:3,
        name:"🍽️ מסעדה",
        price:35000,
        income:200,
        upgradeIncome:100,
        buyXp:200,
        upgradeXp:100,
        specialUpgradeCost:70,
        specialUpgradeBonus:225
    },
    {
        id:4,
        name:"🛡️ חברת אבטחה",
        price:80000,
        income:400,
        upgradeIncome:200,
        buyXp:350,
        upgradeXp:175,
        specialUpgradeCost:100,
        specialUpgradeBonus:475
    },
    {
        id:5,
        name:"🚚 חברת הובלות",
        price:180000,
        income:800,
        upgradeIncome:400,
        buyXp:600,
        upgradeXp:300,
        specialUpgradeCost:150,
        specialUpgradeBonus:1050
    },
    {
        id:6,
        name:"🏭 מפעל ייצור",
        price:400000,
        income:1600,
        upgradeIncome:800,
        buyXp:1000,
        upgradeXp:500,
        specialUpgradeCost:220,
        specialUpgradeBonus:2300
    },
    {
        id:7,
        name:"🏢 תאגיד עתידני",
        price:900000,
        income:3200,
        upgradeIncome:1600,
        buyXp:1600,
        upgradeXp:800,
        specialUpgradeCost:320,
        specialUpgradeBonus:5000
    },
    {
        id:8,
        name:"🏦 קונצרן פיננסי",
        price:2000000,
        income:6400,
        upgradeIncome:3200,
        buyXp:2800,
        upgradeXp:1400,
        specialUpgradeCost:500,
        specialUpgradeBonus:11000
    }
];
// ==========================================
// רכישת עסק
// ==========================================
function buyBusiness(id){
    if(!player){
        return false;
    }
    const business =
    BUSINESS_LIST.find(
        b => b.id === id
    );
    if(!business){
        showBusinessMessage(
            "🏢 העסק לא נמצא"
        );
        return false;
    }
    if(!Array.isArray(player.businesses)){
        player.businesses = [];
    }
    // מניעת רכישה כפולה
    const owned =
    player.businesses.find(
        b => b.id === id
    );
    if(owned){
        showBusinessMessage(
            "🏢 העסק כבר בבעלותך"
        );
        return false;
    }
    if(player.money < business.price){
        showBusinessMessage(
            "💰 אין מספיק כסף לרכישת עסק"
        );
        return false;
    }
    player.money -= business.price;
    player.businesses.push({
        id:business.id,
        name:business.name,
        income:business.income,
        upgradeIncome:business.upgradeIncome,
        price:business.price,
        upgradeXp:business.upgradeXp,
        specialUpgradeCost:business.specialUpgradeCost,
        specialUpgradeBonus:business.specialUpgradeBonus,
        level:1
    });
    if(typeof addXP === "function"){
        addXP(business.buyXp);
    }
    showBusinessMessage(
        "🏢 נרכש עסק: " +
        business.name +
        " (+" + business.buyXp + " XP)"
    );
    saveBusinessUpdate();
    return true;
}
// ==========================================
// הכנסה מעסקים
// ==========================================
function getBusinessIncome(){
    if(
        !player ||
        !Array.isArray(player.businesses)
    ){
        return 0;
    }
    let total = 0;
    player.businesses.forEach(business=>{
        // business.income כבר צובר את כל תוספות
        // השדרוגים (upgradeIncome) בעצמו - אסור
        // להכפיל שוב ברמה, זה גרם לניפוח כפול
        total += business.income || 0;
    });
    return Math.floor(total);
}
// ==========================================
// שדרוג עסק
// ==========================================
function upgradeBusiness(index){
    if(
        !player ||
        !Array.isArray(player.businesses)
    ){
        return false;
    }
    const business =
    player.businesses[index];
    if(!business){
        return false;
    }
    business.level =
    business.level || 1;
    business.upgradeIncome =
    business.upgradeIncome || 1000;
    // עלות שדרוג = 10% ממחיר העסק המקורי, כפול הרמה הנוכחית
    const basePrice =
    typeof business.price === "number"
    ?
    business.price
    :
    100000;
    const upgradeCost =
    business.level *
    Math.floor(basePrice * 0.15);
    if(player.money < upgradeCost){
        showBusinessMessage(
            "💰 אין מספיק כסף לשדרוג"
        );
        return false;
    }
    player.money -= upgradeCost;
    business.level++;
    business.income +=
    business.upgradeIncome;
    const upgradeXp =
    typeof business.upgradeXp === "number"
    ?
    business.upgradeXp
    :
    100;
    if(typeof addXP === "function"){
        addXP(upgradeXp);
    }
    showBusinessMessage(
        "🏢 העסק שודרג לרמה " +
        business.level +
        " (+" + upgradeXp + " XP)"
    );
    saveBusinessUpdate();
    return true;
}
// ==========================================
// שדרוג מיוחד לעסק - עד 10 רמות
// עלות: כסף שחור + יהלומים
// ==========================================
const BUSINESS_SPECIAL_MAX_LEVEL = 10;

function getBusinessSpecialUpgradeInfo(index){
    if(!player || !Array.isArray(player.businesses)) return null;

    const business = player.businesses[index];
    if(!business) return null;

    const definition = BUSINESS_LIST.find(b => b.id === business.id);
    if(!definition) return null;

    let currentLevel = Number(business.specialUpgradeLevel || 0);

    // תאימות לשמירות ישנות
    if(currentLevel < 1 && business.specialUpgrade === true){
        currentLevel = 1;
        business.specialUpgradeLevel = 1;
    }

    currentLevel = Math.max(
        0,
        Math.min(BUSINESS_SPECIAL_MAX_LEVEL, Math.floor(currentLevel))
    );

    if(currentLevel >= BUSINESS_SPECIAL_MAX_LEVEL){
        return {
            currentLevel,
            nextLevel: BUSINESS_SPECIAL_MAX_LEVEL,
            maxed: true,
            blackCost: 0,
            diamondCost: 0,
            bonus: 0
        };
    }

    const nextLevel = currentLevel + 1;
    const baseBlack = Number(definition.specialUpgradeCost || 50);
    const baseBonus = Number(definition.specialUpgradeBonus || 50);

    const blackCost = Math.max(
        1,
        Math.ceil(baseBlack * Math.pow(1.45, currentLevel))
    );

    const diamondCost = Math.max(
        1,
        Math.ceil((Number(definition.price) || 100000) / 1000000)
        + Math.floor(currentLevel / 2)
    );

    const bonus = Math.max(
        1,
        Math.floor(baseBonus * Math.pow(1.35, currentLevel))
    );

    return {
        currentLevel,
        nextLevel,
        maxed: false,
        blackCost,
        diamondCost,
        bonus
    };
}

function buyBusinessSpecialUpgrade(index){
    if(!player || !Array.isArray(player.businesses)) return false;

    const business = player.businesses[index];
    if(!business) return false;

    const info = getBusinessSpecialUpgradeInfo(index);
    if(!info){
        showBusinessMessage("🏢 נתוני השדרוג המיוחד לא נמצאו");
        return false;
    }

    if(info.maxed){
        showBusinessMessage(
            "⭐ העסק כבר ברמת השדרוג המיוחד המקסימלית — רמה " +
            BUSINESS_SPECIAL_MAX_LEVEL
        );
        return false;
    }

    if((player.blackMoney || 0) < info.blackCost){
        showBusinessMessage(
            "🖤 אין מספיק כסף שחור. נדרש " +
            info.blackCost.toLocaleString()
        );
        return false;
    }

    if((player.diamonds || 0) < info.diamondCost){
        showBusinessMessage(
            "💎 אין מספיק יהלומים. נדרש " +
            info.diamondCost
        );
        return false;
    }

    player.blackMoney -= info.blackCost;
    player.diamonds -= info.diamondCost;

    business.income =
        Number(business.income || 0) + info.bonus;

    business.specialUpgradeLevel = info.nextLevel;
    business.specialUpgrade = info.nextLevel >= 1;

    showBusinessMessage(
        "⭐ " + business.name +
        " שודרג במיוחד לרמה " + info.nextLevel +
        " | +" + info.bonus.toLocaleString() +
        " ₪/דקה | 🖤 -" + info.blackCost.toLocaleString() +
        " | 💎 -" + info.diamondCost
    );

    saveBusinessUpdate();
    return true;
}

// ==========================================
// רשימת עסקים
// ==========================================
function getBusinesses(){
    return BUSINESS_LIST;
}
// ==========================================
// עסקים בבעלות
// ==========================================
function getOwnedBusinesses(){
    if(
        !player ||
        !Array.isArray(player.businesses)
    ){
        return [];
    }
    return player.businesses;
}
// ==========================================
// מספר עסקים
// ==========================================
function getOwnedBusinessesCount(){
    return getOwnedBusinesses().length;
}
// ==========================================
// שמירה ועדכון
// ==========================================
function saveBusinessUpdate(){
    if(typeof saveGame === "function"){
        saveGame();
    }
    if(typeof dailyAddProgress === "function"){
        dailyAddProgress("realEstateActions", 1);
    }
    if(typeof updateUI === "function"){
        updateUI();
    }
    if(
        typeof currentPage !== "undefined"
        &&
        currentPage === "business"
    ){
        const content =
        document.getElementById("gameContent");
        if(
            content
            &&
            typeof renderBusiness === "function"
        ){
            renderBusiness(content);
        }
    }
}
// ==========================================
// הודעה בטוחה
// ==========================================
function showBusinessMessage(message){
    if(typeof showMessage === "function"){
        showMessage(message);
    }
}
console.log(
    "WARDEAL BUSINESS v2.2 READY"
);
