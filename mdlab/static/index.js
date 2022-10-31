$(document).ready(function() {
    localStorage.getItem('MDLab') === 'dark' ? setDark() : setLight();
});

function setDark() {
    localStorage.setItem('MDLab', 'dark');
    document.documentElement.setAttribute('data-theme', localStorage.getItem('MDLab'));
    $('#dark').show();
    $('#light').hide();
}

function setLight() {
    localStorage.setItem('MDLab', 'light');
    document.documentElement.setAttribute('data-theme', localStorage.getItem('MDLab'));
    $('#light').show();
    $('#dark').hide();
}

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function toggleNav() {
    $('#folders').toggle();    
    $('#note').toggleClass(['col-6', 'col-8']);
    $('#sidebar').toggleClass(['bi-layout-split', 'bi-layout-three-columns']);
}

function reloadPage() {
    $('#page').load(location.href + ' #page');
}

function createFolder() {
    $.post('create_folder', {
        name: $('#name').val()
    });
}

function createNote(folder) {
    $.post('create_note', {
        folder: folder,
        name: $('#notename').val()
    });
}

function deleteFolder(name) {
    $.get('delete_folder', {
        name: name
    });
}

function deleteNote(folder, name) {
    $.get('delete_note', {
        folder: folder,
        name: name
    });
}

function toggleFavorite(folder, name) {
    $.get('toggle_favorite', {
        folder: folder,
        name: name
    });
}

function getFolder(name, id) {
    $('div[id^="folder"]').removeClass('selected');
    $('#folder' + id).addClass('selected');
    $.get('get_folder', {
        name: name
    }, function(data) {
        $('#notes, #note').html('');
        $('#notes').html(`
            <a onclick="toggleDiv('newNote') " class="btn btn-sm btn-outline-success mb-3" ><i class="bi bi-plus-lg"></i> New Note</a>
            <a onclick="toggleDiv('deleteFolder')" class="btn btn-sm btn-outline-danger mb-3" ><i class="bi bi-x-lg"></i> Delete</a>
            <a onclick="deleteFolder('${name}') " style="display:none" id="deleteFolder" class="btn btn-sm text-danger mb-3">Delete?</a>
            <form onsubmit="event.preventDefault(); createNote('${name}');" class="mb-4" style="display: none;" id="newNote"><input type="text" id="notename" autocomplete="off" placeholder="Name" required class="form-control"></form>
            `);
        for (const[idx, x] of data.notes.entries()) {
            $('#notes').append(`
                <div id="note${idx}" class="text-truncate mb-2 p-1">
                <a class="font-custom" onclick="selectNote('${idx}'); getMarkdown('${name}', '${x.name}.md', ${x.favorited});"><i class="bi bi-sticky pe-1"></i> ${x.name}</a><br>
                <span class="small text-muted"><i class="bi bi-pen"></i> ${x.last_modified}</span>
                </div>
                `);
        }
    });
}

function getFavorites() {
    $('div[id^="folder"]').removeClass('selected');
    $('#folderFavs').addClass('selected');
    $.get('get_favorites', function(data) {
        $('#notes, #note').html('');
        for (const[idx, x] of data.favs.entries()) {
            $('#notes').append(`
                <div id="note${idx}" class="text-truncate mb-2 p-1">
                <a class="font-custom" onclick="selectNote('${idx}'); getMarkdown('${x.folder}', '${x.name}.md', 1);"><i class="bi bi-sticky pe-1"></i> ${x.name}</a><br>
                <span class="small text-muted"><i class="bi bi-pen"></i> ${x.last_modified}</span>
                </div>
                `);
        }
    });
}

function selectNote(id) {
    $('div[id^="note"]').removeClass('selected');
    $('#note' + id).addClass('selected');
}

function getMarkdown(folder, name, favorited) {
    $.get('get_markdown', {
        folder: folder,
        name: name
    }, function(data) {
        $('#note').html(`
            <a onclick="getText('${folder}', '${name}', ${favorited})" class="btn btn-sm btn-outline-secondary mb-3"><i class="bi bi-pen"></i> Edit</a>
            <a onclick="toggleFavorite('${folder}', '${name}')" class="btn btn-sm ${(favorited == 1) ? 'btn-warning':'btn-outline-warning'} mb-3"><i class="bi bi-star-fill"></i> ${(favorited == 1) ? 'Favorited':'Favorite'}</a>
            <a onclick="toggleDiv('deleteNote')" class="btn btn-sm btn-outline-danger mb-3"><i class="bi bi-x-lg"></i> Delete</a>
            <a id="deleteNote" style="display:none" onclick="deleteNote('${folder}', '${name}') " class="btn btn-sm text-danger mb-3">Delete?</a>
            <br>${data}
            `);
    });
}

function getText(folder, name, favorited) {
    $.get('get_text', { 
        folder: folder,
        name: name
    }, function(data) {
        $('#note').html(`
            <a onclick="getMarkdown('${folder}', '${name}', ${favorited})" class="btn btn-sm btn-outline-secondary mb-3"><i class="bi bi-eye"></i> View</a>
            <span id="saved" style="display:none" class="btn btn-sm text-success mb-3"><i class="bi bi-check-lg"></i> Saved.</span><br>
            <textarea id="text" onchange="editNote('${folder}', '${name}')" class="form-control border-0" rows=30 >${data}</textarea>
            `);
    });
}

function editNote(folder, name) {
    $.post('edit_note', { 
        folder: folder,
        name: name,
        text: $('#text').val()
    }, function (data) {
        $('#saved').show();
        setTimeout(function() { $('#saved').hide() }, 1500);
    });
}
