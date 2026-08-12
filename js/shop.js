/* ==========================================
   WARDEAL v0.1.0
   חנות ציוד
   נשק -> כוח התקפה (power)
   שריון/בגדים -> הגנה (defense)
   רכבים -> מהירות (speed): מקצרת זמן
   עבודות ונותנת בונוס קטן בקרב
   כל פריט נרכש פעם אחת, בזהב או ביהלומים
========================================== */


const WEAPONS_LIST = [

    { id:1, name:"🔫 אקדח", currency:"gold", cost:20, power:5 },

    { id:2, name:"🔫 רובה סער", currency:"gold", cost:45, power:12 },

    { id:3, name:"🎯 רובה צלפים", currency:"gold", cost:80, power:22 },

    { id:4, name:"🔫 מקלע כבד", currency:"gold", cost:150, power:35 },

    { id:5, name:"✨ נשק לייזר (נדיר)", currency:"diamonds", cost:8, power:60 },

    { id:6, name:"💥 נשק על-קולי (נדיר ביותר)", currency:"diamonds", cost:20, power:100 },

    { id:7, name:"🖤 נשק גנוב מהצבא (שוק שחור)", currency:"blackMoney", cost:60, power:130 },

    { id:8, name:"🖤 נשק מבוקש בעולם (שוק שחור)", currency:"blackMoney", cost:90, power:160 }

];



const ARMOR_LIST = [

    { id:1, name:"🛡️ אפוד קל", currency:"gold", cost:15, defense:4 },

    { id:2, name:"🛡️ אפוד טקטי", currency:"gold", cost:35, defense:10 },

    { id:3, name:"🛡️ שריון גוף מלא", currency:"gold", cost:70, defense:18 },

    { id:4, name:"🛡️ שריון קרבי", currency:"gold", cost:130, defense:30 },

    { id:5, name:"🛡️ שריון ננו (נדיר)", currency:"diamonds", cost:7, defense:55 },

    { id:6, name:"🛡️ שריון על-חוסן (נדיר ביותר)", currency:"diamonds", cost:18, defense:95 },

    { id:7, name:"🖤 שריון מוברח (שוק שחור)", currency:"blackMoney", cost:55, defense:110 },

    { id:8, name:"🖤 שריון על-סודי (שוק שחור)", currency:"blackMoney", cost:85, defense:140 }

];



const VEHICLES_LIST = [

    { id:1, name:"🚗 אופנוע", currency:"gold", cost:25, speed:5 },

    { id:2, name:"🚗 רכב ספורט", currency:"gold", cost:55, speed:12 },

    { id:3, name:"🚗 רכב שטח משודרג", currency:"gold", cost:100, speed:20 },

    { id:4, name:"🚗 מסוק תובלה", currency:"gold", cost:180, speed:32 },

    { id:5, name:"🚗 רכב מרוץ (נדיר)", currency:"diamonds", cost:9, speed:55 },

    { id:6, name:"🚗 ג'ט פרטי (נדיר ביותר)", currency:"diamonds", cost:22, speed:90 },

    { id:7, name:"🖤 רכב גנוב משודרג (שוק שחור)", currency:"blackMoney", cost:60, speed:100 },

    { id:8, name:"🖤 מסוק צבאי גנוב (שוק שחור)", currency:"blackMoney", cost:90, speed:130 }

];









// ==========================================
// עזר: ניכוי מטבע מתאים
// ==========================================

function canAffordShopItem(item){


    if(!player){

        return false;

    }




    if(item.currency === "diamonds"){

        return (player.diamonds || 0) >= item.cost;

    }




    if(item.currency === "blackMoney"){

        return (player.blackMoney || 0) >= item.cost;

    }




    return (player.gold || 0) >= item.cost;


}









function chargeShopItem(item){


    if(item.currency === "diamonds"){

        player.diamonds -= item.cost;

    }

    else if(item.currency === "blackMoney"){

        player.blackMoney -= item.cost;

    }

    else{

        player.gold -= item.cost;

    }


}









