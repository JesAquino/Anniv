/* ---------- blue rose drawing ---------- */
function rose(bloom){
  var layers=[
    {n:5,d:23,r:23,c:"#2d5bc4",o:0},
    {n:5,d:17,r:19,c:"#3f74e0",o:36},
    {n:4,d:11,r:15,c:"#5b92f0",o:20},
    {n:3,d:6,r:11,c:"#8db6ff",o:50},
    {n:1,d:0,r:8,c:"#cfe2ff",o:0}
  ], g="";
  layers.forEach(function(L,i){
    var s="";
    for(var k=0;k<L.n;k++){
      var a=L.o+k*360/L.n;
      s+='<circle cx="0" cy="'+(-L.d)+'" r="'+L.r+'" fill="'+L.c+'" stroke="#1d3d94" stroke-opacity=".55" stroke-width="1" transform="rotate('+a+')"/>';
    }
    g+='<g class="l" style="--i:'+i+'">'+s+'</g>';
  });
  return '<svg class="'+(bloom?'bloom':'')+'" viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg">'+g+'</svg>';
}

/* ---------- hero rose ---------- */
document.getElementById("hero-rose").innerHTML=rose(true);

/* ---------- falling roses ---------- */
var rain=document.getElementById("rain");
for(var i=0;i<14;i++){
  var d=document.createElement("div");
  d.className="fall";
  var size=26+Math.random()*34;
  d.style.cssText="left:"+(Math.random()*96)+"%;width:"+size+"px;height:"+size+"px;animation-duration:"+(14+Math.random()*14)+"s;animation-delay:"+(-Math.random()*20)+"s";
  d.innerHTML=rose(false).replace(/<g class="l"[^>]*>/g,'<g>');
  rain.appendChild(d);
}

/* ---------- envelope seal + opening ---------- */
document.getElementById("seal").innerHTML=rose(false);
(function(){
  var env=document.getElementById("env"),
      wrap=document.getElementById("envwrap"),
      letter=document.getElementById("letter"),
      done=false;
  env.addEventListener("click",function(){
    if(done)return;
    done=true;
    env.classList.add("open");
    setTimeout(function(){
      wrap.hidden=true;
      letter.hidden=false;
      toast("Secret found","You opened the letter");
      letter.scrollIntoView({behavior:"smooth",block:"center"});
    },900);
  });
})();

/* ---------- achievement pop-up ---------- */
var tt;
function toast(t,d){
  document.getElementById("at").textContent="Achievement unlocked: "+t;
  document.getElementById("ad").textContent=d;
  var a=document.getElementById("ach");
  a.classList.add("show");
  clearTimeout(tt);
  tt=setTimeout(function(){a.classList.remove("show")},4200);
}
setTimeout(function(){toast("Still going strong","1 year together")},3800);

/* ---------- rose-catching game ---------- */
(function(){
  var cv=document.getElementById("cv"),
      cx=cv.getContext("2d"),
      W=520,H=340;
  var btn=document.getElementById("start"),
      sc=document.getElementById("score");
  var run=false,score=0,items=[],bx=W/2,last=0,spawn=0,keys={};

  function bud(x,y,r){
    for(var k=0;k<5;k++){
      var a=k*1.2566;
      cx.beginPath();
      cx.arc(x+Math.sin(a)*r*.5,y-Math.cos(a)*r*.5,r*.55,0,6.283);
      cx.fillStyle="#3f74e0";cx.fill();
      cx.strokeStyle="#1d3d94";cx.stroke();
    }
    cx.beginPath();cx.arc(x,y,r*.45,0,6.283);cx.fillStyle="#8db6ff";cx.fill();
    cx.beginPath();cx.arc(x,y,r*.2,0,6.283);cx.fillStyle="#cfe2ff";cx.fill();
  }

  function draw(){
    cx.clearRect(0,0,W,H);
    items.forEach(function(i){bud(i.x,i.y,17)});
    cx.fillStyle="#ffd3e2";
    cx.beginPath();
    cx.moveTo(bx-46,H-46);cx.lineTo(bx+46,H-46);
    cx.lineTo(bx+34,H-12);cx.lineTo(bx-34,H-12);
    cx.closePath();cx.fill();
  }

  function loop(t){
    var dt=Math.min((t-last)/1000||0,.05);
    last=t;
    if(run){
      if(keys.ArrowLeft)bx-=330*dt;
      if(keys.ArrowRight)bx+=330*dt;
      bx=Math.max(46,Math.min(W-46,bx));
      spawn+=dt;
      if(spawn>.8){
        spawn=0;
        items.push({x:24+Math.random()*(W-48),y:-20,v:120+score*10});
      }
      items=items.filter(function(i){
        i.y+=i.v*dt;
        if(i.y>H-60&&i.y<H-20&&Math.abs(i.x-bx)<50){
          score++;sc.textContent=score;return false;
        }
        return i.y<H+20;
      });
      if(score>=10){win()}
    }
    draw();
    requestAnimationFrame(loop);
  }

  function win(){
    run=false;
    toast("Level cleared","Letter unlocked");
    setTimeout(function(){
      document.getElementById("game").hidden=true;
      document.getElementById("envwrap").hidden=false;
    },900);
  }

  cv.addEventListener("pointermove",function(e){
    var r=cv.getBoundingClientRect();
    bx=(e.clientX-r.left)*W/r.width;
  });
  addEventListener("keydown",function(e){
    if(e.key==="ArrowLeft"||e.key==="ArrowRight"){
      keys[e.key]=true;
      if(run)e.preventDefault();
    }
  });
  addEventListener("keyup",function(e){keys[e.key]=false});
  btn.addEventListener("click",function(){
    run=true;score=0;sc.textContent=0;items=[];btn.hidden=true;
  });
  requestAnimationFrame(loop);
})();