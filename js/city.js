/* ==========================================
   WARDEAL v0.1.0
   מערכת עיר
   לוח מחוונים + חדשות ואירועים אקראיים
========================================== */


const CITY_EVENT_COOLDOWN = 20000;


let lastCityEventTime = 0;


let cityNewsLog = [];





// ==========================================
// מאגר אירועים
// ==========================================


const CITY_EVENTS = [


    // חיוביים - כלליים

    { text:"🎁 מצאת ארנק אבוד ברחוב", money:150 },

    { text:"💵 קיבלת טיפ נדיב מתושב מקומי", money:250 },

    { text:"📈 השקעה קטנה הניבה רווח נאה", money:400 },

    { text:"🎉 חגיגה בעיר הביאה איתה הזדמנות עסקית", money:300 },


    // שליליים - כלליים

    { text:"🚗 קנס חנייה הפתיע אותך", money:-150 },

    { text:"💸 הוצאה בלתי צפויה פגעה בתקציב", money:-200 },

    { text:"🔧 תיקון ציוד עלה יותר מהצפוי", money:-120 },


    // ספציפי משטרה

    { text:"👮 פשיטה מוצלחת הניבה החרמות", money:350, side:"police" },

    { text:"🚔 דוח משמעת קטן הוריד מהתקציב", money:-180, side:"police" },


    // ספציפי עבריינים

    { text:"🕶️ עסקה חשאית הניבה רווח נאה", money:500, side:"criminal" },

    { text:"🚨 כמעט נתפסת - שוחד קטן נדרש", money:-300, side:"criminal" },


    // מציאות נדירות - זהב/יהלומים

    { text:"🥇 מצאת מטבע זהב נדיר ברחוב", gold:8 },

    { text:"🥇 עסקה קטנה שולמה לך בזהב", gold:12 },

    { text:"💎 מצאת יהלום נוצץ באשפה", diamonds:1 },

    { text:"💎 קיבלת יהלום כתשלום על שירות", diamonds:1 },


    // שוחד - כסף שחור, זמין לשני הצדדים

    { text:"🖤 מישהו שילם לך שוחד תמורת שתיקה", blackMoney:15 },

    { text:"🖤 עסקה חשאית תחת השולחן", blackMoney:22 }


];









// ==========================================
// סינון אירועים לפי צד
// ==========================================

function getCityEventsForSide(side){


    return CITY_EVENTS.filter(

        event =>

        !event.side

        ||

        event.side === side

    );


}









// ==========================================
// ניסיון להפעיל אירוע אוטומטי (נקרא מ-gameTick)
// ==========================================

function maybeTriggerCityEvent(){


    if(!player){

        return;

    }








    const now = Date.now();








    if(now - lastCityEventTime < CITY_EVENT_COOLDOWN){

        return;

    }








    // סיכוי נמוך בכל בדיקה, כך שהאירועים לא יהיו תכופים מדי

    if(Math.random() > 0.05){

        return;

    }








    triggerCityEvent(false);


}









// ==========================================
// הפעלת אירוע (force=true להפעלה ידנית מכפתור)
// ==========================================

