let mainContainer = document.querySelector('.main-container');
let mainContainerRect = mainContainer.getBoundingClientRect();


//============== круг символов ===============

let signsZone = document.getElementById('signs-zone');
function animateSignRotating (signElement, x0, y0, r, speed, startDeg, isForward){
    let prevTime = performance.now();
    let deg = startDeg;
    let coef = isForward ? 1 : -1;
    signElement.style.left = x0 - signElement.clientWidth/2 +'px';
    signElement.style.top = y0 - signElement.clientHeight/2 +'px';
    speed = speed/1000;

    requestAnimationFrame (function rotating(time){

       let timeSincePrev = time-prevTime;
       deg = (coef*timeSincePrev*speed + deg) % 360;
       let radians = deg*Math.PI/180;
       let x = r*Math.cos(radians);
       let y = r*Math.sin(radians);
       signElement.style.translate = `${x}px ${y}px`

       prevTime = time;
       requestAnimationFrame (rotating);
    })
}

function animateSignsCircle(x0, y0, r, speed, isForward){
    let prevTime = performance.now();
    let deg = 0;
    let coef = isForward ? 1 : -1;
    speed = speed/1000;
    let circle = document.createElement('div');
    circle.classList.add('signs-circle');
    circle.style.height = r*2 + "px";
    circle.style.width = r*2 + "px";
    circle.style.left = x0 - r + 'px';
    circle.style.top = y0 - r + 'px';
    signsZone.append(circle);
    requestAnimationFrame(function circleRotating(time){
        let timeSincePrev = time-prevTime;
        deg = (coef*timeSincePrev*speed + deg) % 360;
        circle.style.rotate = `${deg}deg`;
        prevTime = time;
        requestAnimationFrame(circleRotating);
    })
}
let signsArr = [];
let reverseSignsArr = [];
let signsAmount = 16;
let reverseSignsAmount = 14;
let circleCenterX = window.innerWidth*1.12;
let circleCenterY = window.innerWidth*0.34;
let bigCircleRadius = window.innerWidth*0.4;
let smallCircleRadius = window.innerWidth*0.32;
let bigCircleSpeed = 10;  //градусы в сек
let smallCircleSpeed = 8;
for(let i = 0; i<signsAmount; i++){
    let sign = document.createElement('div');
    sign.classList.add('sign');
    sign.style.backgroundImage = `url('./img/sign${i+1}.png')`;
    signsArr.push(sign);
    signsZone.append(sign);
}


for(let i = 0; i<reverseSignsAmount; i++){
      let sign = document.createElement('div');
    sign.classList.add('sign');
    sign.style.backgroundImage = `url('./img/sign${reverseSignsAmount - i}.png')`;
    reverseSignsArr.push(sign);
    signsZone.append(sign);
}

animateSignsCircle(circleCenterX, circleCenterY, bigCircleRadius, bigCircleSpeed, true);
signsArr.forEach((element, index)=>{
    animateSignRotating(element, circleCenterX, circleCenterY, bigCircleRadius, bigCircleSpeed, index*360/signsAmount, true);
})


animateSignsCircle(circleCenterX, circleCenterY, smallCircleRadius, smallCircleSpeed, false);
reverseSignsArr.forEach((element, index)=>{
    animateSignRotating(element, circleCenterX, circleCenterY, smallCircleRadius, smallCircleSpeed, index*360/reverseSignsAmount, false);
})

//==========================================

// ====== увеличение карточек =========
let researchCardsContainer = document.getElementById('research-cards-container');
let researchCardsArr = Array.from(researchCardsContainer.querySelectorAll('.research-card'));

let screenCenterY = mainContainerRect.height / 2;
let screenBottomY = mainContainerRect.height;

researchCardsArr.forEach((element, index)=>{
    scaleByElementCenterYPosition(element, screenBottomY, screenCenterY, 1.08, 1);

    mainContainer.addEventListener('scroll', ()=>{
        requestAnimationFrame(() => {
            scaleByElementCenterYPosition(element, screenBottomY, screenCenterY, 1.08, 1);
        });
 })
})

//============================



// ====== горизонтальный скролл с эффектами =============

