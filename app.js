let myNumber = null;

/* 학생 입장 */
function join(){
  const num = document.getElementById("numberSelect").value;
  if(!num) return alert("번호 선택!");

  myNumber = num;

  db.ref("students/"+num).set({
    joined:true
  });

  document.getElementById("joinScreen").style.display="none";
  document.getElementById("waitingScreen").style.display="block";
}

/* 교사 실시간 학생 목록 */
if(document.getElementById("studentGrid")){
  db.ref("students").on("value", snap=>{
    const data = snap.val();
    const grid = document.getElementById("studentGrid");
    const count = document.getElementById("count");

    grid.innerHTML="";
    if(!data){
      count.innerText=0;
      return;
    }

    const nums = Object.keys(data);
    nums.forEach(n=>{
      const div = document.createElement("div");
      div.className="student-card";
      div.innerText=n+"번";
      grid.appendChild(div);
    });

    count.innerText=nums.length;
  });
}

/* 게임 시작 */
function startReactionGame(){
  db.ref("game").set({
    active:true,
    winner:null
  });
}

/* 학생 화면 게임 감지 */
db.ref("game").on("value", snap=>{
  const game = snap.val();

  const waiting = document.getElementById("waitingScreen");
  const gameScreen = document.getElementById("gameScreen");
  const result = document.getElementById("resultDisplay");

  if(!waiting) return;

  if(!game || !game.active){
    waiting.style.display="block";
    gameScreen.style.display="none";
    return;
  }

  if(game.winner){
    waiting.style.display="none";
    gameScreen.style.display="none";
    result.innerText="🏆 "+game.winner+"번 승리!";
    return;
  }

  waiting.style.display="none";
  gameScreen.style.display="block";
});

/* 학생 클릭 */
function clickReaction(){
  if(!myNumber) return;

  db.ref("game").once("value", snap=>{
    const game = snap.val();
    if(!game.winner){
      db.ref("game/winner").set(myNumber);
    }
  });
}

/* 교사 승자 표시 */
if(document.getElementById("winnerDisplay")){
  db.ref("game/winner").on("value", snap=>{
    const w = snap.val();
    if(w){
      document.getElementById("winnerDisplay").innerText="🏆 "+w+"번 승리!";
    }
  });
}

/* 리셋 */
function resetGame(){
  db.ref("game").remove();
  db.ref("students").remove();
}