function triggerCityEvent(force){


    if(!player){

        return null;

    }








    const now = Date.now();








    if(

        !force

        &&

        now - lastCityEventTime < CITY_EVENT_COOLDOWN

    ){

        return null;

    }








    if(

        force

        &&

        now - lastCityEventTime < CITY_EVENT_COOLDOWN

    ){


        showMessageSafeCity(

            "⏳ חכה קצת לפני אירוע חדש בעיר"

        );


        return null;


    }








    const pool =

    getCityEventsForSide(player.side);








    if(pool.length === 0){

        return null;

    }








    const event =

    pool[

        Math.floor(

            Math.random() * pool.length

        )

    ];








    if(typeof event.money === "number"){


        player.money += event.money;


        if(player.money < 0){

            player.money = 0;

        }


    }




    if(typeof event.gold === "number"){


        if(typeof player.gold !== "number"){

            player.gold = 0;

        }


        player.gold += event.gold;


    }




    if(typeof event.diamonds === "number"){


        if(typeof player.diamonds !== "number"){

            player.diamonds = 0;

        }


        player.diamonds += event.diamonds;


    }




    if(typeof event.blackMoney === "number"){


        if(typeof player.blackMoney !== "number"){

            player.blackMoney = 0;

        }


        player.blackMoney += event.blackMoney;


    }








    lastCityEventTime = now;








    cityNewsLog.unshift({

        text:event.text,

        money:event.money || 0,

        gold:event.gold || 0,

        diamonds:event.diamonds || 0,

        blackMoney:event.blackMoney || 0,

        time:now

    });








    if(cityNewsLog.length > 5){

        cityNewsLog = cityNewsLog.slice(0,5);

    }








    showMessageSafeCity(event.text);








    if(typeof saveGame === "function"){

        saveGame();

    }








    if(typeof updateUI === "function"){

        updateUI();

    }








    if(

        typeof currentPage !== "undefined"

        &&

        currentPage === "home"

    ){


        const content =

        document.getElementById("gameContent");








        if(

            content

            &&

            typeof renderCity === "function"

        ){

            renderCity(content);

        }


    }








    return event;


}









// ==========================================
// מתנה כל 4 שעות
// ==========================================


const GIFT_COOLDOWN =

4 * 60 * 60 * 1000;




const GIFT_MONEY_MIN = 1;

const GIFT_MONEY_MAX = 10000;

const GIFT_GOLD_MIN = 1;

const GIFT_GOLD_MAX = 15;

const GIFT_DIAMOND_CHANCE = 0.1;









// ==========================================
// סטטוס המתנה - האם זמינה וכמה זמן נותר
// ==========================================

function getGiftStatus(){


    if(!player){


        return { ready:false, timeText:"" };


    }




    const lastClaim =

    player.lastGiftClaim || 0;




    const elapsed =

    Date.now() - lastClaim;




    if(elapsed >= GIFT_COOLDOWN){


        return { ready:true, timeText:"" };


    }




    const remain =

    GIFT_COOLDOWN - elapsed;




    const hours =

    Math.floor(remain / (60*60*1000));




    const minutes =

    Math.floor(

        (remain % (60*60*1000)) / (60*1000)

    );




    return {

        ready:false,

        timeText: hours + " שע' " + minutes + " דק'"

    };


}









// ==========================================
// איסוף המתנה
// ==========================================

// ==========================================
// גביית שוחד - זמינה תמיד, לא תופסת משבצת
// עבודה, עולה רק אנרגיה
// מוגבלת ל-10 פעמים בכל חלון של 4 שעות
// ==========================================

const BRIBE_ENERGY_COST = 15;

const BRIBE_MONEY_MIN = 100;

const BRIBE_MONEY_MAX = 300;

const BRIBE_BLACKMONEY_MIN = 5;

const BRIBE_BLACKMONEY_MAX = 15;

const BRIBE_XP = 20;

const BRIBE_WINDOW = 4 * 60 * 60 * 1000;

const BRIBE_MAX_USES = 10;

const BRIBE_DIAMOND_CHANCE = 0.05;




// ==========================================
// סטטוס גביית שוחד - כמה נשארו וכמה זמן לאיפוס
// ==========================================

function getBribeStatus(){


    if(!player){

        return { remaining:0, resetText:"" };

    }




    const now = Date.now();


    const windowStart =

    player.bribeWindowStart || 0;




    if(now - windowStart >= BRIBE_WINDOW){


        return { remaining: BRIBE_MAX_USES, resetText:"" };


    }




    const used =

    player.bribeCount || 0;




    const remaining =

    Math.max(0, BRIBE_MAX_USES - used);




    const remainMs =

    BRIBE_WINDOW - (now - windowStart);




    const hours =

    Math.floor(remainMs / (60*60*1000));




    const minutes =

    Math.floor(

        (remainMs % (60*60*1000)) / (60*1000)

    );




    return {

        remaining:remaining,

        resetText: hours + " שע' " + minutes + " דק'"

    };


}




