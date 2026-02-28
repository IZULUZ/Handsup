// 🔥 본인 firebase config로 교체
const firebaseConfig = {
  apiKey: "AIzaSyDHG3uB-tqoE-4YLBHHvBRM4YhPh9qa-mI",
  authDomain: "handsup-262b8.firebaseapp.com",
  databaseURL: "https://handsup-262b8-default-rtdb.firebaseio.com",
  projectId: "handsup-262b8",
  storageBucket: "handsup-262b8.firebasestorage.app",
  messagingSenderId: "494093439378",
  appId: "1:494093439378:web:af0a9081d72f021031f14b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let username = "";

function join() {
  username = document.getElementById("nameInput").value;
  if (!username) return;

  if (username === "teacher") {
    document.getElementById("teacherBox").style.display = "block";
    listenStudents();
  } else {
    document.getElementById("gameBox").style.display = "block";
    document.getElementById("welcome").innerText = username + "님 환영합니다";
    db.ref("students/" + username).set({
      score: 0,
      status: "대기중"
    });
  }

  document.getElementById("loginBox").style.display = "none";
}

function startGame() {
  const start = Date.now();
  const area = document.getElementById("gameArea");

  area.innerHTML = "<button id='clickBtn'>지금 클릭!</button>";

  document.getElementById("clickBtn").onclick = () => {
    const time = Date.now() - start;
    const score = Math.max(0, 5000 - time);

    db.ref("students/" + username).update({
      score: score,
      status: "완료"
    });

    area.innerHTML = "점수: " + score;
  };
}

function listenStudents() {
  db.ref("students").on("value", snapshot => {
    const data = snapshot.val();
    const list = document.getElementById("studentList");
    list.innerHTML = "";

    let arr = [];

    for (let key in data) {
      arr.push({name:key, score:data[key].score});
    }

    arr.sort((a,b)=>b.score-a.score);

    arr.forEach((s,i)=>{
      list.innerHTML += `<div>${i+1}등 - ${s.name} (${s.score})</div>`;
    });

    if (arr.length > 0) {
      launchFireworks();
    }
  });
}

// 🎆 폭죽
function launchFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i=0;i<50;i++){
    ctx.beginPath();
    ctx.arc(
      Math.random()*canvas.width,
      Math.random()*canvas.height,
      3,
      0,
      Math.PI*2
    );
    ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;
    ctx.fill();
  }

  setTimeout(()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
  },1000);
}
