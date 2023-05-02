const LoadingContext = React.createContext();
const ThemeContext = React.createContext();
const FoldersContext = React.createContext();
const CurrentFolderContext = React.createContext();
const CurrentNoteContext = React.createContext();

function FolderList() {
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [folders, setFolders] = React.useContext(FoldersContext);
  const [currentFolder, setCurrentFolder] =
    React.useContext(CurrentFolderContext);

  React.useEffect(() => {
    setLoading(true);
    $.get("/folders", function (data) {
      setFolders(data.folders);
      setLoading(false);
    });
  }, []);

  const getFolder = (name) => {
    setLoading(true);
    $.get(
      "/folder",
      {
        name: name,
      },
      function (data) {
        setCurrentFolder(data);
        setLoading(false);
      }
    );
  };

  const createFolder = () => {
    setLoading(true);
    $.get("/create_folder", function (data) {
      setCurrentFolder(data);
      $.get("/folders", function (data_) {
        setFolders(data_.folders);
      });
      setLoading(false);
    });
  };

  return (
    <>
      <a
        onClick={() => createFolder()}
        className="btn btn-outline-success w-100 mb-2"
      >
        <i className="me-2 bi bi-folder-plus"></i>New Folder
      </a>
      <hr />
      <div>
        {folders.map((x) => (
          <a
            onClick={() => getFolder(x.name)}
            className={
              "d-block rounded heading text-truncate px-3 py-1 my-1 hover" +
              (currentFolder.name === x.name ? " bg-secondary" : "")
            }
          >
            {x.name}
          </a>
        ))}
      </div>
    </>
  );
}

function FolderPage() {
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [folders, setFolders] = React.useContext(FoldersContext);
  const [currentFolder, setCurrentFolder] =
    React.useContext(CurrentFolderContext);
  const [currentNote, setCurrentNote] = React.useContext(CurrentNoteContext);
  const [deleting, setDeleting] = React.useState(false);

  const getNote = (folder, name) => {
    setLoading(true);
    $.get(
      "/note",
      {
        folder: folder,
        name: name,
      },
      function (data) {
        setCurrentNote(data);
        setLoading(false);
      }
    );
  };

  const deleteFolder = () => {
    setLoading(true);
    $.get(
      "/delete_folder",
      {
        name: currentFolder.name,
      },
      function (data) {
        setCurrentFolder([]);
        setDeleting(false);
        $.get("/folders", function (data_) {
          setFolders(data_.folders);
          setLoading(false);
        });
      }
    );
  };

  const renameFolder = (e) => {
    e.preventDefault();
    setLoading(true);
    $.post(
      "/rename_folder",
      {
        name: currentFolder.name,
        new_name: $("#folder-name").val(),
      },
      function (data) {
        setCurrentFolder(data);
        $.get("/folders", function (data_) {
          setFolders(data_.folders);
          setLoading(false);
        });
      }
    );
  };

  const createNote = () => {
    setLoading(true);
    $.get(
      "/create_note",
      {
        folder: currentFolder.name,
      },
      function (data) {
        setCurrentNote(data);
        $.get(
          "/folder",
          {
            name: currentFolder.name,
          },
          function (data_) {
            setCurrentFolder(data_);
            setLoading(false);
          }
        );
      }
    );
  };

  return (
    <>
      {currentFolder.length !== 0 && (
        <>
          <form
            onSubmit={(e) => renameFolder(e)}
            className="input-group input-group-lg mb-1"
          >
            <a onClick={() => createNote()} className="ps-0 btn text-success">
              <i className="bi bi-filetype-md"></i>
            </a>
            <a className="ps-0 btn text-primary">
              <i className="bi bi-filetype-html"></i>
            </a>
            <a
              onClick={() => setDeleting(!deleting)}
              className="ps-0 btn text-danger"
            >
              <i className="bi bi-trash2"></i>
            </a>
            {deleting && (
              <a
                onClick={() => deleteFolder()}
                className="ps-0 btn text-danger"
              >
                <i className="bi bi-question-lg"></i>
              </a>
            )}
            <input
              id="folder-name"
              className="form-control border-0 heading p-0"
              autoComplete="off"
              key={currentFolder.name}
              defaultValue={currentFolder.name}
            />
          </form>
          <hr />
          {currentFolder.notes.map((x) => (
            <a
              onClick={() => getNote(x.folder, x.name)}
              className={
                "d-block rounded heading text-truncate px-3 py-1 my-1 hover" +
                (currentNote.name === x.name ? " bg-secondary" : "")
              }
            >
              {x.stem}
            </a>
          ))}
        </>
      )}
    </>
  );
}