function collectBribe(){


    if(!player){

        return false;

    }




    const now = Date.now();




    // איפוס חלון אם עברו 4 שעות מתחילת החלון הנוכחי

    if(

        !player.bribeWindowStart

        ||

        now - player.bribeWindowStart >= BRIBE_WINDOW

    ){


        player.bribeWindowStart = now;


        player.bribeCount = 0;


    }




    if((player.bribeCount || 0) >= BRIBE_MAX_USES){


        const status = getBribeStatus();


        showMessageSafeCity(

            "🖤 ניצלת את כל " + BRIBE_MAX_USES +

            " גביות השוחד - עוד " + status.resetText

        );


        return false;


    }




    if(player.energy < BRIBE_ENERGY_COST){


        showMessageSafeCity("⚡ אין מספיק אנרגיה לגביית שוחד");


        return false;


    }




    player.energy -= BRIBE_ENERGY_COST;


    player.bribeCount = (player.bribeCount || 0) + 1;




    const money =

    Math.floor(

        Math.random() * (BRIBE_MONEY_MAX - BRIBE_MONEY_MIN + 1)

    ) + BRIBE_MONEY_MIN;




    const blackMoney =

    Math.floor(

        Math.random() * (BRIBE_BLACKMONEY_MAX - BRIBE_BLACKMONEY_MIN + 1)

    ) + BRIBE_BLACKMONEY_MIN;




    let diamonds = 0;


    if(Math.random() < BRIBE_DIAMOND_CHANCE){

        diamonds = 1;

    }




    player.money += money;




    if(typeof player.blackMoney !== "number"){

        player.blackMoney = 0;

    }

    player.blackMoney += blackMoney;




    if(diamonds > 0){

        if(typeof player.diamonds !== "number"){

            player.diamonds = 0;

        }

        player.diamonds += diamonds;

    }




    if(typeof addXP === "function"){

        addXP(BRIBE_XP);

    }




    showMessageSafeCity(

        "🖤 גבית שוחד: ₪" + money + " ו-" + blackMoney + " 🖤" +

        (diamonds > 0 ? " ועוד 💎 יהלום נדיר!" : "")

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

        currentPage === "actions"

    ){


        const content =

        document.getElementById("gameContent");




        if(

            content

            &&

            typeof renderActions === "function"

        ){

            renderActions(content);

        }


    }



    return true;


}









// ==========================================
// המרת כסף רגיל לכסף שחור
// סיכוי הצלחה עולה עם הסכום שמסתכנים בו
// (1% בסכום המינימלי, עד 10% בסכום המקסימלי)
// שיעור המרה בהצלחה: 200 כסף = 1 כסף שחור
// מוגבל ל-4 פעמים בכל חלון של 4 שעות
// ==========================================

const CONVERT_MIN_AMOUNT = 500;

const CONVERT_MAX_AMOUNT_BASE = 20000;




// ==========================================
// גבול המרה מקסימלי - עולה 10% בכל רמה
// ==========================================

function getConvertMaxAmount(){


    const level =

    player && typeof player.level === "number"

    ?

    player.level

    :

    1;




    return Math.round(

        CONVERT_MAX_AMOUNT_BASE * Math.pow(1.1, level - 1)

    );


}

const CONVERT_RATE = 200;

const CONVERT_WINDOW = 4 * 60 * 60 * 1000;

const CONVERT_MAX_USES = 4;




// ==========================================
// סטטוס המרה - כמה נותרו וכמה זמן לאיפוס
// ==========================================

