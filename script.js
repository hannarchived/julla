const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- typewriter ---------- */
(async()=>{
  const a=document.getElementById("ta"),b=document.getElementById("tb"),z=ms=>new Promise(r=>setTimeout(r,ms));
  const seq=[["hi, it’s ","julla"],["","hanna sandoval"]];
  if(RM){a.textContent=seq[0][0];b.textContent=seq[0][1];return}
  let i=0;
  for(;;){
    const [p,n]=seq[i%seq.length];
    for(const c of p){a.textContent+=c;await z(75)}
    for(const c of n){b.textContent+=c;await z(85)}
    await z(2200);
    while(b.textContent){b.textContent=b.textContent.slice(0,-1);await z(45)}
    while(a.textContent){a.textContent=a.textContent.slice(0,-1);await z(45)}
    await z(350);i++;
  }
})();

/* ---------- glass glow follows cursor ---------- */
const gl=[...document.querySelectorAll(".glass")];
addEventListener("pointermove",e=>{
  for(const g of gl){
    const r=g.getBoundingClientRect(),
      dx=Math.max(r.left-e.clientX,0,e.clientX-r.right),dy=Math.max(r.top-e.clientY,0,e.clientY-r.bottom);
    g.style.setProperty("--mx",(e.clientX-r.left)+"px");g.style.setProperty("--my",(e.clientY-r.top)+"px");
    g.style.setProperty("--o",Math.max(0,1-Math.hypot(dx,dy)/240).toFixed(2));
  }
});

/* ---------- kanban ---------- */
let S=null;try{S=JSON.parse(localStorage.getItem("hs-kanban2"))}catch(e){}
const EM={todo:"Nothing planned yet.",doing:"Nothing in motion yet — move a card here once you start.",done:"First finished project lands here."};
if(!S||!S.todo||!S.doing||!S.done)S={todo:[{id:1,c:"PRJ-2026-001",t:"Lily Pad"},{id:2,c:"PRJ-2026-002",t:"Nightfall Notes"}],doing:[],done:[]};
let nid=Date.now();
const save=()=>{try{localStorage.setItem("hs-kanban2",JSON.stringify(S))}catch(e){}};
const kc=[...document.querySelectorAll(".col")],keys=kc.map(c=>c.dataset.k);
function move(id,to,idx){let it=null;for(const k of keys){const i=S[k].findIndex(x=>x.id==id);if(i>-1){it=S[k].splice(i,1)[0];break}}
  if(!it)return;S[to].splice(idx==null?S[to].length:idx,0,it);save();draw()}
function draw(){
  const tot=keys.reduce((n,k)=>n+S[k].length,0);
  kc.forEach((c,ci)=>{const k=c.dataset.k,l=c.querySelector(".list");l.textContent="";c.querySelector("h3 span").textContent=String(S[k].length).padStart(2,"0")
    S[k].forEach(it=>{
      const d=document.createElement("div");d.className="k";d.draggable=true;
      const cd=document.createElement("div");cd.className="code";cd.textContent=it.c||"";d.append(cd);const p=document.createElement("div");p.textContent=it.t;p.style.fontWeight=600;d.append(p);
      const ac=document.createElement("div");ac.className="ac";
      [["‹",-1,"Move left"],["›",1,"Move right"]].forEach(([s,dir,lb])=>{
        if(dir&&!kc[ci+dir])return;const b=document.createElement("button");b.textContent=s;b.setAttribute("aria-label",lb);
        b.onclick=()=>{if(dir)move(it.id,keys[ci+dir]);else{S[k]=S[k].filter(x=>x!==it);save();draw()}};ac.append(b)});
      d.append(ac);
      d.ondragstart=e=>{e.dataTransfer.setData("text/plain",String(it.id));e.dataTransfer.effectAllowed="move";setTimeout(()=>d.classList.add("drag"))};
      d.ondragend=()=>d.classList.remove("drag");
      l.append(d)});
    if(!S[k].length){const e=document.createElement("div");e.className="empty";e.textContent=EM[k];l.append(e)}
  });
  const dn=S.done.length;document.getElementById("pct").textContent=dn+" of "+tot+" done";
  document.getElementById("bar").style.width=(tot?dn/tot*100:0)+"%";
}
kc.forEach(c=>{
  const l=c.querySelector(".list"),k=c.dataset.k;
  c.ondragover=e=>{e.preventDefault();l.classList.add("over")};
  c.ondragleave=e=>{if(!c.contains(e.relatedTarget))l.classList.remove("over")};
  c.ondrop=e=>{e.preventDefault();l.classList.remove("over");
    const id=e.dataTransfer.getData("text/plain"),cards=[...l.querySelectorAll(".k:not(.drag)")];
    let idx=cards.findIndex(x=>{const r=x.getBoundingClientRect();return e.clientY<r.top+r.height/2});
    move(id,k,idx<0?cards.length:idx)};
  
});
draw();

/* ---------- menu becomes a banner on scroll ---------- */
const hd=document.querySelector("header");
const onScroll=()=>hd.classList.toggle("scrolled",scrollY>60);
addEventListener("scroll",onScroll,{passive:true});onScroll();

/* ---------- reveal ---------- */
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add("in")),{threshold:.12});
document.querySelectorAll(".rv").forEach(el=>io.observe(el));

