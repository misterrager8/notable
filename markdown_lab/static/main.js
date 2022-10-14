$(document).ready(function() {{
    localStorage.getItem('MDLab') === 'dark' ? setDark() : setLight();
}});

function setDark() {{
    localStorage.setItem('MDLab', 'dark');
    document.documentElement.setAttribute('data-theme', localStorage.getItem('MDLab'));
    $('#dark').show();
    $('#light').hide();
}}

function setLight() {{
    localStorage.setItem('MDLab', 'light');
    document.documentElement.setAttribute('data-theme', localStorage.getItem('MDLab'));
    $('#light').show();
    $('#dark').hide();
}}

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function reloadPage() {
    $('#pageContent').load(location.href + ' #pageContent');
}

function editNote(folder, file) {
    $.post('edit_note', {
        folder: folder,
        file: file,
        content: $('#content').val()
    }, function(data) {
        // reloadPage();
        $('#done').show();
        setTimeout(function() { $('#done').hide() }, 1000);
    });
}
