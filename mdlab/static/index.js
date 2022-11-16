$(document).ready(function() {
	localStorage.getItem('MDLab') === 'light' ? setLight() : setDark();
	localStorage.getItem('navState') === 'collapsed' ? hideNav() : showNav();
});

function toggleDiv(id) {
	$('#' + id).fadeToggle(150);
}

function setLight() {
	document.documentElement.setAttribute('data-theme', 'light');
	localStorage.setItem('MDLab', 'light');
	$('#setLight').hide();
	$('#setDark').show();
}

function setDark() {
	document.documentElement.setAttribute('data-theme', 'dark');
	localStorage.setItem('MDLab', 'dark');
	$('#setDark').hide();
	$('#setLight').show();
}

function hideNav() {
	$('body, .sidenav').addClass('collapsed');
	localStorage.setItem('navState', 'collapsed');
	$('#hideNav').hide();
	$('#showNav').show();
}

function showNav() {
	$('body, .sidenav').removeClass('collapsed');
	localStorage.setItem('navState', 'shown');
	$('#hideNav').show();
	$('#showNav').hide();
}

function getText(folder, name) {
	$('#viewMode').show();
	$('#editMode').hide();
	$.get('get_text', {
		folder: folder,
		name: name
	}, function(data) {
		$('#note').html(`
			<div class="btn-group mb-4">
				<a class="btn btn-outline-success"><i class="bi bi-save" id="saveBtn"></i></a>
				<a class="btn btn-outline-secondary"><i class="bi bi-type-bold"></i></a>
				<a class="btn btn-outline-secondary"><i class="bi bi-type-italic"></i></a>
				<a class="btn btn-outline-secondary"><i class="bi bi-list-ol"></i></a>
				<a class="btn btn-outline-secondary"><i class="bi bi-list-ul"></i></a>
				<a class="btn btn-outline-secondary"><i class="bi bi-link"></i></a>
				<a class="btn btn-outline-secondary"><i class="bi bi-clock"></i></a>
				<a class="btn btn-outline-secondary"><i class="bi bi-type"></i></a>
				<a class="btn btn-outline-secondary"><i class="bi bi-type-h1"></i></a>
				<a class="btn btn-outline-secondary"><i class="bi bi-card-image"></i></a>
				<a class="btn btn-outline-secondary"><i class="bi bi-code"></i></a>
				<a class="btn btn-outline-secondary"><i class="bi bi-quote"></i></a>
			</div>
			<textarea id="content" class="form-control form-control-hidden" rows="30" onchange="editNote('${folder}', '${name}')">${data}</textarea>
			`);
	});
}

function getMarkdown(folder, name) {
	$('#viewMode').hide();
	$('#editMode').show();
	$.get('get_markdown', {
		folder: folder,
		name: name
	}, function(data) {
		$('#note').html(data);
	});
}

function editNote(folder, name) {
	$.post('edit_note', {
		folder: folder,
		name: name,
		content: $('#content').val()
	}, function(data) {
		$('#saveBtn').toggleClass(['bi-save', 'bi-check-lg']);
		setTimeout(function() { $('#saveBtn').toggleClass(['bi-save', 'bi-check-lg']); }, 1500);
	});
}

function toggleFavorite(folder, name) {
	$.get('toggle_favorite', {
		folder: folder,
		name: name
	}, function(data) {
		location.reload();
	});
}

function deleteNote(folder, name) {
	$.get('delete_note', {
		folder: folder,
		name: name
	}, function(data) {
		location.reload();
	});
}
