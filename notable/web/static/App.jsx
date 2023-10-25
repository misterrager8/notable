// Contexts
const LoadingContext = React.createContext();
const NoteContext = React.createContext();
const NotesContext = React.createContext();
const FoldersContext = React.createContext();
const FullscreenContext = React.createContext();
const SortFilterContext = React.createContext();

var timer = null;

function apiCall(url, params, callback) {
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => callback(data));
}

// Forms

function Editor() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [mode, setMode] = React.useState("view");
  const [note, setNote] = React.useContext(NoteContext);
  const [, , getNotes] = React.useContext(NotesContext);
  const [saved, setSaved] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [folders] = React.useContext(FoldersContext);

  const onChangeUrl = (e) => setUrl(e.target.value);

  const copyNote = () => {
    navigator.clipboard.writeText(note.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const editNote = () => {
    setLoading(true);
    apiCall(
      "/edit_note",
      { path: note.path, content: document.getElementById("content").value },
      (data) => {
        setNote(data);
        setLoading(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 500);
      }
    );
  };

  const renameNote = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/rename_note",
      { path: note.path, new_name: document.getElementById("note-name").value },
      (data) => {
        setNote(data);
        getNotes();
        setLoading(false);
      }
    );
  };

  const fixupTitle = () => {
    setLoading(true);
    apiCall("/fixup_title", { path: note.path }, (data) => {
      setNote(data);
      getNotes();
      setLoading(false);
    });
  };

  const changeFolder = (newFolder) => {
    setLoading(true);
    apiCall(
      "/change_folder",
      { path: note.path, new_folder: newFolder },
      (data) => {
        setNote(data);
        getNotes();
        setLoading(false);
      }
    );
  };

  const savePage = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall("/save_page", { path: note.path, url: url }, (data) => {
      setNote(data);
      setLoading(false);
      setUrl("");
      setSaved(true);
      setTimeout(() => setSaved(false), 500);
    });
  };

  React.useEffect(() => {
    if (mode === "edit") {
      timer = setInterval(() => editNote(), 30000);
    } else {
      clearInterval(timer);
    }
  }, [mode]);

  return (
    <>
      <form onSubmit={(e) => renameNote(e)} className="input-group">
        <a className="btn border-0 ps-0" onClick={() => fixupTitle()}>
          <i className="bi bi-type"></i>
        </a>
        <input
          required
          autoComplete="off"
          className="form-control border-0 p-0 heading fs-5"
          defaultValue={note.name}
          key={`${note.name}-name`}
          id="note-name"
        />
      </form>
      <div className="dropdown mb-2">
        <a
          className="btn btn-sm dropdown-toggle border-0"
          data-bs-toggle="dropdown"
          data-bs-target="#folders">
          <i className="me-2 bi bi-folder-fill"></i>
          {note.folder || "No Folder"}
        </a>
        <div id="folders" className="dropdown-menu">
          <a onClick={() => changeFolder(null)} className="dropdown-item">
            No Folder
          </a>
          {folders.map((x) => (
            <a onClick={() => changeFolder(x)} className="dropdown-item">
              {x}
            </a>
          ))}
        </div>
      </div>
      <div className="btn-group mb-2">
        <a onClick={() => copyNote()} className="btn">
          <i className={"bi bi-clipboard" + (copied ? "-check" : "")}></i>
        </a>
        <a
          className={"btn" + (mode === "view" ? " active" : "")}
          onClick={() => setMode("view")}>
          <i className="bi bi-eye"></i>
        </a>
        <a
          className={"btn" + (mode === "edit" ? " active" : "")}
          onClick={() => setMode("edit")}>
          <i className="bi bi-pen"></i>
        </a>
        <a
          className={"btn" + (saving ? " active" : "")}
          onClick={() => setSaving(!saving)}>
          <i className="bi bi-link"></i>
        </a>

        {mode === "edit" && (
          <a className="btn" onClick={() => editNote()}>
            <i className={"bi bi-" + (saved ? "check-lg" : "save2")}></i>
          </a>
        )}
      </div>
      {saving && (
        <form onSubmit={savePage} className="input-group">
          <input
            autoComplete="off"
            className="form-control"
            placeholder="URL"
            value={url}
            onChange={onChangeUrl}
          />
          <button type="submit" className="btn">
            Save
          </button>
        </form>
      )}
      <hr />
      <div className="p-1" style={{ height: "500px", overflowY: "scroll" }}>
        {mode === "view" ? (
          <div
            id="reader"
            dangerouslySetInnerHTML={{ __html: note.markdown }}></div>
        ) : (
          <textarea
            className="form-control h-100 border-0"
            key={note.name}
            id="content"
            defaultValue={note.content}></textarea>
        )}
      </div>
    </>
  );
}

