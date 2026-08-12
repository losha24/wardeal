/* ==========================================
   WARDEAL v0.3.2
   Core Game Engine
   Stable Runtime + Offline Support
========================================== */


let gameRunning = false;


let gameInterval = null;


let saveInterval = null;


let uiUpdateCounter = 0;









// ==========================================
// הפעלת מנוע
// ==========================================

function startGameEngine(){



    if(gameRunning){



        return;



    }








    gameRunning = true;








    gameInterval = setInterval(()=>{



        gameTick();



    },1000);








    saveInterval = setInterval(()=>{



        if(typeof saveGame === "function"){



            saveGame();



        }



    },



    typeof AUTO_SAVE_TIME !== "undefined"



    ?



    AUTO_SAVE_TIME



    :



    15000



    );








    console.log(

        "WARDEAL ENGINE v0.3.2 STARTED"

    );



}









// ==========================================
// עצירת מנוע
// ==========================================

function stopGameEngine(){



    gameRunning = false;








    if(gameInterval){



        clearInterval(gameInterval);



        gameInterval = null;



    }








    if(saveInterval){



        clearInterval(saveInterval);



        saveInterval = null;



    }








    if(typeof saveGame === "function"){



        saveGame();



    }



}









// ==========================================
// פעולת זמן אחת
// ==========================================

function gameTick() {
    
    
    
    if (!player) {
        
        
        
        return;
        
        
        
    }
    
    
    
    
    
    // ======================================
    // מערכת עבודות (jobs.js)
    // ======================================
    
    if (typeof updateJobs === "function") {
        
        
        updateJobs();
        
        
    }
    
    
    
    // ======================================
    // אירועי עיר אקראיים (city.js)
    // ======================================
    
    if (typeof maybeTriggerCityEvent === "function") {
        
        
        maybeTriggerCityEvent();
        
        
    }
    
    
    
    // רענון חי של מסך העבודות אם פתוח
    
    if (
        
        typeof currentPage !== "undefined"
        
        &&
        
        currentPage === "work"
        
    ) {
        
        
        const workContent =
            
            document.getElementById("gameContent");
        
        
        if (
            
            workContent
            
            &&
            
            typeof renderWork === "function"
            
        ) {
            
            
            renderWork(workContent);
            
            
        }
        
        
    }








    recoverPlayerEnergy();



    recoverPlayerHealth();



    updatePassiveIncome();



    uiUpdateCounter++;








    // עדכון UI כל 3 שניות

    if(

        uiUpdateCounter >= 3

    ){



        uiUpdateCounter = 0;



        if(typeof updateUI === "function"){



            updateUI();



        }



    }



}
// ==========================================
// שחזור אנרגיה
// ==========================================

function recoverPlayerEnergy(){



    if(!player){



        return;



    }








    if(

        typeof player.energy !== "number"

        ||

        typeof player.maxEnergy !== "number"

    ){



        return;



    }








    if(player.energy < player.maxEnergy){



        player.energy +=



        typeof ENERGY_RECOVERY !== "undefined"



        ?



        ENERGY_RECOVERY



        :



        1;








        if(player.energy > player.maxEnergy){



            player.energy = player.maxEnergy;



        }



    }



}









// ==========================================
// שחזור חיים
// ==========================================

function recoverPlayerHealth(){



    if(!player){



        return;



    }








    if(

        typeof player.health !== "number"

        ||

        typeof player.maxHealth !== "number"

    ){



        return;



    }








    if(player.health < player.maxHealth){



        player.health +=



        typeof HEALTH_RECOVERY !== "undefined"



        ?



        HEALTH_RECOVERY



        :



        1;








        if(player.health > player.maxHealth){



            player.health = player.maxHealth;



        }



    }



}









// ==========================================
// הכנסה פסיבית בזמן אמת
// ==========================================

function updatePassiveIncome(){



    if(!player){



        return;



    }








    let passive = 0;








    if(typeof calculatePassiveIncome === "function"){



        passive = calculatePassiveIncome();



    }








    if(passive <= 0){



        return;



    }








    if(typeof player.money !== "number"){



        player.money = 0;



    }








    player.money += Math.floor(

        passive / 60

    );



}









// ==========================================
// מצב מנוע
// ==========================================

