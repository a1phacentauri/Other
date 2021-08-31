const body = document.body;
const slider = document.querySelectorAll(".slider");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

let activeIndex = 0;
changeBGImage();
rightBtn.addEventListener('click', () => {
    activeIndex++;
    if (activeIndex > slider.length - 1) {
        activeIndex = 0;
    }
    changeBGImage();
    setActiveIndex();
})

leftBtn.addEventListener('click', () => {
    activeIndex--;
    if (activeIndex < 0) {
        activeIndex = slider.length - 1;
    }
    changeBGImage();
    setActiveIndex();
})

function changeBGImage() {
    body.style.backgroundImage = slider[activeIndex].style.backgroundImage;
}

function setActiveIndex() {
    slider.forEach(slide => slide.classList.remove("active"));

    slider[activeIndex].classList.add("active");
}