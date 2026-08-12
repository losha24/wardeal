/* ==========================================
   WARDEAL v0.1.0
   מערכת בוסים
   כוח והגנה של הבוס נגזרים מרמת השחקן.
   הגנת השחקן מפחיתה נזק בהפסד (לא משפיעה
   על תוצאת הניצחון/הפסד עצמה - כמו בקרב רגיל).
   הפסד מול בוס: 50% סיכוי לאבד יחידה,
   ונזק גבוה משמעותית מקרב רגיל.
   כל בוס נופל עם פריט ציוד בלעדי משלו,
   שלא ניתן לרכוש בשום מקום אחר.
========================================== */


const BOSSES = [

    {
        id:1,
        name:"ראש כנופיה",
        desc:"שולט ברחובות עם קבוצת אכיפה קטנה",
        icon:"🔪",
        energyCost:25,
        cooldownHours:2,
        basePower:30,
        powerPerLevel:8,
        baseDefense:15,
        defensePerLevel:4,
        rewardBlackMoneyMin:30,
        rewardBlackMoneyMax:60,
        rewardDiamondsMin:1,
        rewardDiamondsMax:2,
        lootChance:0.15,
        loot:{ category:"weapon", name:"🔫 אקדח הכנופיה", statKey:"power", statValue:180 }
    },


    {
        id:2,
        name:"בוס סמים אזורי",
        desc:"מנהל רשת הפצה על פני כמה שכונות",
        icon:"💊",
        energyCost:35,
        cooldownHours:2,
        basePower:60,
        powerPerLevel:14,
        baseDefense:25,
        defensePerLevel:7,
        rewardBlackMoneyMin:50,
        rewardBlackMoneyMax:90,
        rewardDiamondsMin:1,
        rewardDiamondsMax:3,
        lootChance:0.15,
        loot:{ category:"armor", name:"🛡️ שריון הבוס האזורי", statKey:"defense", statValue:170 }
    },


    {
        id:3,
        name:"מלך ההברחות",
        desc:"מפעיל צי שלם של רכבים חשאיים",
        icon:"🚢",
        energyCost:50,
        cooldownHours:3,
        basePower:100,
        powerPerLevel:22,
        baseDefense:40,
        defensePerLevel:11,
        rewardBlackMoneyMin:80,
        rewardBlackMoneyMax:140,
        rewardDiamondsMin:2,
        rewardDiamondsMax:4,
        lootChance:0.12,
        loot:{ category:"vehicle", name:"🚗 רכב מלך ההברחות", statKey:"speed", statValue:150 }
    },


    {
        id:4,
        name:"ראש המאפיה",
        desc:"עומד בראש ארגון פשע ותיק ומסועף",
        icon:"🎩",
        energyCost:65,
        cooldownHours:3,
        basePower:150,
        powerPerLevel:32,
        baseDefense:60,
        defensePerLevel:16,
        rewardBlackMoneyMin:120,
        rewardBlackMoneyMax:200,
        rewardDiamondsMin:3,
        rewardDiamondsMax:6,
        lootChance:0.1,
        loot:{ category:"weapon", name:"🔫 נשק ראש המאפיה", statKey:"power", statValue:230 }
    },


    {
        id:5,
        name:"אדון הפשע העליון",
        desc:"האויב המסוכן ביותר בעיר",
        icon:"👑",
        energyCost:80,
        cooldownHours:4,
        basePower:220,
        powerPerLevel:45,
        baseDefense:85,
        defensePerLevel:22,
        rewardBlackMoneyMin:180,
        rewardBlackMoneyMax:300,
        rewardDiamondsMin:5,
        rewardDiamondsMax:9,
        lootChance:0.08,
        loot:{ category:"armor", name:"🛡️ שריון אדון הפשע", statKey:"defense", statValue:220 }
    },


    {
        id:6,
        name:"הקרטל הבינלאומי",
        desc:"רשת פשע חוצת יבשות עם משאבים בלתי מוגבלים",
        icon:"🌍",
        energyCost:95,
        cooldownHours:4,
        basePower:320,
        powerPerLevel:65,
        baseDefense:125,
        defensePerLevel:32,
        rewardBlackMoneyMin:260,
        rewardBlackMoneyMax:420,
        rewardDiamondsMin:7,
        rewardDiamondsMax:12,
        lootChance:0.08,
        loot:{ category:"vehicle", name:"🚗 רכב הקרטל הבינלאומי", statKey:"speed", statValue:210 }
    },


    {
        id:7,
        name:"השליט הצללי",
        desc:"אף אחד לא ראה את פניו, אבל כולם מפחדים ממנו",
        icon:"🌑",
        energyCost:110,
        cooldownHours:4.5,
        basePower:460,
        powerPerLevel:90,
        baseDefense:180,
        defensePerLevel:46,
        rewardBlackMoneyMin:380,
        rewardBlackMoneyMax:600,
        rewardDiamondsMin:10,
        rewardDiamondsMax:16,
        lootChance:0.06,
        loot:{ category:"weapon", name:"🔫 נשק השליט הצללי", statKey:"power", statValue:300 }
    },


    {
        id:8,
        name:"קיסר העולם התחתון",
        desc:"האגדה עצמה. מי שמנצח אותו נכנס להיסטוריה",
        icon:"🔱",
        energyCost:130,
        cooldownHours:5,
        basePower:650,
        powerPerLevel:125,
        baseDefense:250,
        defensePerLevel:64,
        rewardBlackMoneyMin:550,
        rewardBlackMoneyMax:850,
        rewardDiamondsMin:14,
        rewardDiamondsMax:22,
        lootChance:0.05,
        loot:{ category:"armor", name:"🛡️ שריון קיסר העולם התחתון", statKey:"defense", statValue:320 }
    }

];









