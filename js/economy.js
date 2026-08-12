/* ==========================================
   WARDEAL v0.3.1
   Economy System
   Passive Income (+ legacy JOBS/work())
   ------------------------------------------
   הערה: מסך "עבודה" ב-UI משתמש כעת במערכת
   העבודות המתקדמת ב-jobs.js (עם זמן והתקדמות).
   ה-JOBS/work() כאן נשארו כאפשרות עתידית
   (למשל "עבודות מהירות") אך אינם מקושרים
   כרגע לשום כפתור במשחק.
========================================== */



const JOBS = [
  
  
  {
    id: 0,
    name: "מנקה",
    income: 100,
    xp: 5
  },
  
  
  {
    id: 1,
    name: "שליח",
    income: 500,
    xp: 10
  },
  
  
  {
    id: 2,
    name: "מאבטח",
    income: 1000,
    xp: 20
  },
  
  
  {
    id: 3,
    name: "מתכנת",
    income: 3000,
    xp: 50
  }
  
  
];









// ==========================================
// עבודה
// ==========================================

function work(jobIndex = 0) {
  
  
  
  if (!player) {
    
    
    
    return;
    
    
    
  }
  
  
  
  
  
  
  
  const job =
    
    JOBS[jobIndex];
  
  
  
  
  
  
  
  if (!job) {
    
    
    
    showMessage(
      
      "עבודה לא קיימת"
      
    );
    
    
    
    return;
    
    
    
  }
  
  
  
  
  
  
  
  
  
  const energyCost =

    typeof WORK_ENERGY_COST !== "undefined"

    ?

    WORK_ENERGY_COST

    :

    10;
  
  
  
  
  
  
  
  if (!useEnergy(energyCost)) {
    
    
    
    if (typeof showMessage === "function") {
      
      
      
      showMessage(
        
        "⚡ אין מספיק אנרגיה"
        
      );
      
      
      
    }
    
    
    
    return;
    
    
    
  }
  
  
  
  
  
  
  
  
  player.money +=
    
    job.income;
  
  
  
  
  
  
  
  
  addXP(job.xp);
  
  
  
  
  
  
  
  
  if (typeof showMessage === "function") {
    
    
    
    showMessage(
      
      `💼 עבדת כ${job.name} והרווחת ₪${job.income}`
      
    );
    
    
    
  }
  
  
  
  
  
  
  
  
  if (typeof saveGame === "function") {
    
    
    
    saveGame();
    
    
    
  }
  
  
  
  
  
  
  
  
  if (typeof updateUI === "function") {
    
    
    
    updateUI();
    
    
    
  }
  
  
  
  
  
  
  
  
  return {
    
    
    job: job.name,
    
    income: job.income,
    
    xp: job.xp
    
    
  };
  
  
  
}
// ==========================================
// חישוב הכנסה פסיבית
// ==========================================

function calculatePassiveIncome() {
  
  
  
  let income = 0;
  
  
  
  
  
  if (typeof getPropertyIncome === "function") {
    
    
    
    income +=
      
      getPropertyIncome();
    
    
    
  }
  
  
  
  
  
  
  
  if (typeof getBusinessIncome === "function") {
    
    
    
    income +=
      
      getBusinessIncome();
    
    
    
  }
  
  
  
  
  
  
  
  return Math.floor(income || 0);
  
  
  
}









// ==========================================
// איסוף הכנסה פסיבית
// (הערה: כבר לא מקושרת לכפתור - הוחלפה
// במתנת 4 השעות ב-city.js. ההכנסה הפסיבית
// עצמה עדיין נכנסת אוטומטית כל שנייה
// דרך updatePassiveIncome ב-core.js)
// ==========================================

function collectPassiveIncome() {
  
  
  
  if (!player) {
    
    
    
    return;
    
    
    
  }
  
  
  
  
  
  
  
  
  const amount =
    
    calculatePassiveIncome();
  
  
  
  
  
  
  
  
  if (amount <= 0) {
    
    
    
    if (typeof showMessage === "function") {
      
      
      
      showMessage(
        
        "💰 אין הכנסה פסיבית זמינה"
        
      );
      
      
      
    }
    
    
    
    return;
    
    
    
  }
  
  
  
  
  
  
  
  
  player.money += amount;
  
  
  
  
  
  
  
  if (typeof addXP === "function") {
    
    
    
    addXP(5);
    
    
    
  }
  
  
  
  
  
  
  
  
  if (typeof showMessage === "function") {
    
    
    
    showMessage(
      
      `💰 נאספו ₪${amount}`
      
    );
    
    
    
  }
  
  
  
  
  
  
  
  
  if (typeof saveGame === "function") {
    
    
    
    saveGame();
    
    
    
  }
  
  
  
  
  
  
  
  
  if (typeof updateUI === "function") {
    
    
    
    updateUI();
    
    
    
  }
  
  
  
  
  
  
  
  
  return amount;
  
  
  
}









// ==========================================
// קבלת רשימת עבודות
// ==========================================

function getJobs() {
  
  
  
  return JOBS;
  
  
  
}









// ==========================================
// בדיקת עבודה זמינה
// ==========================================

function getJob(index) {
  
  
  
  return JOBS[index] || null;
  
  
  
}



// ==========================================
// תאימות לקוד ישן
// ==========================================

function workJob(jobIndex = 0) {
  
  
  return work(jobIndex);
  
  
}





console.log(
  
  "WARDEAL ECONOMY v0.3.1 READY"
  
);