/* ==========================================
   WARDEAL v0.1.0
   מערכת קרבות
   יחידות מוסיפות כוח התקפה
   הגנה מפחיתה נזק שנספג
========================================== */


const ENEMIES = {


    forPolice: [

        {
            name:"כנופיית רחוב",
            desc:"עבריינים מקומיים חמושים בסכינים",
            difficulty:0.7
        },

        {
            name:"סוחר סמים",
            desc:"דילר קטן עם שומרי ראש",
            difficulty:0.9
        },

        {
            name:"שודד בנקים",
            desc:"מבוקש ומסוכן",
            difficulty:1.1
        },

        {
            name:"ראש ארגון פשע",
            desc:"בוס תת-קרקעי עם צבא פרטי",
            difficulty:1.4
        }

    ],


    forCriminal: [

        {
            name:"סיור משטרתי",
            desc:"שוטרים על הרגל באזור",
            difficulty:0.7
        },

        {
            name:"בלש חשאי",
            desc:"חוקר סמוי שעוקב אחריך",
            difficulty:0.9
        },

        {
            name:"יחידה מיוחדת",
            desc:"כוח משטרתי כבד עם ציוד מתקדם",
            difficulty:1.1
        },

        {
            name:"סוכן פדרלי",
            desc:"חוקר בכיר עם תקציב בלתי מוגבל",
            difficulty:1.4
        }

    ]


};









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


    if(!player){

        return null;

    }








    const pool =

    player.side === "police"

    ?

    ENEMIES.forPolice

    :

    ENEMIES.forCriminal;








    return pool[

        Math.floor(

            Math.random() * pool.length

        )

    ];


}









// ==========================================
// קרב
// ==========================================

function startBattle(){


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




    const battleEnergyCost =

    typeof BATTLE_ENERGY_COST !== "undefined"

    ?

    BATTLE_ENERGY_COST

    :

    10;




    if(player.energy < battleEnergyCost){


        showMessage("⚡ אין מספיק אנרגיה לקרב");


        return;


    }




    player.energy -= battleEnergyCost;








    const enemy =

    getRandomEnemy();








    if(!enemy){

        return;

    }








    const attackPower =

    getAttackPower();








    // טווח אקראי סביב רמת הקושי של האויב

    const variance =

    0.85 + Math.random() * 0.3;








    const enemyPower =

    Math.floor(

        attackPower * enemy.difficulty * variance

    );








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








    if(attackPower >= enemyPower){



        // אויב קשה יותר = פרס גדול יותר

        const baseReward =

        Math.floor(

            Math.random() * (maxReward - minReward + 1)

        ) + minReward;








        const reward =

        Math.floor(

            baseReward * enemy.difficulty

        );








        player.money += reward;




        // זהב על כל ניצחון - 1 עד 15, מושפע מקושי האויב

        const goldReward =

        Math.min(

            15,

            Math.max(

                1,

                Math.round(

                    Math.random() * 15 * enemy.difficulty

                )

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




        showMessage(

            "⚔️ ניצחת את " +

            enemy.name +

            " וקיבלת ₪" +

            reward +

            " ו-" + goldReward + " 🥇" +

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

            " (" +

            enemy.desc +

            ") -" +

            reducedDamage +

            " חיים" +

            (

                goldLost > 0

                ?

                " ואיבדת " + goldLost + " 🥇"

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

    "WARDEAL COMBAT v0.1.0 READY"

);