// ==========================================
// רכישת נשק
// ==========================================

function buyWeapon(id){



    if(!player){

        return false;

    }




    const weapon =

    WEAPONS_LIST.find(w => w.id === id);




    if(!weapon){

        showMessageSafeShop("🔫 הפריט לא נמצא");

        return false;

    }




    if(!Array.isArray(player.weapons)){

        player.weapons = [];

    }




    if(player.weapons.find(w => w.id === id)){

        showMessageSafeShop("🔫 הנשק כבר ברשותך");

        return false;

    }




    if(!canAffordShopItem(weapon)){

        showMessageSafeShop(

            weapon.currency === "diamonds"

            ? "💎 אין מספיק יהלומים"

            : "🥇 אין מספיק זהב"

        );

        return false;

    }




    chargeShopItem(weapon);




    player.weapons.push({

        id:weapon.id,

        name:weapon.name,

        power:weapon.power,

        level:1

    });




    player.power += weapon.power;




    showMessageSafeShop(

        "🔫 נרכש נשק: " + weapon.name + " (+" + weapon.power + " כוח)"

    );




    saveShopUpdate();



    return true;


}









// ==========================================
// רכישת שריון
// ==========================================

function buyArmor(id){



    if(!player){

        return false;

    }




    const armor =

    ARMOR_LIST.find(a => a.id === id);




    if(!armor){

        showMessageSafeShop("🛡️ הפריט לא נמצא");

        return false;

    }




    if(!Array.isArray(player.armor)){

        player.armor = [];

    }




    if(player.armor.find(a => a.id === id)){

        showMessageSafeShop("🛡️ הפריט כבר ברשותך");

        return false;

    }




    if(!canAffordShopItem(armor)){

        showMessageSafeShop(

            armor.currency === "diamonds"

            ? "💎 אין מספיק יהלומים"

            : "🥇 אין מספיק זהב"

        );

        return false;

    }




    chargeShopItem(armor);




    player.armor.push({

        id:armor.id,

        name:armor.name,

        defense:armor.defense,

        level:1

    });




    player.defense += armor.defense;




    showMessageSafeShop(

        "🛡️ נרכש: " + armor.name + " (+" + armor.defense + " הגנה)"

    );




    saveShopUpdate();



    return true;


}









// ==========================================
// רכישת רכב
// ==========================================

function buyVehicle(id){



    if(!player){

        return false;

    }




    const vehicle =

    VEHICLES_LIST.find(v => v.id === id);




    if(!vehicle){

        showMessageSafeShop("🚗 הפריט לא נמצא");

        return false;

    }




    if(!Array.isArray(player.vehicles)){

        player.vehicles = [];

    }




    if(player.vehicles.find(v => v.id === id)){

        showMessageSafeShop("🚗 הרכב כבר ברשותך");

        return false;

    }




    if(!canAffordShopItem(vehicle)){

        showMessageSafeShop(

            vehicle.currency === "diamonds"

            ? "💎 אין מספיק יהלומים"

            : "🥇 אין מספיק זהב"

        );

        return false;

    }




    chargeShopItem(vehicle);




    player.vehicles.push({

        id:vehicle.id,

        name:vehicle.name,

        speed:vehicle.speed,

        level:1

    });




    if(typeof player.speed !== "number"){

        player.speed = 0;

    }




    player.speed += vehicle.speed;




    showMessageSafeShop(

        "🚗 נרכש: " + vehicle.name + " (+" + vehicle.speed + " מהירות)"

    );




    saveShopUpdate();



    return true;


}









// ==========================================
// עזר: תווית מטבע להודעות
// ==========================================

function currencyLabel(currency){


    if(currency === "diamonds"){

        return "יהלומים";

    }


    if(currency === "blackMoney"){

        return "כסף שחור";

    }


    return "זהב";


}









// ==========================================
// עזר: יתרת מטבע נוכחית של השחקן
// ==========================================

