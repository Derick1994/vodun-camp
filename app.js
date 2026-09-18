'use strict';
const config = window.CAMP_CONFIG;
const money = value => new Intl.NumberFormat('fr-FR').format(value);
const form = document.querySelector('#booking');
const field = name => form.elements.namedItem(name);
const text = (id, value) => { document.getElementById(id).textContent = value; };
const localISO = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const today = new Date(); today.setHours(0,0,0,0);
const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
field('arrival').value = localISO(today); field('departure').value = localISO(tomorrow);
field('arrival').min = localISO(today); field('departure').min = localISO(tomorrow);
const displayDate = value => new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'short',year:'numeric'}).format(new Date(`${value}T12:00:00`));
document.querySelectorAll('[data-price]').forEach(el => el.textContent = money(config.plans[el.dataset.price].price));
document.querySelector('#tent-cards').innerHTML = Object.entries(config.plans).map(([id,p]) => `<article class="tent-card ${id==='duo'?'featured':''}"><div class="tent-image"><img src="assets/camping-v2.png" alt="Détail de la simulation du camping, illustration de la formule ${p.name}" loading="lazy"><span class="tag">CONCEPTION · ${p.capacity} PERSONNE${p.capacity>1?'S':''}</span></div><div class="tent-content"><h3>${p.name}</h3><p>${p.description}</p><div class="tent-price"><strong>${money(p.price)}</strong> <small>FCFA / nuit</small></div><ul>${p.features.map(f=>`<li>${f}</li>`).join('')}</ul><p class="fineprint">Réservations fermées · ${p.capacity} pers. max.</p><a class="button" href="#reservation" data-plan="${id}">Choisir ${p.name} <span>↗</span></a></div></article>`).join('');
document.querySelector('#options').innerHTML = config.options.map(o=>`<label class="option"><input type="checkbox" name="${o.id}"><span>${o.name}<small>${o.label}</small></span><strong>${money(o.price)} F</strong></label>`).join('');
function estimate(){
 const plan = config.plans[field('plan').value], guests = Number(field('guests').value);
 const arrival = field('arrival').value, departure = field('departure').value;
 const nights = (Date.parse(departure)-Date.parse(arrival))/86400000;
 let error = '';
 if(!arrival || !departure || !Number.isInteger(nights) || nights<1) error='Le départ doit être au moins un jour après l’arrivée.';
 else if(arrival<localISO(today)) error='Choisissez une arrivée à partir d’aujourd’hui.';
 else if(guests>plan.capacity) error='Solo Camp accueille une personne. Choisissez Duo ou Comfort pour deux personnes.';
 else if(plan.stock<1) error='Cette formule est complète dans le stock de démonstration. Choisissez une autre formule.';
 const options = config.options.filter(o=>field(o.id).checked).map(o=>({...o, total:o.price*(o.basis==='person-night'?guests*nights:o.basis==='person-stay'?guests:1)}));
 const lodging = nights*plan.price;
 return {plan, guests, arrival, departure, nights, options, lodging, total:lodging+options.reduce((s,o)=>s+o.total,0), error};
}
function addLine(container,label,value){const row=document.createElement('div');row.className='summary-line';const a=document.createElement('span'),b=document.createElement('span');a.textContent=label;b.textContent=value;row.append(a,b);container.append(row);}
function update(){
 const s=estimate();text('booking-error',s.error);field('departure').min=field('arrival').value?localISO(new Date(Date.parse(field('arrival').value)+86400000)):localISO(tomorrow);
 text('summary-plan',s.plan.name);text('summary-dates',s.error?'Vérifiez les informations du séjour.':`${displayDate(s.arrival)} → ${displayDate(s.departure)} · ${s.guests} personne${s.guests>1?'s':''}`);
 const lines=document.querySelector('#summary-lines');lines.replaceChildren();
 if(!s.error){addLine(lines,`${s.nights} nuit${s.nights>1?'s':''} × ${money(s.plan.price)} F`,money(s.lodging)+' F');s.options.forEach(o=>addLine(lines,o.name,money(o.total)+' F'));}
 text('total',s.error?'—':money(s.total)+' F');text('availability','Réservations fermées. Aucun stock réel n’est bloqué.');text('early-total',s.error?'Vérifiez votre séjour':money(s.total)+' FCFA');text('early-detail',s.error?s.error:`${s.nights} nuit(s) · ${s.plan.name} · ${s.guests} personne(s), options incluses si sélectionnées.`);
 document.querySelector('#submit-booking').disabled=Boolean(s.error);
 return s;
}
form.addEventListener('input',update);form.addEventListener('change',update);
document.querySelectorAll('[data-plan]').forEach(a=>a.addEventListener('click',()=>{field('plan').value=a.dataset.plan;field('guests').value=String(config.plans[a.dataset.plan].capacity);update();}));
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Ouvrir le menu');}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{const d=document.querySelector('#lightbox');d.querySelector('img').src=button.dataset.image;d.querySelector('img').alt=button.dataset.caption;d.querySelector('p').textContent=button.dataset.caption;d.showModal();}));
let summaryText='';
form.addEventListener('submit',event=>{
 event.preventDefault();const s=update();if(s.error || !form.reportValidity())return;
 if(!field('fullname').value.trim()){field('fullname').setCustomValidity('Indiquez votre nom.');field('fullname').reportValidity();return;}
 const lines=['VODUN CAMP — SIMULATION UNIQUEMENT','Aucune réservation effectuée. Aucun paiement. Aucun envoi.',`${s.plan.name} · ${s.guests} personne(s)`,`${displayDate(s.arrival)} au ${displayDate(s.departure)} · ${s.nights} nuit(s)`,`Hébergement : ${money(s.lodging)} FCFA`,...s.options.map(o=>`${o.name} : ${money(o.total)} FCFA`),`TOTAL ESTIMÉ : ${money(s.total)} FCFA`,`Nom : ${field('fullname').value.trim()}`,`Téléphone : ${field('phone').value}`,`E-mail : ${field('email').value}`,`Paiement envisagé : ${field('payment').value} (non activé)`,'Accès : rue de l’église ECC Vakogbamey, à 100 m de la route goudronnée.','Point GPS communiqué : 6.380253, 2.092563.','Tarifs, services et dates du séjour à confirmer.'];
 summaryText=lines.join('\n');const body=document.querySelector('#confirmation-body');body.replaceChildren();lines.slice(2).forEach(line=>{const p=document.createElement('p');p.textContent=line;body.append(p);});document.querySelector('#confirmation').showModal();
});
field('fullname').addEventListener('input',()=>field('fullname').setCustomValidity(''));
document.querySelector('#download-summary').addEventListener('click',()=>{
 try {
  const {jsPDF}=window.jspdf;const doc=new jsPDF();
  doc.setFillColor(21,62,52);doc.rect(0,0,210,35,'F');doc.setTextColor(255,255,255);doc.setFontSize(22);doc.text('VODUN CAMP',18,21);
  doc.setTextColor(155,45,10);doc.setFontSize(12);doc.text('SIMULATION UNIQUEMENT - AUCUNE RESERVATION',18,46);
  doc.setTextColor(32,46,39);doc.setFontSize(11);let y=57;
  const clean=s=>s.replace(/[\u202f\u00a0]/g,' ').replace(/[’‘]/g,"'").replace(/[–—]/g,'-').replace(/→/g,'au');
  const rows=summaryText.split('\n').slice(2).concat(['Conditions :','Prix provisoires. Aucun paiement traite. Aucune tente bloquee.','Dates de reservation, autorisations et services non confirmes.','Ce document ne constitue ni un billet, ni une confirmation, ni une facture.','Les coordonnees restent dans ce PDF et dans votre navigateur. Aucun envoi.']);
  rows.forEach(row=>{const wrapped=doc.splitTextToSize(clean(row),174);wrapped.forEach(line=>{if(y>274){doc.addPage();y=22;}doc.text(line,18,y);y+=6;});y+=3;});
  for(let n=1;n<=doc.getNumberOfPages();n++){doc.setPage(n);doc.setFontSize(9);doc.setTextColor(95,105,95);doc.text('Prototype VODUN CAMP - Page '+n+' / '+doc.getNumberOfPages(),18,288);}
  doc.save('vodun-camp-simulation.pdf');text('pdf-status','PDF généré. Vérifiez les téléchargements de votre navigateur.');
 } catch {text('pdf-status','Le PDF n’a pas pu être généré. Rechargez la page et réessayez.');}
});
document.querySelector('#whatsapp').addEventListener('click',()=>{if(/^\d{8,15}$/.test(config.whatsapp)){window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent('Bonjour VODUN CAMP, je souhaite des informations sur le camping.')}`,'_blank','noopener,noreferrer');}else{text('contact-status','Le numéro WhatsApp n’a pas encore été communiqué. Le contact sera disponible à l’ouverture des réservations.');}});
text('year',new Date().getFullYear());
if('IntersectionObserver' in window)new IntersectionObserver(entries=>document.body.classList.toggle('booking-visible',entries[0].isIntersecting),{threshold:0}).observe(document.querySelector('#reservation'));
update();
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'read_camp_estimate',title:'Lire le devis du séjour',description:'Lit la simulation affichée, sans réserver ni envoyer de données personnelles.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(input){if(!input||Object.keys(input).length)throw new Error('Aucun paramètre attendu.');const s=estimate();return {formula:s.plan.name,nights:s.nights,guests:s.guests,total:s.error?null:s.total,currency:'XOF',error:s.error,demo:true};}})).catch(()=>{});}catch{}}
