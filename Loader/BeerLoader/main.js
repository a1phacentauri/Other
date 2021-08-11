let counter = document.querySelector('.counter'); /*метод querySelector() возвращает первый элемент (Element) документа, который соответствует указанному селектору или группе селекторов. Если совпадений не найдено, возвращает значение null.*/
let beer = document.querySelector('.beer-full');

beer.addEventListener('animationstart', function(){
 let count = +counter.textContent;
 let inter = setInterval(()=>{
  count++;
  counter.textContent = `${count}%`;
  if(count == 100) clearInterval(inter);
 },50)
});