function Navbar() {
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
				<a href="/" className="btn btn-outline-secondary"><i className="bi bi-house-fill"></i></a>
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

function Layout() {
	const [folders, setFolders] = React.useState([]);
	const [selectedFolder, setSelectedFolder] = React.useState([]);
	const [selectedNote, setSelectedNote] = React.useState([]);

	const [mode, setMode] = React.useState('view');
	const [saved, setSaved] = React.useState(false);
	const [fullscreen, setFullscreen] = React.useState(false);

	React.useEffect(() => {
		$.get('/get_folders', function(data) {
			setFolders(data.folders);
		});
	}, []);

	const createFolder = (e) => {
		e.preventDefault();
		$.post('/create_folder', {
			name: $('#new-folder-name').val()
		}, function(data) {
			setSelectedFolder(data);
			$('#new-folder-name').val('');
		});
	}

	const getFolder = (name) => {
		$.get('/get_folder', {
			name: name
		}, function(data) {
			setSelectedFolder(data);
			setSelectedNote([]);
		});
	}

	const deleteFolder = (name) => {
		$.get('/delete_folder', {
			name: name
		}, function(data) {
			setFolders(data.folders);
			setSelectedFolder([]);
		});
	}

	const createNote = (e) => {
		e.preventDefault();
		$.post('/create_note', {
			folder: selectedFolder.name,
			name: $('#new-note-name').val()
		}, function(data) {
			setSelectedNote(data);
			$('#new-note-name').val('');
		});
	}

	const saveNote = (e) => {
		e.preventDefault();
		$.post('/save_note', {
			folder: selectedFolder.name,
			url: $('#url').val()
		}, function(data) {
			setSelectedNote(data);
			$('#url').val('');
		});
	}

	const getNote = (folder, name) => {
		$.get('/get_note', {
			folder: folder,
			name: name
		}, function(data) {
			setSelectedNote(data);
			if (mode === 'edit') {
				$('#content').val(selectedNote.text);
			}
		});
	}

	const editNote = () => {
		$.post('/edit_note', {
			folder: selectedNote.folder,
			name: selectedNote.name,
			content: $('#content').val()
		}, function (data) {
			setSelectedNote(data);
			setSaved(true);
			setTimeout(function() { setSaved(false); }, 1500);
		});
	}

	const deleteNote = () => {
		$.get('/delete_note', {
			folder: selectedFolder.name,
			name: selectedNote.name
		}, function(data) {
			setSelectedFolder(data);
			setSelectedNote([]);
		});
	}

	const toggleFullscreen = () => {
		if (fullscreen) {
			$('#folders, #folder').hide();
			$('#note').addClass('col-12');
			$('#note').removeClass('col-7');
			setFullscreen(!fullscreen);
		} else {
			$('#folders, #folder').show();
			$('#note').removeClass('col-12');
			$('#note').addClass('col-7');
			setFullscreen(!fullscreen);
		}
	}

	return (
		<div className="row">
			<div className="col-2" id="folders">
				<div className="pt-4">
					<div className={'mb-3 px-3 py-1 text-truncate rounded'}>
						<a className="d-flex justify-content-between">
							<div className="heading"><i className="bi bi-star-fill"></i> Favorites</div>
						</a>
					</div>
					<form className="input-group input-group-sm mb-3" onSubmit={(e) => createFolder(e)}>
						<input autoComplete="off" className="form-control border-success" id="new-folder-name" placeholder="New Folder"/>
					</form>
					{folders.map((x, id) => (
						<div className={'px-3 py-1 text-truncate rounded' + (x.name === selectedFolder.name ? ' selected' : '')} key={id}>
							<a className="d-flex justify-content-between" onClick={() => getFolder(x.name)}>
								<div className="heading">{x.name}</div>
							</a>
						</div>
						) )}
				</div>
			</div>
			<div className="col-3" id="folder">
				<div className="sticky-top pt-4">
					<input autoComplete="off" className="form-control border-0 p-1 fw-bold heading" defaultValue={selectedFolder.name}/>
					{selectedFolder.notes && (
						<div>
							<div className="fst-italic small">{selectedFolder.notes.length} note(s)</div>
							<div className="btn-group btn-group-sm my-3">
								<a onClick={() => $('#delete-folder').toggle()} className="btn btn-outline-danger"><i className="bi bi-trash2"></i> Delete Folder</a>
								<a onClick={() => deleteFolder(selectedFolder.name)} id="delete-folder" style={{ display: 'none' }} className="btn btn-outline-danger">Delete?</a>
							</div>
							<form className="input-group input-group-sm mb-3" onSubmit={(e) => createNote(e)}>
								<input autoComplete="off" className="form-control border-success" placeholder="New Note" id="new-note-name" />
							</form>
							<form className="input-group input-group-sm mb-3" onSubmit={(e) => saveNote(e)}>
								<input autoComplete="off" className="form-control border-success" placeholder="Save Page" id="url" />
							</form>
							{selectedFolder.notes.map((x, id) => (
							<div className={'px-3 py-1 text-truncate rounded' + (x.name === selectedNote.name ? ' selected' : '')}>
								<a onClick={() => getNote(x.folder, x.name)}>
									<div className="heading">{x.stem}</div>
								</a>
							</div>
							))}
						</div>
						)}
				</div>
			</div>
			<div className="col-7" id="note">
				<div className="pt-4">
					{selectedNote !== [] && (
						<div>
							<input autoComplete="off" className="form-control border-0 p-1 fw-bold heading" defaultValue={selectedNote.stem}/>
							<div className="fst-italic small"><i className="bi bi-folder"></i> {selectedNote.folder}</div>
							<div className="btn-group btn-group-sm my-3">
								<a className="btn btn-outline-warning"><i className="bi bi-star"></i> Favorite</a>
								<a onClick={() => $('#delete-note').toggle()} className="btn btn-outline-danger"><i className="bi bi-trash2"></i> Delete</a>
								<a onClick={() => deleteNote()} id="delete-note" style={{ display: 'none' }} className="btn btn-outline-danger">Delete?</a>
							</div>
							<div>
								<div><a className="btn btn-sm" style={{ color:'inherit' }} onClick={() => toggleFullscreen()}><i className={'bi bi-fullscreen'}></i> Toggle Fullscreen</a></div>
								<div className="btn-group btn-group-sm mb-3 col-4 offset-4">
									<a onClick={() => setMode('view')} className={'btn btn-outline-secondary' + (mode === 'view' ? ' active' : '')}><i className="bi bi-eye"></i> View</a>
									<a onClick={() => setMode('edit')} className={'btn btn-outline-secondary' + (mode === 'edit' ? ' active' : '')}><i className="bi bi-pen"></i> Edit</a>
								</div>
								{mode === 'view' ? (
									<div id="note-reader" dangerouslySetInnerHTML={{__html:selectedNote.markdown }}></div>
									) : (
									<div>
										<div className="btn-group mb-3">
											<a onClick={() => editNote(selectedNote.folder, selectedNote.name)} className="btn btn-outline-success"><i className={'bi bi-' + (saved ? 'check-lg' : 'save2')}></i></a>
											<a className="btn btn-outline-secondary"><i className="bi bi-type-bold"></i></a>
											<a className="btn btn-outline-secondary"><i className="bi bi-type-italic"></i></a>
											<a className="btn btn-outline-secondary"><i className="bi bi-link"></i></a>
											<a className="btn btn-outline-secondary"><i className="bi bi-type"></i></a>
											<a className="btn btn-outline-secondary"><i className="bi bi-clock"></i></a>
											<a className="btn btn-outline-secondary"><i className="bi bi-code"></i></a>
											<a className="btn btn-outline-secondary"><i className="bi bi-image"></i></a>
											<a className="btn btn-outline-secondary"><i className="bi bi-type-h1"></i></a>
										</div>
										<textarea id="content" className="form-control" rows="20" defaultValue={selectedNote.text}></textarea>
									</div>
									)}
							</div>
						</div>
						)}
				</div>
			</div>
		</div>
		);
}

function App() {
	return (
		<div className="p-4">
			<Navbar/>
			<Layout/>
		</div>
		);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
