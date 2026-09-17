/* ==========================================
   WARDEAL v0.7.0
   מערכת משימות
   10 משימות, מתאפסות כל 4 שעות
========================================== */
const DAILY_MISSION_RESET_MS = 4 * 60 * 60 * 1000;
const DAILY_MISSION_STAT_KEYS = [
    "jobsCompleted","battlesWon","unitsRecruited","specialActions","moneyEarned",
    "shopPurchases","bossesDefeated","realEstateActions","hqUpgrades"
];
const DAILY_MISSIONS_BASE = [
    { id:"jobs", icon:"💼", name:"יום עבודה", desc:"סיים עבודות", target:2, stat:"jobsCompleted", reward:{money:800}, xp:80 },
    { id:"wins", icon:"⚔️", name:"לוחם היום", desc:"נצח בקרבות נגד היריב שלך", target:2, stat:"battlesWon", reward:{money:1000, gold:3}, xp:100 },
    { id:"recruit", icon:"👥", name:"חיזוק כוחות", desc:"גייס יחידות", target:2, stat:"unitsRecruited", reward:{money:600}, xp:60 },
    { id:"actions", icon:"🎯", name:"פעילות נגד היריב", desc:"בצע פעולות נגד הצד היריב", target:2, stat:"specialActions", reward:{money:700, blackMoney:10}, xp:70 },
    { id:"wealth", icon:"💰", name:"צובר הון", desc:"הרווח כסף מעבודות וקרבות", target:5000, stat:"moneyEarned", reward:{gold:5}, xp:120 },
    { id:"shopper", icon:"🛒", name:"קניין", desc:"קנה פריט אחד בחנות (נשק / שריון / רכב)", target:1, stat:"shopPurchases", reward:{money:900, gold:3}, xp:90 },
    { id:"bosshunt", icon:"👑", name:"ציד בוסים", desc:"נצח בוס אחד", target:1, stat:"bossesDefeated", reward:{money:1500, diamonds:1}, xp:150 },
    { id:"realestate", icon:"🏘️", name:"משקיע נדל״ן", desc:"קנה או שדרג נכס / עסק אחד", target:1, stat:"realEstateActions", reward:{money:1200}, xp:100 },
    { id:"hqbuilder", icon:"🏰", name:"מפקד מתפתח", desc:"שדרג את המפקדה / התחנה פעם אחת", target:1, stat:"hqUpgrades", reward:{money:1000, gold:4}, xp:100 },
    { id:"champion", icon:"🏆", name:"אלוף המחזור", desc:"השלם 6 משימות אחרות במחזור הנוכחי", target:6, stat:"missionsCompleted", reward:{money:2500, gold:8, diamonds:1}, xp:200 }
];
function getDailyMissions(){
    const police = player && player.side === "police";
    return DAILY_MISSIONS_BASE.map(m=>({ ...m,
        name: m.id === "actions" ? (police ? "מבצעי היום" : "מבצעי הפשע") : m.name,
        desc: m.id === "actions" ? (police ? "בצע פעולות נגד עבריינים" : "בצע פעולות נגד שוטרים") : (m.id === "wins" ? (police ? "נצח בקרבות נגד עבריינים" : "נצח בקרבות נגד שוטרים") : m.desc)
    }));
}
// ==========================================
// סטטוס המחזור הנוכחי - זמן שנותר עד האיפוס
// ==========================================
function getDailyMissionsResetStatus(){
    if(!player) return { remainingMs:0, timeText:"" };
    const data = ensureDailyMissions();
    const elapsed = Date.now() - (data.windowStart || 0);
    const remain = Math.max(0, DAILY_MISSION_RESET_MS - elapsed);
    const hours = Math.floor(remain / (60*60*1000));
    const minutes = Math.floor((remain % (60*60*1000)) / (60*1000));
    return { remainingMs:remain, timeText: hours + " שע' " + minutes + " דק'" };
}
// ==========================================
// ווידוא שהמחזור הנוכחי עדכני (4 שעות)
// ==========================================
function ensureDailyMissions(){
    if(!player) return null;
    if(!player.dailyMissions || typeof player.dailyMissions !== "object") player.dailyMissions = {};
    const now = Date.now();
    const windowStart = player.dailyMissions.windowStart || 0;
    if(!windowStart || now - windowStart >= DAILY_MISSION_RESET_MS){
        const freshStats = {};
        DAILY_MISSION_STAT_KEYS.forEach(k=>{ freshStats[k] = 0; });
        player.dailyMissions = { windowStart: now, claimed:{}, stats: freshStats };
    }
    if(!player.dailyMissions.stats) player.dailyMissions.stats = {};
    DAILY_MISSION_STAT_KEYS.forEach(k=>{
        if(typeof player.dailyMissions.stats[k] !== "number") player.dailyMissions.stats[k]=0;
    });
    if(!player.dailyMissions.claimed) player.dailyMissions.claimed={};
    return player.dailyMissions;
}
function dailyAddProgress(stat, amount=1){
    const data=ensureDailyMissions();
    if(!data) return;
    data.stats[stat]=(Number(data.stats[stat])||0)+(Number(amount)||0);
    if(typeof saveGame === "function") saveGame();
}
function getDailyMissionProgress(mission){
    const data=ensureDailyMissions();
    if(!data) return 0;
    if(mission.id === "champion") return getDailyMissions().filter(m=>m.id!=="champion" && data.claimed[m.id]).length;
    return Math.min(mission.target, Number(data.stats[mission.stat])||0);
}
function isDailyMissionClaimed(id){
    const data=ensureDailyMissions();
    return !!(data && data.claimed[id]);
}
function claimDailyMission(id){
    const data=ensureDailyMissions();
    const mission=getDailyMissions().find(m=>m.id===id);
    if(!data || !mission || data.claimed[id]) return;
    const progress=getDailyMissionProgress(mission);
    if(progress < mission.target){
        if(typeof showMessage === "function") showMessage("⏳ המשימה עדיין לא הושלמה");
        return;
    }
    data.claimed[id]=true;
    player.money += mission.reward.money||0;
    player.gold += mission.reward.gold||0;
    player.diamonds += mission.reward.diamonds||0;
    player.blackMoney += mission.reward.blackMoney||0;
    if(typeof addXP === "function") addXP(mission.xp||0);
    if(typeof saveGame === "function") saveGame();
    if(typeof updateUI === "function") updateUI();
    if(typeof showMessage === "function") showMessage("🎁 משימה הושלמה: "+mission.name);
    renderDailyMissions(document.getElementById("gameContent"));
}
function renderDailyMissions(content){
    if(!player || !content) return;
    ensureDailyMissions();
    const missions=getDailyMissions();
    const completed=missions.filter(m=>isDailyMissionClaimed(m.id)).length;
    const resetStatus=getDailyMissionsResetStatus();
    let html=`<div class="contentCard dailyMissionsPanel"><h3>📅 משימות</h3><p class="dailyIntro">השלם משימות וקבל תגמולים. המשימות מתאפסות כל 4 שעות - עוד ${resetStatus.timeText}.</p><div class="dailySummary">🏆 הושלמו במחזור: <b>${completed}/${missions.length}</b></div><div class="dailyGrid">`;
    missions.forEach(m=>{
        const p=getDailyMissionProgress(m), claimed=isDailyMissionClaimed(m.id), pct=Math.min(100,Math.floor((p/m.target)*100));
        const reward=[];
        if(m.reward.money) reward.push("₪"+m.reward.money.toLocaleString());
        if(m.reward.gold) reward.push(m.reward.gold+" 🥇");
        if(m.reward.diamonds) reward.push(m.reward.diamonds+" 💎");
        if(m.reward.blackMoney) reward.push(m.reward.blackMoney+" 🖤");
        html+=`<div class="dailyMissionCard ${claimed?"claimed":""}"><div class="dailyMissionIcon">${m.icon}</div><div class="dailyMissionName">${m.name}</div><div class="dailyMissionDesc">${m.desc}</div><div class="dailyMissionProgressText">${p.toLocaleString()} / ${m.target.toLocaleString()}</div><div class="dailyProgress"><div style="width:${pct}%"></div></div><div class="dailyReward">🎁 ${reward.join(" · ")} · ${m.xp} XP</div><button class="upgradeBtn dailyClaimBtn" ${claimed||p<m.target?"disabled":""} onclick="claimDailyMission('${m.id}')">${claimed?"✅ נאסף":"🎁 אסוף פרס"}</button></div>`;
    });
    html+=`</div></div>`;
    content.innerHTML=html;
}
