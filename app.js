const DEFAULT_DATA={"`": {"normal": "`", "shift": "ြ"}, "1": {"normal": "၁", "shift": "ဘျုးး"}, "2": {"normal": "၂", "shift": "@"}, "3": {"normal": "၃", "shift": "#"}, "4": {"normal": "၄", "shift": "$"}, "5": {"normal": "၅", "shift": "ၡ"}, "6": {"normal": "၆", "shift": "฿"}, "7": {"normal": "၇", "shift": "ရ"}, "8": {"normal": "၈", "shift": "ဂ"}, "9": {"normal": "၉", "shift": "("}, "0": {"normal": "၀", "shift": ")"}, "-": {"normal": "-", "shift": "_"}, "=": {"normal": "=", "shift": ""}, "Q": {"normal": "ဆ", "shift": "ဆ"}, "W": {"normal": "တ", "shift": "ဝ"}, "E": {"normal": "န", "shift": "န"}, "R": {"normal": "မ", "shift": "ၤ"}, "T": {"normal": "အ", "shift": "ကြၢးၢး"}, "Y": {"normal": "ပ", "shift": "လီၤ"}, "U": {"normal": "က", "shift": "က"}, "I": {"normal": "င", "shift": "."}, "O": {"normal": "သ", "shift": ""}, "P": {"normal": "စ", "shift": "ကၠိ"}, "[": {"normal": "ဟ", "shift": "ဧ"}, "]": {"normal": "သ", "shift": "ြ"}, "\\": {"normal": "\\", "shift": "|"}, "A": {"normal": "", "shift": "ပှၤ"}, "S": {"normal": "ျ", "shift": ""}, "D": {"normal": "", "shift": ""}, "F": {"normal": "", "shift": ""}, "G": {"normal": "", "shift": ""}, "H": {"normal": "", "shift": ""}, "J": {"normal": "", "shift": ""}, "K": {"normal": "", "shift": ""}, "L": {"normal": "", "shift": ""}, ";": {"normal": "း", "shift": ""}, "'": {"normal": "ဒ", "shift": "“"}, "Z": {"normal": "ဖ", "shift": "ဖ"}, "X": {"normal": "ထ", "shift": "ၢ"}, "C": {"normal": "ခ", "shift": "ဃ"}, "V": {"normal": "လ", "shift": "ျ့"}, "B": {"normal": "ဘ", "shift": "ယ"}, "N": {"normal": "ည", "shift": "က့ၢ်"}, "M": {"normal": "ာ်", "shift": "န့"}, ",": {"normal": "ယ", "shift": ","}, ".": {"normal": "ၣ်", "shift": "ၢ်"}, "/": {"normal": "ဆ", "shift": "?"}};
const CURRICULUM={"consonants": ["က", "ခ", "ဂ", "ဃ", "င", "စ", "ဆ", "ၡ", "ည", "တ", "ထ", "ဒ", "န", "ပ", "ဖ", "ဘ", "မ", "ယ", "ရ", "လ", "၀", "သ", "ဟ", "အ", "ဧ"], "marks": ["ါ", "ံ", "ၢ", "ု", "ူ", "့", "ဲ", "ိ", "ီ", "ၢ်", "ၣ်", "း", "ာ်", "ၤ", "ၠ", "ျ", "ှ", "ြ", "ွ", "်"], "two_blends": ["ကါ", "ခါ", "ခံ"], "three_blends": ["ကျါ", "ပှၤ", "ညွံ"], "four_blends": [], "source_note": "Consonants, marks, and example blends are user-specified in the project conversation. Keyboard mapping is based on the uploaded KL Keyboard Layout.pdf."};
let mapping=JSON.parse(JSON.stringify(DEFAULT_DATA));
let stats=JSON.parse(localStorage.getItem("karenAcademy.v2")||"null")||{
  xp:0,stars:0,coins:0,hearts:5,streak:0,total:0,correct:0,bestCpm:0,
  attempts:{},daily:{},badges:{},level:1,lastPlay:""
};
let leaderboard=JSON.parse(localStorage.getItem("karenAcademy.leaderboard")||"[]");
let currentTarget="",learnKey="",practiceType="consonants",practiceTarget="",practiceStarted=0,practiceRunning=false;
let learnShift=false,shiftOn=false,capsOn=false,keyboardOn=true,activeTextTarget=null;
const aliasToMapping={}; const codeToKey={};
Object.keys(mapping).forEach(k=>aliasToMapping[k]=k);
Object.assign(codeToKey,{Backquote:"`",Digit1:"1",Digit2:"2",Digit3:"3",Digit4:"4",Digit5:"5",Digit6:"6",Digit7:"7",Digit8:"8",Digit9:"9",Digit0:"0",Minus:"-",Equal:"=",KeyQ:"Q",KeyW:"W",KeyE:"E",KeyR:"R",KeyT:"T",KeyY:"Y",KeyU:"U",KeyI:"I",KeyO:"O",KeyP:"P",BracketLeft:"[",BracketRight:"]",Backslash:"\\",KeyA:"A",KeyS:"S",KeyD:"D",KeyF:"F",KeyG:"G",KeyH:"H",KeyJ:"J",KeyK:"K",KeyL:"L",Semicolon:";",Quote:"'",KeyZ:"Z",KeyX:"X",KeyC:"C",KeyV:"V",KeyB:"B",KeyN:"N",KeyM:"M",Comma:",",Period:".",Slash:"/",Space:"SPACE"});

