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

function clearFavorites() {
    $.get('clear_favorites', function(data) {
        reloadPage();
    });
}

function favoriteFile(path) {
    $.get('favorite_file', {
        path: path
    }, function(data) {
        reloadPage();
    });
}

function deleteFile(folder, file) {
    $.get('delete_file', {
        folder: folder,
        file: file,
    }, function(data) {
        reloadPage();
    });
}
