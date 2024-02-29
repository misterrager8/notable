var timer = null;

const sorts = [
  {
    name: "name",
    label: "Name",
    icon: "type",
  },
  {
    name: "last_modified",
    label: "Last Modified",
    icon: "pencil",
  },
  {
    name: "date_created",
    label: "Date Created",
    icon: "plus-lg",
  },
  {
    name: "favorited",
    label: "Pinned",
    icon: "pin-angle-fill",
  },
];

const defaultSettings = {
  theme: "light",
  lastOpened: "",
  mode: "split",
  sort: "favorited",
};

const makeRequest = (url, params = {}, callback) => {
  fetch(`/${url}`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => callback(data));
};

// Contexts
const LoadingContext = React.createContext();
const SettingsContext = React.createContext();
const SelectedNoteContext = React.createContext();
const NotesContext = React.createContext();
const FolderContext = React.createContext();

// Atoms
function Button(props) {
  return (
    <button
      type={props.type || "button"}
      onClick={props.target ? null : props.onClick}
      data-bs-toggle={props.target ? "dropdown" : null}
      data-bs-target={props.target ? `#${props.target}` : null}
      className={
        props.className + " btn" + (props.size === "sm" ? " btn-sm" : "")
      }>
      {props.icon && (
        <Icon name={props.icon} className={props.text ? "me-2" : ""} />
      )}
      {props.children}
      {props.text}
    </button>
  );
}

function Link(props) {
  return <></>;
}

function Input(props) {
  return <></>;
}

function Spinner(props) {
  return <></>;
}

function Icon(props) {
  return <i className={props.className + " bi bi-" + props.name}></i>;
}

function Dropdown(props) {
  return (
    <div className={props.className + " dropdown"}>
      <Button
        icon={props.icon}
        className={props.classNameBtn + " dropdown-toggle"}
        target={props.target}
        text={props.text}
      />
      <div id={props.target} className={props.classNameMenu + " dropdown-menu"}>
        {props.children}
      </div>
    </div>
  );
}

// Forms

// Items
function NoteItem({ item, className = "" }) {
  const [selectedNote, setSelectedNote] = React.useContext(SelectedNoteContext);
  const [settings, setSettings] = React.useContext(SettingsContext);

  return (
    <div
      className={
        className +
        " py-2 rounded px-3 item" +
        (selectedNote.name === item.name ? " selected" : "")
      }
      onClick={() => setSelectedNote({ ...item })}>
      <div className="between">
        <div
          className={
            "pe-4 text-truncate fw-bold" +
            (item.favorited && selectedNote.name !== item.name
              ? " highlight"
              : "")
          }>
          {item.name}
        </div>
        {item.favorited && (
          <Icon className="py-1 small" name="pin-angle-fill" />
        )}
      </div>
      <div className="between small mt-1">
        {settings.sort === "date_created" ? (
          <div className="opacity-75">
            <Icon name="plus-lg" className="me-1" />
            {item.date_created}
          </div>
        ) : (
          <div className="opacity-75">
            <Icon name="pencil" className="me-1" />
            {item.last_modified}
          </div>
        )}
        {item.folder && <div className="badge">{item.folder}</div>}
      </div>
    </div>
  );
}

// Panels

function FolderItem({ item }) {
  const [folders, setFolders, selectedFolder, setSelectedFolder, getFolders] =
    React.useContext(FolderContext);
  const [deleting, setDeleting] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState("");

  const onChangeName = (e) => setName(e.target.value);

  const deleteFolder = () =>
    makeRequest("delete_folder", { name: item }, (data) => getFolders());

  const renameFolder = (e) => {
    e.preventDefault();
    makeRequest("rename_folder", { name: item, new_name: name }, (data) => {
      setEditing(false);
      getFolders();
      // getNotes();
    });
  };

  React.useEffect(() => {
    setName(item);
  }, []);

  return (
    <div className="small between">
      {editing ? (
        <form
          className="input-group input-group-sm "
          style={{ marginBlockEnd: 0 }}
          onSubmit={(e) => renameFolder(e)}>
          <input
            onChange={onChangeName}
            value={name}
            className="form-control border-0 opacity-50"
            autoComplete="off"
            required
          />
        </form>
      ) : (
        <a className="py-1 fw-bold" onClick={() => setSelectedFolder(item)}>
          {item}
        </a>
      )}
      <div className="btn-group btn-group-sm">
        <Button
          onClick={() => setEditing(!editing)}
          className={"border-0"}
          icon={editing ? "arrow-left" : "pencil"}
        />
        {deleting && (
          <Button
            onClick={() => deleteFolder()}
            className="border-0"
            icon="question-lg"
          />
        )}
        <Button
          onClick={() => setDeleting(!deleting)}
          className="border-0"
          icon="trash2"
        />
      </div>
    </div>
  );
}

