let counter = document.querySelector('.counter');
let beer = document.querySelector('.beer-full');

beer.addEventListener('animationstart', function(){
 let count = +counter.textContent;
 let inter = setInterval(()=>{
  count++;
  counter.textContent = `${count}%`;
  if(count == 100) clearInterval(inter);
 },50)
});