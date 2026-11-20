// Anngan: drawer, search, listing preview, subtle fade-in. No framework.
(function(){
var drawer=document.getElementById('drawer'),overlay=document.getElementById('drawerOverlay'),btn=document.getElementById('menuBtn');
function closeDrawer(){if(!drawer)return;drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');overlay.classList.remove('show');document.body.classList.remove('locked');if(btn)btn.setAttribute('aria-expanded','false')}
function openDrawer(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');overlay.classList.add('show');document.body.classList.add('locked');btn.setAttribute('aria-expanded','true')}
if(btn)btn.addEventListener('click',function(){drawer.classList.contains('open')?closeDrawer():openDrawer()});
var dc=document.getElementById('drawerClose');if(dc)dc.addEventListener('click',closeDrawer);
if(overlay)overlay.addEventListener('click',closeDrawer);
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDrawer()});
// fade-in on scroll, subtle only
var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
// search tabs + search button (home only)
var cur='all';
document.querySelectorAll('.tabs button').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.tabs button').forEach(function(x){x.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true');cur=b.getAttribute('data-status')})});
var sb=document.getElementById('searchBtn');
if(sb)sb.addEventListener('click',function(){
var loc=document.getElementById('sLoc').value,type=document.getElementById('sType').value,note=document.getElementById('searchNote'),parts=[];
var hits={Mangla:['MGH Pakistan'],Lahore:['Global Homes Lahore','Al Ghani Phase 7','Urban City','China Town'],Multan:['Pak China Grain Market'],Kashmir:['Kashmir Modern City']};
if(loc){parts.push(hits[loc]?hits[loc].length+' project(s) in '+loc+': '+hits[loc].join(', '):'No project in '+loc+' yet')}
if(type==='File'){parts.push("MGH Zamindar File at MGH Pakistan, Mangla. Call for today's rate")}
if(cur==='sale'||type==='House'){parts.push('1 listing for sale: 10 Marla House, Rs 35,000,000, 5 bed, 5 bath')}
if(cur==='rent'){parts.push('No rental listing is live today. Call +92 304 1111 698 to register your requirement')}
if(!parts.length){parts.push('Showing everything: 7 projects and 1 featured listing. Pick a location or type to narrow it down')}
note.textContent=parts.join('. ')+'.';
});
// city cards (home only)
document.querySelectorAll('[data-city]').forEach(function(t){t.addEventListener('click',function(){
var city=t.getAttribute('data-city'),note=document.getElementById('cityNote');
var hits={Karachi:[],Islamabad:[],Lahore:['Global Homes Lahore','Al Ghani Phase 7','Urban City','China Town'],Peshawar:[]};
if(hits[city]&&hits[city].length){note.innerHTML=city+': '+hits[city].join(', ')+'. <a href="projects.html">Open Projects page</a>'}
else{note.textContent=city+': no Anngan project is located in '+city+' yet. Listings are added through Create a Listing. Call +92 304 1111 698 to ask.'}
})});
// listing preview (create only)
var f=document.getElementById('listForm');
if(f)f.addEventListener('submit',function(e){e.preventDefault();
var g=function(id){return document.getElementById(id).value};
var price=g('lfPrice')?('Rs '+Number(g('lfPrice')).toLocaleString('en-PK')):'Price on call';
var pv=document.getElementById('listPreview');pv.style.display='block';
pv.innerHTML='<b>'+g('lfSize')+' '+g('lfType')+' '+g('lfStatus')+' in '+g('lfCity')+'</b><br>'+price+' · '+g('lfBed')+' bedrooms · by '+(g('lfName')||'Anngan seller')+' · '+(g('lfPhone')||'+92 304 1111 698')+'<br>Page URL: /properties/'+g('lfCity').toLowerCase()+'/'+g('lfSize').toLowerCase().replace(' ','-')+'-'+g('lfType').toLowerCase();
pv.scrollIntoView({behavior:'smooth',block:'center'});
});
})();
