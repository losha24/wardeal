/* ==========================================
   WARDEAL v0.3.3
   Local Storage System
   Safe Save + Migration + Repair + Offline
========================================== */


const WARDEAL_SAVE_KEY =
    "WARDEAL_PLAYER_SAVE";


const WARDEAL_BACKUP_KEY =
    "WARDEAL_PLAYER_BACKUP";


const WARDEAL_VERSION =
    "0.3.3";









// ==========================================
// תיקון נתוני שחקן
// (הפונקציה עצמה נמצאת ב-player.js
// כדי למנוע התנגשות בין שתי גרסאות
// והעתקה שטחית שגרמה לזיהום מערכים גלובליים)
// ==========================================

// ==========================================
// שמירת משחק
// ==========================================

function saveGame(){


    try{


        if(!player){


            return false;


        }








        player.lastSave =

        Date.now();








        const saveData = {


            version:

            WARDEAL_VERSION,



            savedAt:

            Date.now(),



            player:

            player



        };








        const oldSave =

        localStorage.getItem(

            WARDEAL_SAVE_KEY

        );








        if(oldSave){



            localStorage.setItem(

                WARDEAL_BACKUP_KEY,

                oldSave

            );



        }








        localStorage.setItem(

            WARDEAL_SAVE_KEY,

            JSON.stringify(saveData)

        );








        return true;



    }

    catch(error){



        console.error(

            "WARDEAL SAVE ERROR",

            error

        );








        return false;



    }


}









// ==========================================
// טעינת משחק
// ==========================================

function loadGame(){


    try{


        let saved =

        localStorage.getItem(

            WARDEAL_SAVE_KEY

        );








        if(!saved){



            saved =

            localStorage.getItem(

                WARDEAL_BACKUP_KEY

            );



        }








        if(!saved){



            return false;



        }








        const data =

        JSON.parse(saved);








        const savedPlayer =

        data.player || data;








        if(

            !savedPlayer

            ||

            !savedPlayer.uid

        ){



            return false;



        }








        // שמירת כניסה קודמת עבור Offline

        const previousLogin =

        savedPlayer.lastLogin || Date.now();








        player =

        repairPlayerData(

            savedPlayer

        );








        player.previousLogin =

        previousLogin;








        player.lastLogin =

        Date.now();








        console.log(

            "WARDEAL LOAD OK",

            player.name

        );








        return true;



    }

    catch(error){



        console.error(

            "WARDEAL LOAD ERROR",

            error

        );








        return restoreBackup();



    }


}
// ==========================================
// שחזור גיבוי
// ==========================================

function restoreBackup(){


    try{


        const backup =

        localStorage.getItem(

            WARDEAL_BACKUP_KEY

        );








        if(!backup){



            return false;



        }








        const data =

        JSON.parse(backup);








        const savedPlayer =

        data.player || data;








        if(!savedPlayer){



            return false;



        }








        player =

        repairPlayerData(

            savedPlayer

        );








        player.lastLogin =

        Date.now();








        console.log(

            "WARDEAL BACKUP RESTORED"

        );








        return true;



    }

    catch(error){



        console.error(

            "WARDEAL BACKUP ERROR",

            error

        );








        return false;



    }


}









// ==========================================
// בדיקת שמירה קיימת
// ==========================================

function hasSave(){


    return (


        localStorage.getItem(

            WARDEAL_SAVE_KEY

        ) !== null



        ||



        localStorage.getItem(

            WARDEAL_BACKUP_KEY

        ) !== null



    );


}









// ==========================================
// מחיקת שמירה
// ==========================================

function deleteSave(){


    localStorage.removeItem(

        WARDEAL_SAVE_KEY

    );








    localStorage.removeItem(

        WARDEAL_BACKUP_KEY

    );








    player = null;








    console.log(

        "WARDEAL SAVE DELETED"

    );


}









// ==========================================
// איפוס משחק
// ==========================================

function resetGame(){


    deleteSave();


    location.reload();


}









// ==========================================
// יצוא שמירה
// ==========================================

function exportSave(){


    if(!player){



        return null;



    }








    return JSON.stringify({


        version:

        WARDEAL_VERSION,



        exportedAt:

        Date.now(),



        player:

        player



    });


}









// ==========================================
// יבוא שמירה
// ==========================================

function importSave(data){


    try{


        if(!data){



            return false;



        }








        const imported =



        typeof data === "string"



        ?



        JSON.parse(data)



        :



        data;








        const importedPlayer =

        imported.player || imported;








        player =

        repairPlayerData(

            importedPlayer

        );








        saveGame();








        console.log(

            "WARDEAL IMPORT OK"

        );








        return true;



    }

    catch(error){



        console.error(

            "WARDEAL IMPORT ERROR",

            error

        );








        return false;



    }


}
// ==========================================
// מידע שמירה
// ==========================================

function getSaveInfo(){


    return {


        exists:

        hasSave(),



        version:

        WARDEAL_VERSION,



        player:


        player

        ?

        player.name

        :

        null,



        savedAt:


        player

        ?

        player.lastSave

        :

        null



    };


}









// ==========================================
// ניקוי שמירה פגומה
// ==========================================

function clearBrokenSave(){


    localStorage.removeItem(

        WARDEAL_SAVE_KEY

    );








    localStorage.removeItem(

        WARDEAL_BACKUP_KEY

    );


}









// ==========================================
// קבלת זמן כניסה קודם
// ==========================================

function getPreviousLogin(){


    if(!player){


        return 0;


    }








    return player.previousLogin || 0;


}









// ==========================================
// הפעלת Offline לאחר טעינה
// ==========================================

function processOfflineIncome(silent){


    if(!player){


        return 0;


    }








    if(

        typeof calculateOfflineIncome !== "function"

    ){



        return 0;



    }








    const income =

    calculateOfflineIncome(

        getPreviousLogin()

    );








    if(income <= 0){



        return 0;



    }








    player.money += income;








    if(!silent && typeof showMessage === "function"){



        showMessage(

            "💰 הכנסה בזמן שלא היית במשחק: ₪" +

            income

        );



    }








    return income;


}









// ==========================================
// שמירת יציאה בטוחה
// ==========================================

function saveBeforeExit(){


    if(!player){



        return;



    }








    player.lastLogin =

    Date.now();








    saveGame();


}









window.addEventListener(

    "beforeunload",

    ()=>{


        if(window.isResetting){

            return;

        }




        saveBeforeExit();


    }

);









console.log(

    "WARDEAL STORAGE v0.3.3 READY"

);