function getConvertStatus(){


    if(!player){

        return { remaining:0, resetText:"" };

    }




    const now = Date.now();


    const windowStart =

    player.convertWindowStart || 0;




    if(now - windowStart >= CONVERT_WINDOW){


        return { remaining: CONVERT_MAX_USES, resetText:"" };


    }




    const used =

    player.convertCount || 0;




    const remaining =

    Math.max(0, CONVERT_MAX_USES - used);




    const remainMs =

    CONVERT_WINDOW - (now - windowStart);




    const hours =

    Math.floor(remainMs / (60*60*1000));




    const minutes =

    Math.floor(

        (remainMs % (60*60*1000)) / (60*1000)

    );




    return {

        remaining:remaining,

        resetText: hours + " שע' " + minutes + " דק'"

    };


}









// ==========================================
// חישוב סיכוי הצלחה לפי הסכום שנבחר
// ==========================================

function getConvertChance(amount){


    const maxAmount =

    typeof getConvertMaxAmount === "function"

    ?

    getConvertMaxAmount()

    :

    CONVERT_MAX_AMOUNT_BASE;




    const clamped =

    Math.min(

        maxAmount,

        Math.max(CONVERT_MIN_AMOUNT, amount)

    );




    const ratio =

    (clamped - CONVERT_MIN_AMOUNT) /

    (maxAmount - CONVERT_MIN_AMOUNT);



    // 1% עד 10%

    return 0.01 + ratio * 0.09;


}









// ==========================================
// ביצוע ההמרה
// ==========================================

