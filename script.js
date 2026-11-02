const P=[
 {id:1,n:'Runner One',c:'Shoes',p:120,e:'👟',bg:'#ffd6e0'},
 {id:2,n:'Field Watch',c:'Watches',p:210,e:'⌚',bg:'#d6e4ff'},
 {id:3,n:'Studio Headphones',c:'Audio',p:180,e:'🎧',bg:'#e0d6ff'},
 {id:4,n:'Weekend Tote',c:'Bags',p:95,e:'👜',bg:'#ffe9c7'},
 {id:5,n:'Sun Frames',c:'Eyewear',p:75,e:'🕶️',bg:'#c9f2e3'},
 {id:6,n:'Everyday Cap',c:'Caps',p:35,e:'🧢',bg:'#ffd9c7'},
 {id:7,n:'Court Classic',c:'Shoes',p:99,e:'👞',bg:'#d6f0ff'},
 {id:8,n:'Pocket Speaker',c:'Audio',p:60,e:'🔊',bg:'#f3d6ff'}
];
const cart={};let filter='All';
const $=id=>document.getElementById(id);
const money=n=>'$'+n.toLocaleString('en-US');

function chips(){
  const cats=['All',...new Set(P.map(x=>x.c))];
  $('chips').innerHTML=cats.map(c=>`<button class="chip" aria-pressed="${c===filter}" data-c="${c}">${c}</button>`).join('');
}
$('chips').onclick=e=>{const c=e.target.dataset.c;if(!c)return;filter=c;chips();grid();};

function grid(){
  $('grid').innerHTML=P.filter(x=>filter==='All'||x.c===filter).map(x=>`
   <article class="card">
     <div class="pic" style="background:${x.bg}"><i>${x.e}</i></div>
     <h3>${x.n}</h3><small>${x.c}</small>
     <div class="row"><span class="price">${money(x.p)}</span><button class="add" data-id="${x.id}">Add to cart</button></div>
   </article>`).join('');
}

/* 3D tilt on cards (mouse, pen and touch) */
const g=$('grid');
g.addEventListener('pointermove',e=>{
  const c=e.target.closest('.card');if(!c)return;
  const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  c.classList.add('live');
  c.style.transform=`rotateY(${x*18}deg) rotateX(${-y*18}deg) translateZ(14px)`;
});
g.addEventListener('pointerout',e=>{
  const c=e.target.closest('.card');if(!c)return;
  c.classList.remove('live');c.style.transform='';
});
g.addEventListener('click',e=>{
  const b=e.target.closest('.add');if(!b)return;
  add(+b.dataset.id);b.classList.add('done');b.textContent='Added';
  setTimeout(()=>{b.classList.remove('done');b.textContent='Add to cart'},1200);
});

/* Hero cube: auto-spin, drag to rotate */
let rx=-22,ry=30,drag=false,lx=0,ly=0;
const cube=$('cube'),stage=$('stage');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
stage.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;stage.setPointerCapture(e.pointerId)});
stage.addEventListener('pointermove',e=>{if(!drag)return;ry+=(e.clientX-lx)*.6;rx-=(e.clientY-ly)*.6;lx=e.clientX;ly=e.clientY});
stage.addEventListener('pointerup',()=>drag=false);
(function spin(){if(!drag&&!reduce)ry+=.35;cube.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;requestAnimationFrame(spin)})();

/* Cart */
function add(id,d=1){cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];render();if(d>0)toast('Added to cart')}
function render(){
  const ids=Object.keys(cart);let total=0,n=0;
  $('items').innerHTML=ids.length?ids.map(i=>{const p=P.find(x=>x.id==i),q=cart[i];total+=p.p*q;n+=q;
   return `<div class="item"><em style="background:${p.bg}">${p.e}</em><div><b>${p.n}</b><br><small>${money(p.p)}</small></div>
   <div class="qty"><button data-d="-1" data-id="${i}" aria-label="Remove one">−</button> ${q} <button data-d="1" data-id="${i}" aria-label="Add one">+</button></div></div>`}).join(''):'<p class="empty">Your cart is empty. Add a product to start.</p>';
  $('total').textContent=money(total);$('count').textContent=n;
}
$('items').onclick=e=>{const b=e.target.closest('button');if(b)add(+b.dataset.id,+b.dataset.d)};
const open=v=>{$('cart').classList.toggle('open',v);$('scrim').classList.toggle('open',v)};
$('open').onclick=()=>open(true);$('close').onclick=()=>open(false);$('scrim').onclick=()=>open(false);
addEventListener('keydown',e=>{if(e.key==='Escape')open(false)});
$('checkout').onclick=()=>{if(!Object.keys(cart).length)return toast('Add a product before checking out');toast('Demo only: connect your payment provider here')};
let t;function toast(m){const el=$('toast');el.textContent=m;el.classList.add('show');clearTimeout(t);t=setTimeout(()=>el.classList.remove('show'),1800)}

chips();grid();render();
