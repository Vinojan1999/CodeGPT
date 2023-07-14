
window.onload = function() {
    var overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            closePopup();
        }
    });
};

window.closePopup = function() {
    var overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
};


