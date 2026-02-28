let myNumber=null;
let startTime=null;
let submitted=false;

function join(){
  const num=document.getElementById("numInput").value.trim();
  if(!num||isNaN(num)) return alert("숫자 입력");

  myNumber=num;

  const myRef=PRESENCE.child(myNumber);
  myRef.set(true);
  myRef.onDisconnect().remove();

  document.getElementById("login").classList.add("hidden");
  document.getElementById("waiting").classList.remove("hidden");
}

/* 미션 감지 */
GAME.on("value", snap=>{
  const data=snap.val();
  if(!data||data.status!=="playing") return;
  startTime=data.startTime;
  submitted=false;
  launchGame(data.mission);
});

function launchGame(type){
  document.getElementById("waiting").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  const area=document.getElementById("gameArea");
  area.innerHTML="";

  if(type===1){
    for(let i=0;i<16;i++){
      const btn=document.createElement("button");
      btn.className="game-btn";
      btn.innerText=i===0?"발표":"발펴";
      if(i===0) btn.onclick=submit;
      area.appendChild(btn);
    }
  }

  if(type===2){
    let count=0;
    const btn=document.createElement("button");
    btn.className="big-btn";
    btn.innerText="연타!";
    btn.onclick=()=>{
      count+=10;
      if(count>=100) submit();
    };
    area.appendChild(btn);
  }

  if(type===3){
    const btn=document.createElement("button");
    btn.innerText="발표";
    btn.className="big-btn";
    area.appendChild(btn);

    const move=setInterval(()=>{
      btn.style.position="absolute";
      btn.style.left=Math.random()*70+"%";
      btn.style.top=Math.random()*60+"%";
    },600);

    btn.onclick=()=>{
      clearInterval(move);
      submit();
    };
  }
}

function submit(){
  if(submitted) return;
  submitted=true;

  const time=Date.now()-startTime;

  RESULTS.child(myNumber).set({
    number:myNumber,
    time:time
  });

  document.getElementById("gameArea").innerHTML="<h2>제출 완료!</h2>";
}