function verticalToHorizontalScrollInsideZone(innerElement, container, zoneBottomYCoordInViewport = window.innerHeight, zoneTopYCoordInViewport = 0) {
    container.addEventListener('wheel', (event) => {
        event.preventDefault();
        requestAnimationFrame(() => {
            let innerElementRect = innerElement.getBoundingClientRect();
            let innerElementCenterY = innerElementRect.top + innerElementRect.height/2;
            if (innerElementCenterY <= zoneBottomYCoordInViewport && innerElementCenterY >= zoneTopYCoordInViewport - 1) {
                innerElement.scrollLeft += event.deltaY * 0.5;
            }
        });

    });

    let touchStartY = 0;
    container.addEventListener('touchstart', (event) => {
        requestAnimationFrame(() => {
            touchStartY = event.touches[0].clientY;
        })
    })

    container.addEventListener('touchmove', (event) => {
        requestAnimationFrame(() => {
            let innerElementRect = innerElement.getBoundingClientRect();
            let innerElementCenterY = innerElementRect.top + innerElementRect.height/2;
            let deltaY = touchStartY - event.touches[0].clientY;

            if (innerElementCenterY <= zoneBottomYCoordInViewport && innerElementCenterY >= zoneTopYCoordInViewport - 1) {
                innerElement.scrollLeft += deltaY * 0.08;
            }
        });

    });
}


function disableVerticalScrollUntilHorizontalIsDone(innerElement, container, innerElementCenterStopYCoordInViewport) {
    let containerStopScrollAbsoluteValue = innerElement.getBoundingClientRect().top + innerElement.getBoundingClientRect().height / 2 - innerElementCenterStopYCoordInViewport;
    container.addEventListener('wheel', (event) => {
        event.preventDefault();
        requestAnimationFrame(() => {
            let innerElementRect = innerElement.getBoundingClientRect();
            if (
                event.deltaY > 0
                && container.scrollTop + 1 >= containerStopScrollAbsoluteValue
                // && innerElementRect.top <= stopPointYCoordInViewport
                && innerElement.scrollLeft + 1 < innerElement.scrollWidth - innerElementRect.width
                ||
                event.deltaY < 0
                && container.scrollTop - 1 <= containerStopScrollAbsoluteValue
                && innerElement.scrollLeft - 1 > 0
            ) {
                container.scrollTop = containerStopScrollAbsoluteValue;
            } else {
                container.scrollTop += event.deltaY;
            }
        });

    })

    let touchStartY = 0;
    container.addEventListener('touchstart', (event) => {
        requestAnimationFrame(() => {
            touchStartY = event.touches[0].clientY;
        })
    })

    container.addEventListener('touchmove', (event) => {
        requestAnimationFrame(() => {
            let innerElementRect = innerElement.getBoundingClientRect();
            let deltaY = touchStartY - event.touches[0].clientY;
            if (
                deltaY > 0
                && container.scrollTop + 1 >= containerStopScrollAbsoluteValue
                // && innerElementRect.top <= stopPointYCoordInViewport
                && innerElement.scrollLeft + 1 < innerElement.scrollWidth - innerElementRect.width
                ||
                deltaY < 0
                && container.scrollTop - 1 <= containerStopScrollAbsoluteValue
                && innerElement.scrollLeft - 1 > 0

            ) {
                container.scrollTop = containerStopScrollAbsoluteValue;
            } else {
                container.scrollTop += deltaY * 0.08;
            }

        })
    });
}


