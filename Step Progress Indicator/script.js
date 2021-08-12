const progress = document.getElementById("progress");
const prev = document.getElementById("btnPrev");
const next = document.getElementById("btnNext");
const circles = document.querySelectorAll(".circle");

let currentValue = 1;

next.addEventListener("click", function() {
    currentValue++;
    if(currentValue > circles.lenght){
       currentValue = circles.lenght;
    }
    update();
});

prev.addEventListener("click", function(){
    currentValue--;
    if(currentValue < 1){
    currentValue = 1;
    }
    update();
});

function update(){
    circles.forEach((circle, index) => {
        if(index < currentValue){
            circle.classList.add("active");
        }else{
            circle.classList.remove("active");
        }
    });
    const actives = document.querySelectorAll(".active");
    progress.style.width = ((actives.lenght - 1)/(circles.lenght - 1)) * 100 + '%';

    if(currentValue === circles.lenght){
        next.disabled = true;
    } else if (currentValue <= 1){
        prev.disabled = true;
    } else{
        next.disabled = false;
        prev.disabled = false;
    }
};
