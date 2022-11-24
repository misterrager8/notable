$(document).ready(function() {
	localStorage.getItem('MDLab') === 'light' ? setLight() : setDark();
	localStorage.getItem('navState') === 'collapsed' ? hideNav() : showNav();
});

var beforeSel;
var afterSel;

function toggleDiv(id) {
	$('#' + id).fadeToggle(150);
}

function setLight() {
	document.documentElement.setAttribute('data-theme', 'light');
	localStorage.setItem('MDLab', 'light');
	$('a[id^="setLight"]').hide();
	$('a[id^="setDark"]').show();
}

function setDark() {
	document.documentElement.setAttribute('data-theme', 'dark');
	localStorage.setItem('MDLab', 'dark');
	$('a[id^="setDark"]').hide();
	$('a[id^="setLight"]').show();
}

function hideNav() {
	$('body, .sidenav, .vertnav').addClass('collapsed');
	localStorage.setItem('navState', 'collapsed');
	$('#hideNav').hide();
	$('#showNav').show();
}

function showNav() {
	$('body, .sidenav, .vertnav').removeClass('collapsed');
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
				<a onclick="editNote('${folder}', '${name}')" class="btn btn-outline-success"><i class="bi bi-save" id="saveBtn"></i></a>
				<a onclick="formatText('bold')" class="btn btn-outline-secondary"><i class="bi bi-type-bold"></i></a>
				<a onclick="formatText('italic')" class="btn btn-outline-secondary"><i class="bi bi-type-italic"></i></a>
				<a onclick="formatText('numlist')" class="btn btn-outline-secondary"><i class="bi bi-123"></i></a>
				<a onclick="formatText('bullist')" class="btn btn-outline-secondary"><i class="bi bi-list-ul"></i></a>
				<a onclick="formatText('link')" class="btn btn-outline-secondary"><i class="bi bi-link"></i></a>
				<a onclick="formatText('time')" class="btn btn-outline-secondary"><i class="bi bi-clock"></i></a>
				<a onclick="formatText('heading')" class="btn btn-outline-secondary"><i class="bi bi-type-h1"></i></a>
				<a onclick="formatText('image')" class="btn btn-outline-secondary"><i class="bi bi-card-image"></i></a>
				<a onclick="formatText('code')" class="btn btn-outline-secondary"><i class="bi bi-code"></i></a>
				<a onclick="formatText('capitalize')" class="btn btn-outline-secondary"><i class="bi bi-type"></i></a>
			</div>
			<textarea autocomplete="off" class="invisible" id="format"></textarea>
			<textarea onselect="getselection(event)" id="content" class="form-control form-control-hidden" rows="30" onchange="editNote('${folder}', '${name}')">${data}</textarea>
			`);
	});
}

function getselection(event) {
	var sel = $('#content').val().substring(event.currentTarget.selectionStart, event.currentTarget.selectionEnd);
	beforeSel = $('#content').val().substring(0, event.currentTarget.selectionStart);
	afterSel = $('#content').val().substring(event.currentTarget.selectionEnd);
	$('#format').val(sel);
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

function editMemo(folder, name) {
	$.post('edit_memo', {
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

function deleteMemo(folder, name) {
	$.get('delete_memo', {
		folder: folder,
		name: name
	}, function(data) {
		location.reload();
	});
}

function formatText(type_) {
	var mid = $('#format').val();
	switch (type_) {
		case 'bold':
			var newMid = `${beforeSel}**${mid}**${afterSel}`;
			break;
		case 'italic':
			var newMid = `${beforeSel}*${mid}*${afterSel}`;
			break;
		case 'link':
			var newMid = `${beforeSel}[${mid}](url)${afterSel}`;
			break;
		case 'heading':
			var newMid = `${beforeSel}# ${mid}${afterSel}`;
			break;
		case 'numlist':
			var newMid = `${beforeSel}1. ${mid}${afterSel}`;
			break;
		case 'bullist':
			var newMid = `${beforeSel}- ${mid}${afterSel}`;
			break;
		case 'time':
			var newMid = `${beforeSel}${mid}${new Date()}${afterSel}`;
			break;
		case 'image':
			var newMid = `${beforeSel}![${mid}](url)${afterSel}`;
			break;
		case 'capitalize':
			var newMid = `${beforeSel}${mid.toUpperCase()}${afterSel}`;
			break;
		case 'code':
			var newMid = `${beforeSel}    ${mid}${afterSel}`;
	}
	$('#content').val(newMid);
	$('#content').trigger('change');
}
