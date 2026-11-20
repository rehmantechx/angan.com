// Anngan: drawer, search, browse, tools, plot finder, back to top. No framework.
(function(){
var drawer=document.getElementById('drawer'),overlay=document.getElementById('drawerOverlay'),btn=document.getElementById('menuBtn');
function closeDrawer(){if(!drawer)return;drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');if(overlay)overlay.classList.remove('show');document.body.classList.remove('locked');if(btn)btn.setAttribute('aria-expanded','false')}
function openDrawer(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');if(overlay)overlay.classList.add('show');document.body.classList.add('locked');if(btn)btn.setAttribute('aria-expanded','true')}
if(btn)btn.addEventListener('click',function(){drawer.classList.contains('open')?closeDrawer():openDrawer()});
var dc=document.getElementById('drawerClose');if(dc)dc.addEventListener('click',closeDrawer);
if(overlay)overlay.addEventListener('click',closeDrawer);
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDrawer()});
var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
var toTop=document.getElementById('toTop');
if(toTop){window.addEventListener('scroll',function(){toTop.classList.toggle('show',window.scrollY>600)});toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})})}
var tl=document.getElementById('topLink');if(tl)tl.addEventListener('click',function(e){e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})});
// ---- real data from anngan.com ----
var LISTINGS=[
{id:'karachi-shamsi',title:'Brand new flat for sale in Shamsi Society Airport, Karachi',price:'Rs 3,600,000',n:3600000,beds:2,baths:2,size:'4 Marla',city:'Karachi',loc:'Shamsi Society Airport, Karachi',type:'Flat',status:'sale',img:'lst-karachi-shamsi.jpg',badge:'Super Hot',url:'https://anngan.com/property/brand-new-flat-for-sale-in-shamsi-society-airport-karachi/'},
{id:'dha-stunning',title:'10 Marla Stunning House for Sale in DHA Lahore',price:'Rs 49,000,000',n:49000000,beds:5,baths:6,size:'10 Marla',city:'Lahore',loc:'DHA Lahore',type:'House',status:'sale',img:'lst-dha-stunning.jpg',badge:'Super Hot',url:'https://anngan.com/property/10-marla-stunning-house-for-sale-in-dha-lahore/'},
{id:'dha-defence4',title:'10 Marla House for Sale in Defence Phase-IV Lahore',price:'Rs 60,000,000',n:60000000,beds:4,baths:4,size:'10 Marla',city:'Lahore',loc:'Defence Phase-IV, Lahore',type:'House',status:'sale',img:'lst-dha-defence4.jpg',badge:'For Sale',url:'https://anngan.com/property/10-marla-house-for-sale-in-defence-phase-iv-lahore/'},
{id:'dha-u7',title:'10 Marla House for Sale, Sector U Phase 7 DHA Lahore',price:'Rs 46,000,000',n:46000000,beds:4,baths:5,size:'10 Marla',city:'Lahore',loc:'Sector U, Phase 7, DHA Lahore',type:'House',status:'sale',img:'lst-dha-u7.jpg',badge:'For Sale',url:'https://anngan.com/property/10-marla-house-for-sale-sector-u-phase-7-dha-lahore/'},
{id:'dha-1kanal',title:'1 Kanal House for Sale at Prime Location of DHA Phase 7',price:'Rs 65,000,000',n:65000000,beds:5,baths:6,size:'1 Kanal',city:'Lahore',loc:'DHA Phase 7, Lahore',type:'House',status:'sale',img:'lst-dha-1kanal.jpg',badge:'For Sale',url:'https://anngan.com/property/1-kanal-beautiful-new-house-for-sale-at-prime-location-of-dha-phase-7/'},
{id:'bahria-luxury',title:'10 Marla brand new ultra modern stylish luxury house in Bahria Town Lahore',price:'Rs 47,500,000',n:47500000,beds:5,baths:7,size:'10 Marla',city:'Lahore',loc:'Bahria Town, Lahore',type:'House',status:'sale',img:'lst-bahria-luxury.jpg',badge:'For Sale',url:'https://anngan.com/property/10-marla-brand-new-ultra-modren-stylish-luxury-house-in-bahria-town-lahore/'},
{id:'alhafeez',title:'5 Marla double story brand new house for sale in Al Hafeez Garden Phase 1',price:'Rs 16,500,000',n:16500000,beds:4,baths:4,size:'5 Marla',city:'Lahore',loc:'Al Hafeez Garden Phase 1, Lahore',type:'House',status:'sale',img:'lst-alhafeez.jpg',badge:'For Sale',url:'https://anngan.com/property/5-marla-double-story-brand-new-house-for-sale-in-al-hafeez-garden-phase-1/'},
{id:'bahria-rwp',title:'5 Marla brand new house for sale in Bahria Rawalpindi',price:'Rs 16,500,000',n:16500000,beds:3,baths:3,size:'5 Marla',city:'Rawalpindi',loc:'Bahria Town, Rawalpindi',type:'House',status:'sale',img:'lst-bahria-rwp.jpg',badge:'For Sale',url:'https://anngan.com/property/05-marla-brand-new-house-for-sale-in-bahria-rawalpindi-at-very-reasonable-price/'},
{id:'citi-multan',title:'5 Marla house for sale in Citi Housing Multan Phase 1',price:'Rs 10,000,000',n:10000000,beds:3,baths:3,size:'5 Marla',city:'Multan',loc:'Citi Housing Phase 1, Multan',type:'House',status:'sale',img:'lst-citi-multan.jpg',badge:'For Sale',url:'https://anngan.com/property/5-marla-house-for-sale-in-citi-housing-multan-phase-1/'},
{id:'orchard-rent',title:'2 bed upper portion available for rent in Bahria Orchard',price:'Rs 39,000 per month',n:39000,beds:2,baths:2,size:'5 Marla',city:'Lahore',loc:'Bahria Orchard, Lahore',type:'Portion',status:'rent',img:'lst-orchard-rent.jpg',badge:'For Rent',url:'https://anngan.com/property/2-bed-upper-portion-available-for-rent-in-bahria-orchard/'},
{id:'bahria8-rent',title:'10 Marla furnished house for rent, Bahria Town Phase 8 Rawalpindi',price:'Rs 300,000 per month',n:300000,beds:5,baths:5,size:'10 Marla',city:'Rawalpindi',loc:'Bahria Town Phase 8, Rawalpindi',type:'House',status:'rent',img:'lst-bahria8-rent.jpg',badge:'For Rent',url:'https://anngan.com/property/10-marla-furnished-house-for-rent-bahria-town-phase-8-rawalpindi/'},
{id:'kuri-rent',title:'6 Marla house for rent in Kuri Road near Pindoriya, Islamabad',price:'Rs 70,000 per month',n:70000,beds:4,baths:5,size:'6 Marla',city:'Islamabad',loc:'Kuri Road, Islamabad',type:'House',status:'rent',img:'lst-kuri-rent.jpg',badge:'For Rent',url:'https://anngan.com/property/6-marla-house-for-rent-in-kuri-road-near-pindoriya/'}
];
var PROJECTS=[
{name:'MGH Pakistan',loc:'Mangla',city:'Mangla',page:'project-mgh.html',img:'mgh-lake-aerial.jpg',note:'Zamindar File, Affidavit MGH and Serene Farm Houses, inside one project.'},
{name:'Global Homes Lahore',loc:'Lahore',city:'Lahore',page:'project-global.html',img:'global-zamzam-location.jpg',note:'Zam Zam City, Lahore. LDA approved.'},
{name:'Al Ghani Phase 7',loc:'Lahore',city:'Lahore',page:'project-alghani.html',img:'alghani-hero.jpeg',note:'Bhaini Road, Lahore.'},
{name:'Urban City',loc:'Lahore',city:'Lahore',page:'project-urban.html',img:'urban-drone.jpg',note:'80,000+ kanals, Lahore.'},
{name:'China Town',loc:'Lahore',city:'Lahore',page:'project-chinatown.html',img:'chinatown-bahria-sky.jpg',note:'Inside Bahria Sky, Bahria Orchard, Lahore.'},
{name:'Pak China Grain Market',loc:'Multan',city:'Multan',page:'project-grain.html',img:'',note:'54 acres, Shujabad Road, Multan. 996 shops.'},
{name:'Kashmir Modern City',loc:'Kashmir',city:'Kashmir',page:'project-kashmir.html',img:'kmc-01.jpg',note:'Sold Out. Mirpur, Kashmir.'}
];
function cardHTML(l){return "<article class='card'><div class='ph'><img src='assets/img/"+l.img+"' alt='"+l.title+"' loading='lazy'><span class='tag'>"+l.badge+"</span></div><div class='bd'><div class='price'>"+l.price+"</div><h3>"+l.title+"</h3><div class='loc'>"+l.loc+"</div><div class='specs'><span>"+l.beds+" Beds</span><span>"+l.baths+" Baths</span><span>"+l.size+"</span><span>"+l.type+"</span></div><div class='row'><a class='btn btn-red btn-sm' href='tel:+923041111698'>Call</a><a class='btn btn-wa btn-sm' href='https://wa.me/923041111698' target='_blank' rel='noopener'>WhatsApp</a><a class='btn btn-line btn-sm' href='"+l.url+"' target='_blank' rel='noopener'>On anngan.com</a></div></div></article>"}
function projHTML(p){var ph=p.img?"<div class='ph'><img src='assets/img/"+p.img+"' alt='"+p.name+"' loading='lazy'></div>":"<div class='ph shopplan'><div class='shopplan-in'><b>Pak China Grain Market</b><span>2 Marla Rs 56 Lac</span><span>3 Marla Rs 84 Lac</span><span>4 Marla Rs 112 Lac</span></div></div>";return "<article class='card'>"+ph+"<div class='bd'><h3>"+p.name+"</h3><div class='loc'>"+p.loc+"</div><p>"+p.note+"</p><div class='row'><a class='btn btn-red btn-sm' href='"+p.page+"'>View project</a><a class='btn btn-line btn-sm' href='tel:+923041111698'>Call</a></div></div></article>"}
var cur='all';
document.querySelectorAll('.tabs button[data-status]').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.tabs button[data-status]').forEach(function(x){x.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true');cur=b.getAttribute('data-status')})});
function budgetOK(l,bud){if(!bud)return true;if(l.status==='rent')return true;if(bud.indexOf('Under')===0)return l.n<10000000;if(bud.indexOf('Rs 1 to 3')===0)return l.n>=10000000&&l.n<30000000;if(bud.indexOf('Rs 3 to 5')===0)return l.n>=30000000&&l.n<50000000;return l.n>=50000000}
function doSearch(fromURL){
  var key=(document.getElementById('sKey')?document.getElementById('sKey').value:'').trim().toLowerCase();
  var typ=document.getElementById('sType')?document.getElementById('sType').value:'';
  var loc=document.getElementById('sLoc')?document.getElementById('sLoc').value:'';
  var bed=document.getElementById('sBed')?document.getElementById('sBed').value:'';
  var bud=document.getElementById('sBud')?document.getElementById('sBud').value:'';
  var note=document.getElementById('searchNote'),box=document.getElementById('searchResults'),band=document.getElementById('searchResultsBand');
  var wantProjects=(cur==='project'||key.indexOf('mgh')>=0||key.indexOf('mangla')>=0||key.indexOf('project')>=0);
  var hits=LISTINGS.filter(function(l){
    if(cur==='sale'&&l.status!=='sale')return false;
    if(cur==='rent'&&l.status!=='rent')return false;
    if(loc&&l.city!==loc)return false;
    if(typ&&typ!=='File'&&l.type!==typ)return false;
    if(typ==='File')return false;
    if(bed){if(bed==='5+'){if(l.beds<5)return false}else if(l.beds!==parseInt(bed,10))return false}
    if(!budgetOK(l,bud))return false;
    if(key){var hay=(l.title+' '+l.loc+' '+l.city+' '+l.size+' '+l.type).toLowerCase();if(hay.indexOf(key)<0)return false}
    return true});
  var phits=PROJECTS.filter(function(p){if(cur==='sale'||cur==='rent')return false;if(loc&&p.city!==loc)return false;if(key){var hay=(p.name+' '+p.loc+' '+p.city).toLowerCase();if(hay.indexOf(key)<0)return false}return true});
  if(typ==='File'){phits=PROJECTS.filter(function(p){return p.name==='MGH Pakistan'})}
  var out='',msg='';
  if(hits.length||phits.length){
    if(hits.length)out+=hits.map(cardHTML).join('');
    if(phits.length)out+=phits.map(projHTML).join('');
    var parts=[];
    if(hits.length)parts.push(hits.length+' listing(s)');
    if(phits.length)parts.push(phits.length+' project(s)');
    msg='Found '+parts.join(' and ')+'.';
    if(loc==='Karachi'&&hits.length===1)msg+=' Karachi has only 1 real listing on anngan.com, the Shamsi Society flat below. Nearest other listings are in Lahore.';
    if(key&&hits.length===0&&phits.length>0)msg+=' No listing matched that word, but these projects did.';
  } else {
    // never blank: show nearest real results
    var near=LISTINGS.filter(function(l){return l.city==='Lahore'}).slice(0,3);
    out=near.map(cardHTML).join('');
    msg='No exact match on anngan.com for that search. These are the nearest real listings, in Lahore. Call +92 304 1111 698 to ask about other cities.';
    if(loc)msg='No listing in '+loc+' on anngan.com yet. These are the nearest real listings, in Lahore. Call +92 304 1111 698 to ask.';
    if(key&&key.indexOf('karachi')>=0)msg='No Karachi listing matched that word. anngan.com has only 1 Karachi listing, the Shamsi Society flat, Rs 3,600,000. These are the nearest real listings, in Lahore.';
  }
  if(box){box.innerHTML=out;box.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in')})}
  if(band&&band.id==='searchResultsBand'&&band.style)band.style.display='block';
  if(note)note.textContent=msg;
  if(box)box.scrollIntoView({behavior:'smooth',block:'start'});
  return {hits:hits.length,projects:phits.length,msg:msg};
}
var sb=document.getElementById('searchBtn');
if(sb)sb.addEventListener('click',function(){doSearch(false)});
var sk=document.getElementById('sKey');
if(sk)sk.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();doSearch(false)}});
// URL params: ?city=Karachi, ?q=DHA
var qs=new URLSearchParams(window.location.search);
if(qs.get('city')||qs.get('q')){
  var sl=document.getElementById('sLoc');if(sl&&qs.get('city'))sl.value=qs.get('city');
  if(sk&&qs.get('q'))sk.value=qs.get('q');
  if(document.getElementById('searchBtn'))doSearch(true);
}
// Browse tabs on home
var bg=document.getElementById('browseGrid');
function renderBrowse(kind){
  if(!bg)return;
  if(kind==='homes'){bg.innerHTML=LISTINGS.filter(function(l){return l.type==='House'||l.type==='Flat'||l.type==='Portion'}).slice(0,6).map(cardHTML).join('')}
  else if(kind==='plots'){bg.innerHTML="<article class='card'><div class='bd'><h3>No plot listing on anngan.com right now</h3><p>Plots are sold as files and projects instead. See MGH Zamindar File at MGH Pakistan, Mangla, and the 7 projects.</p><div class='row'><a class='btn btn-red btn-sm' href='project-mgh.html'>MGH Zamindar File</a><a class='btn btn-navy btn-sm' href='projects.html'>All projects</a></div></div></article>"+PROJECTS.slice(0,2).map(projHTML).join('')}
  else{bg.innerHTML="<article class='card'><div class='bd'><h3>Pak China Grain Market, Multan</h3><p>996 shops, 54 acres, Shujabad Road. 2 Marla Rs 56 Lac, 3 Marla Rs 84 Lac, 4 Marla Rs 112 Lac.</p><div class='row'><a class='btn btn-red btn-sm' href='project-grain.html'>View market</a></div></div></article><article class='card'><div class='bd'><h3>China Town, Lahore</h3><p>Pakistan's First China Town, inside Bahria Sky, Bahria Orchard, Lahore.</p><div class='row'><a class='btn btn-red btn-sm' href='project-chinatown.html'>View project</a></div></div></article>"}
}
if(bg){renderBrowse('homes');
document.querySelectorAll('.browse-tabs button').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.browse-tabs button').forEach(function(x){x.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true');renderBrowse(b.getAttribute('data-browse'))})});
}
// city cards (old, keep working)
document.querySelectorAll('[data-city]').forEach(function(t){t.addEventListener('click',function(){var city=t.getAttribute('data-city');window.location.href='properties.html?city='+encodeURIComponent(city)})});
// ---- tools ----
function num(id){var v=parseFloat(document.getElementById(id).value);return isNaN(v)?0:v}
var cc=document.getElementById('ccBtn');
if(cc)cc.addEventListener('click',function(){var a=num('ccArea'),r=num('ccRate');if(!a||!r){document.getElementById('ccOut').textContent='Enter both the covered area and your rate per sqft.';return}var total=a*r;var cont=document.getElementById('ccCont').checked;var grand=cont?total*1.10:total;document.getElementById('ccOut').textContent='Cost: Rs '+Math.round(total).toLocaleString('en-PK')+(cont?' + 10% contingency = Rs '+Math.round(grand).toLocaleString('en-PK'):'')});
var ln=document.getElementById('lnBtn');
if(ln)ln.addEventListener('click',function(){var P=num('lnAmt'),y=num('lnYears'),rate=num('lnRate');if(!P||!y||!rate){document.getElementById('lnOut').textContent='Enter the loan amount, years and annual markup.';return}var m=rate/100/12,n=y*12;var pay=P*m*Math.pow(1+m,n)/(Math.pow(1+m,n)-1);document.getElementById('lnOut').textContent='Monthly payment: Rs '+Math.round(pay).toLocaleString('en-PK')+'\nTotal paid over '+y+' years: Rs '+Math.round(pay*n).toLocaleString('en-PK')});
var ac=document.getElementById('acBtn');
if(ac)ac.addEventListener('click',function(){var v=num('acVal'),f=document.getElementById('acFrom').value;var sqft={Marla:272.25,Kanal:5445,Sqft:1,Sqyd:9,Acre:43560}[f]*v;document.getElementById('acOut').textContent=v+' '+f+' = '+sqft.toLocaleString('en-PK')+' sqft = '+(sqft/272.25).toFixed(2)+' Marla = '+(sqft/5445).toFixed(2)+' Kanal = '+(sqft/9).toFixed(2)+' sqyd = '+(sqft/43560).toFixed(3)+' Acre'});
var pf=document.getElementById('pfBtn');
if(pf)pf.addEventListener('click',function(){var c=document.getElementById('pfCity').value,s=document.getElementById('pfSize').value;var out=document.getElementById('pfOut');var hits=LISTINGS.filter(function(l){if(c&&l.city!==c)return false;if(s&&l.size!==s)return false;return true});var ph=PROJECTS.filter(function(p){if(c&&p.city!==c)return false;if(s==='5 Marla'&&p.name==='MGH Pakistan')return true;if(s)return false;return true});if(hits.length||ph.length){out.innerHTML=hits.map(cardHTML).join('')+ph.map(projHTML).join('')}else{out.innerHTML="<article class='card'><div class='bd'><h3>No match in that city and size</h3><p>Try another size, or call +92 304 1111 698. Nearest real listings are in Lahore.</p><div class='row'><a class='btn btn-red btn-sm' href='properties.html'>All properties</a></div></div></article>"+LISTINGS.filter(function(l){return l.city==='Lahore'}).slice(0,2).map(cardHTML).join('')}});
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
