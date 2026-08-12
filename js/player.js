/* ==========================================
   WARDEAL v0.3.2
   Player System
   Stable Save Compatibility
========================================== */


const DEFAULT_PLAYER = {
    
    uid: "",
    
    name: "",
    
    side: "",
    
    level: 1,
    
    xp: 0,
    
    nextLevelXp: 100,
    
    
    money: 5000,
    
    gold: 25,
    
    diamonds: 5,
    
    blackMoney: 0,
    
    
    health: 100,
    
    maxHealth: 100,
    
    
    energy: 100,
    
    maxEnergy: 100,
    
    
    power: 10,
    
    unitsPower: 0,
    
    unitsDefense: 0,
    
    unitTraining: {},
    
    defense: 5,

    speed: 0,
    
    
    policeUnits: 0,
    
    criminalUnits: 0,
    
    
    weapons: [],
    
    vehicles: [],

    armor: [],
    
    properties: [],
    
    businesses: [],
    
    activeJobs: [],
    
    
    createdAt: 0,
    
    lastLogin: 0,
    
    lastSave: 0,
    
    totalWins: 0,
    
    lastGiftClaim: 0,
    
    bribeWindowStart: 0,
    
    bribeCount: 0,
    
    convertWindowStart: 0,
    
    convertCount: 0,
    
    hospitalUntil: 0,
    
    bossCooldowns: {},
    
    bossLoot: []
    
};





let player = null;









// ==========================================
// יצירת שחקן חדש
// ==========================================

function createNewPlayer() {
    
    return JSON.parse(
        
        JSON.stringify(DEFAULT_PLAYER)
        
    );
    
}









// ==========================================
// יצירת מזהה שחקן
// ==========================================

function generatePlayerID() {
    
    return (
        
        "WD-"
        
        +
        
        Date.now().toString(36)
        
        +
        
        "-"
        
        +
        
        Math.random()
        
        .toString(36)
        
        .substring(2, 8)
        
        .toUpperCase()
        
    );
    
}
// ==========================================
// יצירת שחקן חדש
// ==========================================

function initializePlayer(name,side){


    player = createNewPlayer();


    player.uid =

    generatePlayerID();



    player.name =

    name || "שחקן";



    player.side =

    side || "";



    player.createdAt =

    Date.now();



    player.lastLogin =

    Date.now();





    if(side === "police"){


        player.policeUnits = 10;


        player.power += 10;


    }


    else if(side === "criminal"){


        player.criminalUnits = 10;


        player.power += 10;


    }





    return player;


}









// ==========================================
// תיקון נתוני שחקן ישן
// ==========================================

function repairPlayerData(data){



    if(!data){


        return createNewPlayer();


    }





    const fixed = {


        ...createNewPlayer(),


        ...data


    };





    if(!fixed.uid){


        fixed.uid = generatePlayerID();


    }








    if(!Array.isArray(fixed.weapons)){


        fixed.weapons = [];


    }





    if(!Array.isArray(fixed.vehicles)){


        fixed.vehicles = [];


    }




    if(!Array.isArray(fixed.armor)){


        fixed.armor = [];


    }




    if(!Array.isArray(fixed.bossLoot)){


        fixed.bossLoot = [];


    }




    if(

        !fixed.bossCooldowns

        ||

        typeof fixed.bossCooldowns !== "object"

        ||

        Array.isArray(fixed.bossCooldowns)

    ){


        fixed.bossCooldowns = {};


    }




    if(

        !fixed.unitTraining

        ||

        typeof fixed.unitTraining !== "object"

        ||

        Array.isArray(fixed.unitTraining)

    ){


        fixed.unitTraining = {};


    }





    if(!Array.isArray(fixed.properties)){


        fixed.properties = [];


    }





    if(!Array.isArray(fixed.businesses)){


        fixed.businesses = [];


    }




    if(!Array.isArray(fixed.activeJobs)){


        fixed.activeJobs = [];


    }









    const numbers = [


        "level",

        "xp",

        "nextLevelXp",

        "money",

        "gold",

        "diamonds",

        "blackMoney",

        "health",

        "maxHealth",

        "energy",

        "maxEnergy",

        "power",

        "unitsPower",

        "unitsDefense",

        "speed",

        "totalWins",

        "lastGiftClaim",

        "bribeWindowStart",

        "bribeCount",

        "convertWindowStart",

        "convertCount",

        "hospitalUntil",

        "defense",

        "policeUnits",

        "criminalUnits"


    ];









    numbers.forEach(key=>{



        if(typeof fixed[key] !== "number"){



            fixed[key] =

            DEFAULT_PLAYER[key];



        }



    });









    return fixed;



}









// ==========================================
// עדכון כניסה
// ==========================================

function updateLastLogin(){



    if(player){


        player.lastLogin =

        Date.now();


    }


}









// ==========================================
// הוספת XP
// ==========================================

function addXP(amount){



    if(!player){


        return;


    }







    if(typeof amount !== "number"){


        return;


    }







    player.xp += amount;



    checkLevelUp();



}









// ==========================================
// בדיקת עליית רמה
// ==========================================

