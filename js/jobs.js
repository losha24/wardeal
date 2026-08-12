/* ==========================================
   WARDEAL v0.4.0
   Job System
   העבודות הפעילות נשמרות כעת בתוך אובייקט
   השחקן (player.activeJobs) - חלק מהשמירה
   הראשית, נכללות בגיבוי, בייצוא/ייבוא,
   ונמחקות כראוי במשחק חדש.
========================================== */


const MAX_ACTIVE_JOBS = 2;




// ==========================================
// עבודות משטרה
// ==========================================


const POLICE_JOBS = [

{
id:"patrol",
name:"סיור רחובות",
money:300,
xp:30,
energy:10,
time:30
},


{
id:"traffic",
name:"אכיפת תנועה",
money:600,
xp:60,
energy:15,
time:45
},


{
id:"investigation",
name:"חקירה",
money:1200,
xp:120,
energy:25,
time:60
},


{
id:"raid",
name:"פשיטה",
money:2500,
xp:250,
energy:40,
time:90
},


{
id:"special",
name:"יחידה מיוחדת",
money:4000,
xp:400,
energy:55,
time:120
},


{
id:"undercover",
name:"מבצע סמוי",
money:5500,
xp:550,
energy:68,
time:150
},


{
id:"swat",
name:"פשיטת סווט",
money:7500,
xp:750,
energy:80,
time:180,
gold:15
},


{
id:"chief",
name:"מבצע ראש המחלקה",
money:9800,
xp:980,
energy:92,
time:210,
gold:25,
diamonds:1,
blackMoney:40
}

];




// ==========================================
// עבודות עבריינים
// ==========================================


const CRIME_JOBS = [

{
id:"delivery",
name:"שליחות",
money:250,
xp:25,
energy:10,
time:30
},


{
id:"steal",
name:"גניבה",
money:700,
xp:70,
energy:20,
time:45
},


{
id:"robbery",
name:"שוד",
money:1500,
xp:150,
energy:35,
time:60
},


{
id:"operation",
name:"מבצע פשע",
money:3000,
xp:300,
energy:50,
time:90
},


{
id:"empire",
name:"ניהול אימפריה",
money:7000,
xp:700,
energy:80,
time:120
},


{
id:"smuggling",
name:"הברחה בינלאומית",
money:9000,
xp:900,
energy:85,
time:150
},


{
id:"cartel",
name:"עסקת קרטל",
money:12000,
xp:1200,
energy:92,
time:180,
gold:18
},


{
id:"kingpin",
name:"שליטה בעולם התחתון",
money:15500,
xp:1550,
energy:99,
time:210,
gold:30,
diamonds:1,
blackMoney:55
}

];





// ==========================================
// קבלת עבודות לפי צד
// ==========================================


function getAvailableJobs(){


    if(!player){

        return [];

    }



    if(player.side==="police"){


        return POLICE_JOBS;


    }


    return CRIME_JOBS;


}


// ==========================================
// גישה בטוחה למערך העבודות הפעילות של השחקן
// ==========================================


function getActiveJobsArray(){


    if(!player){

        return [];

    }



    if(!Array.isArray(player.activeJobs)){

        player.activeJobs = [];

    }



    return player.activeJobs;


}





// ==========================================
// התחלת עבודה
// ==========================================


function startJob(id){


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



    const activeJobs =

    getActiveJobsArray();




    if(activeJobs.length >= MAX_ACTIVE_JOBS){


        showMessage(

        "⚠️ אפשר לבצע רק 2 עבודות"

        );


        return;


    }







    let job =

    getAvailableJobs()

    .find(j=>j.id===id);





    if(!job){


        return;


    }






    let alreadyRunning =

    activeJobs.find(

        j=>j.id===id

    );




    if(alreadyRunning){


        showMessage(

        "⚠️ העבודה כבר פעילה"

        );


        return;


    }








    if(player.energy < job.energy){


        showMessage(

        "⚡ אין מספיק אנרגיה"

        );


        return;


    }






    player.energy -= job.energy;





    activeJobs.push({



        id:job.id,


        name:job.name,


        money:job.money,


        xp:job.xp,


        gold:job.gold || 0,


        diamonds:job.diamonds || 0,


        blackMoney:job.blackMoney || 0,


        start:Date.now(),


        duration:

        (

            typeof applySpeedToJobTime === "function"

            ?

            applySpeedToJobTime(job.time)

            :

            job.time

        ) * 1000



    });





    showMessage(

    "💼 התחלת: "+job.name

    );




    if(typeof saveGame==="function"){


        saveGame();


    }



    updateUI();


}









// ==========================================
// אחוז התקדמות
// ==========================================


function getJobProgress(index){


    const activeJobs =

    getActiveJobsArray();



    let job = activeJobs[index];


    if(!job){


        return 0;


    }






    let passed =

    Date.now()

    -

    job.start;



    let percent =

    (

        passed /

        job.duration

    ) * 100;



    if(percent < 0){


        percent=0;


    }




    if(percent > 100){


        percent=100;


    }




    return Math.floor(percent);


}









// ==========================================
// זמן שנותר
// ==========================================


function getJobTime(index){


    const activeJobs =

    getActiveJobsArray();



    let job = activeJobs[index];


    if(!job){


        return "";


    }






    let remain =

    job.duration -

    (

        Date.now()

        -

        job.start

    );




    if(remain < 0){


        remain=0;


    }




    return Math.ceil(

        remain / 1000

    )

    +

    " שניות";


}









// ==========================================
// בדיקת סיום עבודות
// ==========================================


function updateJobs(silent){


    if(!player){


        return [];


    }



    const activeJobs =

    getActiveJobsArray();




    const completed = [];




    for(

    let i = activeJobs.length-1;

    i>=0;

    i--

    ){



        let job = activeJobs[i];




        if(

        Date.now()

        >=

        job.start +

        job.duration

        ){




            player.money +=

            job.money;




            if(job.gold > 0){


                if(typeof player.gold !== "number"){

                    player.gold = 0;

                }


                player.gold += job.gold;


            }




            if(job.diamonds > 0){


                if(typeof player.diamonds !== "number"){

                    player.diamonds = 0;

                }


                player.diamonds += job.diamonds;


            }




            if(job.blackMoney > 0){


                if(typeof player.blackMoney !== "number"){

                    player.blackMoney = 0;

                }


                player.blackMoney += job.blackMoney;


            }




            addXP(

            job.xp

            );




            completed.push({

                name: job.name,

                money: job.money,

                gold: job.gold || 0,

                diamonds: job.diamonds || 0,

                blackMoney: job.blackMoney || 0

            });




            if(!silent){


                showMessage(

                "✅ "+

                job.name+

                " הסתיימה" +

                (job.gold > 0 ? " (+"+job.gold+" 🥇)" : "") +

                (job.diamonds > 0 ? " (+"+job.diamonds+" 💎)" : "") +

                (job.blackMoney > 0 ? " (+"+job.blackMoney+" 🖤)" : "")

                );


            }




            activeJobs.splice(

            i,

            1

            );




            if(typeof saveGame==="function"){


                saveGame();


            }


        }


    }




    return completed;


}


console.log(

"WARDEAL JOBS v0.4.0 READY"

);