// ==========================================
// עזר: חישוב סף הקושי של בוס לפי רמת השחקן
// ==========================================

function getBossThreshold(boss){


    if(!player){

        return 0;

    }




    const level =

    typeof player.level === "number"

    ?

    player.level

    :

    1;




    const bossPower =

    boss.basePower + level * boss.powerPerLevel;




    const bossDefense =

    boss.baseDefense + level * boss.defensePerLevel;




    return bossPower + Math.floor(bossDefense * 0.5);


}









// ==========================================
// סטטוס בוס - זמין / כמה זמן נותר
// ==========================================

function getBossStatus(bossId){


    if(!player){

        return { ready:false, timeText:"" };

    }




    const boss =

    BOSSES.find(b=>b.id===bossId);




    if(!boss){

        return { ready:false, timeText:"" };

    }




    if(!player.bossCooldowns || typeof player.bossCooldowns !== "object"){

        player.bossCooldowns = {};

    }




    const lastAttempt =

    player.bossCooldowns[bossId] || 0;




    const cooldownMs =

    boss.cooldownHours * 60 * 60 * 1000;




    const elapsed =

    Date.now() - lastAttempt;




    if(elapsed >= cooldownMs){


        return { ready:true, timeText:"" };


    }




    const remain =

    cooldownMs - elapsed;




    const hours =

    Math.floor(remain / (60*60*1000));


    const minutes =

    Math.floor((remain % (60*60*1000)) / (60*1000));




    return {

        ready:false,

        timeText: hours + " שע' " + minutes + " דק'"

    };


}









// ==========================================
// תקיפת בוס
// ==========================================