function NotesPanel(props) {
  const [notes, setNotes, getNotes] = React.useContext(NotesContext);
  const [folders, setFolders, selectedFolder, setSelectedFolder, getFolders] =
    React.useContext(FolderContext);
  const [settings, setSettings] = React.useContext(SettingsContext);
  const [showFolders, setShowFolders] = React.useState(false);

  React.useEffect(() => getNotes(), [settings, selectedFolder]);
  React.useEffect(() => getFolders(), []);

  const addFolder = () => makeRequest("add_folder", {}, (data) => getFolders());

  return (
    <div className={props.className}>
      <div className="between mb-2">
        <Dropdown
          classNameBtn="border-0 text-capitalize"
          className="btn-group-sm"
          target="sorts"
          icon={sorts.filter((x) => x.name === settings.sort)[0].icon}
          text={sorts.filter((x) => x.name === settings.sort)[0].label}>
          {sorts.map((x) => (
            <button
              key={x.name}
              className="dropdown-item between"
              onClick={() => setSettings({ ...settings, sort: x.name })}>
              <span className="">{x.label}</span>
              <Icon name={x.icon} className="m-1" />
            </button>
          ))}
        </Dropdown>
        <div className="btn-group btn-group-sm">
          <Button
            onClick={() => setShowFolders(!showFolders)}
            className={
              "dropdown-toggle border-0" + (showFolders ? " selected" : "")
            }
            icon="folder"
            text={
              selectedFolder ? selectedFolder.substring(0, 10) : "All Folders"
            }
          />
          {selectedFolder !== null && (
            <Button
              onClick={() => setSelectedFolder(null)}
              className="border-0"
              icon="x-lg"
            />
          )}
        </div>
      </div>
      <div>
        {showFolders && (
          <div className="px-3">
            <hr />
            <Button
              onClick={() => addFolder()}
              text="New Folder"
              icon="plus-lg"
              className="w-100 mb-3"
              size="sm"
            />
            {folders.map((x) => (
              <React.Fragment key={x}>
                {x !== selectedFolder && <FolderItem item={x} />}
              </React.Fragment>
            ))}
            <hr />
          </div>
        )}
      </div>
      <div>
        {notes.map((x) => (
          <NoteItem className="" key={x.name} item={x} />
        ))}
      </div>
    </div>
  );
}

function Editor(props) {
  const [selectedNote, setSelectedNote, content, setContent] =
    React.useContext(SelectedNoteContext);
  const [settings, setSettings] = React.useContext(SettingsContext);

  const onChangeContent = (e) => setContent(e.target.value);

  React.useEffect(() => {
    setContent(selectedNote.length !== 0 ? selectedNote.content : "");
    setSettings({
      ...settings,
      lastOpened: selectedNote.length !== 0 ? { ...selectedNote } : "",
    });
  }, [selectedNote]);

  return (
    <div className={props.className}>
      <div className="row h-100 overflow-scroll">
        {["split", "write"].includes(settings.mode) && (
          <div
            className={
              "px-3 border-end col-" + (settings.mode === "write" ? "12" : "6")
            }>
            <textarea
              className="form-control h-100"
              value={content}
              onChange={onChangeContent}
              placeholder="..."></textarea>
          </div>
        )}
        {["split", "read"].includes(settings.mode) && (
          <div
            className={"px-5 col-" + (settings.mode === "read" ? "12" : "6")}>
            <div
              id="reader"
              dangerouslySetInnerHTML={{
                __html: window.markdownit().render(content),
              }}></div>
          </div>
        )}
      </div>
    </div>
  );
}

