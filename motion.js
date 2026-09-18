'use strict';
(() => {
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const control=document.querySelector('#motion-control');
 let paused=preference.matches;
 let observer;
 function configure(){
  observer?.disconnect();
  document.body.classList.toggle('motion-paused',paused);
  control.setAttribute('aria-pressed',String(paused));
  control.textContent=paused?'Activer les animations':'Désactiver les animations';
  if(paused || !('IntersectionObserver' in window))return;
  observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('reveal-enter');observer.unobserve(entry.target);}
  }),{threshold:.12});
  document.querySelectorAll('.section-heading,.tent-card,.service-grid article,.location-landmarks article').forEach(el=>{
   if(!el.classList.contains('reveal-enter'))observer.observe(el);
  });
 }
 control.addEventListener('click',()=>{paused=!paused;configure();});
 preference.addEventListener('change',event=>{paused=event.matches;configure();});
 configure();
})();