function checkLevelUp(){



    if(!player){


        return;


    }







    let leveled = false;








    while(

        player.xp >= player.nextLevelXp

    ){



        player.xp -=

        player.nextLevelXp;





        player.level++;





        player.nextLevelXp =

        Math.floor(

            player.nextLevelXp * 1.5

        );






        player.power += 2;



        player.defense += 2;



        player.maxHealth += 10;



        player.health =

        player.maxHealth;




        // אנרגיה מקסימלית גדלה ב-5% בכל רמה

        player.maxEnergy =

        Math.floor(

            player.maxEnergy * 1.05

        );



        player.energy =

        player.maxEnergy;







        // בונוס זהב בכל עליית רמה - חדש

        if(typeof player.gold !== "number"){

            player.gold = 0;

        }

        player.gold += 5;




        // בונוס יהלום נדיר יותר - כל 5 רמות

        if(player.level % 5 === 0){

            if(typeof player.diamonds !== "number"){

                player.diamonds = 0;

            }

            player.diamonds += 1;

        }


        leveled = true;



    }








    if(

        leveled &&

        typeof showMessage === "function"

    ){



        showMessage(

            "🎉 עלית לרמה " +

            player.level

        );



    }



}
// ==========================================
// קבלת מספר יחידות
// ==========================================

function getUnits(){



    if(!player){


        return 0;


    }







    if(player.side === "police"){



        return player.policeUnits || 0;



    }








    if(player.side === "criminal"){



        return player.criminalUnits || 0;



    }








    return 0;



}









// ==========================================
// שימוש באנרגיה
// ==========================================

function useEnergy(amount){



    if(!player){



        return false;



    }







    if(

        typeof amount !== "number"

        ||

        amount <= 0

    ){



        return false;



    }








    if(player.energy < amount){



        return false;



    }








    player.energy -= amount;





    return true;



}









// ==========================================
// שינוי כסף
// ==========================================

function addMoney(amount){



    if(!player){



        return;



    }







    if(typeof amount !== "number"){



        return;



    }








    player.money += amount;



}









// ==========================================
// שינוי יחידות
// ==========================================

function addUnits(amount){



    if(!player){



        return;



    }








    if(typeof amount !== "number"){



        return;



    }








    if(player.side === "police"){



        player.policeUnits += amount;



    }



    else if(player.side === "criminal"){



        player.criminalUnits += amount;



    }



}









// ==========================================
// בדיקת חיים
// ==========================================

function addHealth(amount){



    if(!player){



        return;



    }








    if(typeof amount !== "number"){



        return;



    }








    player.health += amount;








    if(player.health > player.maxHealth){



        player.health = player.maxHealth;



    }








    if(player.health < 0){



        player.health = 0;



    }



}









// ==========================================
// בדיקת אנרגיה מקסימלית
// ==========================================

function recoverEnergy(){



    if(!player){



        return;



    }








    player.energy += ENERGY_RECOVERY;








    if(player.energy > player.maxEnergy){



        player.energy = player.maxEnergy;



    }



}









// ==========================================
// שחזור חיים
// ==========================================

function recoverHealth(){



    if(!player){



        return;



    }








    player.health += HEALTH_RECOVERY;








    if(player.health > player.maxHealth){



        player.health = player.maxHealth;



    }



}









console.log(

    "WARDEAL PLAYER v0.3.2 READY"

);




// ==========================================
// בית חולים - נעילה כשגומרים חיים
// ==========================================


const HOSPITAL_DURATION =

4 * 60 * 60 * 1000;


const HOSPITAL_BASE_COSTS = {

    money:2000,

    gold:20,

    diamonds:2,

    blackMoney:50

};




// ==========================================
// חישוב עלות דילוג על בית החולים לפי רמת השחקן
// כל רמה מעלה את העלות ב-10%
// ==========================================

function getHospitalSkipCost(currency){


    const base =

    HOSPITAL_BASE_COSTS[currency];




    if(typeof base !== "number"){

        return 0;

    }




    const level =

    player && typeof player.level === "number"

    ?

    player.level

    :

    1;




    return Math.max(

        base,

        Math.round(

            base * Math.pow(1.1, level - 1)

        )

    );


}




// ==========================================
// שליחה לבית חולים (נקרא כשחיים <= 0)
// ==========================================

function sendToHospital(){


    if(!player){

        return;

    }




    player.health = 0;




    player.hospitalUntil =

    Date.now() + HOSPITAL_DURATION;


}









// ==========================================
// בדיקה האם השחקן נעול בבית חולים כרגע
// ==========================================

function isHospitalized(){


    if(!player){

        return false;

    }




    return (player.hospitalUntil || 0) > Date.now();


}









// ==========================================
// סטטוס בית חולים - כמה זמן נותר
// ==========================================

function getHospitalStatus(){


    if(!player || !isHospitalized()){


        return { locked:false, timeText:"" };


    }




    const remain =

    player.hospitalUntil - Date.now();




    const hours =

    Math.floor(remain / (60*60*1000));




    const minutes =

    Math.floor(

        (remain % (60*60*1000)) / (60*1000)

    );




    return {

        locked:true,

        timeText: hours + " שע' " + minutes + " דק'"

    };


}









// ==========================================
// תשלום מהיר לדילוג על בית החולים
// ==========================================

function payToSkipHospital(currency){


    if(!player || !isHospitalized()){

        return false;

    }




    const cost =

    getHospitalSkipCost(currency);




    if(typeof cost !== "number" || cost <= 0){

        return false;

    }




    const balance =

    currency === "money"

    ?

    player.money

    :

    (player[currency] || 0);




    if(balance < cost){


        if(typeof showMessage === "function"){


            showMessage("😕 אין מספיק כדי לשלם ולצאת מוקדם");


        }


        return false;


    }




    if(currency === "money"){

        player.money -= cost;

    }

    else{

        player[currency] -= cost;

    }




    player.hospitalUntil = 0;




    player.health = player.maxHealth;




    if(typeof showMessage === "function"){


        showMessage("🏥 שילמת ויצאת מבית החולים בריא לגמרי!");


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

    ){


        const content =

        document.getElementById("gameContent");




        if(

            content

            &&

            typeof renderBattle === "function"

        ){

            renderBattle(content);

        }


    }




    return true;


}