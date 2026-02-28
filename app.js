let myName = "";

// 학생 입장
function join(){
  myName = document.getElementById("name").value;
  if(!myName) return alert("이름 입력!");
  db.ref("students/"+myName).set(true);
}

// 교사 게임 시작
function startGame(type){
  db.ref("game").set({
    type:type,
    time:Date.now()
  });
  let status = document.getElementById("status");
  if(status) status.innerText = type + " 실행중";
}

// 학생 반응
function reactionClick(){
  db.ref("reaction/"+myName).set(Date.now());
}

// 게임 감지
db.ref("game").on("value", function(snapshot){
  let data = snapshot.val();
  if(!data) return;

  let area = document.getElementById("gameArea");
  let btn = document.getElementById("reactionBtn");

  if(!area) return; // 교사 화면이면 무시

  if(data.type === "random"){
    db.ref("students").once("value", snap=>{
      let list = snap.val();
      if(!list) return;
      let names = Object.keys(list);
      let pick = names[Math.floor(Math.random()*names.length)];
      area.innerHTML = "🎤 발표자: "+pick;
    });
  }

  if(data.type === "reaction"){
    area.innerHTML = "⚡ 가장 빨리 누르세요!";
    btn.style.display = "block";

    setTimeout(()=>{
      db.ref("reaction").once("value", snap=>{
        let data = snap.val();
        if(!data) return;
        let winner = Object.keys(data).sort((a,b)=>data[a]-data[b])[0];
        area.innerHTML = "🏆 승자: "+winner;
        btn.style.display = "none";
      });
    },3000);
  }
});
