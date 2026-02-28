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

let myNumber = null;

// 화면 전환
function showTeacher() {
  document.getElementById("homeScreen").classList.add("hidden");
  document.getElementById("teacherScreen").classList.remove("hidden");
}

function showStudent() {
  document.getElementById("homeScreen").classList.add("hidden");
  document.getElementById("studentScreen").classList.remove("hidden");
}

// 드롭다운 1~25 생성 (정상작동)
const select = document.getElementById("studentNumber");
for (let i = 1; i <= 25; i++) {
  let opt = document.createElement("option");
  opt.value = i;
  opt.textContent = i + "번";
  select.appendChild(opt);
}

// 학생 입장
function enterStudent() {
  myNumber = select.value;
  if (!myNumber) return alert("번호를 선택하세요");

  db.ref("students/" + myNumber).set({
    number: myNumber,
    entered: true
  });

  document.getElementById("studentStatus").innerText =
    myNumber + "번 입장 완료. 선생님을 기다리는 중...";
}

// 교사 실시간 입장 확인
db.ref("students").on("value", snapshot => {
  const data = snapshot.val();
  const liveList = document.getElementById("liveList");
  liveList.innerHTML = "";

  if (!data) {
    liveList.innerHTML = "입장 학생 없음";
    return;
  }

  Object.keys(data).sort((a,b)=>a-b).forEach(num => {
    const div = document.createElement("div");
    div.textContent = num + "번 입장";
    liveList.appendChild(div);
  });
});

// 교사 게임 시작
function startGame() {
  db.ref("gameState").set({
    started: true,
    mission: "speed"
  });
}

// 학생 화면에서 게임 시작 감지
db.ref("gameState").on("value", snapshot => {
  const data = snapshot.val();
  if (!data || !data.started) return;

  if (myNumber) {
    showGame();
  }
});

// 간단한 5초 클릭 게임
function showGame() {
  const area = document.getElementById("gameArea");
  area.innerHTML = `
    <h2 class="big-text">지금 누르세요!</h2>
    <button class="big-btn" onclick="finishGame()">클릭!</button>
  `;
}

function finishGame() {
  alert("완료!");
}
