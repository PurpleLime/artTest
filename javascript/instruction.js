
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


//================= зацикленные карточки ======================

let newsContainer = document.querySelector('.instruction-cards-container');

infiniteCycledMoving(newsContainer, 50, true);

// =====================================================

let survivalButton = document.querySelector('.research-card-button');

survivalButton.addEventListener('click', () => {
    window.location.href = 'https://www.calameo.com/read/007905481032e2e89110e';
});