function NoteItem({ item }) {
  const [, , getNotes] = React.useContext(NotesContext);
  const [, setLoading] = React.useContext(LoadingContext);
  const [note, setNote] = React.useContext(NoteContext);
  const [deleting, setDeleting] = React.useState(false);

  const deleteNote = () => {
    setLoading(true);
    apiCall("/delete_note", { path: item.path }, (data) => {
      note.name === item.name && setNote([]);
      setLoading(false);
      getNotes();
    });
  };

  const toggleFavorite = () => {
    setLoading(true);
    apiCall("/toggle_favorite", { path: item.path }, (data) => {
      setLoading(false);
      getNotes();
    });
  };

  return (
    <div
      className={
        "d-flex justify-content-between text-truncate py-1" +
        (item.name === note.name ? " selected" : "")
      }>
      <div className="text-truncate heading">
        <a title={item.name} onClick={() => setNote(item)}>
          {item.name}
        </a>
      </div>
      <div>
        {item.folder && (
          <span className="badge">
            <i className="me-1 bi bi-folder-fill"></i>
            {item.folder}
          </span>
        )}
        <div className="btn-group ps-2">
          <button
            className="btn text-warning border-0 px-1"
            onClick={() => toggleFavorite()}>
            <i className={"bi bi-star" + (item.favorited ? "-fill" : "")}></i>
          </button>
          {deleting && (
            <button className="btn border-0 px-1" onClick={() => deleteNote()}>
              <i className="bi bi-question-lg"></i>
            </button>
          )}
          <button
            className="btn border-0 px-1"
            onClick={() => setDeleting(!deleting)}>
            <i className="bi bi-trash2"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

function FolderItem({ item }) {
  const [deleting, setDeleting] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [, , filter, setFilter] = React.useContext(SortFilterContext);
  const [name, setName] = React.useState(item);
  const [, , getFolders] = React.useContext(FoldersContext);
  const [, , getNotes] = React.useContext(NotesContext);

  const onChangeName = (e) => setName(e.target.value);

  const deleteFolder = () => {
    apiCall("/delete_folder", { name: item }, (data) => getFolders());
  };

  const renameFolder = (e) => {
    e.preventDefault();
    apiCall("/rename_folder", { name: item, new_name: name }, (data) => {
      setEditing(false);
      getFolders();
      getNotes();
    });
  };

  return (
    <div
      className={
        "d-flex justify-content-between py-1" +
        (item === filter ? " selected" : "")
      }>
      <div>
        {editing ? (
          <form onSubmit={(e) => renameFolder(e)}>
            <input
              autoComplete="off"
              className="form-control form-control-sm"
              value={name}
              onChange={onChangeName}
            />
          </form>
        ) : (
          <a onClick={() => setFilter(item)} className="heading">
            {item}
          </a>
        )}
      </div>
      <div className="btn-group">
        <a onClick={() => setEditing(!editing)} className="btn px-2 border-0">
          <i className={"ps-0 bi bi-" + (editing ? "arrow-left" : "pen")}></i>
        </a>
        {deleting && (
          <a onClick={() => deleteFolder()} className="btn px-2 border-0">
            <i className="bi bi-question-lg"></i>
          </a>
        )}
        <a onClick={() => setDeleting(!deleting)} className="btn px-2 border-0">
          <i className="bi bi-trash2"></i>
        </a>
      </div>
    </div>
  );
}

function Spinner() {
  return <span className="me-2 spinner-border spinner-border-sm"></span>;
}

function Search() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);

  const onChangeQuery = (e) => {
    setQuery(e.target.value);
  };

  const search = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall("/search", { query: query }, (data) => {
      setLoading(false);
      setResults(data.results);
    });
  };

  return (
    <>
      <form className="input-group" onSubmit={(e) => search(e)}>
        <input
          className="form-control"
          placeholder="Search"
          autoComplete="off"
          value={query}
          onChange={onChangeQuery}
          required
        />
        {results.length !== 0 && (
          <button
            className="btn"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}>
            <i className="bi bi-x-lg"></i>
          </button>
        )}
        <button type="submit" className="btn">
          <i className="bi bi-search"></i>
        </button>
      </form>

      <div className="my-2">
        {results.map((x) => (
          <>
            <a className="d-block heading">{x.file}</a>
            <div className="fst-italic small opacity-50">"{x.match}"</div>
          </>
        ))}
      </div>
    </>
  );
}