function getGameState(){



    let passive = 0;








    if(typeof calculatePassiveIncome === "function"){



        passive = calculatePassiveIncome();



    }








    return {



        running:



        gameRunning,



        player:



        player || null,



        passiveIncome:



        passive



    };



}









// ==========================================
// איפוס מנוע
// ==========================================

function resetEngine(){



    stopGameEngine();



    gameRunning = false;



}









// ==========================================
// בדיקת מנוע פעיל
// ==========================================

function isGameRunning(){



    return gameRunning;



}









// ==========================================
// קבלת הכנסה פסיבית
// ==========================================

function getPassiveIncome(){



    if(typeof calculatePassiveIncome === "function"){



        return calculatePassiveIncome();



    }








    return 0;



}
// ==========================================
// שחזור אנרגיה ובריאות באופליין
// ==========================================

function applyOfflineRegen(lastLogin){


    if(

        !lastLogin

        ||

        !player

    ){


        return { energyGained:0, healthGained:0 };


    }




    const now = Date.now();




    const passed =

    now - lastLogin;




    if(passed <= 0){


        return { energyGained:0, healthGained:0 };


    }




    // מקסימום 12 שעות - כמו בהכנסה הפסיבית

    const maxTime =

    12 * 60 * 60 * 1000;




    const time =

    Math.min(passed, maxTime);




    const seconds =

    Math.floor(time / 1000);




    const energyRecovery =

    typeof ENERGY_RECOVERY !== "undefined"

    ?

    ENERGY_RECOVERY

    :

    1;




    const healthRecovery =

    typeof HEALTH_RECOVERY !== "undefined"

    ?

    HEALTH_RECOVERY

    :

    1;




    let energyGained = 0;


    let healthGained = 0;




    if(typeof player.energy === "number" && typeof player.maxEnergy === "number"){


        const before = player.energy;


        player.energy += seconds * energyRecovery;


        if(player.energy > player.maxEnergy){

            player.energy = player.maxEnergy;

        }


        energyGained = player.energy - before;


    }




    if(typeof player.health === "number" && typeof player.maxHealth === "number"){


        const before = player.health;


        player.health += seconds * healthRecovery;


        if(player.health > player.maxHealth){

            player.health = player.maxHealth;

        }


        healthGained = player.health - before;


    }




    return { energyGained:energyGained, healthGained:healthGained };


}









// ==========================================
// חישוב הכנסה Offline
// ==========================================

function calculateOfflineIncome(lastLogin){



    if(

        !lastLogin

        ||

        !player

    ){



        return 0;



    }








    const now = Date.now();








    const passed =

    now - lastLogin;








    if(passed <= 0){



        return 0;



    }








    // מקסימום 12 שעות

    const maxTime =

    12 *

    60 *

    60 *

    1000;








    const time =

    Math.min(

        passed,

        maxTime

    );








    const income =



    (

        time /

        60000

    )

    *

    getPassiveIncome();








    return Math.floor(income);



}









// ==========================================
// איסוף הכנסה Offline
// ==========================================

function collectOfflineIncome(){



    if(!player){



        return 0;



    }








    const income =

    calculateOfflineIncome(

        player.lastLogin

    );








    if(income <= 0){



        return 0;



    }








    player.money += income;








    if(typeof showMessage === "function"){



        showMessage(

            "💰 הכנסה בזמן שלא היית במשחק: ₪" +

            income

        );



    }








    return income;



}









// ==========================================
// עדכון זמן משחק אחרון
// ==========================================

function updateLastGameTime(){



    if(!player){



        return;



    }








    player.lastLogin =

    Date.now();



}









// ==========================================
// שמירה ביציאה
// ==========================================

window.addEventListener(

    "beforeunload",

    ()=>{



        if(window.isResetting){

            return;

        }




        updateLastGameTime();



        if(typeof saveGame === "function"){



            saveGame();



        }



    }

);









// ==========================================
// הכנה לטעינה מחדש
// ==========================================

function onGameLoaded(){



    if(!player){



        return;



    }








    const offline =

    collectOfflineIncome();








    updateLastGameTime();








    if(typeof saveGame === "function"){



        saveGame();



    }








    if(offline > 0){



        console.log(

            "WARDEAL OFFLINE INCOME:",

            offline

        );



    }



}









console.log(

    "WARDEAL CORE v0.3.2 READY"

);