function Nav(props) {
  const [settings, setSettings] = React.useContext(SettingsContext);
  const [selectedNote, setSelectedNote, content, setContent] =
    React.useContext(SelectedNoteContext);
  const [folders, setFolders, selectedFolder, setSelectedFolder, getFolders] =
    React.useContext(FolderContext);
  const [deleting, setDeleting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [notes, setNotes, getNotes] = React.useContext(NotesContext);
  const [name, setName] = React.useState("");

  const onChangeName = (e) => setName(e.target.value);

  React.useEffect(() => {
    selectedNote.length !== 0 && setName(selectedNote.name);
  }, [selectedNote]);

  const themes = [
    "light",
    "dark",
    "caramel",
    "ocean",
    "violet",
    "navy",
    "vanilla",
    "mint",
    "ruby",
    "forest",
  ];

  const copyNote = () => {
    navigator.clipboard.writeText(selectedNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const editNote = () => {
    makeRequest(
      "edit_note",
      { path: selectedNote.path, content: content },
      (data) => {
        setSelectedNote(data);
        getNotes();
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    );
  };

  const deleteNote = () => {
    makeRequest("delete_note", { path: selectedNote.path }, (data) => {
      setSelectedNote([]);
      getNotes();
      setDeleting(false);
    });
  };

  const togglePin = () => {
    makeRequest("toggle_favorite", { path: selectedNote.path }, (data) => {
      setSelectedNote({ ...selectedNote, favorited: !selectedNote.favorited });
      getNotes();
    });
  };

  const addNote = () => {
    makeRequest("add_note", { folder: selectedFolder }, (data) => {
      setSelectedNote(data);
      getNotes();
    });
  };

  const renameNote = (e) => {
    e.preventDefault();
    makeRequest(
      "rename_note",
      { path: selectedNote.path, new_name: name },
      (data) => {
        setSelectedNote(data);
        getNotes();
      }
    );
  };

  const changeFolder = (newFolder) => {
    makeRequest(
      "change_folder",
      { path: selectedNote.path, new_folder: newFolder },
      (data) => {
        setSelectedNote(data);
        getNotes();
      }
    );
  };

  return (
    <div className={props.className + " row"}>
      <div className="col-2">
        <div className="between">
          <Button
            onClick={() => {
              setSelectedNote([]);
              setSettings({ ...settings, lastOpened: "" });
            }}
            className={"border-0 btn-sm"}
            text={"notable"}>
            <img
              className="me-2 pb-1"
              src="static/favicon.svg"
              width={20}
              height={20}
            />
          </Button>
          <Button
            onClick={() => addNote()}
            className={"btn-sm"}
            text={"New Note"}
            icon={"plus-lg"}
          />
        </div>
      </div>
      <div className="col-5">
        {selectedNote.length !== 0 && (
          <form
            className="input-group input-group-sm"
            onSubmit={(e) => renameNote(e)}>
            <input
              value={name}
              onChange={onChangeName}
              className="form-control fst-italic border-0 "
              style={{ letterSpacing: "2px" }}
            />
            <Dropdown
              icon="folder"
              className="btn-group-sm"
              classNameBtn="border-0"
              target="note-folder"
              text={selectedNote.folder ? selectedNote.folder : "No Folder"}>
              <button
                onClick={() => changeFolder(null)}
                type="button"
                className="dropdown-item">
                No Folder
              </button>
              {folders.map((x) => (
                <button
                  key={`${x}-2`}
                  onClick={() => changeFolder(x)}
                  type="button"
                  className="dropdown-item">
                  {x}
                </button>
              ))}
            </Dropdown>
            <div className="btn-group btn-group-sm ms-2">
              <Button
                className={settings.mode === "read" ? "active" : ""}
                onClick={() => setSettings({ ...settings, mode: "read" })}
                icon="eye-fill"
              />
              <Button
                className={settings.mode === "write" ? "active" : ""}
                onClick={() => setSettings({ ...settings, mode: "write" })}
                icon="pencil"
              />
              <Button
                className={settings.mode === "split" ? "active" : ""}
                onClick={() => setSettings({ ...settings, mode: "split" })}
                icon="layout-split"
              />
            </div>
          </form>
        )}
      </div>
      <div className="col-5">
        <div className="between">
          <div className="btn-group btn-group-sm">
            {selectedNote.length !== 0 && (
              <>
                {settings.mode !== "read" && (
                  <Button
                    onClick={() => editNote()}
                    text={saved ? "Saved." : "Save"}
                    icon={saved ? "check-lg" : "floppy2-fill"}
                  />
                )}
                <Button
                  onClick={() => togglePin()}
                  text={selectedNote.favorited ? "Unpin" : "Pin"}
                  icon={"pin-angle" + (selectedNote.favorited ? "-fill" : "")}
                  className={selectedNote.favorited ? "active" : ""}
                />
                <Button
                  onClick={() => copyNote()}
                  text={"Copy"}
                  icon={"clipboard" + (copied ? "-check" : "")}
                />
                <Button
                  onClick={() => setDeleting(!deleting)}
                  text={"Delete"}
                  icon={"trash2"}
                />
                {deleting && (
                  <Button
                    onClick={() => deleteNote()}
                    text={"Delete"}
                    icon={"question-lg"}
                  />
                )}
              </>
            )}
          </div>

          <div className="btn-group btn-group-sm">
            <Dropdown
              icon={"paint-bucket"}
              className="btn-group btn-group-sm"
              classNameBtn="text-capitalize"
              text={settings.theme}
              target="themes">
              {themes.map((x) => (
                <React.Fragment key={x}>
                  {settings.theme !== x && (
                    <button
                      onClick={() => setSettings({ ...settings, theme: x })}
                      className="dropdown-item text-capitalize">
                      {x}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </Dropdown>
            <a
              target="_blank"
              className="btn"
              href="https://github.com/misterrager8/notable">
              <i className="bi bi-info-circle me-2"></i>About
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [settings, setSettings] = React.useState(
    JSON.parse(localStorage.getItem("notable")) || defaultSettings
  );
  const [selectedNote, setSelectedNote] = React.useState([]);
  const [notes, setNotes] = React.useState([]);
  const [content, setContent] = React.useState("");

  const [folders, setFolders] = React.useState([]);
  const [selectedFolder, setSelectedFolder] = React.useState(null);

  const getNotes = () =>
    makeRequest(
      "notes",
      { sort: settings.sort, filter_: selectedFolder },
      (data) => setNotes(data.notes)
    );

  const getFolders = () =>
    makeRequest("folders", {}, (data) => {
      setFolders(data.folders);
    });

  React.useEffect(() => {
    localStorage.setItem("notable", JSON.stringify(settings));

    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings]);

  React.useEffect(() => {
    settings.lastOpened !== "" && setSelectedNote({ ...settings.lastOpened });
  }, []);

  return (
    <SettingsContext.Provider value={[settings, setSettings]}>
      <FolderContext.Provider
        value={[
          folders,
          setFolders,
          selectedFolder,
          setSelectedFolder,
          getFolders,
        ]}>
        <NotesContext.Provider value={[notes, setNotes, getNotes]}>
          <SelectedNoteContext.Provider
            value={[selectedNote, setSelectedNote, content, setContent]}>
            <div className="p-4">
              <Nav className="mb-3" />
              <div className="row view">
                <NotesPanel className="col-2 border-end h-100 overflow-scroll" />
                {selectedNote.length !== 0 && (
                  <Editor className="col-10 h-100" />
                )}
              </div>
            </div>
          </SelectedNoteContext.Provider>
        </NotesContext.Provider>
      </FolderContext.Provider>
    </SettingsContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