function attackBoss(bossId){


    if(!player){

        return false;

    }




    if(

        typeof isHospitalized === "function"

        &&

        isHospitalized()

    ){


        const hStatus =

        typeof getHospitalStatus === "function"

        ?

        getHospitalStatus()

        :

        { timeText:"" };


        showMessage(

            "🏥 אתה בבית החולים - עוד " + hStatus.timeText

        );


        return false;


    }




    const boss =

    BOSSES.find(b=>b.id===bossId);




    if(!boss){

        return false;

    }




    const status =

    getBossStatus(bossId);




    if(!status.ready){


        showMessage(

            "⏳ " + boss.name + " עוד לא זמין - עוד " + status.timeText

        );


        return false;


    }




    if(player.energy < boss.energyCost){


        showMessage("⚡ אין מספיק אנרגיה לתקיפת " + boss.name);


        return false;


    }




    player.energy -= boss.energyCost;




    if(!player.bossCooldowns || typeof player.bossCooldowns !== "object"){

        player.bossCooldowns = {};

    }


    player.bossCooldowns[bossId] = Date.now();




    const attackPower =

    typeof getAttackPower === "function"

    ?

    getAttackPower()

    :

    (player.power || 0);




    const threshold =

    getBossThreshold(boss);




    // שונות אקראית קטנה, כמו בקרב רגיל

    const variance =

    0.9 + Math.random() * 0.2;




    const effectiveThreshold =

    Math.floor(threshold * variance);




    if(attackPower >= effectiveThreshold){



        const blackMoney =

        Math.floor(

            Math.random() * (boss.rewardBlackMoneyMax - boss.rewardBlackMoneyMin + 1)

        ) + boss.rewardBlackMoneyMin;




        const diamonds =

        Math.floor(

            Math.random() * (boss.rewardDiamondsMax - boss.rewardDiamondsMin + 1)

        ) + boss.rewardDiamondsMin;




        if(typeof player.blackMoney !== "number"){

            player.blackMoney = 0;

        }

        player.blackMoney += blackMoney;




        if(typeof player.diamonds !== "number"){

            player.diamonds = 0;

        }

        player.diamonds += diamonds;




        addXP(boss.energyCost * 10);




        let lootMessage = "";




        if(!Array.isArray(player.bossLoot)){

            player.bossLoot = [];

        }




        const alreadyHasLoot =

        player.bossLoot.find(l=>l.bossId===boss.id);




        if(

            !alreadyHasLoot

            &&

            Math.random() < boss.lootChance

        ){


            player.bossLoot.push({

                bossId:boss.id,

                category:boss.loot.category,

                name:boss.loot.name,

                statKey:boss.loot.statKey,

                statValue:boss.loot.statValue

            });




            if(typeof player[boss.loot.statKey] !== "number"){

                player[boss.loot.statKey] = 0;

            }


            player[boss.loot.statKey] += boss.loot.statValue;




            lootMessage =

            " | 🎁 שלל נדיר! קיבלת " + boss.loot.name +

            " (+" + boss.loot.statValue + ")";


        }




        showMessage(

            "🏆 ניצחת את " + boss.name + "! " +

            "+" + blackMoney + " 🖤 +" + diamonds + " 💎" +

            lootMessage

        );



    }

    else{



        const baseDamagePercent =

        0.3 + Math.random() * 0.15;




        const rawDamage =

        Math.floor((player.maxHealth || 100) * baseDamagePercent);




        const defense =

        player.defense || 0;




        const reducedDamage =

        Math.max(

            5,

            rawDamage - Math.floor(defense * 0.5)

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




        let unitLost = false;


        if(

            Math.random() < 0.5

            &&

            typeof getUnits === "function"

            &&

            getUnits() > 0

        ){


            const totalUnits =

            getUnits();




            const avgPower =

            Math.max(1, Math.round((player.unitsPower || 0) / totalUnits));




            const avgDefense =

            (player.unitsDefense || 0) > 0

            ?

            Math.max(1, Math.round((player.unitsDefense || 0) / totalUnits))

            :

            0;




            if(player.side === "police"){

                player.policeUnits = Math.max(0, player.policeUnits - 1);

            }

            else{

                player.criminalUnits = Math.max(0, player.criminalUnits - 1);

            }




            player.power =

            Math.max(1, player.power - avgPower);


            player.unitsPower =

            Math.max(0, (player.unitsPower || 0) - avgPower);




            if(avgDefense > 0){


                player.defense =

                Math.max(1, player.defense - avgDefense);


                player.unitsDefense =

                Math.max(0, (player.unitsDefense || 0) - avgDefense);


            }




            unitLost = true;


        }




        showMessage(

            "💥 הפסדת מול " + boss.name +

            " (-" + reducedDamage + " חיים)" +

            (unitLost ? " | 💀 איבדת חייל!" : "") +

            (sentToHospital ? " | 🏥 נשלחת לבית החולים ל-4 שעות!" : "")

        );



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

        &&

        typeof renderBattle === "function"

    ){


        const content =

        document.getElementById("gameContent");


        if(content){

            renderBattle(content);

        }


    }




    return true;


}




console.log(

    "WARDEAL BOSS v0.1.0 READY"

);