let huntRunning=false,huntItem=null,huntScore=0,huntStreak=0,huntLives=3;
let sprintRunning=false,sprintEnd=0,sprintCount=0,sprintTotal=0,sprintStart=0,sprintExpected=null;
let memorySeq="",memoryRound=0,memoryBest=0;
let fallRunning=false,fallScore=0,fallMiss=0,fallItems=[],fallLast=0,fallAnim=0;
const $=id=>document.getElementById(id);
const normalEntries=()=>Object.entries(mapping).filter(([k,v])=>v.normal).map(([key,v])=>({key,char:v.normal}));
const todayKey=()=>new Date().toISOString().slice(0,10);
function save(){localStorage.setItem("karenAcademy.v2",JSON.stringify(stats));updateUI()}
function rand(a){return a[Math.floor(Math.random()*a.length)]}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function accuracy(){return stats.total?Math.round(stats.correct/stats.total*100):100}
function addReward(xp=0,stars=0,coins=0){stats.xp+=xp;stats.stars+=stars;stats.coins+=coins;checkLevel();checkBadges();save()}
function checkLevel(){stats.level=Math.max(1,Math.floor(stats.xp/100)+1)}
function record(ok,key=""){stats.total++;if(ok){stats.correct++;if(key){stats.attempts[key]=Math.max(0,(stats.attempts[key]||0)-1)}}else if(key){stats.attempts[key]=(stats.attempts[key]||0)+1}checkBadges();save()}
function dailyDone(){return stats.daily[todayKey()]?.done}
function updateUI(){
  $("stars").textContent=stats.stars;$("hearts").textContent=stats.hearts;$("coins").textContent=stats.coins;$("streak").textContent=stats.streak;$("level").textContent=stats.level;
  $("statStars").textContent=stats.stars;$("statCoins").textContent=stats.coins;$("statStreak").textContent=stats.streak;$("statBadges").textContent=Object.keys(stats.badges).length;
  $("homeXp").textContent=stats.xp;$("nextXp").textContent=stats.level*100;$("levelTitle").textContent="Level "+stats.level;$("badgeCount").textContent=Object.keys(stats.badges).length;
  $("xpFill").style.width=Math.min(100,(stats.xp%100))+"%";
  renderBadges();renderWeak();renderLeaderboard();renderDailySummary();
}
const BADGES=[
  ["first","🌱","First Step","Complete your first practice."],
  ["accuracy","🎯","Sharp Shooter","Reach 95% accuracy."],
  ["speed","⚡","Speed Typist","Reach 40 CPM."],
  ["keys","⌨️","Key Explorer","Practice 10 different keys."],
  ["stars","⭐","Star Collector","Earn 100 stars."],
  ["streak","🔥","On Fire","Reach a 7-day streak."],
  ["blend","🧩","Blend Builder","Complete a blend practice."],
  ["daily","📅","Daily Hero","Complete a daily challenge."],
  ["level10","🏆","Level 10","Reach level 10."]
];
function checkBadges(){
  const conditions={first:stats.total>0,accuracy:accuracy()>=95,speed:stats.bestCpm>=40,keys:Object.keys(stats.attempts).length>=10,stars:stats.stars>=100,streak:stats.streak>=7,blend:stats.xp>=30,daily:Object.values(stats.daily).some(x=>x.done),level10:stats.level>=10};
  BADGES.forEach(([id])=>{if(conditions[id])stats.badges[id]=true});
}
function renderBadges(){$("badges").innerHTML=BADGES.map(([id,icon,name,desc])=>`<div class="badge ${stats.badges[id]?"":"locked"}"><div class="badge-icon">${icon}</div><b>${name}</b><div class="muted">${desc}</div></div>`).join("")}
function renderWeak(){const w=Object.entries(stats.attempts).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]).slice(0,10);$("weakKeys").innerHTML=w.length?w.map(([k,n])=>`<span class="chip">${esc(k)} <small>×${n}</small></span>`).join(""):"<span class='muted'>No weak keys yet — keep practicing!</span>"}
function switchPage(name){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===name));document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.page===name));if(name==="daily")setupDaily()}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>switchPage(b.dataset.page));

