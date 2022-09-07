$(document).ready(function() {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('MDLab'));
});

function changeTheme(theme) {
    localStorage.setItem('MDLab', theme);
    document.documentElement.setAttribute('data-theme', localStorage.getItem('MDLab'));
}

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}