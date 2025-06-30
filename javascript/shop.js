let plusButtonsArr = Array.from(document.querySelectorAll('.shop-item-add-button'));

plusButtonsArr.forEach((item) => {
    item.addEventListener('click', () => {
        window.location.href = '404.html';
    })
});