function SortAndFilter() {
  const [folders, , getFolders] = React.useContext(FoldersContext);
  const [sort, setSort, filter, setFilter] =
    React.useContext(SortFilterContext);
  const [showFolders, setShowFolders] = React.useState(false);

  React.useEffect(() => {
    getFolders();
  }, []);

  const sorts = [
    "name",
    "favorited",
    "folder",
    "last_modified",
    "date_created",
  ];

  return (
    <>
      <div className="d-flex justify-content-between mt-3">
        <button
          data-bs-target="#sort"
          data-bs-toggle="dropdown"
          className="btn border-0 dropdown-toggle text-capitalize">
          <i className="me-2 bi bi-filter-right"></i>
          {sort.replace("_", " ")}
        </button>
        <div id="sort" className="dropdown-menu">
          {sorts.map((x) => (
            <>
              {sort !== x && (
                <button
                  onClick={() => setSort(x)}
                  className="dropdown-item text-capitalize">
                  {x.replace("_", " ")}
                </button>
              )}
            </>
          ))}
        </div>
        <div className="btn-group">
          <button
            onClick={() => setShowFolders(!showFolders)}
            className={
              "btn border-0 dropdown-toggle" + (filter ? " active" : "")
            }>
            <i className="me-2 bi bi-folder-fill"></i>
            {filter ? filter : "All Notes"}
          </button>
          {filter !== null && (
            <button onClick={() => setFilter(null)} className="btn border-0">
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>
      {showFolders && (
        <div className="p-3">
          {folders.map((x) => (
            <FolderItem item={x} />
          ))}
        </div>
      )}
    </>
  );
}

function Notes() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [notes, , getNotes] = React.useContext(NotesContext);
  const [, , getFolders] = React.useContext(FoldersContext);
  const [, setNote] = React.useContext(NoteContext);
  const [, , filter] = React.useContext(SortFilterContext);

  React.useEffect(() => {
    getNotes();
  }, []);

  const addNote = () => {
    setLoading(true);
    apiCall("/add_note", { folder: filter }, (data) => {
      setLoading(false);
      setNote(data);
      getNotes();
    });
  };

  const addFolder = () => {
    setLoading(true);
    apiCall("/add_folder", {}, (data) => {
      getFolders();
      setLoading(false);
    });
  };

  return (
    <>
      <div className="pe-3">
        <Search />
        <div className="btn-group w-100">
          <a className="btn" onClick={() => addNote()}>
            <i className="me-2 bi bi-file-earmark-plus"></i>New Note
          </a>
          <a className="btn" onClick={() => addFolder()}>
            <i className="me-2 bi bi-folder-plus"></i>New Folder
          </a>
        </div>
        <SortAndFilter />
      </div>
      <div
        className="mt-3 pe-3"
        style={{ overflowY: "scroll", height: "450px" }}>
        {notes.map((x) => (
          <NoteItem key={`${x.name}-card`} item={x} />
        ))}
      </div>
      <hr />
      <div className="small opacity-50">{notes.length} note(s)</div>
    </>
  );
}

function Nav() {
  const [loading] = React.useContext(LoadingContext);
  const [fullscreen, setFullscreen] = React.useContext(FullscreenContext);
  const [note, setNote] = React.useContext(NoteContext);
  const [theme, setTheme] = React.useState(
    localStorage.getItem("notable-theme") || "light"
  );
  const [, , , setFilter] = React.useContext(SortFilterContext);

  React.useEffect(() => {
    localStorage.setItem("notable-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const themes = [
    "light",
    "dark",
    "manila",
    "looseleaf",
    "space",
    "pine",
    "quartz",
    "licorice",
    "magenta",
  ];

  return (
    <nav className="navbar navbar-expand-lg mb-3 sticky-top">
      <div className="container-fluid">
        {note.length !== 0 && (
          <a
            onClick={() => setFullscreen(!fullscreen)}
            className="navbar-brand">
            <i
              className={
                "bi bi-layout-sidebar-inset" + (fullscreen ? "" : "-reverse")
              }></i>
          </a>
        )}
        <a
          onClick={() => {
            setNote([]);
            setFilter(null);
          }}
          className="navbar-brand">
          {!loading ? (
            <img width="20" height="20" src="./static/favicon.svg"></img>
          ) : (
            <Spinner />
          )}
        </a>
        <a
          class="nav-item navbar-toggler"
          data-bs-target="#nav-content"
          data-bs-toggle="collapse"
          type="button">
          <i class="bi bi-list"></i>
        </a>
        <div className="collapse navbar-collapse" id="nav-content">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown text-capitalize">
              <a
                data-bs-toggle="dropdown"
                data-bs-target="#themes"
                className="nav-link dropdown-toggle">
                <i className="me-2 bi bi-paint-bucket"></i>
                {theme}
              </a>
              <div id="themes" className="dropdown-menu">
                {themes.map((x) => (
                  <>
                    {theme !== x && (
                      <a
                        key={x}
                        onClick={() => setTheme(x)}
                        className="dropdown-item">
                        {x}
                      </a>
                    )}
                  </>
                ))}
              </div>
            </li>
            <li className="nav-item">
              <a
                target="_blank"
                href="https://github.com/misterrager8/notable"
                className="nav-link">
                <i className="me-2 bi bi-info-circle"></i>About
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [loading, setLoading] = React.useState(false);
  const [note, setNote] = React.useState([]);
  const [notes, setNotes] = React.useState([]);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [sort, setSort] = React.useState("favorited");
  const [filter, setFilter] = React.useState(null);
  const [folders, setFolders] = React.useState([]);

  const getNotes = () => {
    setLoading(true);
    apiCall("/notes", { sort: sort, filter_: filter }, (data) => {
      setNotes(data.notes);
      setLoading(false);
    });
  };

  const getFolders = () => {
    apiCall("/folders", {}, (data) => {
      setFolders(data.folders);
    });
  };

  React.useEffect(() => {
    getNotes();
  }, [sort, filter]);

  return (
    <>
      <LoadingContext.Provider value={[loading, setLoading]}>
        <FoldersContext.Provider value={[folders, setFolders, getFolders]}>
          <SortFilterContext.Provider
            value={[sort, setSort, filter, setFilter]}>
            <NotesContext.Provider value={[notes, setNotes, getNotes]}>
              <NoteContext.Provider value={[note, setNote]}>
                <FullscreenContext.Provider value={[fullscreen, setFullscreen]}>
                  <div className="p-4">
                    <Nav />
                    <div className="row">
                      <div className={fullscreen ? "d-none" : "col-xl-3"}>
                        <Notes />
                      </div>
                      <div className={"col-xl-" + (fullscreen ? "12" : "9")}>
                        {note.length !== 0 && <Editor />}
                      </div>
                    </div>
                  </div>
                </FullscreenContext.Provider>
              </NoteContext.Provider>
            </NotesContext.Provider>
          </SortFilterContext.Provider>
        </FoldersContext.Provider>
      </LoadingContext.Provider>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
