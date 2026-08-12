/* ==========================================
   WARDEAL v0.4.0
   Real Estate System
   8 נכסים, XP וכסף תואמים במדויק למוצג ב-UI
========================================== */


const PROPERTY_LIST = [


    {
        id:1,
        name:"🏠 דירת סטודיו",
        price:3000,
        income:25,
        upgradeIncome:12,
        buyXp:30,
        upgradeXp:15,
        specialUpgradeCost:20,
        specialUpgradeBonus:15
    },


    {
        id:2,
        name:"🏠 דירה קטנה",
        price:8000,
        income:50,
        upgradeIncome:25,
        buyXp:60,
        upgradeXp:30,
        specialUpgradeCost:35,
        specialUpgradeBonus:35
    },


    {
        id:3,
        name:"🏘️ בית פרברי",
        price:18000,
        income:100,
        upgradeIncome:50,
        buyXp:120,
        upgradeXp:60,
        specialUpgradeCost:55,
        specialUpgradeBonus:75
    },


    {
        id:4,
        name:"🏢 בניין מגורים",
        price:40000,
        income:200,
        upgradeIncome:100,
        buyXp:220,
        upgradeXp:110,
        specialUpgradeCost:80,
        specialUpgradeBonus:160
    },


    {
        id:5,
        name:"🏬 מרכז מסחרי קטן",
        price:90000,
        income:400,
        upgradeIncome:200,
        buyXp:380,
        upgradeXp:190,
        specialUpgradeCost:120,
        specialUpgradeBonus:325
    },


    {
        id:6,
        name:"🏙️ מגדל עתידני",
        price:200000,
        income:800,
        upgradeIncome:400,
        buyXp:650,
        upgradeXp:325,
        specialUpgradeCost:180,
        specialUpgradeBonus:700
    },


    {
        id:7,
        name:"🏗️ קומפלקס יוקרה",
        price:450000,
        income:1600,
        upgradeIncome:800,
        buyXp:1000,
        upgradeXp:500,
        specialUpgradeCost:280,
        specialUpgradeBonus:1500
    },


    {
        id:8,
        name:"🌆 שכונת על",
        price:1000000,
        income:3200,
        upgradeIncome:1600,
        buyXp:1800,
        upgradeXp:900,
        specialUpgradeCost:450,
        specialUpgradeBonus:3250
    }


];









// ==========================================
// רכישת נכס
// ==========================================

function buyProperty(id){



    if(!player){

        return false;

    }








    const property =

    PROPERTY_LIST.find(

        p => p.id === id

    );








    if(!property){


        showMessageSafe(

            "🏠 הנכס לא נמצא"

        );


        return false;


    }








    if(!Array.isArray(player.properties)){


        player.properties = [];


    }








    // מניעת רכישה כפולה

    const owned =

    player.properties.find(

        p => p.id === id

    );








    if(owned){


        showMessageSafe(

            "🏠 הנכס כבר בבעלותך"

        );


        return false;


    }








    if(player.money < property.price){


        showMessageSafe(

            "💰 אין מספיק כסף לרכישת נכס"

        );


        return false;


    }








    player.money -= property.price;








    player.properties.push({


        id:property.id,


        name:property.name,


        income:property.income,


        upgradeIncome:property.upgradeIncome,


        price:property.price,


        upgradeXp:property.upgradeXp,


        specialUpgradeCost:property.specialUpgradeCost,


        specialUpgradeBonus:property.specialUpgradeBonus,


        level:1



    });








    if(typeof addXP === "function"){


        addXP(property.buyXp);


    }








    showMessageSafe(

        "🏠 נרכש נכס: " + property.name +

        " (+" + property.buyXp + " XP)"

    );








    saveUpdate();



    return true;


}









// ==========================================
// הכנסה מנכסים
// ==========================================

function getPropertyIncome(){



    if(

        !player ||

        !Array.isArray(player.properties)

    ){


        return 0;


    }








    let total = 0;








    player.properties.forEach(property=>{


        // property.income כבר צובר את כל תוספות

        // השדרוגים (upgradeIncome) בעצמו - אסור

        // להכפיל שוב ברמה, זה גרם לניפוח כפול

        total += property.income || 0;


    });








    return Math.floor(total);



}









