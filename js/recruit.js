/* ==========================================
   WARDEAL v0.4.0
   Recruitment System
   8 סוגי יחידות + שדרוג רמות (כוח + הגנה)
   player.unitsPower עוקב אחרי הכוח שהגיע
   מיחידות (לתצוגה בלבד - לא נספר פעמיים
   בחישוב הקרב, כי הוא כבר חלק מ-player.power)
========================================== */



const RECRUIT_TYPES = {


  soldier: {

    name: "חייל רגיל",

    icon: "🪖",

    cost: 700,

    power: 2,

    xp: 10

  },



  elite: {

    name: "יחידה מובחרת",

    icon: "🛡️",

    cost: 3200,

    power: 8,

    xp: 30

  },



  sniper: {

    name: "צלף מיומן",

    icon: "🎯",

    cost: 7800,

    power: 15,

    xp: 60

  },



  armored: {

    name: "יחידה משוריינת",

    icon: "🚔",

    cost: 16000,

    power: 28,

    defense: 20,

    xp: 100

  },



  special: {

    name: "כוח מיוחד",

    icon: "⭐",

    cost: 32000,

    power: 50,

    defense: 15,

    xp: 180

  },



  commander: {

    name: "מפקד בכיר",

    icon: "🎖️",

    cost: 65000,

    power: 90,

    defense: 40,

    xp: 350

  },


  general: {

    name: "גנרל ותיק",

    icon: "🏅",

    cost: 130000,

    power: 150,

    defense: 70,

    xp: 600

  },


  supreme: {

    name: "פיקוד עליון",

    icon: "👑",

    cost: 260000,

    power: 250,

    defense: 120,

    xp: 1000

  }


};









// ==========================================
// גיוס יחידה
// ==========================================


function recruitUnit(type = "soldier") {
  
  
  
  if (!player) {
    
    
    
    return false;
    
    
    
  }
  
  
  
  
  
  
  
  
  const unit =
    
    RECRUIT_TYPES[type];
  
  
  
  
  
  
  
  
  if (!unit) {
    
    
    
    showMessage(
      
      "יחידה לא קיימת"
      
    );
    
    
    
    return false;
    
    
    
  }
  
  
  
  
  
  
  
  
  if (player.money < unit.cost) {
    
    
    
    showMessage(
      
      "אין מספיק כסף לגיוס"
      
    );
    
    
    
    return false;
    
    
    
  }
  
  
  
  
  
  
  
  
  player.money -= unit.cost;
  
  
  
  
  
  
  
  
  if (player.side === "police") {
    
    
    
    player.policeUnits++;
    
    
    
  }
  
  else {
    
    
    
    player.criminalUnits++;
    
    
    
  }
  
  
  
  
  
  
  
  
  player.power += unit.power;



  if (typeof player.unitsPower !== "number") {

    player.unitsPower = 0;

  }

  player.unitsPower += unit.power;




  if (typeof unit.defense === "number" && unit.defense > 0) {


    player.defense += unit.defense;


    if (typeof player.unitsDefense !== "number") {

      player.unitsDefense = 0;

    }

    player.unitsDefense += unit.defense;


  }
  
  
  
  
  
  
  
  
  addXP(unit.xp);
  
  
  
  
  
  
  
  
  showMessage(
    
    
    
    `👥 גויסה ${unit.name} (+${unit.power} כוח${unit.defense ? ", +" + unit.defense + " הגנה" : ""})`
    
    
    
  );
  
  
  
  
  
  
  
  
  saveGame();
  
  
  
  updateUI();




  if (

    typeof currentPage !== "undefined"

    &&

    currentPage === "recruit"

  ) {


    const content =

    document.getElementById("gameContent");



    if (

      content

      &&

      typeof renderRecruit === "function"

    ) {

      renderRecruit(content);

    }


  }
  
  
  
  
  
  
  
  return true;
  
  
  
}









// ==========================================
// שדרוג רמת יחידה (כוח + הגנה)
// עולה כסף רגיל, סקלת עלות עולה לפי רמה
// ==========================================


function upgradeRecruit(type){


    if(!player){

        return false;

    }




    const unit =

    RECRUIT_TYPES[type];




    if(!unit){

        return false;

    }




    if(!player.unitTraining || typeof player.unitTraining !== "object"){

        player.unitTraining = {};

    }




    const level =

    player.unitTraining[type] || 1;




    const cost =

    level *

    Math.max(1, Math.ceil(unit.cost * 0.5));




    if(player.money < cost){


        showMessage("אין מספיק כסף לשדרוג היחידה");


        return false;


    }




    player.money -= cost;




    const bonus =

    Math.max(1, Math.ceil(unit.power * 0.2));




    player.power += bonus;


    player.defense += bonus;




    player.unitTraining[type] = level + 1;




    showMessage(

        "⬆️ " + unit.name + " שודרגה לרמה " + (level+1) +

        " (+" + bonus + " כוח, +" + bonus + " הגנה)"

    );




    if(typeof saveGame === "function"){

        saveGame();

    }




    if(typeof updateUI === "function"){

        updateUI();

    }




    if(

        typeof currentPage !== "undefined"

        &&

        currentPage === "recruit"

    ){


        const content =

        document.getElementById("gameContent");




        if(

            content

            &&

            typeof renderRecruit === "function"

        ){

            renderRecruit(content);

        }


    }




    return true;


}









// ==========================================
// תאימות לקוד ישן
// ==========================================


function recruitPerson() {
  
  
  
  return recruitUnit(
    
    "soldier"
    
  );
  
  
  
}









// ==========================================
// כמות יחידות
// ==========================================


function getRecruitCount() {
  
  
  
  return getUnits();
  
  
  
}









// ==========================================
// כמה מכוח השחקן הגיע מיחידות שגויסו
// (לתצוגה בלבד - כבר כלול ב-player.power,
// ולכן אסור להוסיף אותו שוב בחישוב קרב)
// ==========================================


function getRecruitPower() {
  
  
  
  if (!player) {

    return 0;

  }



  return player.unitsPower || 0;
  
  
  
}
