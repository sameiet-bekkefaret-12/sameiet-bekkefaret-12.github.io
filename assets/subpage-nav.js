const menuButton=document.querySelector('.menu-button');
const menu=document.querySelector('#hovedmeny');
if(menuButton&&menu){
  menuButton.addEventListener('click',()=>{
    const open=menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded',String(open));
  });
  menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded','false');
  }));
}

const footer=document.querySelector('footer');
if(footer){
  const updated=document.createElement('p');
  updated.className='last-updated';
  updated.textContent='Sist oppdatert: 9. september 2026';
  footer.parentNode.insertBefore(updated,footer);
}