function getCurrencyBalance(currency){


    if(!player){

        return 0;

    }


    if(currency === "diamonds"){

        return player.diamonds || 0;

    }


    if(currency === "blackMoney"){

        return player.blackMoney || 0;

    }


    return player.gold || 0;


}









// ==========================================
// עזר: ניכוי מטבע נוכחי
// ==========================================

function spendCurrency(currency, amount){


    if(currency === "diamonds"){

        player.diamonds -= amount;

    }

    else if(currency === "blackMoney"){

        player.blackMoney -= amount;

    }

    else{

        player.gold -= amount;

    }


}









// ==========================================
// שדרוג רמה לפריט חנות (נשק/שריון/רכב)
// עולה באותו מטבע שבו נרכש הפריט המקורי
// ==========================================

function upgradeShopItem(category, index){



    if(!player){

        return false;

    }




    let ownedArray, listArray, statKey;


    if(category === "weapon"){

        ownedArray = player.weapons;

        listArray = WEAPONS_LIST;

        statKey = "power";

    }

    else if(category === "armor"){

        ownedArray = player.armor;

        listArray = ARMOR_LIST;

        statKey = "defense";

    }

    else if(category === "vehicle"){

        ownedArray = player.vehicles;

        listArray = VEHICLES_LIST;

        statKey = "speed";

    }

    else{

        return false;

    }




    if(!Array.isArray(ownedArray)){

        return false;

    }




    const owned =

    ownedArray[index];




    if(!owned){

        return false;

    }




    const definition =

    listArray.find(i => i.id === owned.id);




    if(!definition){

        return false;

    }




    owned.level =

    owned.level || 1;




    const upgradeCost =

    owned.level *

    Math.max(1, Math.ceil(definition.cost * 0.8));




    const currency =

    definition.currency;




    if(getCurrencyBalance(currency) < upgradeCost){


        showMessageSafeShop(

            "אין מספיק " + currencyLabel(currency) + " לשדרוג"

        );


        return false;


    }




    spendCurrency(currency, upgradeCost);




    const bonus =

    Math.max(1, Math.ceil(definition[statKey] * 0.2));




    owned[statKey] += bonus;


    owned.level++;




    if(typeof player[statKey] !== "number"){

        player[statKey] = 0;

    }


    player[statKey] += bonus;




    showMessageSafeShop(

        "⬆️ " + owned.name + " שודרג לרמה " + owned.level +

        " (+" + bonus + ")"

    );




    saveShopUpdate();



    return true;


}









function upgradeWeapon(index){

    return upgradeShopItem("weapon", index);

}



function upgradeArmor(index){

    return upgradeShopItem("armor", index);

}



function upgradeVehicle(index){

    return upgradeShopItem("vehicle", index);

}









// ==========================================
// קיצור זמן עבודות לפי מהירות
// (עד מקסימום 50% קיצור)
// ==========================================

function applySpeedToJobTime(baseTimeSeconds){


    if(!player){

        return baseTimeSeconds;

    }




    const speed =

    player.speed || 0;




    const reduction =

    Math.min(0.5, speed * 0.005);




    return Math.max(

        1,

        Math.floor(baseTimeSeconds * (1 - reduction))

    );


}









// ==========================================
// בונוס מהירות קטן לכוח התקפה בקרב
// ==========================================

function getSpeedCombatBonus(){


    if(!player){

        return 0;

    }




    return Math.floor((player.speed || 0) * 0.5);


}









// ==========================================
// שמירה ועדכון
// ==========================================

function saveShopUpdate(){



    if(typeof saveGame === "function"){

        saveGame();

    }




    if(typeof updateUI === "function"){

        updateUI();

    }




    if(

        typeof currentPage !== "undefined"

        &&

        currentPage === "shop"

    ){


        const content =

        document.getElementById("gameContent");




        if(

            content

            &&

            typeof renderShop === "function"

        ){

            renderShop(content);

        }


    }


}









function showMessageSafeShop(message){


    if(typeof showMessage === "function"){

        showMessage(message);

    }


}









console.log(

    "WARDEAL SHOP v0.1.0 READY"

);
