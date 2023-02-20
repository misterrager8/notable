var beforeSel;
var afterSel;

function Navbar(props) {
	const [theme, setTheme] = React.useState(localStorage.getItem('MarkdownLab'));

	const changeTheme = (theme_) => {
		localStorage.setItem('MarkdownLab', theme_);
		document.documentElement.setAttribute('data-theme', theme_);
		setTheme(theme_);
	}

	React.useEffect(() => {
		changeTheme(theme);
	}, []);

	return (
		<div className="d-flex justify-content-between p-2">
			<div className="btn-group btn-group-sm">
				<a onClick={() => props.fn()} className="btn btn-outline-secondary"><i className="bi bi-house-fill"></i></a>
				<a data-bs-target="#themes" data-bs-toggle="dropdown" className="btn btn-outline-secondary dropdown-toggle text-capitalize"><i className="bi bi-paint-bucket"></i> {theme}</a>
				<div id="themes" className="dropdown-menu text-center">
					{theme !== 'light' && <a onClick={() => changeTheme('light')} className="small dropdown-item text-capitalize">light</a>}
					{theme !== 'dark' && <a onClick={() => changeTheme('dark')} className="small dropdown-item text-capitalize">dark</a>}
					{theme !== 'teal' && <a onClick={() => changeTheme('teal')} className="small dropdown-item text-capitalize">teal</a>}
					{theme !== 'strawberry' && <a onClick={() => changeTheme('strawberry')} className="small dropdown-item text-capitalize">strawberry</a>}
					{theme !== 'manila' && <a onClick={() => changeTheme('manila')} className="small dropdown-item text-capitalize">manila</a>}
					{theme !== 'forest' && <a onClick={() => changeTheme('forest')} className="small dropdown-item text-capitalize">forest</a>}
					{theme !== 'lavender' && <a onClick={() => changeTheme('lavender')} className="small dropdown-item text-capitalize">lavender</a>}
				</div>
			</div>
		</div>
		);
}

function FolderItem(props) {
	return (
		<div className={'px-3 py-1 text-truncate rounded' + (props.folder.name === props.selected ? ' selected' : '')}>
			<a className="heading" onClick={() => props.fn(props.folder.name)}>{props.folder.name}</a>
		</div>
		);
}

function NoteItem(props) {
	return (
		<div className={'folder-card px-3 py-2 text-truncate' + (props.note.stem === props.selected ? ' selected' : '')}>
			<a title={props.note.stem} className="heading" onClick={() => props.fn(props.note.folder, props.note.name)}>{props.note.stem}</a>
			<div className="small fw-light">{props.note.last_modified}</div>
		</div>
		);
}

