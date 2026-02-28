let studentNumber = null;
let missionStartTime = null;

function enterGame() {
  studentNumber = document.getElementById("numberInput").value;
  if (!studentNumber) return;

  // Presence 등록
  const myRef = PRESENCE_REF.child(studentNumber);
  myRef.set(true);
  myRef.onDisconnect().remove();

  document.getElementById("login").classList.add("hidden");
  document.getElementById("waiting").classList.remove("hidden");
}

// 🔥 미션 감지
GAME_REF.on("value", snapshot => {
  const data = snapshot.val();
  if (!data || !studentNumber) return;

  if (data.status === "playing") {
    missionStartTime = data.missionStartTime;
    startGame(data.mission);
  }
});

function startGame(type) {
  document.getElementById("waiting").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  const area = document.getElementById("gameArea");
  area.innerHTML = "";

  if (type === 1) wordGame(area);
  if (type === 2) gaugeGame(area);
  if (type === 3) movingButtonGame(area);
}

function submitResult() {
  const time = Date.now() - missionStartTime;

  RESULT_REF.child(studentNumber).set({
    number: studentNumber,
    time: time
  });

  document.getElementById("gameArea").innerHTML = "<h2>제출 완료!</h2>";
}

/* ====== 미니게임 ====== */

function wordGame(area) {
  for (let i=0;i<16;i++){
    const btn = document.createElement("button");
    btn.className="game-btn";

    if(i===0){
      btn.innerText="발표";
      btn.onclick=submitResult;
    }else{
      btn.innerText=["발펴","발표우","발표ㅜ"][Math.floor(Math.random()*3)];
    }
    area.appendChild(btn);
  }
}

function gaugeGame(area){
  let gauge=0;
  const btn=document.createElement("button");
  btn.innerText="연타!";
  btn.className="big-btn";
  btn.onclick=()=>{
    gauge+=10;
    if(gauge>=100){
      submitResult();
    }
  };
  area.appendChild(btn);
}

function movingButtonGame(area){
  const btn=document.createElement("button");
  btn.innerText="발표";
  btn.className="moving-btn";
  area.appendChild(btn);

  const interval=setInterval(()=>{
    btn.style.left=Math.random()*80+"%";
    btn.style.top=Math.random()*60+"%";
  },600);

  btn.onclick=()=>{
    clearInterval(interval);
    submitResult();
  };
}