/* ---------- nano-particle lily ---------- */
const cv=document.getElementById("lily"),ctx=cv.getContext("2d"),G=400,img=new Image();
const NB=28,PAL=Array.from({length:NB},(_,i)=>{const t=i/(NB-1),A=[140,22,82],M=[255,118,172],Z=[255,205,224],[u,v,w]=t<.5?[A,M,t*2]:[M,Z,(t-.5)*2];return"rgb("+u.map((c,j)=>Math.round(c+(v[j]-c)*w)).join(",")+")"});
let mask=null,P=[],W=0,mouse={x:-999,y:-999},t0=0;
img.onload=()=>{
  const o=document.createElement("canvas");o.width=o.height=G;const c=o.getContext("2d");c.drawImage(img,0,0,G,G);
  const d=mask=c.getImageData(0,0,G,G).data,ox=G*.47,oy=G*.8,md=Math.hypot(G,G)*.55;
  for(let y=0;y<G;y+=2)for(let x=0;x<G;x+=2){
    const k=(y*G+x)*4;if(d[k+3]<140)continue;
    const dist=Math.hypot(x-ox,y-oy);
    P.push({sx:x/G,sy:y/G,x:0,y:0,vx:0,vy:0,ph:Math.random()*6.28,
      dl:(dist/md)*1.5+Math.random()*.35,b:Math.round(Math.max(0,Math.min(1,((d[k]*.3+d[k+1]*.59+d[k+2]*.11)/255-.12)/.72))*(NB-1)),ox:ox/G,oy:oy/G});
  }
  size();t0=performance.now();requestAnimationFrame(loop);
};
img.src=LILY;
function size(){
  const dpr=Math.min(devicePixelRatio||1,2),r=cv.getBoundingClientRect();
  W=cv.width=Math.round(r.width*dpr);cv.height=W;cv.dataset.dpr=dpr;
  for(const p of P){p.x=(p.ox+(Math.random()-.5)*.02)*W;p.y=(p.oy+(Math.random()-.5)*.02)*W}
}
addEventListener("resize",()=>{if(P.length){size();t0=performance.now()}});
addEventListener("pointermove",e=>{const r=cv.getBoundingClientRect(),s=W/r.width;mouse.x=(e.clientX-r.left)*s;mouse.y=(e.clientY-r.top)*s;
  const gx=Math.floor(mouse.x/W*G),gy=Math.floor(mouse.y/W*G);
  const on=mask&&gx>=0&&gy>=0&&gx<G&&gy<G&&mask[(gy*G+gx)*4+3]>60&&!e.target.closest("a,button,input,.glass");
  document.documentElement.classList.toggle("onlily",!!on)});
addEventListener("pointerleave",()=>{mouse.x=mouse.y=-999});
const sm={x:-999,y:-999};

function loop(now){
  const t=(now-t0)/1000,R=W*.17,R2=R*R,base=W/200;
  if(mouse.x<-900){sm.x=sm.y=-999}else if(sm.x<-900){sm.x=mouse.x;sm.y=mouse.y}else{sm.x+=(mouse.x-sm.x)*.2;sm.y+=(mouse.y-sm.y)*.2}
  ctx.clearRect(0,0,W,W);
  const B=Array.from({length:NB},()=>[]);
  for(const p of P){
    const tx=p.sx*W+Math.sin(t*1.1+p.ph)*W*.002,ty=p.sy*W+Math.cos(t*.9+p.ph)*W*.002;
    let sc=1;
    if(RM||t>p.dl){
      p.vx+=(tx-p.x)*.024;p.vy+=(ty-p.y)*.024;
      const dx=p.x-sm.x,dy=p.y-sm.y,d2=dx*dx+dy*dy;
      if(d2<R2&&d2>.01){const d=Math.sqrt(d2),u=1-d/R,f=u*u*(3-2*u)*.9;
        p.vx+=(dx/d)*f*3.2+(-dy/d)*f*1.1;p.vy+=(dy/d)*f*3.2+(dx/d)*f*1.1}
      p.vx*=.9;p.vy*=.9;p.x+=p.vx;p.y+=p.vy;
      sc=Math.max(.28,1-Math.hypot(p.x-tx,p.y-ty)/(W*.1))*(RM?1:Math.min(1,(t-p.dl)/1.1));
    }else{p.x+=Math.sin(t*9+p.ph)*.25;p.y+=Math.cos(t*8+p.ph)*.25;sc=.25}
    B[p.b].push(p.x,p.y,sc);
  }
  for(let i=0;i<NB;i++){const a=B[i];if(!a.length)continue;ctx.fillStyle=PAL[i];ctx.beginPath();
    for(let j=0;j<a.length;j+=3){const r=base*.82*a[j+2];ctx.moveTo(a[j]+r,a[j+1]);ctx.arc(a[j],a[j+1],r,0,6.2832)}
    ctx.fill()}
  requestAnimationFrame(loop);
}

function loopOld(now){
  const t=(now-t0)/1000,R=W*.12,s=Math.max(1.2,W/150);
  ctx.clearRect(0,0,W,W);
  for(const p of P){
    const tx=p.sx*W+Math.sin(t*1.1+p.ph)*W*.0025,ty=p.sy*W+Math.cos(t*.9+p.ph)*W*.0025;
    if(RM||t>p.dl){
      p.vx+=(tx-p.x)*.03;p.vy+=(ty-p.y)*.03;
      const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);
      if(d<R&&d>.1){const f=Math.pow(1-d/R,2);
        p.vx+=(dx/d)*f*5+(-dy/d)*f*1.6;p.vy+=(dy/d)*f*5+(dx/d)*f*1.6}
      p.vx*=.86;p.vy*=.86;p.x+=p.vx;p.y+=p.vy;
    }else{p.x+=Math.sin(t*9+p.ph)*.35;p.y+=Math.cos(t*8+p.ph)*.35}
    ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,s,s);
  }
  requestAnimationFrame(loop);
}