function App() {
	const [showFolders, setShowFolders] = React.useState(true);
	const [loading, setLoading] = React.useState(false);

	const [folders, setFolders] = React.useState([]);
	const [folder, setFolder] = React.useState([]);
	const [note, setNote] = React.useState([]);

	const [deletingNote, setDeletingNote] = React.useState(false);
	const [deletingFolder, setDeletingFolder] = React.useState(false);
	const [saved, setSaved] = React.useState(false);

	const [mode, setMode] = React.useState('view');

	const exitAll = () => {
		setFolder([]);
		setNote([]);
	}

	const getFolders = () => {
		setLoading(true);
		$.get('/get_folders', function(data) {
			setFolders(data.folders);
			setLoading(false);
		});
	}

	const createFolder = () => {
		setLoading(true);
		$.get('/create_folder', function(data) {
			setFolder(data);
			setNote([]);
			getFolders();
			setLoading(false);
			setTimeout(function(){$('#folder-name').select();}, 250);
		});
	}

	const getFolder = (name) => {
		setLoading(true);
		$.get('/get_folder', {
			name: name
		}, function(data) {
			setFolder(data);
			// setNote([]);
			localStorage.setItem('last-folder-opened', data.name);
			setLoading(false);
		});
	}

	const renameFolder = (e) => {
		setLoading(true);
		e.preventDefault();
		$.post('/rename_folder', {
			folder: folder.name,
			new_name: $('#folder-name').val()
		}, function(data) {
			getFolders();
			setFolder(data);
			setLoading(false);
		});
	}

	const deleteFolder = () => {
		setLoading(true);
		$.get('/delete_folder', {
			name: folder.name
		}, function(data) {
			setFolder([]);
			setDeletingFolder(false);
			getFolders();
			setLoading(false);
		});
	}

	const createNote = () => {
		setLoading(true);
		$.get('/create_note', {
			folder: folder.name
		}, function(data) {
			setNote(data.note);
			setFolder(data.folder);
			setMode('edit');
			setLoading(false);
			setTimeout(function(){$('#note-name').select();}, 250);
		});
	}	

	const saveNote = (e) => {
		e.preventDefault();
		$.post('/save_note', {
			folder: folder.name,
			url: $('#url').val()
		}, function(data) {
			setNote(data.note);
			setFolder(data.folder);
			setMode('edit');
			setLoading(false);
			$('#save-note').modal('toggle'); 
			setTimeout(function(){$('#note-name').select();}, 250);
		});
	}

	const getNote = (folder, name) => {
		setLoading(true);
		$.get('/get_note', {
			folder: folder,
			name: name
		}, function(data) {
			setNote(data);
			localStorage.setItem('last-note-opened', data.name);
			setLoading(false);
		});
	}

	const editNote = () => {
		setLoading(true);
		$.post('/edit_note', {
			folder: note.folder,
			name: note.name,
			content: $('#content').val()
		}, function(data) {
			setNote(data);
			setSaved(true);
			setLoading(false);
			setTimeout(function() { setSaved(false); }, 1500);
		});
	}

	const renameNote = (e) => {
		setLoading(true);
		e.preventDefault();
		$.post('/rename_note', {
			folder: note.folder,
			name: note.name,
			new_name: $('#note-name').val()
		}, function(data) {
			setNote(data.note);
			setFolder(data.folder);
			setLoading(false);
		});
	}

	const toggleFavorite = () => {
		setLoading(true);
		$.get('/toggle_favorite', {
			folder: note.folder,
			name: note.name
		}, function(data) {
			getNote(note.folder, note.name);
			setLoading(false);
		});
	}

	const deleteNote = () => {
		setLoading(true);
		$.get('/delete_note', {
			folder: note.folder,
			name: note.name
		}, function(data) {
			getFolder(note.folder);
			setDeletingNote(false);
			setLoading(false);
		});
	}

	const getSelection = (event) => {
		var sel = $('#content').val().substring(event.currentTarget.selectionStart, event.currentTarget.selectionEnd);
		beforeSel = $('#content').val().substring(0, event.currentTarget.selectionStart);
		afterSel = $('#content').val().substring(event.currentTarget.selectionEnd);
		$('#format').val(sel);
	}

	const formatText = (type_) => {
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
				var newMid = `${beforeSel}\n1. ${mid}\n${afterSel}`;
				break;
			case 'bullist':
				var newMid = `${beforeSel}\n- ${mid}\n${afterSel}`;
				break;
			case 'time':
				var newMid = `${beforeSel}${new Date().toLocaleString()}${afterSel}`;
				break;
			case 'image':
				var newMid = `${beforeSel}![${mid}](url)${afterSel}`;
				break;
			case 'capitalize':
				var newMid = `${beforeSel}${mid.toUpperCase()}${afterSel}`;
				break;
			case 'hrule':
				var newMid = `${beforeSel}\n---\n${afterSel}`;
				break;
			case 'code':
				var newMid = `${beforeSel}\n    ${afterSel}`;
		}
		$('#content').val(newMid);
		$('#content').trigger('change');
	}

	React.useEffect(() => {
		getFolders();
		getFolder(localStorage.getItem('last-folder-opened'));
		getNote(localStorage.getItem('last-folder-opened'), localStorage.getItem('last-note-opened'));
	}, []);

	return (
		<div className="p-4">
			<Navbar fn={exitAll}/>
			<div className="btn-group btn-group-sm mx-2 py-3">
				{loading && <span className="btn text-secondary"><span className="spinner-border spinner-border-sm"></span></span>}
				<a className="btn btn-outline-secondary" onClick={() => setShowFolders(!showFolders)} ><i className="bi bi-layout-sidebar-inset"></i> {(showFolders ? 'Hide ' : 'Show ') + 'Folders'}</a>
				{folder.length !== 0 && (<a data-bs-toggle="dropdown" data-bs-target="#new" className="btn btn-outline-success dropdown-toggle"><i className="bi bi-plus-lg"></i> New</a>)}
				
				<div id="new" className="dropdown-menu text-center">
					<a onClick={() => createNote()} className="dropdown-item small">Note</a>
					<a data-bs-toggle="modal" data-bs-target="#save-note" className="dropdown-item small">Page</a>
				</div>

				<div className="modal" id="save-note">
					<div className="modal-dialog">
						<div className="modal-content">
							<form onSubmit={(e) => saveNote(e)}>
								<input required autoComplete="off" className="form-control form-control-sm" placeholder="URL" id="url"/>
							</form>
						</div>
					</div>
				</div>
				
				{note.length !== 0 && <a onClick={() => toggleFavorite()} className={'btn btn-' + (!note.favorited ? 'outline-' : '') + 'warning'}><i className="bi bi-star"></i> {'Favorite' + (note.favorited ? 'd' : '')}</a>}
				{note.length !== 0 && <a onClick={() => setDeletingNote(!deletingNote)} className="btn btn-outline-danger"><i className="bi bi-trash2"></i> Delete Note</a>}
				{(note.length !== 0 && deletingNote) && <a onClick={() => deleteNote()} className="btn text-danger">Delete?</a>}
			</div>
			<div className="row">
				{(folders.length !== 0 && showFolders) &&
				<div className="col-2">
					<div className={'px-3 py-1 text-truncate rounded text-warning mb-2'}>
						<a className="heading"><i className="bi bi-star-fill"></i> Favorites</a>
					</div>
					{folders.map((x, id) => <FolderItem folder={x} key={id} selected={folder.name} fn={getFolder}/> )}
					<div className={'px-3 py-1 text-truncate rounded text-success mt-2 fst-italic'}>
						<a onClick={() => createFolder()} className="heading"><i className="bi bi-plus-circle"></i> New Folder</a>
					</div>
				</div>}
				{folder.length !== 0 &&
				<div className="col-2">
					<div className={'folder-card px-3 py-2 text-truncate text-center mb-2'}>
						<form onSubmit={(e) => renameFolder(e)} className="input-group">
							<span className="text-secondary me-3"><i className="bi bi-folder"></i></span>
							<input autoComplete="off" id="folder-name" defaultValue={folder.name} key={folder.name} className="form-control border-0 p-0 small heading"/>
						</form>
					</div>
					{folder.notes.map((x, id) => <NoteItem note={x} key={id} selected={note.stem} fn={getNote}/> )}
					<div className={'folder-card px-3 py-2 text-truncate text-danger text-center mt-2'}>
						<a onClick={() => setDeletingFolder(!deletingFolder)} className="small heading">Delete {folder.name}</a><br/>
						{deletingFolder && <a onClick={() => deleteFolder()} className="btn btn-sm btn-outline-danger w-100 my-2">Delete?</a>}
					</div>
				</div>}
				{note.length !== 0 &&
				<div className={'col-' + (showFolders ? '8' : '10')}>
					<div className="text-center small fw-light mb-2">Last Modified: {note.last_modified}</div>
					<form onSubmit={(e) => renameNote(e)}><input key={note.stem} id="note-name" autoComplete="off" className="form-control border-0 fs-2 p-0" defaultValue={note.stem}/></form>
					<div className="my-3">
						<span className="btn-group btn-group-sm">
							<a onClick={() => setMode('view')} className={'btn btn-outline-secondary' + (mode === 'view' ? ' active' : '')}><i className="bi bi-eye"></i> View</a>
							<a onClick={() => setMode('edit')} className={'btn btn-outline-secondary' + (mode === 'edit' ? ' active' : '')}><i className="bi bi-pen"></i> Edit</a>
						</span>
						{mode === 'edit' &&
						<span className="btn-group mx-3">
							<a onClick={() => editNote()} className="btn btn-outline-success"><i className={'bi bi-' + (saved ? 'check-lg' : 'save2')}></i></a>
							<a onClick={() => formatText('bold')} className="btn btn-outline-secondary"><i className="bi bi-type-bold"></i></a>
							<a onClick={() => formatText('italic')} className="btn btn-outline-secondary"><i className="bi bi-type-italic"></i></a>
							<a onClick={() => formatText('numlist')} className="btn btn-outline-secondary"><i className="bi bi-list-ol"></i></a>
							<a onClick={() => formatText('bullist')} className="btn btn-outline-secondary"><i className="bi bi-list-ul"></i></a>
							<a onClick={() => formatText('link')} className="btn btn-outline-secondary"><i className="bi bi-link"></i></a>
							<a onClick={() => formatText('capitalize')} className="btn btn-outline-secondary"><i className="bi bi-type"></i></a>
							<a onClick={() => formatText('heading')} className="btn btn-outline-secondary"><i className="bi bi-type-h1"></i></a>
							<a onClick={() => formatText('code')} className="btn btn-outline-secondary"><i className="bi bi-code"></i></a>
							<a onClick={() => formatText('time')} className="btn btn-outline-secondary"><i className="bi bi-clock"></i></a>
						</span>}
					</div>
					{mode === 'view' ? (
						<div id="note-reader" dangerouslySetInnerHTML={{__html:note.markdown }}></div>
					) : (
						<div>
							<textarea onSelect={(e) => getSelection(e)} id="content" className="form-control form-control-sm border-0" rows="20" defaultValue={note.text} key={note.text}></textarea>
							<textarea autocomplete="off" class="invisible" id="format"></textarea>
						</div>
					)}
				</div>}
			</div>
		</div>
		);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
