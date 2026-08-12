/* ==========================================
   WARDEAL v0.3.3
   Application Controller
   Auto Login + Screen Fix + Stable Engine
========================================== */


let selectedSide = "";


window.warDealLoadedPlayer = false;


// ==========================================
// טעינת מערכת
// ==========================================

document.addEventListener(
    
    "DOMContentLoaded",
    
    () => {
        
        
        setupGame();
        
        
    }
    
);




// ==========================================
// הכנת משחק
// ==========================================

function setupGame() {
    
    
    let loadedPlayer = false;
    
    
    window.warDealLoadedPlayer = false;
    
    
    hideScreens();
    
    
    
    
    // בדיקת שמירה קיימת
    
    if (
        
        typeof hasSave === "function"
        
        &&
        
        hasSave()
        
    ) {
        
        
        const loaded =
            
            loadGame();
        
        
        
        
        
        if (
            
            loaded
            
            &&
            
            player
            
            &&
            
            player.uid
            
        ) {
            
            
            loadedPlayer = true;
            
            
            window.warDealLoadedPlayer = true;
            
            
            
            
            if (
                
                typeof updateLastLogin === "function"
                
            ) {
                
                
                updateLastLogin();
                
                
            }




            // חישוב ותשלום הכנסה על הזמן שהשחקן
            // לא היה מחובר (עד מקסימום 12 שעות)
            // (silent=true - מוצג במסך "ברוך שובך" המאוחד)

            let offlineIncome = 0;

            if (

                typeof processOfflineIncome === "function"

            ) {


                offlineIncome = processOfflineIncome(true);


            }




            // שחזור אנרגיה ובריאות על אותו הזמן

            let offlineRegen = { energyGained:0, healthGained:0 };

            const previousLoginTime =

            typeof getPreviousLogin === "function"

            ?

            getPreviousLogin()

            :

            0;

            if (

                typeof applyOfflineRegen === "function"

            ) {


                offlineRegen = applyOfflineRegen(previousLoginTime) || offlineRegen;


            }




            // עבודות שהיו אמורות להסתיים בזמן ההיעדרות

            let offlineJobs = [];

            if (

                typeof updateJobs === "function"

            ) {


                offlineJobs = updateJobs(true) || [];


            }




            // הצגת מסך "ברוך שובך" מאוחד, אם יש משהו לדווח

            if (

                typeof showWelcomeBackScreen === "function"

            ) {


                showWelcomeBackScreen({

                    previousLogin: previousLoginTime,

                    income: offlineIncome,

                    energyGained: offlineRegen.energyGained,

                    healthGained: offlineRegen.healthGained,

                    jobs: offlineJobs

                });


            }
            
            
            
        }
        
        
    }
    
    
    
    
    
    setGameScreen(
        
        loadedPlayer
        
    );
    
    
    
    
    
    
    if (loadedPlayer) {
        
        
        
        if (
            
            typeof startGameEngine === "function"
            
        ) {
            
            
            if (
                
                typeof isGameRunning !== "function"
                
                ||
                
                !isGameRunning()
                
            ) {
                
                
                startGameEngine();
                
                
            }
            
            
        }
        
        
        
        
        
        
        if (
            
            typeof updateUI === "function"
            
        ) {
            
            
            updateUI();
            
            
        }
        
        
        
        
        
        
        
        if (
            
            typeof saveGame === "function"
            
        ) {
            
            
            saveGame();
            
            
        }
        
        
        
        
        
        
        console.log(
            
            "WARDEAL AUTO LOGIN:",
            
            player.name
            
        );
        
        
        
    }
    
    
    
    
    
    
    setupButtons();
    
    
    
}
// ==========================================
// הסתרה בזמן בדיקה
// ==========================================

function hideScreens(){


    const start =

    document.getElementById(

        "startScreen"

    );





    const game =

    document.getElementById(

        "gameScreen"

    );







    if(start){


        start.style.display = "none";


    }







    if(game){


        game.style.display = "none";


    }



}









// ==========================================
// החלפת מסכים
// ==========================================

function setGameScreen(isGame){



    const start =

    document.getElementById(

        "startScreen"

    );







    const game =

    document.getElementById(

        "gameScreen"

    );









    if(start){



        start.style.display =

        isGame

        ?

        "none"

        :

        "flex";



    }









    if(game){



        game.style.display =

        isGame

        ?

        "block"

        :

        "none";



    }



}









// ==========================================
// כפתורי פתיחה
// ==========================================