function NotePage() {
  const [mode, setMode] = React.useState("view");
  const [saved, setSaved] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [currentNote, setCurrentNote] = React.useContext(CurrentNoteContext);
  const [currentFolder, setCurrentFolder] =
    React.useContext(CurrentFolderContext);
  const [loading, setLoading] = React.useContext(LoadingContext);

  const deleteNote = () => {
    let x = currentNote.folder;
    setLoading(true);
    $.get(
      "/delete_note",
      {
        folder: currentNote.folder,
        name: currentNote.name,
      },
      function (data) {
        setCurrentNote([]);
        $.get(
          "/folder",
          {
            name: x,
          },
          function (data_) {
            setCurrentFolder(data_);
            setLoading(false);
            setDeleting(false);
          }
        );
      }
    );
  };

  const toggleFavorite = () => {
    setLoading(true);
    $.get(
      "/toggle_favorite",
      {
        folder: currentNote.folder,
        name: currentNote.name,
      },
      function (data) {
        setCurrentNote(data);
        setLoading(false);
      }
    );
  };

  const renameNote = (e) => {
    e.preventDefault();
    setLoading(true);
    $.post(
      "/rename_note",
      {
        folder: currentNote.folder,
        name: currentNote.name,
        new_name: $("#note-name").val(),
        new_suffix: ".md",
      },
      function (data) {
        setCurrentNote(data);
        $.get(
          "/folder",
          {
            name: data.folder,
          },
          function (data_) {
            setCurrentFolder(data_);
            setLoading(false);
          }
        );
      }
    );
  };
  const editNote = () => {
    $.post(
      "/edit_note",
      {
        folder: currentNote.folder,
        name: currentNote.name,
        content: $("#content").val(),
      },
      function (data) {
        setCurrentNote(data);
        setSaved(true);
        setTimeout(function () {
          setSaved(false);
        }, 1500);
      }
    );
  };

  return (
    <>
      {currentNote.length !== 0 && (
        <>
          <form
            onSubmit={(e) => renameNote(e)}
            className="input-group input-group-lg mb-1"
          >
            <a
              onClick={() => setMode(mode === "view" ? "edit" : "view")}
              className="btn text-secondary ps-0"
            >
              <i className={"bi bi-" + (mode === "view" ? "pen" : "eye")}></i>
            </a>
            {mode === "edit" && (
              <a onClick={() => editNote()} className="btn text-success ps-0">
                <i
                  className={"bi bi-" + (saved ? "check-lg" : "save2-fill")}
                ></i>
              </a>
            )}
            <input
              className="form-control border-0 heading p-0 fst-italic"
              autoComplete="off"
              id="note-name"
              key={currentNote.name}
              defaultValue={currentNote.stem}
            />
            <a
              onClick={() => toggleFavorite()}
              className="btn text-warning px-2"
            >
              <i
                className={
                  "bi bi-star" + (currentNote.favorited ? "-fill" : "")
                }
              ></i>
            </a>
            {deleting && (
              <a onClick={() => deleteNote()} className="btn text-danger px-2">
                <i className="bi bi-question-lg"></i>
              </a>
            )}
            <a
              onClick={() => setDeleting(!deleting)}
              className="btn text-danger px-2"
            >
              <i className="bi bi-trash2"></i>
            </a>
          </form>
          <hr />
          <div style={{ height: "525px", overflow: "scroll" }}>
            {mode === "view" ? (
              <>
                <div
                  dangerouslySetInnerHTML={{ __html: currentNote.content.md }}
                />
              </>
            ) : (
              <>
                <textarea
                  id="content"
                  key={currentNote.stem}
                  className="form-control h-100 border-0"
                  defaultValue={currentNote.content.txt}
                ></textarea>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

function Home() {
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [theme, setTheme] = React.useContext(ThemeContext);
  const [currentFolder, setCurrentFolder] =
    React.useContext(CurrentFolderContext);
  const [currentNote, setCurrentNote] = React.useContext(CurrentNoteContext);
  const [fullscreen, setFullscreen] = React.useState(false);

  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="btn-group btn-group-sm">
          <a className="btn text-secondary">
            {loading ? (
              <span className="me-2 spinner-border spinner-border-sm"></span>
            ) : (
              <i className={"me-2 bi bi-markdown"}></i>
            )}
            Markdown-Lab
          </a>
          {currentFolder.length !== 0 && (
            <a className="btn text-secondary">
              <i className={"me-2 bi bi-chevron-right"}></i>
              {currentFolder.name}
            </a>
          )}
          {currentNote.length !== 0 && (
            <>
              <a className="btn text-secondary">
                <i className={"me-2 bi bi-chevron-right"}></i>
                {currentNote.stem}
              </a>
              <a
                onClick={() => setFullscreen(!fullscreen)}
                className="btn text-secondary"
              >
                <i
                  className={
                    "me-2 bi bi-layout-sidebar-inset" +
                    (fullscreen ? "" : "-reverse")
                  }
                ></i>
              </a>
            </>
          )}
        </div>
        <div className="btn-group btn-group-sm">
          <a
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="btn text-secondary text-capitalize"
          >
            <i className={"me-2 bi bi-paint-bucket"}></i>
            {theme}
          </a>
          <a className="btn text-secondary">
            <i className={"me-2 bi bi-gear"}></i>Settings
          </a>
          <a className="btn text-secondary">
            <i className={"me-2 bi bi-info-circle"}></i>About
          </a>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className={fullscreen ? "d-none" : "col-2"}>
          <FolderList />
        </div>
        <div className="col-3">
          <FolderPage />
        </div>
        <div className={fullscreen ? "col-9" : "col-7"}>
          <NotePage />
        </div>
      </div>
    </>
  );
}

function App() {
  const [loading, setLoading] = React.useState(false);
  const [theme, setTheme] = React.useState(
    localStorage.getItem("Markdown-Lab") || "light"
  );
  const [folders, setFolders] = React.useState([]);
  const [currentFolder, setCurrentFolder] = React.useState([]);
  const [currentNote, setCurrentNote] = React.useState([]);

  React.useEffect(() => {
    localStorage.setItem("Markdown-Lab", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <LoadingContext.Provider value={[loading, setLoading]}>
        <ThemeContext.Provider value={[theme, setTheme]}>
          <FoldersContext.Provider value={[folders, setFolders]}>
            <CurrentFolderContext.Provider
              value={[currentFolder, setCurrentFolder]}
            >
              <CurrentNoteContext.Provider
                value={[currentNote, setCurrentNote]}
              >
                <div className="p-2">
                  <Home />
                </div>
              </CurrentNoteContext.Provider>
            </CurrentFolderContext.Provider>
          </FoldersContext.Provider>
        </ThemeContext.Provider>
      </LoadingContext.Provider>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