// ==========================================
// שדרוג נכס
// ==========================================

function upgradeProperty(index){



    if(

        !player ||

        !Array.isArray(player.properties)

    ){


        return false;


    }








    const property =

    player.properties[index];








    if(!property){


        return false;


    }








    property.level =

    property.level || 1;








    property.upgradeIncome =

    property.upgradeIncome || 250;








    // עלות שדרוג = 10% ממחיר הנכס המקורי, כפול הרמה הנוכחית

    const basePrice =

    typeof property.price === "number"

    ?

    property.price

    :

    50000;








    const upgradeCost =

    property.level *

    Math.floor(basePrice * 0.15);








    if(player.money < upgradeCost){


        showMessageSafe(

            "💰 אין מספיק כסף לשדרוג"

        );


        return false;


    }








    player.money -= upgradeCost;








    property.level++;








    property.income +=

    property.upgradeIncome;








    const upgradeXp =

    typeof property.upgradeXp === "number"

    ?

    property.upgradeXp

    :

    50;








    if(typeof addXP === "function"){


        addXP(upgradeXp);


    }








    showMessageSafe(

        "🏠 הנכס שודרג לרמה " +

        property.level +

        " (+" + upgradeXp + " XP)"

    );








    saveUpdate();



    return true;


}




// ==========================================
// שדרוג מיוחד בכסף שחור (חד-פעמי לכל נכס)
// ==========================================

function buyPropertySpecialUpgrade(index){



    if(

        !player ||

        !Array.isArray(player.properties)

    ){


        return false;


    }




    const property =

    player.properties[index];




    if(!property){

        return false;

    }




    if(property.specialUpgrade === true){


        showMessageSafe("🖤 כבר בוצע שדרוג מיוחד לנכס זה");


        return false;


    }




    const definition =

    PROPERTY_LIST.find(p => p.id === property.id);




    const cost =

    definition && typeof definition.specialUpgradeCost === "number"

    ?

    definition.specialUpgradeCost

    :

    50;




    const bonus =

    definition && typeof definition.specialUpgradeBonus === "number"

    ?

    definition.specialUpgradeBonus

    :

    50;




    if((player.blackMoney || 0) < cost){


        showMessageSafe("🖤 אין מספיק כסף שחור לשדרוג המיוחד");


        return false;


    }




    player.blackMoney -= cost;




    property.income += bonus;




    property.specialUpgrade = true;




    showMessageSafe(

        "🖤 שדרוג מיוחד בוצע ל-" + property.name +

        " (+" + bonus + " ₪/דקה לצמיתות)"

    );




    saveUpdate();



    return true;


}









// ==========================================
// רשימת נכסים לרכישה
// ==========================================

function getProperties(){


    return PROPERTY_LIST;


}









// ==========================================
// נכסים בבעלות
// ==========================================

function getOwnedProperties(){



    if(

        !player ||

        !Array.isArray(player.properties)

    ){


        return [];


    }








    return player.properties;


}









// ==========================================
// מספר נכסים
// ==========================================

function getOwnedPropertiesCount(){



    return getOwnedProperties().length;



}









// ==========================================
// שמירה ועדכון
// ==========================================

function saveUpdate(){



    if(typeof saveGame === "function"){


        saveGame();


    }








    if(typeof updateUI === "function"){


        updateUI();


    }








    if(

        typeof currentPage !== "undefined"

        &&

        currentPage === "property"

    ){



        const content =

        document.getElementById("gameContent");








        if(

            content

            &&

            typeof renderProperties === "function"

        ){

            renderProperties(content);

        }



    }



}









// ==========================================
// הודעה בטוחה
// ==========================================

function showMessageSafe(message){



    if(typeof showMessage === "function"){


        showMessage(message);


    }



}









console.log(

    "WARDEAL PROPERTY v0.4.0 READY"

);