function transformByXPosition(container, elementsArr, breakPointsArr) {

    breakPointsArr.sort((a, b) => a.x - b.x);

    let breakPointsDiff = {};
    for (let i = 1; i < breakPointsArr.length; i++) {
        breakPointsDiff[`${i-1}-${i}`] = {
            scale: breakPointsArr[i].scale - breakPointsArr[i-1].scale,
            rotateZ: breakPointsArr[i].rotateZ - breakPointsArr[i-1].rotateZ,
            rotateY: breakPointsArr[i].rotateY - breakPointsArr[i-1].rotateY,
            rotateX: breakPointsArr[i].rotateX - breakPointsArr[i-1].rotateX,
            translateZ: breakPointsArr[i].translateZ - breakPointsArr[i-1].translateZ,
            translateY: breakPointsArr[i].translateY - breakPointsArr[i-1].translateY,
            translateX: breakPointsArr[i].translateX - breakPointsArr[i-1].translateX,
        }
    }

    container.addEventListener('scroll', (event) => {

        requestAnimationFrame(() => {

            elementsArr.forEach((element) => {
                let elementRect = element.getBoundingClientRect();
                let currentElementCenterX = elementRect.x + elementRect.width / 2;

                if (currentElementCenterX <= breakPointsArr[0].x) {
                    element.style.transform =
                        `scale(${breakPointsArr[0].scale}) ` +
                        `rotateZ(${breakPointsArr[0].rotateZ})` +
                        `rotateY(${breakPointsArr[0].rotateY})` +
                        `rotateX(${breakPointsArr[0].rotateX})` +
                        `translateZ(${breakPointsArr[0].translateZ})` +
                        `translateY(${breakPointsArr[0].translateY})` +
                        `translateX(${breakPointsArr[0].translateX})`;

                    return;
                }

                let maxIndexBreakPoint = breakPointsArr.length - 1;
                if (currentElementCenterX >= breakPointsArr[maxIndexBreakPoint].x) {
                    element.style.transform =
                        `scale(${breakPointsArr[maxIndexBreakPoint].scale}) ` +
                        `rotateZ(${breakPointsArr[maxIndexBreakPoint].rotateZ})` +
                        `rotateY(${breakPointsArr[maxIndexBreakPoint].rotateY})` +
                        `rotateX(${breakPointsArr[maxIndexBreakPoint].rotateX})` +
                        `translateZ(${breakPointsArr[maxIndexBreakPoint].translateZ})` +
                        `translateY(${breakPointsArr[maxIndexBreakPoint].translateY})` +
                        `translateX(${breakPointsArr[maxIndexBreakPoint].translateX})`;

                    return;
                }
                for (let i = 1; i < breakPointsArr.length; i++) {
                    if (
                        currentElementCenterX >= breakPointsArr[i - 1].x
                        && currentElementCenterX <= breakPointsArr[i].x
                    ) {
                        let coef = (currentElementCenterX - breakPointsArr[i - 1].x) / (breakPointsArr[i].x - breakPointsArr[i - 1].x);
                        element.style.transform =
                            `scale(${breakPointsArr[i - 1].scale + coef * breakPointsDiff[`${i-1}-${i}`].scale}) ` +
                            `rotateZ(${breakPointsArr[i - 1].rotateZ + coef * breakPointsDiff[`${i-1}-${i}`].rotateZ}deg) ` +
                            `rotateY(${breakPointsArr[i - 1].rotateY + coef * breakPointsDiff[`${i-1}-${i}`].rotateY}deg) ` +
                            `rotateX(${breakPointsArr[i - 1].rotateX + coef * breakPointsDiff[`${i-1}-${i}`].rotateX}deg) ` +
                            `translateZ(${breakPointsArr[i - 1].translateZ + coef * breakPointsDiff[`${i-1}-${i}`].translateZ}px) ` +
                            `translateY(${breakPointsArr[i - 1].translateY + coef * breakPointsDiff[`${i-1}-${i}`].translateY}px) ` +
                            `translateX(${breakPointsArr[i - 1].translateX + coef * breakPointsDiff[`${i-1}-${i}`].translateX}px)`;

                        return;

                    }
                }
            });
        });


    })

}

let smallCardsContainer = document.getElementById('research-small-cards-container');

let breakPoints = [
    {
        x: smallCardsContainer.getBoundingClientRect().width * 1.5,
        scale: 0.2,
        translateX: 0,
        translateY: window.innerWidth,
        translateZ: 0,
        rotateX: -50,
        rotateY: 100,
        rotateZ: 14,
    },
    {
        x: smallCardsContainer.getBoundingClientRect().width,
        scale: 0.4,
        translateX: 0,
        translateY: window.innerWidth * 0.4,
        translateZ: 0,
        rotateX: -25,
        rotateY: 70,
        rotateZ: 7,
    },
    {
        x: smallCardsContainer.getBoundingClientRect().width * 0.6,
        scale: 1,
        translateX: 0,
        translateY: window.innerWidth * 0.04,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
    },
    {
        x: smallCardsContainer.getBoundingClientRect().width * 0.4,
        scale: 1,
        translateX: 0,
        translateY: - window.innerWidth * 0.04,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
    },
    {
        x: 0,
        scale: 1,
        translateX: 0,
        translateY: - window.innerWidth * 0.125,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
    }
]

let smallCardsContainerRect =smallCardsContainer.getBoundingClientRect();
let smallCardsArr = Array.from(smallCardsContainer.querySelectorAll('.research-small-card'));

transformByXPosition(smallCardsContainer, smallCardsArr, breakPoints);

verticalToHorizontalScrollInsideZone(smallCardsContainer, mainContainer, mainContainerRect.height, 0);

disableVerticalScrollUntilHorizontalIsDone(smallCardsContainer, mainContainer, mainContainerRect.height - smallCardsContainerRect.height / 2 + 30);

// ==========================================



