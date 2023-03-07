function App() {
	const [folders, setFolders] = React.useState([]);
	const [currentFolder, setCurrentFolder] = React.useState([]);

	const [notes, setNotes] = React.useState([]);
	const [currentNote, setCurrentNote] = React.useState([]);

	const [loading, setLoading] = React.useState(false);
	const [deleting, setDeleting] = React.useState(false);
	const [saved, setSaved] = React.useState(false);

	const [mode, setMode] = React.useState('view');

	const [theme, setTheme] = React.useState(localStorage.getItem('MarkdownLab'));

	const changeTheme = (theme_) => {
		localStorage.setItem('MarkdownLab', theme_);
		document.documentElement.setAttribute('data-theme', theme_);
		setTheme(theme_);
	}

	const createFolder = () => {
		setLoading(true);
		$.get('/create_folder', function(data) {
			setCurrentFolder(data);
			setNotes(data.notes);
			getFolders();
			setLoading(false);
		});
	}

	const getFolder = (name) => {
		setLoading(true);
		$.get('/get_folder', {
			name: name
		}, function(data) {
			setCurrentFolder(data);
			setNotes(data.notes);
			setLoading(false);
		});
	}

	const getFolders = () => {
		setLoading(true);
		$.get('/get_folders', function(data) {
			setFolders(data.folders);
			setLoading(false);
		});
	}

	const getFavorites = () => {
		setLoading(true);
		$.get('/get_favorites', function(data) {
			currentFolder.name !== 'Favorites' && setCurrentFolder({name : 'Favorites'});
			setNotes(data.favs);
			setLoading(false);
		});
	}

	const renameFolder = (e) => {
		e.preventDefault();
		setLoading(true);
		$.post('/rename_folder', {
			folder: currentFolder.name,
			new_name: $('#folder-name').val()
		}, function(data) {
			getFolders();
			getFolder(data.name);
			setLoading(false);
		});
	}

	const deleteFolder = () => {
		setLoading(true);
		$.get('/delete_folder', {
			name: currentFolder.name,
		}, function(data) {
			setCurrentFolder([]);
			getFolders();
			setLoading(false);
		});
	}

	const createNote = () => {
		setLoading(true);
		$.get('/create_note', {
			folder: currentFolder.name
		}, function(data) {
			setCurrentNote(data.note);
			setLoading(false);
		});
	}

	const saveNote = (e) => {
		e.preventDefault();
		setLoading(true);
		$.post('/save_note', {
			folder: currentFolder.name,
			url: $('#page-url').val()
		}, function(data) {
			setCurrentNote(data.note);
			setLoading(false);
		});
	}

	const getNote = (folder, name) => {
		setLoading(true);
		$.get('/get_note', {
			folder: folder,
			name: name
		}, function(data) {
			setCurrentNote(data);
			setLoading(false);
		});
	}

	const renameNote = (e) => {
		e.preventDefault();
		setLoading(true);
		$.post('/rename_note', {
			folder: currentNote.folder,
			name: currentNote.name,
			new_name: $('#note-name').val()
		}, function(data) {
			getFolder(data.folder.name);
			setTimeout(function() { getNote(data.note.folder, data.note.name); }, 250);
			setLoading(false);
		});
	}

	const editNote = () => {
		setLoading(true);
		$.post('/edit_note', {
			folder: currentNote.folder,
			name: currentNote.name,
			content: $('#content').val()
		}, function(data) {
			getNote(currentNote.folder, currentNote.name);
			setLoading(false);
			setSaved(true);
			setTimeout(function() { setSaved(false); }, 1500);
		});
	}

	const toggleFavorite = () => {
		setLoading(true);
		$.get('/toggle_favorite', {
			folder: currentNote.folder,
			name: currentNote.name
		}, function(data) {
			getNote(currentNote.folder, currentNote.name);
			currentFolder.name === 'Favorites' && getFavorites();
			setLoading(false);
		});
	}
	
	const deleteNote = () => {
		setLoading(true);
		$.get('/delete_note', {
			folder: currentNote.folder,
			name: currentNote.name
		}, function(data) {
			getFolder(currentFolder.name);
			setDeleting(false);
			setLoading(false);
		});
	}

	React.useEffect(() => {
		changeTheme(theme);
		getFolders();
	}, []);

	React.useEffect(() => {
		setCurrentNote([]);
	}, [currentFolder]);

	return (
		<div className="p-4">
			<nav className="py-2 sticky-top">
				<a onClick={() => setCurrentFolder([])} className="btn btn-sm text-secondary">{loading ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-house"></i>}</a>
					<a data-bs-target="#themes" data-bs-toggle="dropdown" className="btn btn-sm text-secondary dropdown-toggle text-capitalize"><i className="bi bi-paint-bucket"></i> {theme}</a>
					<div id="themes" className="dropdown-menu text-center">
						{theme !== 'light' && <a onClick={() => changeTheme('light')} className="small dropdown-item text-capitalize">light</a>}
						{theme !== 'dark' && <a onClick={() => changeTheme('dark')} className="small dropdown-item text-capitalize">dark</a>}
						{theme !== 'ocean' && <a onClick={() => changeTheme('ocean')} className="small dropdown-item text-capitalize">ocean</a>}
						{theme !== 'seashell' && <a onClick={() => changeTheme('seashell')} className="small dropdown-item text-capitalize">seashell</a>}
						{theme !== 'vanilla' && <a onClick={() => changeTheme('vanilla')} className="small dropdown-item text-capitalize">vanilla</a>}
						{theme !== 'mint' && <a onClick={() => changeTheme('mint')} className="small dropdown-item text-capitalize">mint</a>}
					</div>
				<a className={'btn btn-sm dropdown-toggle text-' + (currentFolder.name === 'Favorites' ? 'warning' : 'secondary')} data-bs-target="#folders" data-bs-toggle="dropdown"><i className={'bi bi-' + (currentFolder.name === 'Favorites' ? 'star-fill' : 'folder')}></i> {currentFolder.length === 0 ? 'Select Folder' : currentFolder.name}</a>
				<div className="dropdown-menu" id="folders">
					<a onClick={() => createFolder()} className="text-center dropdown-item small text-success mb-2"><i className="bi bi-plus-circle"></i> New Folder</a>
					<a onClick={() => getFavorites()} className={'dropdown-item small text-warning ' + (currentFolder.name === 'Favorites' && 'active')}><i className="bi bi-star-fill"></i> Favorites</a>
					{folders.map((x, id) => (
						<a onClick={() => getFolder(x.name)} key={id} className={'dropdown-item small d-flex justify-content-between ' + (x.name === currentFolder.name && 'active')}>
							<span>{x.name}</span>
							<span>{x.notes.length}</span>
						</a>
					))}
				</div>
				{currentFolder.length !== 0  &&
					<span>
						<span><i className="bi bi-chevron-right mx-2"></i></span>
						<a className="btn btn-sm text-secondary dropdown-toggle" data-bs-target="#folders" data-bs-toggle="dropdown"><i className="bi bi-file-earmark"></i> {currentNote.length === 0 ? 'Select Note' : currentNote.stem}</a>
						<div className="dropdown-menu" id="notes">
							<form className="m-1" onSubmit={(e) => renameFolder(e)}><input required autoComplete="off" className="form-control form-control-sm" key={currentFolder.name} defaultValue={currentFolder.name} id="folder-name"/></form>
							<form className="m-1" onSubmit={(e) => saveNote(e)}><input placeholder="Save Note" required autoComplete="off" className="form-control form-control-sm border-primary" id="page-url"/></form>
							<a onClick={() => createNote()} className="text-center dropdown-item small text-success mb-2"><i className="bi bi-plus-circle"></i> New Note</a>
							{notes.map((x, id) => (
								<a onClick={() => getNote(x.folder, x.name)} key={id} className={'dropdown-item small ' + (x.stem === currentNote.stem && 'active')}>{x.stem}</a>
							))}
							<a onClick={() => deleteFolder()} className="text-center dropdown-item small text-danger mt-2"><i className="bi bi-x-circle"></i> Delete Folder</a>
						</div>
					</span>
				}
			</nav>
			{currentNote.length !== 0 &&
				<div>
					<form onSubmit={(e) => renameNote(e)}><input id="note-name" autoComplete="off" className="form-control border-0 p-0 fs-1 text-center my-1" defaultValue={currentNote.stem} key={currentNote.name} /></form>
					<div className="small fw-light mb-2 text-center">Last Modified: {currentNote.last_modified}</div>
					<div className="d-flex justify-content-between mb-3">
						<div className="btn-group btn-group-sm py-1">
							<a onClick={() => setMode('view')} className={'btn btn-outline-secondary ' + (mode === 'view' && 'active')}><i className="bi bi-eye"></i> View</a>
							<a onClick={() => setMode('edit')} className={'btn btn-outline-secondary ' + (mode === 'edit' && 'active')}><i className="bi bi-pen"></i> Edit</a>
							<a onClick={() => toggleFavorite()} className={'btn btn-' + (currentNote.favorited ? 'warning' : 'outline-warning')}><i className="bi bi-star"></i> {'Favorite' + (currentNote.favorited ? 'd' : '')}</a>
							<a onClick={() => setDeleting(!deleting)} className="btn btn-outline-danger"><i className="bi bi-x-circle"></i> Delete</a>
							{deleting && <a onClick={() => deleteNote()} className="btn text-danger">Delete?</a>}
						</div>
						{mode === 'edit' &&
							<span className="btn-group">
								<a className="btn btn-outline-success" onClick={() => editNote()}><i className={'bi bi-' + (saved ? 'check-lg' : 'save2')}></i></a>
								<a className="btn btn-outline-secondary"><i className="bi bi-type-bold"></i></a>
								<a className="btn btn-outline-secondary"><i className="bi bi-type-italic"></i></a>
								<a className="btn btn-outline-secondary"><i className="bi bi-type-h1"></i></a>
								<a className="btn btn-outline-secondary"><i className="bi bi-type"></i></a>
								<a className="btn btn-outline-secondary"><i className="bi bi-list-ol"></i></a>
								<a className="btn btn-outline-secondary"><i className="bi bi-list-ul"></i></a>
								<a className="btn btn-outline-secondary"><i className="bi bi-clock"></i></a>
								<a className="btn btn-outline-secondary"><i className="bi bi-link"></i></a>
								<a className="btn btn-outline-secondary"><i className="bi bi-hr"></i></a>
								<a className="btn btn-outline-secondary"><i className="bi bi-code"></i></a>
								<a className="btn btn-outline-secondary"><i className="bi bi-image"></i></a>
							</span>
						}
					</div>
					{mode === 'view' ? (
						<div id="note-reader" dangerouslySetInnerHTML={{__html:currentNote.markdown }}></div>
					) : (
						<textarea id="content" className="form-control" rows="20" key={currentNote.stem} defaultValue={currentNote.text}></textarea>
					)}
				</div>
			}
		</div>
		);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
