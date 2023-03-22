function App() {
	const [folders, setFolders] = React.useState([]);
	const [currentFolder, setCurrentFolder] = React.useState([]);

	const [notes, setNotes] = React.useState([]);
	const [currentNote, setCurrentNote] = React.useState([]);

	const [loading, setLoading] = React.useState(false);
	const [deletingFolder, setDeletingFolder] = React.useState(false);
	const [deletingNote, setDeletingNote] = React.useState(false);
	const [saved, setSaved] = React.useState(false);
	const [fullscreen, setFullscreen] = React.useState(false);
	const [showOptions, setShowOptions] = React.useState(false);

	const [mode, setMode] = React.useState('view');

	const [theme, setTheme] = React.useState(localStorage.getItem('MarkdownLab'));

	const home = () => {
		setCurrentFolder([]);
		setCurrentNote([]);
	}

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
			setDeletingFolder(false);
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

	const search = (e) => {
		e.preventDefault();
		setLoading(true);
		$.post('/search', {
			query: $('#query').val()
		}, function(data) {
			setNotes(data.results);
			setCurrentFolder({name : `Searching '${$('#query').val()}'`})
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
			getFolder(currentNote.folder);
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
			currentFolder.name === 'Favorites' ? getFavorites() : getFolder(currentNote.folder);
			getNote(currentNote.folder, currentNote.name);
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
			setDeletingNote(false);
			setCurrentNote([]);
			setLoading(false);
		});
	}

	React.useEffect(() => {
		changeTheme(theme);
		getFolders();
		localStorage.getItem('last-folder') === 'Favorites' ? getFavorites() : getFolder(localStorage.getItem('last-folder'));
	}, []);

	React.useEffect(() => {
		currentFolder.length !== 0 && localStorage.setItem('last-folder', currentFolder.name);
	}, [currentFolder]);

	return (
		<div className="p-4">
			<nav className="navbar navbar-expand-lg">
				<div className="container-fluid p-0">
					<div className="collapse navbar-collapse">
						<ul className="navbar-nav me-auto">
							<li className="nav-item">
								<a onClick={() => home()} className="btn btn-sm text-secondary">{loading ? <span className="spinner-border spinner-border-sm me-1"></span> : <i className="bi bi-markdown-fill me-1"></i>} MarkdownLab</a>
							</li>
							<li className="nav-item dropdown">
								<a data-bs-target="#folders" data-bs-toggle="dropdown" className="btn btn-sm text-secondary dropdown-toggle"><i className={'bi bi-' + (currentFolder.name === 'Favorites' ? 'star-fill' : 'folder')}></i> {currentFolder.length === 0 ? 'Select Folder' : currentFolder.name}</a>
								<div className="dropdown-menu" id="folders">
									<a onClick={() => createFolder()} className="dropdown-item small text-success"><i className="bi bi-folder-plus"></i> New Folder</a>
									<a onClick={() => getFavorites()} className={'dropdown-item small text-warning ' + (currentFolder.name === 'Favorites' ? 'active' : '')}><i className="bi bi-star-fill"></i> Favorites</a>
									{folders.map((x, id) => (
										<a onClick={() => getFolder(x.name)} className={'dropdown-item small ' + (x.name === currentFolder.name ? 'active' : '')}><i className={'bi bi-folder2' + (x.name === currentFolder.name ? '-open' : '')}></i> {x.name}</a>
									))}
								</div>
							</li>
						</ul>
						<ul className="navbar-nav ms-auto">
							<li className="nav-item dropdown">
								<a data-bs-target="#themes" data-bs-toggle="dropdown" className="btn btn-sm text-secondary dropdown-toggle text-capitalize"><i className="bi bi-paint-bucket"></i> {theme}</a>
								<div className="dropdown-menu text-center" id="themes">
									{theme !== 'light' && <a onClick={() => changeTheme('light')} className="dropdown-item small text-capitalize">light</a>}
									{theme !== 'dark' && <a onClick={() => changeTheme('dark')} className="dropdown-item small text-capitalize">dark</a>}
									{theme !== 'manila' && <a onClick={() => changeTheme('manila')} className="dropdown-item small text-capitalize">manila</a>}
									{theme !== 'slate' && <a onClick={() => changeTheme('slate')} className="dropdown-item small text-capitalize">slate</a>}
									{theme !== 'navy' && <a onClick={() => changeTheme('navy')} className="dropdown-item small text-capitalize">navy</a>}
									{theme !== 'pine' && <a onClick={() => changeTheme('pine')} className="dropdown-item small text-capitalize">pine</a>}
								</div>
							</li>
							<li className="nav-item">
								<a className="btn btn-sm text-secondary"><i className="bi bi-gear"></i> Settings</a>
							</li>
							<li className="nav-item">
								<a className="btn btn-sm text-secondary"><i className="bi bi-info-circle"></i> About</a>
							</li>
							<li className="nav-item ms-2">
								<form onSubmit={(e) => search(e)} className="input-group input-group-sm p-0 m-0">
									<input autoComplete="off" className="form-control" id="query" placeholder="Search Notes" required/>
									<button type="submit" className="btn btn-outline-primary"><i className="bi bi-search"></i></button>
								</form>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<div className="row mt-3">
				{!fullscreen &&
					<div className="col-3">
						{currentFolder.length !== 0 && (
							<div>
								<form onSubmit={(e) => renameFolder(e)}>
									<input disabled={currentFolder.name === 'Favorites'} id="folder-name" autoComplete="off" className="form-control p-0 border-0 mb-2 fs-4 text-center" defaultValue={currentFolder.name} key={currentFolder.name} />
								</form>
								{currentFolder.name !== 'Favorites' &&
									<div className="mb-3">
										<a className="btn btn-sm btn-outline-secondary mb-1" onClick={() => setShowOptions(!showOptions)}><i className="bi bi-three-dots"></i> Options</a>
										{showOptions && <div className="p-2">
											<a onClick={() => createNote()} className="btn btn-sm btn-outline-success w-100 my-1"><i className="bi bi-sticky"></i> New Note</a>
											<form onSubmit={(e) => saveNote(e)} className="input-group input-group-sm my-1">
												<input autoComplete="off" className="form-control" id="page-url" placeholder="New Link"/>
												<button type="submit" className="btn btn-outline-primary"><i className="bi bi-link"></i></button>
											</form>
											<a onClick={() => setDeletingFolder(!deletingFolder)} className="btn btn-sm btn-outline-danger w-100 my-1"><i className="bi bi-x-circle"></i> Delete</a>
											{deletingFolder && <a onClick={() => deleteFolder()} className="btn btn-sm text-danger w-100 my-1">Delete?</a>}
										</div>}
									</div>
								}
								{notes.map((x, id) => (
									<div style={{ borderBottom:'1px dotted' }} className={'hover px-3 py-1 ' + (x.name === currentNote.name ? 'selected' : '')}>
										<a onClick={() => getNote(x.folder, x.name)}>
											<div title={x.stem} className="heading fst-italic text-truncate mb-1">{x.stem}</div>
											<div className="d-flex justify-content-between small">
												<span>{x.favorited && <i className="bi bi-star-fill text-warning"></i>}</span>
												<span className="fw-light opacity-75">{x.date_created} <i className="bi bi-plus-circle ms-1"></i></span>
											</div>
										</a>
									</div>
								))}
							</div>
						)}
					</div>
				}
				<div className={'col-' + (fullscreen ? '12' : '9')}>
					{currentNote.length !== 0 && (
						<div>
							<form className="mb-3" onSubmit={(e) => renameNote(e)}>
								<input id="note-name" autoComplete="off" className="form-control p-0 border-0 fs-4 fst-italic" defaultValue={currentNote.stem} key={currentNote.name} />
							</form>
							<div className="btn-group btn-group-sm mb-3">
								<a onClick={() => setFullscreen(!fullscreen)} className="btn btn-outline-secondary"><i className={'bi bi-' + (fullscreen ? 'window-sidebar' : 'window')}></i> {(fullscreen ? 'Show' : 'Hide') + ' Sidebar'}</a>
								{mode !== 'edit' && <a onClick={() => setMode('edit')} className="btn btn-outline-secondary"><i className="bi bi-pencil-square"></i> Edit</a>}
								{mode !== 'view' && <a onClick={() => setMode('view')} className="btn btn-outline-secondary"><i className="bi bi-eye"></i> View</a>}
								<a onClick={() => toggleFavorite()} className={'btn btn-' + (currentNote.favorited ? 'warning' : 'outline-warning')}><i className="bi bi-star-fill"></i> {'Favorite' + (currentNote.favorited ? 'd' : '')}</a>
								<a onClick={() => setDeletingNote(!deletingNote)} className="btn btn-outline-danger"><i className="bi bi-x-circle"></i> Delete</a>
								{deletingNote && <a onClick={() => deleteNote()} className="btn text-danger">Delete?</a>}
							</div>
							{mode === 'view' ? (
								<div id="note-reader" dangerouslySetInnerHTML={{__html:currentNote.markdown }}></div>
							) : (
								<div>
									<div className="btn-group mb-3">
										<a onClick={() => editNote()} className="btn btn-outline-success"><i className={'bi bi-' + (saved ? 'check-lg' : 'save2')}></i></a>
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
									</div>
									<textarea className="form-control form-control-sm" id="content" defaultValue={currentNote.text} key={currentNote.stem}></textarea>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
		);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