function setupButtons(){



    const policeButton =

    document.getElementById(

        "policeChoice"

    );







    const criminalButton =

    document.getElementById(

        "criminalChoice"

    );







    const startButton =

    document.getElementById(

        "startButton"

    );









    if(policeButton){



        policeButton.onclick = ()=>{



            selectedSide = "police";







            if(

                typeof highlightSide === "function"

            ){



                highlightSide(

                    "police"

                );



            }







            if(

                typeof showMessage === "function"

            ){



                showMessage(

                    "👮 נבחר צד: משטרה"

                );



            }



        };



    }









    if(criminalButton){



        criminalButton.onclick = ()=>{



            selectedSide = "criminal";







            if(

                typeof highlightSide === "function"

            ){



                highlightSide(

                    "criminal"

                );



            }







            if(

                typeof showMessage === "function"

            ){



                showMessage(

                    "🕶️ נבחר צד: עבריינים"

                );



            }



        };



    }









    if(startButton){



        startButton.onclick = ()=>{



            startGame();



        };



    }



}
// ==========================================
// כניסה למשחק
// ==========================================

function startGame(){



    const nameInput =

    document.getElementById(

        "playerName"

    );









    if(!nameInput){



        return;



    }








    const name =

    nameInput.value.trim();









    // שחקן קיים



    if(

        player

        &&

        player.uid

    ){



        setGameScreen(true);







        if(

            typeof startGameEngine === "function"

        ){



            if(

                typeof isGameRunning !== "function"

                ||

                !isGameRunning()

            ){



                startGameEngine();



            }



        }







        if(

            typeof updateUI === "function"

        ){



            updateUI();



        }







        return;



    }








    if(name === ""){



        if(typeof showStartScreenMessage === "function"){

            showStartScreenMessage("הכנס שם שחקן");

        }



        return;



    }









    if(selectedSide === ""){



        if(typeof showStartScreenMessage === "function"){

            showStartScreenMessage("בחר צד במשחק");

        }



        return;



    }









    if(

        typeof initializePlayer !== "function"

    ){



        console.error(

            "PLAYER SYSTEM NOT READY"

        );



        return;



    }








    initializePlayer(

        name,

        selectedSide

    );








    window.warDealLoadedPlayer = true;








    if(

        typeof saveGame === "function"

    ){



        saveGame();



    }








    setGameScreen(true);








    if(

        typeof startGameEngine === "function"

    ){



        if(

            typeof isGameRunning !== "function"

            ||

            !isGameRunning()

        ){



            startGameEngine();



        }



    }








    if(

        typeof updateUI === "function"

    ){



        updateUI();



    }








    if(

        typeof showMessage === "function"

    ){



        showMessage(

            "⚔️ ברוכים הבאים ל־WARDEAL"

        );



    }



}









// ==========================================
// משחק חדש
// ==========================================

// ==========================================
// אישור כפול לאיפוס משחק - בלי להשתמש ב-
// window.confirm() (עלול להיות חסום בסביבות
// מוטמעות ולגרום ל"לא קורה כלום")
// ==========================================

let newGameConfirmArmed = false;

let newGameConfirmTimeout = null;




// ==========================================
// הודעה במסך הפתיחה (נפרד מ-welcomeBox
// שנמצא רק בתוך מסך המשחק)
// ==========================================

let startScreenMessageTimeout = null;

function showStartScreenMessage(text){


    const box =

    document.getElementById("startScreenMessage");




    if(!box){

        return;

    }




    if(startScreenMessageTimeout){

        clearTimeout(startScreenMessageTimeout);

        startScreenMessageTimeout = null;

    }




    box.textContent = text;




    startScreenMessageTimeout = setTimeout(()=>{


        box.textContent = "";


        startScreenMessageTimeout = null;


    }, 3000);


}




function confirmNewGame(button){


    if(newGameConfirmArmed){


        newGameConfirmArmed = false;


        if(newGameConfirmTimeout){

            clearTimeout(newGameConfirmTimeout);

            newGameConfirmTimeout = null;

        }


        if(button){

            button.textContent = "🗑️ משחק חדש";

        }


        newGame();


        return;


    }




    newGameConfirmArmed = true;




    if(button){

        button.textContent = "⚠️ לחץ שוב לאישור מחיקה";

    }




    if(typeof showMessage === "function"){


        showMessage(

            "⚠️ לחץ שוב על הכפתור תוך 5 שניות כדי לאשר מחיקת ההתקדמות"

        );


    }




    newGameConfirmTimeout = setTimeout(()=>{


        newGameConfirmArmed = false;


        if(button){

            button.textContent = "🗑️ משחק חדש";

        }


    }, 5000);


}




