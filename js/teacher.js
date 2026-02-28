resetAll(); // 시작 시 DB 초기화

function startMission(type){
  RESULTS.remove();

  GAME.set({
    mission:type,
    startTime:Date.now(),
    status:"playing"
  });
}

function resetAll(){
  PRESENCE.remove();
  GAME.set({status:"waiting"});
  RESULTS.remove();
}

/* 실시간 학생 */
PRESENCE.on("value", snap=>{
  const list=document.getElementById("studentList");
  list.innerHTML="";
  snap.forEach(child=>{
    const div=document.createElement("div");
    div.className="card";
    div.innerText=child.key+"번";
    list.appendChild(div);
  });
});

/* 실시간 순위 */
RESULTS.on("value", snap=>{
  const ranking=document.getElementById("ranking");
  ranking.innerHTML="";

  let arr=[];
  snap.forEach(c=>arr.push(c.val()));
  arr.sort((a,b)=>a.time-b.time);

  arr.forEach((r,i)=>{
    const div=document.createElement("div");
    div.className="card";
    div.innerText=`${i+1}등 - ${r.number}번 (${r.time}ms)`;
    ranking.appendChild(div);
  });
});