function convertMoneyToBlackMoney(amount){


    if(!player){

        return false;

    }




    amount =

    Math.floor(Number(amount));




    if(

        !amount

        ||

        isNaN(amount)

        ||

        amount < CONVERT_MIN_AMOUNT

    ){


        showMessageSafeCity(

            "💱 סכום מינימלי להמרה: ₪" + CONVERT_MIN_AMOUNT

        );


        return false;


    }




    const maxAllowed =

    typeof getConvertMaxAmount === "function"

    ?

    getConvertMaxAmount()

    :

    CONVERT_MAX_AMOUNT_BASE;




    if(amount > maxAllowed){


        showMessageSafeCity(

            "💱 סכום מקסימלי להמרה ברמה שלך: ₪" + maxAllowed

        );


        return false;


    }




    const now = Date.now();




    if(

        !player.convertWindowStart

        ||

        now - player.convertWindowStart >= CONVERT_WINDOW

    ){


        player.convertWindowStart = now;


        player.convertCount = 0;


    }




    if((player.convertCount || 0) >= CONVERT_MAX_USES){


        const status = getConvertStatus();


        showMessageSafeCity(

            "💱 ניצלת את כל " + CONVERT_MAX_USES +

            " ניסיונות ההמרה - עוד " + status.resetText

        );


        return false;


    }




    if(player.money < amount){


        showMessageSafeCity("💰 אין מספיק כסף להמרה");


        return false;


    }




    // הכסף יורד תמיד, גם אם ההמרה נכשלת

    player.money -= amount;


    player.convertCount = (player.convertCount || 0) + 1;




    const chance =

    getConvertChance(amount);




    if(Math.random() < chance){



        const blackMoneyGained =

        Math.max(1, Math.floor(amount / CONVERT_RATE));




        if(typeof player.blackMoney !== "number"){

            player.blackMoney = 0;

        }


        player.blackMoney += blackMoneyGained;




        showMessageSafeCity(

            "💱 ההמרה הצליחה! קיבלת " + blackMoneyGained + " 🖤"

        );



    }

    else{



        showMessageSafeCity(

            "💱 ההמרה נכשלה - ₪" + amount + " נעלם"

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

        currentPage === "actions"

    ){


        const content =

        document.getElementById("gameContent");




        if(

            content

            &&

            typeof renderActions === "function"

        ){

            renderActions(content);

        }


    }




    return true;


}









function claimCityGift(){


    if(!player){

        return false;

    }




    const status =

    getGiftStatus();




    if(!status.ready){


        showMessageSafeCity(

            "⏳ המתנה עוד לא זמינה - עוד " + status.timeText

        );


        return false;


    }




    // פילוג פעמון סביב האמצע (ממוצע של 3 הגרלות)
    // כדי שרוב המתנות יהיו סביב האמצע, עם מעט מקרי קצה

    const roll1 =

    GIFT_MONEY_MIN + Math.random() * (GIFT_MONEY_MAX - GIFT_MONEY_MIN);


    const roll2 =

    GIFT_MONEY_MIN + Math.random() * (GIFT_MONEY_MAX - GIFT_MONEY_MIN);


    const roll3 =

    GIFT_MONEY_MIN + Math.random() * (GIFT_MONEY_MAX - GIFT_MONEY_MIN);




    const money =

    Math.round((roll1 + roll2 + roll3) / 3);




    const gold =

    Math.floor(

        Math.random() * (GIFT_GOLD_MAX - GIFT_GOLD_MIN + 1)

    ) + GIFT_GOLD_MIN;




    let diamonds = 0;


    if(Math.random() < GIFT_DIAMOND_CHANCE){

        diamonds = 1;

    }




    player.money += money;




    if(typeof player.gold !== "number"){

        player.gold = 0;

    }

    player.gold += gold;




    if(diamonds > 0){

        if(typeof player.diamonds !== "number"){

            player.diamonds = 0;

        }

        player.diamonds += diamonds;

    }




    player.lastGiftClaim = Date.now();




    showMessageSafeCity(

        "🎁 קיבלת ₪" + money + " ו-" + gold + " 🥇" +

        (diamonds > 0 ? " ועוד 💎 יהלום נדיר!" : "")

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

        currentPage === "actions"

    ){


        const content =

        document.getElementById("gameContent");




        if(

            content

            &&

            typeof renderActions === "function"

        ){

            renderActions(content);

        }


    }




    return true;


}









// ==========================================
// סיכום אימפריה ללוח המחוונים
// ==========================================

function getEmpireSummary(){


    if(!player){


        return {

            properties:0,

            businesses:0,

            units:0,

            income:0

        };


    }








    return {


        properties:

        typeof getOwnedPropertiesCount === "function"

        ?

        getOwnedPropertiesCount()

        :

        0,



        businesses:

        typeof getOwnedBusinessesCount === "function"

        ?

        getOwnedBusinessesCount()

        :

        0,



        units:

        typeof getUnits === "function"

        ?

        getUnits()

        :

        0,



        income:

        typeof calculatePassiveIncome === "function"

        ?

        calculatePassiveIncome()

        :

        0


    };


}









// ==========================================
// ציור מסך העיר
// ==========================================

function renderActions(content){


    if(!player || !content){

        return;

    }




    const giftStatus =

    typeof getGiftStatus === "function"

    ?

    getGiftStatus()

    :

    { ready:false, timeText:"" };




    const bribeStatus =

    typeof getBribeStatus === "function"

    ?

    getBribeStatus()

    :

    { remaining:0, resetText:"" };




    const convertStatus =

    typeof getConvertStatus === "function"

    ?

    getConvertStatus()

    :

    { remaining:0, resetText:"" };




    const convertMaxAmount =

    typeof getConvertMaxAmount === "function"

    ?

    getConvertMaxAmount()

    :

    CONVERT_MAX_AMOUNT_BASE;




    let html = `

    <div class="contentCard">

    <h3>🎯 פעולות</h3>



    <div class="quickActionsRow">

        <button
        class="smallButton quickActionBtn"
        ${giftStatus.ready ? "" : "disabled"}
        onclick="claimCityGift()">

            ${giftStatus.ready ? "🎁 אסוף מתנה!" : "⏳ מתנה בעוד " + giftStatus.timeText}

        </button>

        <button
        class="smallButton quickActionBtn"
        ${(player.energy < BRIBE_ENERGY_COST || bribeStatus.remaining <= 0) ? "disabled" : ""}
        onclick="collectBribe()">

            ${
                bribeStatus.remaining <= 0
                ?
                "🖤 נגמר השוחד - עוד " + bribeStatus.resetText
                :
                "🖤 גבה שוחד (⚡" + BRIBE_ENERGY_COST + ") | " + bribeStatus.remaining + "/" + BRIBE_MAX_USES
            }

        </button>

    </div>



    <div class="ownedCard">

        <div class="ownedCardName">
            💱 המרת כסף לכסף שחור
        </div>

        <div class="ownedCardRow">
            סיכוי הצלחה: 1%-10% (עולה עם הסכום) | 200 ₪ = 1 🖤 בהצלחה
            <br>
            מקסימום ברמה שלך: ₪${convertMaxAmount.toLocaleString()}
            <br>
            אם ההמרה נכשלת, הכסף נעלם.
        </div>

        <input
        type="number"
        id="convertAmountInput"
        min="${CONVERT_MIN_AMOUNT}"
        max="${convertMaxAmount}"
        step="100"
        value="${CONVERT_MIN_AMOUNT}"
        class="convertInput">

        <button
        class="upgradeBtn"
        ${(convertStatus.remaining <= 0 || player.money < CONVERT_MIN_AMOUNT) ? "disabled" : ""}
        onclick="handleConvertClick()">

            ${
                convertStatus.remaining <= 0
                ?
                "💱 נגמרו ההמרות - עוד " + convertStatus.resetText
                :
                "💱 המר | נותרו " + convertStatus.remaining + "/" + CONVERT_MAX_USES
            }

        </button>

    </div>



    </div>

    `;




    content.innerHTML = html;


}









function renderCity(content){


    if(!player || !content){

        return;

    }








    const summary =

    getEmpireSummary();




    let html = `

    <div class="contentCard">

    <h3>🏙️ עיר WARDEAL</h3>



    <div class="cityStatsGrid">

        <div class="cityStatBox">
            🏠 נכסים
            <span>${summary.properties}</span>
        </div>

        <div class="cityStatBox">
            🏢 עסקים
            <span>${summary.businesses}</span>
        </div>

        <div class="cityStatBox">
            👥 יחידות
            <span>${summary.units}</span>
        </div>

        <div class="cityStatBox">
            📈 הכנסה/דקה
            <span>₪${summary.income}</span>
        </div>

    </div>



    <button
    class="smallButton"
    style="width:100%;margin-top:8px;max-width:none"
    onclick="triggerCityEvent(true)">

        📰 מה קורה בעיר?

    </button>



    <h4>📰 חדשות אחרונות</h4>

    `;








    if(cityNewsLog.length === 0){


        html += `
        <p class="cityNoNews">
            אין חדשות עדיין... משהו בטח יקרה בקרוב
        </p>
        `;


    }

    else{


        html += `<div class="cityNewsList">`;








        cityNewsLog.forEach(item=>{



            const sign =

            item.money > 0

            ?

            "+"

            :

            "";








            const cls =

            item.money > 0 || item.gold > 0 || item.diamonds > 0 || item.blackMoney > 0

            ?

            "cityNewsPositive"

            :

            (

                item.money < 0

                ?

                "cityNewsNegative"

                :

                ""

            );








            let amountHtml = "";

            if(item.money !== 0){
                amountHtml += `<span class="cityNewsAmount">${sign}₪${item.money}</span>`;
            }
            if(item.gold > 0){
                amountHtml += `<span class="cityNewsAmount">+${item.gold} 🥇</span>`;
            }
            if(item.diamonds > 0){
                amountHtml += `<span class="cityNewsAmount">+${item.diamonds} 💎</span>`;
            }
            if(item.blackMoney > 0){
                amountHtml += `<span class="cityNewsAmount">+${item.blackMoney} 🖤</span>`;
            }





            html += `
            <div class="cityNewsItem ${cls}">
                <span>${item.text}</span>
                ${amountHtml}
            </div>
            `;



        });








        html += `</div>`;


    }








    html += `</div>`;








    content.innerHTML = html;


}









// ==========================================
// הודעה בטוחה
// ==========================================

function showMessageSafeCity(message){


    if(typeof showMessage === "function"){

        showMessage(message);

    }


}









console.log(

    "WARDEAL CITY v0.1.0 READY"

);