function newGame(){



    // דגל בטיחות - מונע מכל handler של beforeunload
    // לנסות לשמור מחדש בזמן שהמשחק מתאפס

    window.isResetting = true;




    if(

        typeof deleteSave === "function"

    ){



        deleteSave();



    }








    window.warDealLoadedPlayer = false;








    if(

        typeof stopGameEngine === "function"

    ){



        stopGameEngine();



    }








    player = null;








    location.reload();



}
// ==========================================
// יציאה מהמשחק
// ==========================================

function exitGame() {
    
    
    
    if (!player) {
        
        
        
        return;
        
        
        
    }
    
    
    
    
    
    
    
    
    if (
        
        typeof stopGameEngine === "function"
        
    ) {
        
        
        
        // stopGameEngine כבר שומר את המשחק בעצמו
        
        stopGameEngine();
        
        
        
    }
    
    else if (
        
        typeof saveGame === "function"
        
    ) {
        
        
        
        saveGame();
        
        
        
    }
    
    
    
    
    
    
    
    
    window.warDealLoadedPlayer = false;
    
    
    
    
    
    
    
    
    // חזרה למסך הפתיחה בלי לרענן את הדף ובלי
    // למחוק את השחקן - ההתקדמות נשמרת, ולחיצה
    // חוזרת על "כניסה למשחק" תשחזר את הסשן מיד
    
    if (
        
        typeof setGameScreen === "function"
        
    ) {
        
        
        
        setGameScreen(false);
        
        
        
    }
    
    
    
    
    
    
    
    
    // נעילת בחירת הצד - אם כבר יש שחקן קיים,
    // אסור לאפשר להחליף צד; רק איפוס מלא מאפשר זאת
    
    lockSideSelection();
    
    
    
}
    
    
    
    
    
    
    
    
// ==========================================
// נעילת/שחרור בחירת צד במסך הפתיחה
// ==========================================

function lockSideSelection(){


    if(!player){

        return;

    }




    const policeButton =

    document.getElementById("policeChoice");



    const criminalButton =

    document.getElementById("criminalChoice");



    const nameInput =

    document.getElementById("playerName");



    const startButton =

    document.getElementById("startButton");




    if(policeButton){


        policeButton.disabled =

        (player.side !== "police");


    }




    if(criminalButton){


        criminalButton.disabled =

        (player.side !== "criminal");


    }




    selectedSide = player.side;




    if(typeof highlightSide === "function"){


        highlightSide(player.side);


    }




    if(nameInput){


        nameInput.value = player.name || "";


        nameInput.disabled = true;


    }




    if(startButton){


        startButton.textContent = "▶️ המשך משחק";


    }


}









function unlockSideSelection(){


    const policeButton =

    document.getElementById("policeChoice");



    const criminalButton =

    document.getElementById("criminalChoice");



    const nameInput =

    document.getElementById("playerName");



    const startButton =

    document.getElementById("startButton");




    if(policeButton){

        policeButton.disabled = false;

    }




    if(criminalButton){

        criminalButton.disabled = false;

    }




    selectedSide = "";




    if(typeof highlightSide === "function"){

        highlightSide("");

    }




    if(nameInput){

        nameInput.disabled = false;

        nameInput.value = "";

    }




    if(startButton){

        startButton.textContent = "כניסה למשחק";

    }


}









// ==========================================
// בדיקת מצב טעינה
// ==========================================

function isGameLoaded() {
    
    
    
    return (
        
        window.warDealLoadedPlayer
        
        &&
        
        player
        
        &&
        
        player.uid
        
    );
    
    
    
}









// ==========================================
// רענון ממשק
// ==========================================

function reloadGameUI() {
    
    
    
    if (
        
        typeof updateUI === "function"
        
    ) {
        
        
        
        updateUI();
        
        
        
    }
    
    
    
}









// ==========================================
// בדיקת מוכנות מערכת
// ==========================================

function checkSystemReady() {
    
    
    
    const systems = {
        
        
        
        player:
            
            typeof initializePlayer === "function",
        
        
        
        
        
        
        storage:
            
            typeof saveGame === "function",
        
        
        
        
        
        
        ui:
            
            typeof updateUI === "function",
        
        
        
        
        
        
        engine:
            
            typeof startGameEngine === "function"
        
        
        
        
    };
    
    
    
    
    
    
    
    
    
    console.table(
        
        systems
        
    );
    
    
    
    
    
    
    
    
    
    return Object.values(
        
        systems
        
    ).every(
        
        value => value
        
    );
    
    
    
}









console.log(
    
    "WARDEAL APP v0.3.3 FIXED READY"
    
);