const rows=[
 {cls:"",keys:[["`",""],["1",""],["2",""],["3",""],["4",""],["5",""],["6",""],["7",""],["8",""],["9",""],["0",""],["-",""],["=",""],["BACKSPACE","Backspace","backspace"]]},
 {cls:"",keys:[["TAB","Tab","tab"],["Q","Q"],["W","W"],["E","E"],["R","R"],["T","T"],["Y","Y"],["U","U"],["I","I"],["O","O"],["P","P"],["[","["],["]","]"],["\\","\\"]]},
 {cls:"",keys:[["CAPS","Caps Lock","caps"],["A","A"],["S","S"],["D","D"],["F","F"],["G","G"],["H","H"],["J","J"],["K","K"],["L","L"],[";",";"],["'","'"],["ENTER","Enter","enter"]]},
 {cls:"",keys:[["SHIFT","Shift","shiftkey"],["Z","Z"],["X","X"],["C","C"],["V","V"],["B","B"],["N","N"],["M","M"],[",",","],[".","."],["/","/"],["SHIFT","Shift","shiftkey"]]},
 {cls:"",keys:[["CTRL","Ctrl","special"],["ALT","Alt","special"],["SPACE","Space","space"],["ALT","Alt","special"],["FN","Fn","special"],["MENU","☰","special"],["CTRL","Ctrl","special"]]}
];
function fingerFor(k){const m={Q:"Left pinky",A:"Left pinky",Z:"Left pinky",W:"Left ring",S:"Left ring",X:"Left ring",E:"Left middle",D:"Left middle",C:"Left middle",R:"Left index",F:"Left index",V:"Left index",T:"Left index",G:"Left index",B:"Left index",Y:"Right index",H:"Right index",N:"Right index",U:"Right index",J:"Right index",M:"Right index",I:"Right middle",K:"Right middle",",":"Right middle",O:"Right ring",L:"Right ring",".":"Right ring",P:"Right pinky",";":"Right pinky","/":"Right pinky","[":"Right pinky","]":"Right pinky"};return m[k]||"Thumb / special key";}
function updateKeyboardVisual(){document.querySelectorAll('.key').forEach(el=>el.classList.toggle('shift-on',shiftOn));if($('shiftToggle'))$('shiftToggle').textContent=`⇧ Shift: ${shiftOn?'ON':'OFF'}`;if($('capsToggle'))$('capsToggle').textContent=`⇪ Caps: ${capsOn?'ON':'OFF'}`;if($('keyboardToggle'))$('keyboardToggle').textContent=`Keyboard: ${keyboardOn?'ON':'OFF'}`;if($('keyboardStatus'))$('keyboardStatus').innerHTML=`⌨️ Karen Literacy Keyboard: <b>${keyboardOn?'ON':'OFF'}</b>`;if($('shiftIndicator'))$('shiftIndicator').textContent=shiftOn?'⇧ Shift ON':'⇧ Shift OFF';}
function setShift(on){shiftOn=!!on;updateKeyboardVisual()}
function getMappedChar(id,useShift=false){const key=aliasToMapping[id]||id,m=mapping[key];if(!m)return '';return (useShift||shiftOn||capsOn)?(m.shift||''):(m.normal||'');}
function renderKeyboard(){$('keyboardLearn').innerHTML=rows.map(row=>`<div class="keyrow">${row.keys.map(([id,label,cls=""])=>{const k=aliasToMapping[id]||id,m=mapping[k]||{normal:'',shift:''},special=['BACKSPACE','TAB','CAPS','ENTER','SHIFT','CTRL','META','ALT','SPACE','FN','MENU'].includes(id);return `<div class="key ${special?'special':''} ${cls}" data-key="${esc(id)}"><div class="shift ${m.shift?'':'dim'}">${esc(m.shift||'')}</div><div class="char">${esc(m.normal||label)}</div><div class="label">${esc(label)}</div></div>`}).join('')}</div>`).join('');document.querySelectorAll('.key').forEach(el=>el.onclick=()=>onVirtualKey(el.dataset.key));updateKeyboardVisual();}
function insertKarenChar(ch){if(!ch)return;const el=activeTextTarget||$('typingBox');if(!el)return;const a=el.selectionStart,b=el.selectionEnd;el.setRangeText(ch,a,b,'end');el.dispatchEvent(new Event('input',{bubbles:true}));el.focus();}
function backspace(){const el=activeTextTarget||$('typingBox');if(!el)return;const a=el.selectionStart,b=el.selectionEnd;if(a!==b)el.setRangeText('',a,b,'end');else if(a>0)el.setRangeText('',a-1,a,'end');el.dispatchEvent(new Event('input',{bubbles:true}));el.focus();}
function onVirtualKey(id){if(id==='SHIFT'){setShift(!shiftOn);return}if(id==='CAPS'){capsOn=!capsOn;updateKeyboardVisual();return}if(id==='BACKSPACE'){backspace();return}if(id==='ENTER'){insertKarenChar('\n');return}if(id==='SPACE'){insertKarenChar(' ');return}if(['TAB','CTRL','META','ALT','FN','MENU'].includes(id))return;const ch=getMappedChar(id,shiftOn||capsOn);if(ch)insertKarenChar(ch);if(shiftOn)setShift(false);}
function newLearn(){const candidates=[];Object.entries(mapping).forEach(([key,v])=>{if(v.normal)candidates.push({key,char:v.normal,shift:false});if(v.shift)candidates.push({key,char:v.shift,shift:true})});const item=rand(candidates);currentTarget=item.char;learnKey=item.key;learnShift=item.shift;$('learnTarget').textContent=currentTarget;$('learnHint').textContent=item.shift?'Use Shift + the highlighted key.':'Press the key without Shift.';$('fingerHint').textContent='Finger: '+fingerFor(item.key);setShift(item.shift);document.querySelectorAll('.key').forEach(x=>x.classList.remove('active','correct','wrong','finger'));const el=[...document.querySelectorAll('.key')].find(x=>x.dataset.key===learnKey);if(el&&$('showMap').checked)el.classList.add('active','finger');}
function handleKey(id,shift=false){const ok=id===learnKey && !!shift===!!learnShift;document.querySelectorAll('.key').forEach(x=>x.classList.remove('correct','wrong'));const el=[...document.querySelectorAll('.key')].find(x=>x.dataset.key===id);if(el)el.classList.add(ok?'correct':'wrong');record(ok,id);if(ok){addReward(2,1,1);$('learnHint').textContent='✓ Correct!';setTimeout(newLearn,420)}else $('learnHint').textContent=learnShift?'Try Shift + the highlighted key.':'Try the key without Shift.';}
document.addEventListener('keydown',e=>{if(e.key==='Shift'){if(!e.repeat){shiftOn=true;updateKeyboardVisual()}return}if(e.key==='CapsLock'){e.preventDefault();capsOn=!capsOn;updateKeyboardVisual();return}if(e.ctrlKey||e.altKey||e.metaKey)return;const id=codeToKey[e.code];if(!id)return;const focused=e.target&&(e.target.id==='typingBox'||e.target.tagName==='TEXTAREA'||e.target.tagName==='INPUT');if(keyboardOn&&focused){if(['BACKSPACE','DELETE','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;if(id==='SPACE'||mapping[id]){e.preventDefault();const ch=id==='SPACE'?' ':getMappedChar(id,e.shiftKey||shiftOn||capsOn);if(ch)insertKarenChar(ch);if(shiftOn&&!e.shiftKey)setShift(false);return}}if(!e.repeat&&document.activeElement!==$('typingBox')){if(learnKey)handleKey(id,e.shiftKey||shiftOn);if(huntRunning)huntPress(id,e.shiftKey||shiftOn);if(sprintRunning)sprintPress(id,e.shiftKey||shiftOn);if(fallRunning)fallPress(id,e.shiftKey||shiftOn);}});
document.addEventListener('keyup',e=>{if(e.key==='Shift'&&!capsOn)setShift(false)});
$('shiftToggle').onclick=()=>{setShift(!shiftOn);$('typingBox').focus()};$('capsToggle').onclick=()=>{capsOn=!capsOn;updateKeyboardVisual();$('typingBox').focus()};$('keyboardToggle').onclick=()=>{keyboardOn=!keyboardOn;updateKeyboardVisual()};document.addEventListener('focusin',e=>{if(e.target&&(e.target.id==='typingBox'||e.target.tagName==='TEXTAREA'||e.target.tagName==='INPUT'))activeTextTarget=e.target});

function buildFour(){ // Four typed units: consonant + mark + cluster + tone, generated from the user's character sets.
 const out=[];const cs=CURRICULUM.consonants, ms=CURRICULUM.marks;
 for(let i=0;i<12;i++){const c=cs[i%cs.length],m=ms[(i*3)%ms.length],cl=ms[14+(i%5)],tone=ms[9+(i%5)];out.push(c+m+cl+tone)}
 return out;
}
function wordsFromLayout(){return ["ဘျုးး","လီၤ","ကြၢးၢး","ကၠိ","ပှၤ","က့ၢ်","န့","ာ်","ၢ်","ၣ်","ဘ","က","င","မ","န","ရ","ဆ","သ"]}
function sentenceList(){return ["ကါ ခါ ခံ","ကျါ ပှၤ ညွံ","ဘျုးး လီၤ","ကၠိ ပှၤ"];}

function poolFor(type){
 if(type==="consonants")return CURRICULUM.consonants;
 if(type==="marks")return CURRICULUM.marks;
 if(type==="two")return CURRICULUM.two_blends;
 if(type==="three")return CURRICULUM.three_blends;
 if(type==="four")return buildFour();
 if(type==="words")return wordsFromLayout();
 return sentenceList();
}
function startPractice(type){practiceType=type||"consonants";document.querySelectorAll(".practice-option").forEach(b=>b.classList.toggle("active",b.dataset.type===practiceType));switchPage("practice");makePractice()}
document.querySelectorAll(".practice-option").forEach(b=>b.onclick=()=>startPractice(b.dataset.type));
function makePractice(){
 const pool=poolFor(practiceType);const n=practiceType==="consonants"?20:practiceType==="marks"?20:practiceType==="four"?10:practiceType==="words"?8:practiceType==="sentences"?4:pool.length;
 let arr=[];for(let i=0;i<n;i++)arr.push(rand(pool));practiceTarget=practiceType==="sentences"?arr.join("  "):arr.join(" ");
 $("practiceTitle").textContent={consonants:"Consonants",marks:"Vowels, tones & marks",two:"2-unit blends",three:"3-unit blends",four:"4-unit blends",words:"Words",sentences:"Sentences"}[practiceType];
 $("practiceLevel").textContent="Level "+Math.max(1,Math.ceil((pool.length<=3?1:pool.length<=20?2:3)));$("practiceCounter").textContent="0 / "+practiceTarget.length;$("prompt").textContent=practiceTarget;$("typingBox").value="";$("practiceProgress").style.width="0%";$("pAccuracy").textContent="100%";$("pSpeed").textContent="0";$("rewardLine").textContent="Complete the drill to earn XP + stars + coins.";practiceStarted=performance.now();practiceRunning=true;$("typingBox").focus();
}
function updatePracticeStats(){
 const typed=$("typingBox").value;let correct=0;
 for(let i=0;i<typed.length;i++)if(typed[i]===practiceTarget[i])correct++;
 $("practiceCounter").textContent=Math.min(typed.length,practiceTarget.length)+" / "+practiceTarget.length;
 $("practiceProgress").style.width=Math.min(100,typed.length/practiceTarget.length*100)+"%";
 $("pAccuracy").textContent=(typed.length?Math.round(correct/typed.length*100):100)+"%";
 const mins=Math.max(.01,(performance.now()-practiceStarted)/60000);const cpm=Math.round(correct/mins);$("pSpeed").textContent=cpm;
 if(typed.length>=practiceTarget.length){
   practiceRunning=false;const acc=Math.round(correct/practiceTarget.length*100);stats.bestCpm=Math.max(stats.bestCpm,cpm);
   stats.streak=Math.max(stats.streak,1);stats.lastPlay=todayKey();let stars=acc>=95?5:acc>=85?3:1;let coins=stars*2;addReward(20,stars,coins);
   $("rewardLine").textContent=`🎉 Complete! +20 XP  +${stars} ⭐  +${coins} 🪙  | Accuracy ${acc}%`;
 }
}
$('typingBox').addEventListener('input',updatePracticeStats);

function startHunt(){huntRunning=true;huntScore=0;huntStreak=0;huntLives=3;nextHunt();renderHunt();$("startHunt").textContent="Restart"}
function nextHunt(){huntItem=rand(normalEntries());$("huntTarget").textContent=huntItem.char}
function renderHunt(){$("huntScore").textContent=huntScore;$("huntStreak").textContent=huntStreak;$("huntLives").textContent=huntLives}
function huntPress(k){if(!huntRunning)return;let ok=k===huntItem.key;record(ok,k);if(ok){huntScore+=10+huntStreak;huntStreak++;addReward(3,1,1);nextHunt()}else{huntStreak=0;huntLives--;if(huntLives<=0){huntRunning=false;addReward(huntScore,Math.floor(huntScore/50),Math.floor(huntScore/20));$("startHunt").textContent="Play Again"}}renderHunt()}
$("startHunt").onclick=startHunt;

function startSprint(){sprintRunning=true;sprintCount=0;sprintTotal=0;sprintStart=performance.now();sprintEnd=Date.now()+30000;nextSprint();$("startSprint").textContent="Running…";requestAnimationFrame(sprintTick)}
function nextSprint(){sprintExpected=rand(normalEntries());$("sprintPrompt").textContent=sprintExpected.char}
function sprintTick(){if(!sprintRunning)return;let left=Math.max(0,sprintEnd-Date.now());$("timer").textContent=Math.ceil(left/1000);if(left<=0){sprintRunning=false;let mins=(performance.now()-sprintStart)/60000,cpm=Math.round(sprintCount/mins);stats.bestCpm=Math.max(stats.bestCpm,cpm);addReward(Math.min(50,sprintCount),Math.max(1,Math.floor(cpm/15)),Math.max(1,Math.floor(cpm/5)));$("sprintCpm").textContent=cpm;$("startSprint").textContent="Start Sprint";return}requestAnimationFrame(sprintTick)}
function sprintPress(k){if(!sprintRunning)return;sprintTotal++;if(k===sprintExpected.key){sprintCount++;record(true,k);nextSprint()}else record(false,k);$("sprintAcc").textContent=Math.round(sprintCount/sprintTotal*100)+"%"}
$("startSprint").onclick=startSprint;

function startMemory(){memoryRound=1;nextMemory()}
function nextMemory(){const n=Math.min(3+memoryRound,10);memorySeq=Array.from({length:n},()=>rand(normalEntries()).char).join("");$("memoryRound").textContent=memoryRound;$("memorySequence").textContent=memorySeq;$("memoryInput").value="";$("memoryInput").disabled=true;setTimeout(()=>{$("memorySequence").textContent="⌨️ Type the sequence";$("memoryInput").disabled=false;$("memoryInput").focus()},900+memoryRound*100)}
$("memoryInput").oninput=()=>{if($("memoryInput").value.length>=memorySeq.length){if($("memoryInput").value===memorySeq){memoryBest=Math.max(memoryBest,memoryRound);addReward(memoryRound*5,2,3);memoryRound++;setTimeout(nextMemory,350)}else{$("memorySequence").textContent="❌ Try again";stats.hearts=Math.max(0,stats.hearts-1);save();$("memoryInput").value=""}}}
$("startMemory").onclick=startMemory;

const canvas=$("fallCanvas"),ctx=canvas.getContext("2d");
function startFall(){fallRunning=true;fallScore=0;fallMiss=0;fallItems=[];fallLast=performance.now();$("startFall").textContent="Running…";cancelAnimationFrame(fallAnim);fallLoop(performance.now())}
function fallLoop(t){if(!fallRunning)return;ctx.clearRect(0,0,canvas.width,canvas.height);if(t-fallLast>800){let it=rand(normalEntries());fallItems.push({x:40+Math.random()*(canvas.width-80),y:-25,v:.8+Math.random()*1.2,key:it.key,char:it.char});fallLast=t}ctx.fillStyle="#fff";ctx.font="900 34px system-ui";fallItems.forEach(it=>{it.v+=.005;it.y+=it.v*2;ctx.fillText(it.char,it.x,it.y)});fallItems=fallItems.filter(it=>{if(it.y>canvas.height+20){fallMiss++;return false}return true});$("fallScore").textContent=fallScore;$("fallMiss").textContent=fallMiss;if(fallMiss>=5){fallRunning=false;$("startFall").textContent="Start Falling Game";addReward(fallScore,Math.floor(fallScore/40),Math.floor(fallScore/20))}else fallAnim=requestAnimationFrame(fallLoop)}
function fallPress(k){if(!fallRunning)return;let i=fallItems.findIndex(it=>it.key===k);if(i>=0){fallScore+=10;fallItems.splice(i,1);record(true,k);addReward(1,0,1)}else record(false,k)}
$("startFall").onclick=startFall;

function dailyTask(){
 const seed=todayKey().replaceAll("-","");let n=0;for(const c of seed)n=(n*31+c.charCodeAt(0))%100000;
 const types=["consonants","marks","two","three","words"];return types[n%types.length]
}
function renderDailySummary(){const done=dailyDone();$("dailySummary").innerHTML=done?"✅ Completed today!<br>Come back tomorrow for a new challenge.":"🎯 Today: "+dailyTask()+"<br>Reward: ⭐ 10 + 🪙 10 + XP 50";$("dailyStatus").textContent=done?"Completed — great job!":"Complete today's challenge for bonus rewards."}
function setupDaily(){const type=dailyTask();$("dailyTitle").textContent="Today's "+({consonants:"Consonant",marks:"Marks",two:"2-Unit Blend",three:"3-Unit Blend",words:"Word"}[type])+" Challenge";$("dailyTask").textContent=type==="consonants"?"Type 15 consonants with 90% accuracy.":type==="marks"?"Type 15 vowels/tones/marks with 90% accuracy.":type==="two"?"Complete the 2-unit blend drill.":type==="three"?"Complete the 3-unit blend drill.":"Type 8 Karen words with 90% accuracy.";renderDailySummary()}
$("startDaily").onclick=()=>{if(dailyDone())return;startPractice(dailyTask());const old=practiceType;setTimeout(()=>{ // mark when this drill is completed by wrapping completion check
  const check=setInterval(()=>{if(!practiceRunning){clearInterval(check);stats.daily[todayKey()]={done:true,type:old};stats.streak=(stats.streak||0)+1;addReward(50,10,10);setupDaily();}},250)},100)}
$("homeDaily").onclick=()=>switchPage("daily");

function renderLeaderboard(){
 const rows=[...leaderboard].sort((a,b)=>b.score-a.score).slice(0,10);$("leaderRows").innerHTML=rows.length?rows.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.name)}</td><td>${r.score}</td><td>${r.acc}%</td><td>${r.level}</td><td>${r.date}</td></tr>`).join(""):`<tr><td colspan="6" class="muted">No scores yet.</td></tr>`;
}
$("saveScore").onclick=()=>{const name=$("playerName").value.trim()||"Player";leaderboard.push({name,score:stats.xp+stats.stars*5+stats.coins,acc:accuracy(),level:stats.level,date:todayKey()});localStorage.setItem("karenAcademy.leaderboard",JSON.stringify(leaderboard));renderLeaderboard();$("playerName").value=""}
$("clearLeaderboard").onclick=()=>{if(confirm("Clear local leaderboard?")){leaderboard=[];localStorage.removeItem("karenAcademy.leaderboard");renderLeaderboard()}}

$("downloadCsv").onclick=()=>{let rows=[["key","normal","shift"],...Object.entries(mapping).map(([k,v])=>[k,v.normal,v.shift])];let csv=rows.map(r=>r.map(x=>`"${String(x).replaceAll('"','""')}"`).join(",")).join("\n");let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="keyboard.csv";a.click()}
$("csvInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const lines=r.result.split(/\r?\n/).filter(Boolean);const out={};for(let i=1;i<lines.length;i++){const parts=lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(x=>x.replace(/^"|"$/g,"").replaceAll('""','"'));if(parts[0])out[parts[0]]={normal:parts[1]||"",shift:parts[2]||""}}mapping={...mapping,...out};renderKeyboard();newLearn();alert("Keyboard mapping loaded for this browser session.")};r.readAsText(f,"utf-8")}
$("exportProgress").onclick=()=>{let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(stats,null,2)],{type:"application/json"}));a.download="karen-keyboard-progress.json";a.click()}
$("progressInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{stats=JSON.parse(r.result);save();alert("Progress imported.")}catch{alert("Invalid progress file.")}};r.readAsText(f)}

renderKeyboard();newLearn();makePractice();updateUI();setupDaily();
