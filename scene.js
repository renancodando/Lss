import * as THREE from 'https://esm.sh/three@0.170.0';
const canvas=document.getElementById('product-canvas'), viewport=document.getElementById('viewport'), loading=document.getElementById('loading');
try{
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.4;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(33,1,.1,100);camera.position.set(0,.05,11);
const root=new THREE.Group();scene.add(root);
const metal=new THREE.MeshPhysicalMaterial({color:0x929b97,metalness:1,roughness:.24,clearcoat:.7,clearcoatRoughness:.18});
const back=new THREE.MeshPhysicalMaterial({color:0x626d69,metalness:.65,roughness:.27,clearcoat:1,clearcoatRoughness:.12});
const dark=new THREE.MeshPhysicalMaterial({color:0x11181c,metalness:.8,roughness:.16,clearcoat:1});
const glass=new THREE.MeshPhysicalMaterial({color:0x070b10,metalness:.12,roughness:.07,clearcoat:1,clearcoatRoughness:.02});
function rounded(w,h,r){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s}
function slab(w,h,d,r,mat,z=0){const g=new THREE.ExtrudeGeometry(rounded(w,h,r),{depth:d,bevelEnabled:true,bevelThickness:.035,bevelSize:.035,bevelSegments:5,curveSegments:12,steps:1});g.translate(0,0,-d/2);const m=new THREE.Mesh(g,mat);m.position.z=z;root.add(m);return m}
const W=2.35,H=4.85,D=.28;slab(W,H,D,.34,metal);slab(W-.075,H-.075,.045,.31,back,-D/2-.015);slab(W-.085,H-.085,.025,.31,dark,D/2+.012);
const screen=slab(W-.16,H-.16,.012,.28,glass,D/2+.045);
const screenShape=rounded(W-.23,H-.23,.25);const screenGeo=new THREE.ShapeGeometry(screenShape,24);
const screenCanvas=document.createElement('canvas');screenCanvas.width=512;screenCanvas.height=1024;const ctx=screenCanvas.getContext('2d');const grd=ctx.createLinearGradient(0,0,512,1024);grd.addColorStop(0,'#101c25');grd.addColorStop(.45,'#2a424d');grd.addColorStop(.75,'#997968');grd.addColorStop(1,'#10161e');ctx.fillStyle=grd;ctx.fillRect(0,0,512,1024);ctx.save();ctx.translate(250,640);ctx.rotate(-.5);for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(0,0,150+i*35,350+i*30,0,0,Math.PI*2);ctx.strokeStyle='rgba(246,217,187,'+(.34-i*.035)+')';ctx.lineWidth=7;ctx.stroke()}ctx.restore();ctx.textAlign='center';ctx.fillStyle='#f8f5ed';ctx.font='600 112px Arial';ctx.fillText('09:41',256,220);ctx.font='20px Arial';ctx.fillText('BEYOND ORDINARY',256,915);const texture=new THREE.CanvasTexture(screenCanvas);texture.colorSpace=THREE.SRGBColorSpace;const display=new THREE.Mesh(screenGeo,new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));display.position.z=D/2+.08;root.add(display);
function cylinder(radius,depth,mat,x,y,z,rot=0){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,depth,64),mat);mesh.rotation.x=Math.PI/2;mesh.position.set(x,y,z);root.add(mesh);return mesh}
const island=slab(1.25,1.33,.11,.27,metal,-D/2-.11);island.position.set(-.42,1.55,-D/2-.12);
const lensOuter=new THREE.MeshPhysicalMaterial({color:0x4b5557,metalness:1,roughness:.17});const lensRing=new THREE.MeshPhysicalMaterial({color:0x141b20,metalness:.8,roughness:.15});const lensGlass=new THREE.MeshPhysicalMaterial({color:0x0a1723,metalness:.35,roughness:.06,clearcoat:1,clearcoatRoughness:.01});
for(const [x,y] of [[-.76,1.88],[-.09,1.55],[-.76,1.19]]){cylinder(.30,.11,lensOuter,x,y,-.36);cylinder(.255,.12,lensRing,x,y,-.43);cylinder(.203,.13,lensGlass,x,y,-.51);cylinder(.10,.131,new THREE.MeshPhysicalMaterial({color:0x0b1a29,metalness:.45,roughness:.08,clearcoat:1}),x,y,-.525);cylinder(.038,.132,new THREE.MeshBasicMaterial({color:0x28455b}),x-.035,y+.04,-.535)}
cylinder(.105,.08,new THREE.MeshStandardMaterial({color:0xe8dbb8,emissive:0x8e7653,emissiveIntensity:.35}),-.08,1.95,-.34);
cylinder(.07,.08,dark,-.08,1.15,-.34);
const islandFront=new THREE.Mesh(new THREE.CapsuleGeometry(.11,.42,8,20),new THREE.MeshBasicMaterial({color:0x010204}));islandFront.rotation.z=Math.PI/2;islandFront.position.set(0,1.99,D/2+.095);root.add(islandFront);
function sideButton(x,y,len){const b=new THREE.Mesh(new THREE.BoxGeometry(.07,len,.09),metal);b.position.set(x,y,0);root.add(b)}sideButton(-1.22,1.15,.35);sideButton(-1.22,.55,.52);sideButton(1.22,.62,.72);
const logo=new THREE.Mesh(new THREE.TorusGeometry(.19,.014,8,48),new THREE.MeshStandardMaterial({color:0xbac3be,metalness:.9,roughness:.3}));logo.position.set(0,-.12,-.23);root.add(logo);
scene.add(new THREE.AmbientLight(0xffffff,.55));const lights=[[0xffffff,100,[-3,5,6], [2,6]],[0xb8d8ee,75,[4,1,3],[2,5]],[0xffe0bb,80,[1,-4,-5],[3,5]],[0xffffff,70,[-4,2,-4],[2,5]]];for(const [color,intensity,pos,sz] of lights){const l=new THREE.RectAreaLight(color,intensity,sz[0],sz[1]);l.position.set(...pos);l.lookAt(0,0,0);scene.add(l)}
const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(-2,5,6);scene.add(key);const rim=new THREE.DirectionalLight(0x9ac9e6,4);rim.position.set(3,-1,-4);scene.add(rim);
let yaw=-.55,target=-.55,pitch=-.10,pitchTarget=-.10,drag=false,startX=0,startY=0,originYaw=0,originPitch=0,spinTarget=null;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
viewport.addEventListener('pointerdown',e=>{drag=true;startX=e.clientX;startY=e.clientY;originYaw=target;originPitch=pitchTarget;spinTarget=null;viewport.setPointerCapture(e.pointerId)});
viewport.addEventListener('pointermove',e=>{if(!drag)return;target=originYaw+(e.clientX-startX)*.008;pitchTarget=THREE.MathUtils.clamp(originPitch+(e.clientY-startY)*.004,-.4,.4)});
viewport.addEventListener('pointerup',()=>drag=false);viewport.addEventListener('pointercancel',()=>drag=false);
document.getElementById('spin').addEventListener('click',()=>{spinTarget=(spinTarget??target)+Math.PI*2;target=spinTarget});
function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=w<600?12.6:10.5;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(viewport);resize();
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);const smoothing=1-Math.exp(-dt*4);if(!drag&&!reduced&&spinTarget===null)target+=dt*.12;yaw=THREE.MathUtils.lerp(yaw,target,smoothing);pitch=THREE.MathUtils.lerp(pitch,pitchTarget,smoothing);root.rotation.set(pitch,yaw,.12);if(spinTarget!==null&&Math.abs(yaw-spinTarget)<.015)spinTarget=null;renderer.render(scene,camera)}animate();loading.remove();
}catch(err){console.error('Falha ao inicializar WebGL',err);loading.textContent='NÃO FOI POSSÍVEL INICIAR O 3D NESTE DISPOSITIVO';}
