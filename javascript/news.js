

let newsContainer = document.querySelector('.news-container');

infiniteCycledMoving(newsContainer, 50, false);


// ====== увеличение карточек =========

let scalingCardsContainer = document.getElementById('research-cards-container');
let scalingCardsArr = Array.from(scalingCardsContainer.querySelectorAll('.research-card'));

let screenCenterY = window.innerHeight / 2;
let screenBottomY = window.innerHeight;

scalingCardsArr.forEach((element, index)=>{
    scaleByElementCenterYPosition(element, screenBottomY, screenCenterY, 1.08, 1);

    window.addEventListener('scroll', ()=>{
        requestAnimationFrame(() => {
            scaleByElementCenterYPosition(element, screenBottomY, screenCenterY, 1.08, 1);
        });
 })
})

//============================


//============ съезжающиеся карточки================

function changeGapByElementCenterYPosition(element, lowPointYCoord, highPointYCoord, lowPointGap, highPointGap) {

    let elementRect = element.getBoundingClientRect();
    let elementCenterY = elementRect.top + elementRect.height / 2;
    if (elementCenterY >= lowPointYCoord) {
        element.style.gap = lowPointGap + 'px';
        return;
    }
    if (elementCenterY <= highPointYCoord) {
        element.style.gap = highPointGap + 'px';
        return;
    }
    if (elementCenterY < lowPointYCoord && elementCenterY > highPointYCoord){
        let coef = (elementCenterY - highPointYCoord) / highPointYCoord;
        element.style.gap = highPointGap + coef * (lowPointGap - highPointGap) + 'px';
        return;
    }
}

let labEventsContainer = document.getElementById('lab-events-container');
let labEventsArr = Array.from(labEventsContainer.querySelectorAll('.lab-event'));
let lowGap = 1.3 * window.innerWidth;
let highGap = 0.0651 * window.innerWidth;
labEventsArr.forEach((labEvent) => {
    let labEventRect = labEvent.getBoundingClientRect();
    let labEventCenterY = labEventRect.top + window.scrollY + labEventRect.height / 2;
    let lowY = window.innerHeight + labEventRect.height / 2;
    let highY =
        labEventCenterY + 1 > document.documentElement.scrollHeight - window.innerHeight / 3
            ?
            window.innerHeight - (document.documentElement.scrollHeight - labEventCenterY + 1)
            :
            window.innerHeight * 2 / 3;

    changeGapByElementCenterYPosition(labEvent, lowY, highY, lowGap, highGap);

    window.addEventListener('scroll', ()=>{
        requestAnimationFrame(() => {
            changeGapByElementCenterYPosition(labEvent, lowY, highY, lowGap, highGap);
        });
 })
});

//================================


//============= модальное окно ==================
let modal = document.getElementById('modal');
let body = document.body;
let modalForm = modal.querySelector('.modal-form');
let participateButtonsArr = Array.from(document.querySelectorAll('.lab-event-button'));
let inputs = Array.from(document.querySelectorAll('.modal-input'));

function openModal() {
    inputs.forEach((input) => {
        input.value = '';
    });
    modal.classList.remove('modal-closed');
    body.classList.add('stop-scrolling');
}

function closeModal() {
    modal.classList.add('modal-closed');
    body.classList.remove('stop-scrolling');
}

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
})

modalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    closeModal();
})

participateButtonsArr.forEach((button) => {
    button.addEventListener('click', () => {
        openModal();
    })
});

// ========================

let alchemyButton = document.getElementById('alchemy-button');

alchemyButton.addEventListener('click', () => {
    window.location.href = 'https://elizavetashin.github.io/ProjectAP/';
})
