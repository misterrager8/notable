$(document).ready(function() {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('noteslocal_theme'));
});

function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('noteslocal_theme', theme);
}

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(250);
}

function refreshPage() {
    $('#pageContent').load(location.href + ' #pageContent');
    $('#navContent').load(location.href + ' #navContent');
}

function addNote() {
    $('#spinner').show();
    $.post('add_note', {
        new_note: $('#new_note').val()
    }, function(data) {
        refreshPage();
    })
}

function addNoteToFolder() {
    $('#spinner').show();
    $.post('add_note_to_folder', {
        dirname: $('#dirname').val(),
        new_note: $('#new_note').val()
    }, function(data) {
        refreshPage();
    })
}

function deleteNote(filename) {
    $('#spinner').show();
    $.get('delete_note', {
        filename: filename
    }, function(data) {
        refreshPage();
    })
}

function deleteFolder(dirname) {
    $('#spinner').show();
    $.get('delete_folder', {
        dirname: dirname
    }, function(data) {
        refreshPage();
    })
}

function previewMd() {
    $.post('preview_note', {
        editor: $('#editor').val()
    }, function(data) {
        $('#preview').html(data);
    })

}
