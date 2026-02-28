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

// 번호 드롭다운 생성 (1~25)
const select = document.getElementById("studentNumber");
for (let i = 1; i <= 25; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i + "번";
  select.appendChild(option);
}

// 학생 입장
function enterStudent() {
  const number = select.value;
  if (!number) return alert("번호를 선택하세요.");

  db.ref("students/" + number).set({
    number: number,
    enteredAt: Date.now()
  });

  document.getElementById("studentStatus").innerHTML =
    number + "번 입장 완료";
}

// 교사 실시간 감지
const liveList = document.getElementById("liveList");

db.ref("students").on("value", snapshot => {
  const data = snapshot.val();
  liveList.innerHTML = "";

  if (!data) {
    liveList.innerHTML = "입장한 학생 없음";
    return;
  }

  const numbers = Object.keys(data).sort((a,b)=>a-b);

  numbers.forEach(num => {
    const div = document.createElement("div");
    div.textContent = num + "번 입장";
    liveList.appendChild(div);
  });
});
