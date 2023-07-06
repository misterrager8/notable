// Contexts
const LoadingContext = React.createContext();
const NoteContext = React.createContext();
const NotesContext = React.createContext();

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

  const editNote = () => {
    setLoading(true);
    apiCall(
      "/edit_note",
      { name: note.name, content: document.getElementById("content").value },
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
      { name: note.name, new_name: document.getElementById("note-name").value },
      (data) => {
        setNote(data);
        getNotes();
        setLoading(false);
      }
    );
  };

  const editTag = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/edit_tag",
      { name: note.name, new_tag: document.getElementById("note-tag").value },
      (data) => {
        setNote(data);
        getNotes();
        setLoading(false);
      }
    );
  };

  return (
    <>
      <form onSubmit={(e) => renameNote(e)}>
        <input
          required
          autoComplete="off"
          className="form-control border-0 p-0 heading fs-5"
          defaultValue={note.name}
          key={`${note.name}-name`}
          id="note-name"
        />
      </form>
      <form onSubmit={(e) => editTag(e)} className="input-group">
        <span className="input-group-text">
          <i className="bi bi-tag-fill"></i>
        </span>
        <input
          placeholder="Tag"
          autoComplete="off"
          className="form-control border-0 p-0 heading"
          defaultValue={note.tag}
          key={`${note.name}-tag`}
          id="note-tag"
        />
      </form>
      <div className="btn-group mb-2">
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
        {mode === "edit" && (
          <a className="btn" onClick={() => editNote()}>
            <i className={"bi bi-" + (saved ? "check-lg" : "save2")}></i>
          </a>
        )}
      </div>
      <hr />
      <div className="p-1" style={{ height: "500px", overflowY: "scroll" }}>
        {mode === "view" ? (
          <>
            <div
              id="reader"
              dangerouslySetInnerHTML={{ __html: note.content?.md }}></div>
          </>
        ) : (
          <>
            <textarea
              className="form-control h-100 border-0"
              key={note.name}
              id="content"
              defaultValue={note.content.txt}></textarea>
          </>
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
    apiCall("/delete_note", { name: item.name }, (data) => {
      note.name === item.name && setNote([]);
      setLoading(false);
      getNotes();
    });
  };

  const toggleFavorite = () => {
    setLoading(true);
    apiCall("/toggle_favorite", { name: item.name }, (data) => {
      setLoading(false);
      getNotes();
    });
  };

  return (
    <div className="d-flex justify-content-between text-truncate mb-1">
      <div className="text-truncate heading">
        {item.name === note.name && <i className="me-2 bi bi-record-fill"></i>}
        <a title={item.name} onClick={() => setNote(item)}>
          {item.name}
        </a>
      </div>
      <div>
        {item.tag && (
          <span className="badge">
            <i className="me-1 bi bi-tag-fill"></i>
            {item.tag}
          </span>
        )}
        <div className="btn-group">
          <button className="btn" onClick={() => toggleFavorite()}>
            <i className={"bi bi-star" + (item.favorited ? "-fill" : "")}></i>
          </button>
          {deleting && (
            <button className="btn" onClick={() => deleteNote()}>
              <i className="bi bi-question-lg"></i>
            </button>
          )}
          <button className="btn" onClick={() => setDeleting(!deleting)}>
            <i className="bi bi-trash2"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return <span className="me-2 spinner-border spinner-border-sm"></span>;
}

function PageSaver() {
  const [url, setUrl] = React.useState("");
  const [, , getNotes] = React.useContext(NotesContext);
  const [, setNote] = React.useContext(NoteContext);
  const [loading, setLoading] = React.useState(false);

  const onChangeUrl = (e) => setUrl(e.target.value);

  const savePage = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall("/save_page", { url: url }, (data) => {
      getNotes();
      setNote(data);
      setLoading(false);
      setUrl("");
    });
  };

  return (
    <>
      <form onSubmit={savePage} className="input-group">
        <input
          autoComplete="off"
          className="form-control"
          placeholder="URL"
          value={url}
          onChange={onChangeUrl}
        />
        <button type="submit" className="btn">
          {loading && <Spinner />}
          Save
        </button>
      </form>
    </>
  );
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

function Notes() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [notes, , getNotes] = React.useContext(NotesContext);
  const [, setNote] = React.useContext(NoteContext);

  React.useEffect(() => {
    getNotes();
  }, []);

  const addNote = () => {
    setLoading(true);
    apiCall("/add_note", {}, (data) => {
      setLoading(false);
      setNote(data);
      getNotes();
    });
  };

  return (
    <>
      <PageSaver />
      <Search />
      <a className="btn w-100" onClick={() => addNote()}>
        <i className="me-2 bi bi-plus-lg"></i>New Note
      </a>
      <div className="mt-3">
        {notes.map((x) => (
          <NoteItem key={`${x.name}-card`} item={x} />
        ))}
      </div>
    </>
  );
}

function Nav() {
  const [loading] = React.useContext(LoadingContext);
  const [, setNote] = React.useContext(NoteContext);
  const [theme, setTheme] = React.useState(
    localStorage.getItem("mdlab-theme") || "light"
  );

  React.useEffect(() => {
    localStorage.setItem("mdlab-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const themes = ["light", "dark", "navy", "manila", "shell"];

  return (
    <div className="d-flex justify-content-between mb-4">
      <div className="btn-group">
        <a onClick={() => setNote([])} className="btn border-0">
          {!loading ? (
            <i className="me-2 bi bi-markdown-fill"></i>
          ) : (
            <Spinner />
          )}
          Markdown-Lab
        </a>
      </div>
      <div className="btn-group">
        <div className="btn-group dropdown text-capitalize">
          <a
            data-bs-toggle="dropdown"
            data-bs-target="#themes"
            className="btn dropdown-toggle">
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
        </div>
        <a
          target="_blank"
          href="https://github.com/misterrager8/Markdown-Lab"
          className="btn">
          <i className="me-2 bi bi-info-circle"></i>About
        </a>
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = React.useState(false);
  const [note, setNote] = React.useState([]);
  const [notes, setNotes] = React.useState([]);

  const getNotes = () => {
    setLoading(true);
    apiCall("/notes", {}, (data) => {
      setNotes(data.notes);
      setLoading(false);
    });
  };

  return (
    <>
      <LoadingContext.Provider value={[loading, setLoading]}>
        <NotesContext.Provider value={[notes, setNotes, getNotes]}>
          <NoteContext.Provider value={[note, setNote]}>
            <div className="p-4">
              <Nav />
              <div className="row">
                <div className="col-3">
                  <Notes />
                </div>
                <div className="col-9">{note.length !== 0 && <Editor />}</div>
              </div>
            </div>
          </NoteContext.Provider>
        </NotesContext.Provider>
      </LoadingContext.Provider>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
