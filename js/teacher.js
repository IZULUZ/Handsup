function startMission(type) {
  const startTime = Date.now();

  GAME_REF.set({
    mission: type,
    missionStartTime: startTime,
    status: "playing"
  });

  RESULT_REF.remove();
}

function resetGame() {
  GAME_REF.set({
    mission: null,
    missionStartTime: null,
    status: "waiting"
  });

  RESULT_REF.remove();
}

// 🔥 실시간 학생 접속 확인
PRESENCE_REF.on("value", snapshot => {
  const list = document.getElementById("students");
  list.innerHTML = "";

  snapshot.forEach(child => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = `학생 ${child.key}`;
    list.appendChild(div);
  });
});

// 🔥 실시간 순위
RESULT_REF.on("value", snapshot => {
  const ranking = document.getElementById("ranking");
  ranking.innerHTML = "";

  let results = [];
  snapshot.forEach(child => {
    results.push(child.val());
  });

  results.sort((a,b) => a.time - b.time);

  results.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "card winner";
    div.innerText = `${i+1}등 - ${r.number}번 (${r.time}ms)`;
    ranking.appendChild(div);
  });
});
