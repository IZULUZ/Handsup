let myNumber = null;

/* ======================
   학생 입장
====================== */
function join(){
  const number = document.getElementById("numberSelect").value;
  if(!number) return alert("번호 선택!");

  myNumber = number;

  db.ref("students/"+number).set({
    joined:true,
    finished:false
  });

  document.getElementById("status").innerText = "게임 대기 중...";
}

/* ======================
   교사 - 실시간 학생 목록
====================== */
if(document.getElementById("studentList")){
  db.ref("students").on("value", snapshot=>{
    const data = snapshot.val();
    const listDiv = document.getElementById("studentList");
    const countSpan = document.getElementById("count");

    if(!data){
      listDiv.innerText = "없음";
      countSpan.innerText = 0;
      return;
    }

    const numbers = Object.keys(data);
    listDiv.innerText = numbers.join(", ");
    countSpan.innerText = numbers.length;
  });
}

/* ======================
   게임 시작
====================== */
function startReactionGame(){
  db.ref("game").set({
    active:true,
    type:"reaction",
    winner:null
  });

  db.ref("reaction").remove();
  db.ref("students").once("value", snap=>{
    snap.forEach(child=>{
      db.ref("students/"+child.key+"/finished").set(false);
    });
  });
}

/* ======================
   학생 - 게임 감지
====================== */
db.ref("game").on("value", snapshot=>{
  const game = snapshot.val();
  const status = document.getElementById("status");
  const btn = document.getElementById("reactionBtn");

  if(!status) return;

  if(!game || !game.active){
    status.innerText = "게임 대기 중...";
    btn.style.display="none";
    return;
  }

  if(game.type === "reaction"){
    status.innerText = "⚡ 가장 빨리 누르세요!";
    btn.style.display="inline-block";
  }

  if(game.winner){
    status.innerText = "🏆 "+game.winner+"번 승리!";
    btn.style.display="none";
  }
});

/* ======================
   학생 클릭
====================== */
function clickReaction(){
  if(!myNumber) return;

  db.ref("game").once("value", snap=>{
    const game = snap.val();
    if(!game || game.winner) return;

    db.ref("game/winner").set(myNumber);
    db.ref("students/"+myNumber+"/finished").set(true);
  });
}

/* ======================
   교사 - 승자 감지
====================== */
if(document.getElementById("winner")){
  db.ref("game/winner").on("value", snapshot=>{
    const winner = snapshot.val();
    if(winner){
      document.getElementById("winner").innerText = winner+"번";
    }
  });
}

/* ======================
   리셋
====================== */
function resetGame(){
  db.ref("game").remove();
  db.ref("reaction").remove();
  db.ref("students").remove();
}
