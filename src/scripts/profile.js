const prevPageBtn = document.getElementById('prev-page');
prevPageBtn.addEventListener('click', () => {
    window.history.back();
});