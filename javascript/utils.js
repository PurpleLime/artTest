let activeFigure = document.getElementById ("active-figure");
let cursorCircle = document.getElementById ("cursor-circle");
let activeFigureX = 0;
let activeFigureY = 0;
let cursorCircleX = 0;
let cursorCircleY = 0;
let clientX = 0;
let clientY = 0;
let isSensor = 'ontouchstart' in window;

let startWidth = window.innerWidth;
window.addEventListener('resize', () => {
    if (window.innerWidth !== startWidth) {
        location.reload();
        startWidth = window.innerWidth;
    }
})

// ================== точка под курсором ===============
if (!isSensor) {
    window.addEventListener('mousemove',(event)=>{
        clientX = event.clientX;
        clientY = event.clientY;

    })
    function updateActiveFigure (){
        activeFigureX += (clientX - activeFigureX)/30;
        activeFigureY += (clientY - activeFigureY)/30;
        activeFigure.style.transform = `translate(${Math.round(activeFigureX)}px,${Math.round(activeFigureY)}px)`;
        requestAnimationFrame (()=>{
            updateActiveFigure ()
        })
    }
    function updateCursorCircle (){
        cursorCircleX  += (clientX - cursorCircleX )/6;
        cursorCircleY  += (clientY - cursorCircleY)/6;
        cursorCircle.style.transform = `translate(-50%, -50%) translate(${Math.round(cursorCircleX)}px,${Math.round(cursorCircleY)}px)`;
        requestAnimationFrame (()=>{
            updateCursorCircle ()
        })
    }
    updateActiveFigure ();
    updateCursorCircle ();
} else {
    cursorCircle.style.display = 'none';
}

//===============================


//================= увеличение карточек ================

function scaleByElementCenterYPosition(element, lowPointYCoord, highPointYCoord, lowPointScaleCoef, highPointScalrCoef) {

    let elementRect = element.getBoundingClientRect();
    let elementCenterY = elementRect.top + elementRect.height / 2;

    if (elementCenterY >= lowPointYCoord) {
        element.style.scale = lowPointScaleCoef;
        return;
    }
    if (elementCenterY <= highPointYCoord) {
        element.style.scale = highPointScalrCoef;
        return;
    }
    if (elementCenterY < lowPointYCoord && elementCenterY > highPointYCoord){
        let coef = (elementCenterY - highPointYCoord) / highPointYCoord;
        element.style.scale = highPointScalrCoef + coef * (lowPointScaleCoef - highPointScalrCoef);
        return;
    }
};

// =====================================


//================== зацикленные карточки =================

function infiniteCycledMoving(container, speed, isForward) {
    let containerRect = container.getBoundingClientRect();
    let elements = container.children;
    let firstElement = elements[isForward ? elements.length - 1 : 0];
    let secondElement = elements[isForward ? elements.length - 2 : 1];
    let marginType = isForward ? 'marginRight' : 'marginLeft';
    let prevTime = performance.now();
    let delta = 0;
    let isStopped = false;
    speed = speed / 1000;

    container.style.justifyContent = isForward ? 'end' : 'start';

    for (let i = 0; i < elements.length; i++) {
        if (isSensor) {
            elements[i].addEventListener('touchstart', () => {
                isStopped = true;
            });
            elements[i].addEventListener('touchend', () => {
                isStopped = false;
            })
        } else {
            elements[i].addEventListener('mouseenter', () => {
                isStopped = true;
            })
            elements[i].addEventListener('mouseleave', () => {
                isStopped = false;
            })
        }
    }


    requestAnimationFrame(function move(time) {
        let timeSincePrev = time - prevTime;
        if (!isStopped) {
            delta = delta - timeSincePrev * speed;
            firstElement.style[marginType] = `${delta}px`;
            let secondElementOffset = isForward ? containerRect.right - secondElement.getBoundingClientRect().right : secondElement.getBoundingClientRect().left;
            if (secondElementOffset <= 0) {
                container.removeChild(firstElement);
                if (isForward) {
                    container.prepend(firstElement);
                } else {
                    container.append(firstElement);
                }
                firstElement.style[marginType] = '0px';
                delta = secondElementOffset;
                elements = container.children;
                firstElement = elements[isForward ? elements.length - 1 : 0];
                secondElement = elements[isForward ? elements.length - 2 : 1];
                firstElement.style[marginType] = `${delta}px`;
            }
        }
        prevTime = time;
        requestAnimationFrame(move);
    });
}

//=======================================
