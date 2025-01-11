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

const MultiContext = React.createContext();

const api = (url, params, callback) =>
  fetch("/" + url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => callback(data));

function Icon({ className, name }) {
  return <i className={className + " bi bi-" + name}></i>;
}

function Button({ className, type_ = "button", onClick, icon, text, size }) {
  return (
    <button
      type={type_}
      className={className + " btn" + (size === "sm" ? " btn-sm" : "")}
      onClick={onClick}>
      {icon && <i className={"bi bi-" + icon + (text ? " me-1" : "")}></i>}
      {text}
    </button>
  );
}

function Input({
  className,
  onChange,
  value,
  placeholder,
  required,
  type_,
  size,
}) {
  return (
    <input
      onChange={onChange}
      value={value}
      className={
        className + " form-control" + (size === "sm" ? " form-control-sm" : "")
      }
      placeholder={placeholder}
      required={required}
      autoComplete="off"
      type={type_}
    />
  );
}

function ButtonGroup({ className, size, children }) {
  return (
    <div
      className={
        className + " btn-group" + (size === "sm" ? " btn-group-sm" : "")
      }>
      {children}
    </div>
  );
}

function InputGroup({ className, size, children }) {
  return (
    <div
      className={
        className + " input-group" + (size === "sm" ? " input-group-sm" : "")
      }>
      {children}
    </div>
  );
}

function Spinner({ className }) {
  return (
    <span className={className + " spinner-border spinner-border-sm"}></span>
  );
}

function Badge({ className, icon, text }) {
  return (
    <span className={className + " badge"}>
      {icon && <i className={"bi bi-" + icon + (text ? " me-1" : "")}></i>}
      {text}
    </span>
  );
}

function Dropdown({
  className,
  classNameBtn,
  classNameMenu,
  target,
  icon,
  children,
  text,
  autoClose = true,
}) {
  return (
    <div className={className + " dropdown"}>
      <a
        data-bs-target={"#" + target}
        data-bs-toggle="dropdown"
        data-bs-auto-close={autoClose}
        className={classNameBtn + " dropdown-toggle"}>
        {icon && <Icon name={icon} className="me-1" />}
        {text}
      </a>
      <div id={target} className={classNameMenu + " dropdown-menu"}>
        {children}
      </div>
    </div>
  );
}

function Heading({ className, size = 1, icon, text }) {
  return (
    <div className={className + " text-center h" + size}>
      {icon && <Icon name={icon} className="me-3" />}
      {text}
    </div>
  );
}

function HomePage({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className}>
      <div className="row view">
        <NotesPanel className="col-2 border-end h-100" />
        {multiCtx.currentNote.length !== 0 && (
          <Editor className="col-10 h-100" />
        )}
      </div>
    </div>
  );
}

function AboutPage({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [readme, setReadme] = React.useState("");

  React.useEffect(() => {
    multiCtx.setLoading(true);
    api("about", {}, (data) => {
      setReadme(data.readme);
      multiCtx.setLoading(false);
    });
  }, []);

  return (
    <div className={className}>
      <div
        dangerouslySetInnerHTML={{
          __html: window.markdownit().render(readme),
        }}></div>
    </div>
  );
}

function Display({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className + " py-4"}>
      {multiCtx.currentPage === "about" ? <AboutPage /> : <HomePage />}
    </div>
  );
}

function NoteItem({ item, className = "" }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div
      className={
        className +
        " py-2 rounded px-3 item" +
        (multiCtx.currentNote.name === item.name ? " selected" : "")
      }
      onClick={() => multiCtx.setCurrentNote({ ...item })}>
      <div className="between">
        <div
          className={
            "pe-4 text-truncate fw-bold" +
            (item.favorited && multiCtx.currentNote.name !== item.name
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
        {multiCtx.settings.sort === "date_created" ? (
          <div className="opacity-75 text-truncate">
            <Icon name="plus-lg" className="me-1" />
            {item.date_created}
          </div>
        ) : (
          <div className="opacity-75 text-truncate">
            <Icon name="pencil" className="me-1" />
            {item.last_modified}
          </div>
        )}
        {item.folder && <Badge text={item.folder} />}
      </div>
    </div>
  );
}

function FolderItem({ item }) {
  const multiCtx = React.useContext(MultiContext);

  const [deleting, setDeleting] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState("");

  const onChangeName = (e) => setName(e.target.value);

  React.useEffect(() => {
    setName(item);
  }, []);

  return (
    <div className="small between">
      {editing ? (
        <form
          className="input-group input-group-sm "
          style={{ marginBlockEnd: 0 }}
          onSubmit={(e) => multiCtx.renameFolder(e, item, name)}>
          <Input
            onChange={onChangeName}
            value={name}
            className="border-0 opacity-50"
          />
        </form>
      ) : (
        <a
          className="py-1 fw-bold"
          onClick={() => multiCtx.setCurrentFolder(item)}>
          {item}
        </a>
      )}
      <ButtonGroup size="sm">
        <Button
          onClick={() => setEditing(!editing)}
          className={"border-0"}
          icon={editing ? "arrow-left" : "pencil"}
        />
        {deleting && (
          <Button
            onClick={() => multiCtx.deleteFolder(item)}
            className="border-0"
            icon="question-lg"
          />
        )}
        <Button
          onClick={() => setDeleting(!deleting)}
          className="border-0"
          icon="trash2"
        />
      </ButtonGroup>
    </div>
  );
}

function NotesPanel({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [showFolders, setShowFolders] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);

  React.useEffect(
    () => multiCtx.getNotes(),
    [multiCtx.settings, multiCtx.currentFolder]
  );
  React.useEffect(() => multiCtx.getFolders(), []);
  React.useEffect(() => setShowFolders(false), [multiCtx.currentFolder]);

  const onChangeSearch = (e) => setSearch(e.target.value);

  const searchNotes = (e) => {
    e.preventDefault();
    api("search", { query: search }, (data) => {
      setSearchResults(data.results);
    });
  };

  return (
    <div className={className} id="notes-panel">
      <div className="between">
        <Dropdown
          classNameBtn="btn border-0 text-capitalize"
          className="btn-group-sm"
          target="sorts"
          icon={sorts.filter((x) => x.name === multiCtx.settings.sort)[0]?.icon}
          text={
            sorts.filter((x) => x.name === multiCtx.settings.sort)[0]?.label
          }>
          {sorts.map((x) => (
            <button
              key={x.name}
              className="dropdown-item between"
              onClick={() =>
                multiCtx.setSettings({ ...multiCtx.settings, sort: x.name })
              }>
              <span className="">{x?.label}</span>
              <Icon name={x?.icon} className="m-1" />
            </button>
          ))}
        </Dropdown>
        <ButtonGroup size="sm">
          <Button
            onClick={() => setShowFolders(!showFolders)}
            className={
              "dropdown-toggle border-0" + (showFolders ? " selected" : "")
            }
            icon="folder"
            text={
              multiCtx.currentFolder
                ? multiCtx.currentFolder.substring(0, 10)
                : "All Folders"
            }
          />
          {multiCtx.currentFolder !== null && (
            <Button
              onClick={() => multiCtx.setCurrentFolder(null)}
              className="border-0"
              icon="x-lg"
            />
          )}
        </ButtonGroup>
      </div>
      <form onSubmit={searchNotes} className="input-group input-group-sm my-3">
        <Input placeholder="Search" onChange={onChangeSearch} value={search} />
        {searchResults.length !== 0 && (
          <Button
            type_="button"
            onClick={() => {
              setSearchResults([]);
              setSearch("");
            }}
            className="border-0"
            icon="x-circle"
          />
        )}
      </form>
      {searchResults.length !== 0 && (
        <div className="px-2">
          {searchResults.map((x) => (
            <div className="mb-3">
              <a
                onClick={() => multiCtx.getNote(x.path)}
                className="d-block fw-bold mb-1">
                {x.file}
              </a>
              <div className="fst-italic small opacity-50">"{x.match}"</div>
            </div>
          ))}
          <hr />
        </div>
      )}
      <div>
        {showFolders && (
          <div className="px-3">
            <hr />
            <Button
              onClick={() => multiCtx.addFolder()}
              text="New Folder"
              icon="plus-lg"
              className="w-100 mb-3"
              size="sm"
            />
            {multiCtx.folders.map((x) => (
              <React.Fragment key={x}>
                {x !== multiCtx.currentFolder && <FolderItem item={x} />}
              </React.Fragment>
            ))}
            <hr />
          </div>
        )}
      </div>
      <div className="overflow-auto h-100">
        {multiCtx.notes.map((x) => (
          <NoteItem className="" key={x.name} item={x} />
        ))}
      </div>
      <Badge
        icon="record-fill"
        className="mt-3 border-0 w-100"
        text={
          multiCtx.notes.length +
          " Note" +
          (multiCtx.notes.length === 1 ? "" : "s")
        }
      />
    </div>
  );
}

function Editor({ className }) {
  const multiCtx = React.useContext(MultiContext);

  const onChangeContent = (e) => multiCtx.setContent(e.target.value);
  const [saved, setSaved] = React.useState(false);

  const [selection, setSelection] = React.useState({
    start: 0,
    end: 0,
    selected: "",
  });

  const getSelection = () => {
    let elem = document.getElementById("editor");

    let start = elem.selectionStart;
    let end = elem.selectionEnd;
    let selected = multiCtx.content.substring(start, end);

    setSelection({ start: start, end: end, selected: selected });
  };

  React.useEffect(() => {
    multiCtx.setContent(
      multiCtx.currentNote.length !== 0 ? multiCtx.currentNote.content : ""
    );
    multiCtx.setSettings({
      ...multiCtx.settings,
      lastOpened:
        multiCtx.currentNote.length !== 0 ? { ...multiCtx.currentNote } : "",
    });
  }, [multiCtx.currentNote]);

  return (
    <div className={className}>
      {multiCtx.settings.mode !== "read" && (
        <Toolbar selection={selection} className="mb-3" />
      )}
      <div id="save-sm">
        <Button
          className="mb-1 w-100"
          onClick={() => {
            multiCtx.editNote(multiCtx.currentNote.path, multiCtx.content);
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
          }}
          // text={saved ? "Saved." : "Save"}
          icon={saved ? "check-lg" : "floppy2-fill"}
        />
      </div>
      <div className="row h-100 overflow-auto">
        {["split", "write"].includes(multiCtx.settings.mode) && (
          <div
            id="editor-parent"
            className={
              "px-3 border-end col-" +
              (multiCtx.settings.mode === "write" ? "12" : "6")
            }>
            <textarea
              onMouseUp={() => getSelection()}
              id="editor"
              className="form-control my-1 h-100"
              value={multiCtx.content}
              onChange={onChangeContent}
              placeholder="..."></textarea>
          </div>
        )}
        {["split", "read"].includes(multiCtx.settings.mode) && (
          <div
            className={
              "px-5 col-" + (multiCtx.settings.mode === "read" ? "12" : "6")
            }>
            <div
              id="reader"
              dangerouslySetInnerHTML={{
                __html: window.markdownit().render(multiCtx.content),
              }}></div>
          </div>
        )}
      </div>
    </div>
  );
}

function Toolbar({ selection, className }) {
  const multiCtx = React.useContext(MultiContext);
  const [url, setUrl] = React.useState("");
  const [showURL, setShowURL] = React.useState(false);

  const onChangeURL = (e) => setUrl(e.target.value);

  const savePage = (e) => {
    e.preventDefault();
    api("save_page", { path: multiCtx.currentNote.path, url: url }, (data) =>
      multiCtx.setCurrentNote(data)
    );
  };

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formats = [
    {
      label: "bold",
      format: `**${selection.selected}**`,
    },
    {
      label: "italic",
      format: `*${selection.selected}*`,
    },
    {
      label: "heading",
      format: `### ${selection.selected}`,
    },
    {
      label: "hrule",
      format: "\n---\n",
    },
    {
      label: "num-list",
      format: `1. ${selection.selected.split("\n").join("\n1. ")}`,
    },
    {
      label: "sort",
      format: `${selection.selected.split("\n").toSorted().join("\n")}`,
    },
    {
      label: "sort-reverse",
      format: `${selection.selected
        .split("\n")
        .toSorted()
        .reverse()
        .join("\n")}`,
    },
    {
      label: "bullet-list",
      format: `- ${selection.selected.split("\n").join("\n- ")}`,
    },
    {
      label: "checklist",
      format: `- **[​　]** ${selection.selected
        .split("\n")
        .join("\n- **[​　]** ")}`,
    },
    {
      label: "check",
      format: `✓`,
    },
    {
      label: "code",
      format: `\`\`\`${selection.selected}\`\`\``,
    },
    {
      label: "image",
      format: `![${selection.selected}]()`,
    },
    {
      label: "link",
      format: `[${selection.selected}]()`,
    },
    {
      label: "capitalize",
      format: `${
        selection.selected.charAt(0).toUpperCase() + selection.selected.slice(1)
      }`,
    },
    {
      label: "allcaps",
      format: `${selection.selected.toUpperCase()}`,
    },
    {
      label: "alllower",
      format: `${selection.selected.toLowerCase()}`,
    },
    {
      label: "indent",
      format: `    ${selection.selected}`,
    },
    {
      label: "parentheses",
      format: `(${selection.selected})`,
    },
    {
      label: "curly-braces",
      format: `{${selection.selected}}`,
    },
    {
      label: "square-brackets",
      format: `[${selection.selected}]`,
    },
    {
      label: "single-quotes",
      format: `'${selection.selected}'`,
    },
    {
      label: "double-quotes",
      format: `"${selection.selected}"`,
    },
    {
      label: "date-1",
      format: `${new Date().getDate()} ${monthNames[new Date().getMonth()]}`,
    },
    {
      label: "date-2",
      format: `${weekday[new Date().getDay()]}`,
    },
    {
      label: "date-3",
      format: `${new Date().toLocaleTimeString()}`,
    },
    {
      label: "date-4",
      format: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`,
    },
  ];

  const copyFormat = (format) => {
    let format_ = formats.filter((x) => x.label === format)[0];
    let new_ =
      multiCtx.content.substring(0, selection.start) +
      format_.format +
      multiCtx.content.substring(selection.end, multiCtx.content.length);
    multiCtx.setContent(new_);
  };

  const formatDate = (format) => {
    let format_ = formats.filter((x) => x.label === format)[0];
    let new_ =
      multiCtx.content.substring(0, selection.start) +
      format_.format +
      multiCtx.content.substring(selection.end, multiCtx.content.length);
    multiCtx.setContent(new_);
  };

  return (
    <div className={className} id="toolbar">
      <ButtonGroup>
        <ButtonGroup className="">
          <Button onClick={() => copyFormat("bold")} icon="type-bold" />
          <Button onClick={() => copyFormat("italic")} icon="type-italic" />
          <Button onClick={() => copyFormat("heading")} icon="type-h1" />
          <Button onClick={() => copyFormat("hrule")} icon="hr" />
          <Button onClick={() => copyFormat("num-list")} icon="123" />
          <Button onClick={() => copyFormat("bullet-list")} icon="list-ul" />
          <Button onClick={() => copyFormat("checklist")} icon="ui-checks" />
          <Button
            onClick={() => copyFormat("check")}
            icon="check-circle-fill"
          />
          <Button onClick={() => copyFormat("code")} icon="code-slash" />
          <Button onClick={() => copyFormat("image")} icon="image" />
          <Button onClick={() => copyFormat("link")} icon="link-45deg" />
          <Dropdown
            classNameBtn="btn"
            target="other-formats"
            className="btn-group"
            icon="type"
            autoClose={false}>
            <ButtonGroup size="sm" className="p-1">
              <Button
                className="border-0"
                onClick={() => copyFormat("capitalize")}
                icon="type"
                text="Capitalize"
              />
              <Button
                className="border-0"
                onClick={() => copyFormat("allcaps")}
                icon="alphabet-uppercase"
                text="Upper"
              />
              <Button
                className="border-0"
                onClick={() => copyFormat("alllower")}
                icon="alphabet"
                text="Lower"
              />
            </ButtonGroup>
          </Dropdown>{" "}
          <Button onClick={() => copyFormat("indent")} icon="indent" />
          <Button onClick={() => copyFormat("sort")} icon="sort-alpha-down" />
          <Button
            onClick={() => copyFormat("sort-reverse")}
            icon="sort-alpha-up-alt"
          />
          <Dropdown
            classNameBtn="btn"
            target="other-formats"
            className="btn-group"
            icon="three-dots"
            autoClose={false}>
            <ButtonGroup size="sm" className="p-1">
              <Button
                onClick={() => copyFormat("parentheses")}
                className="border-0"
                text="()"
              />
              <Button
                onClick={() => copyFormat("curly-braces")}
                className="border-0"
                text="{}"
              />
              <Button
                onClick={() => copyFormat("square-brackets")}
                className="border-0"
                text="[]"
              />
              <Button
                onClick={() => copyFormat("single-quotes")}
                className="border-0"
                text="''"
              />
              <Button
                onClick={() => copyFormat("double-quotes")}
                className="border-0"
                text='""'
              />
            </ButtonGroup>
          </Dropdown>
          <Dropdown
            classNameBtn="btn"
            target="date-formats"
            className="btn-group"
            icon="calendar-date"
            autoClose={false}>
            <div className="p-1">
              <Button
                size="sm"
                onClick={() => copyFormat("date-1")}
                className="border-0 w-100"
                text="'22 May'"
              />
              <Button
                size="sm"
                onClick={() => copyFormat("date-2")}
                className="border-0 w-100"
                text="'Wednesday'"
              />
              <Button
                size="sm"
                onClick={() => copyFormat("date-3")}
                className="border-0 w-100"
                text="'3:33 AM'"
              />
              <Button
                size="sm"
                onClick={() => copyFormat("date-4")}
                className="border-0 w-100"
                text="'2024-05-22'"
              />
            </div>
          </Dropdown>
          <Button
            className={showURL ? "active" : ""}
            icon="markdown-fill"
            onClick={() => setShowURL(!showURL)}
          />
        </ButtonGroup>
      </ButtonGroup>
      {showURL && (
        <form onSubmit={(e) => savePage(e)} className="mt-3 w-50">
          <Input
            className="form-control-sm"
            placeholder="URL"
            onChange={onChangeURL}
            value={url}
          />
        </form>
      )}
    </div>
  );
}

function Nav({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [name, setName] = React.useState("");

  const [deleting, setDeleting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const onChangeName = (e) => setName(e.target.value);

  React.useEffect(() => {
    multiCtx.currentNote.length !== 0 && setName(multiCtx.currentNote.name);
  }, [multiCtx.currentNote]);

  const copyNote = () => {
    navigator.clipboard.writeText(multiCtx.currentNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={className} id="nav">
      <div className="row">
        <div className="col-2">
          <div className="between">
            <ButtonGroup size="sm">
              {multiCtx.loading && (
                <button className="btn border-0">
                  <Spinner />
                </button>
              )}
              <a
                onClick={() => {
                  multiCtx.setCurrentPage("");
                  multiCtx.setCurrentNote([]);
                  multiCtx.setSettings({ ...settings, lastOpened: "" });
                }}
                className="btn border-0">
                <img
                  className="me-2 pb-1"
                  src="static/favicon.svg"
                  width={20}
                  height={20}
                />
                notable
              </a>
            </ButtonGroup>
            <Button
              size="sm"
              onClick={() => multiCtx.addNote()}
              text="New Note"
              icon="plus-lg"
            />
          </div>
        </div>
        <div className="col-5">
          {multiCtx.currentNote.length !== 0 && multiCtx.currentPage === "" && (
            <form
              className="input-group input-group-sm"
              onSubmit={(e) =>
                multiCtx.renameNote(e, multiCtx.currentNote.path, name)
              }>
              <input
                value={name}
                onChange={onChangeName}
                className="form-control fst-italic border-0 "
                style={{ letterSpacing: "2px" }}
              />
              <Dropdown
                icon="folder"
                className="btn-group btn-group-sm"
                classNameBtn="btn border-0"
                target="note-folder"
                text={
                  multiCtx.currentNote.folder
                    ? multiCtx.currentNote.folder
                    : "No Folder"
                }>
                <button
                  onClick={() => multiCtx.changeFolder(null)}
                  type="button"
                  className="dropdown-item">
                  No Folder
                </button>
                {multiCtx.folders.map((x) => (
                  <button
                    key={`${x}-2`}
                    onClick={() => multiCtx.changeFolder(x)}
                    type="button"
                    className="dropdown-item">
                    {x}
                  </button>
                ))}
              </Dropdown>
              <ButtonGroup className="ms-2" size="sm">
                <Button
                  className={multiCtx.settings.mode === "read" ? "active" : ""}
                  onClick={() =>
                    multiCtx.setSettings({
                      ...multiCtx.settings,
                      mode: "read",
                    })
                  }
                  icon="eye-fill"
                />
                <Button
                  className={multiCtx.settings.mode === "write" ? "active" : ""}
                  onClick={() =>
                    multiCtx.setSettings({
                      ...multiCtx.settings,
                      mode: "write",
                    })
                  }
                  icon="pencil"
                />
                <Button
                  className={multiCtx.settings.mode === "split" ? "active" : ""}
                  onClick={() =>
                    multiCtx.setSettings({
                      ...multiCtx.settings,
                      mode: "split",
                    })
                  }
                  icon="layout-split"
                />
              </ButtonGroup>
            </form>
          )}
        </div>
        <div className="col-5">
          <div className="between">
            <ButtonGroup size="sm">
              {multiCtx.currentNote.length !== 0 &&
                multiCtx.currentPage === "" && (
                  <>
                    {multiCtx.settings.mode !== "read" && (
                      <Button
                        onClick={() => {
                          multiCtx.editNote(
                            multiCtx.currentNote.path,
                            multiCtx.content
                          );
                          setSaved(true);
                          setTimeout(() => setSaved(false), 1500);
                        }}
                        // text={saved ? "Saved." : "Save"}
                        icon={saved ? "check-lg" : "floppy2-fill"}
                      />
                    )}
                    <Button
                      onClick={() =>
                        multiCtx.pinNote(multiCtx.currentNote.path)
                      }
                      text={multiCtx.currentNote.favorited ? "Unpin" : "Pin"}
                      icon={
                        "pin-angle" +
                        (multiCtx.currentNote.favorited ? "-fill" : "")
                      }
                      className={multiCtx.currentNote.favorited ? "active" : ""}
                    />
                    <Button
                      onClick={() => copyNote()}
                      text={"Copy"}
                      icon={"clipboard" + (copied ? "-check" : "")}
                    />
                    <Button
                      onClick={() =>
                        multiCtx.duplicateNote(multiCtx.currentNote.path)
                      }
                      text={"Duplicate"}
                      icon="copy"
                    />
                    <Button
                      onClick={() => setDeleting(!deleting)}
                      text={"Delete"}
                      icon={"trash2"}
                    />
                    {deleting && (
                      <Button
                        onClick={() => {
                          multiCtx.deleteNote(multiCtx.currentNote.path);
                          multiCtx.setCurrentNote([]);
                          setDeleting(false);
                        }}
                        // text={"Delete"}
                        icon={"question-lg"}
                      />
                    )}
                  </>
                )}
            </ButtonGroup>
            <ButtonGroup size="sm">
              <Button
                onClick={() =>
                  multiCtx.setSettings({
                    ...multiCtx.settings,
                    theme:
                      multiCtx.settings.theme === "light" ? "dark" : "light",
                  })
                }
                className="text-capitalize"
                text={multiCtx.settings.theme}
                icon={
                  multiCtx.settings.theme === "light" ? "sun-fill" : "moon-fill"
                }
              />
              <Button
                className={multiCtx.currentPage === "about" ? " active" : ""}
                text="About"
                icon="info-circle"
                onClick={() => multiCtx.setCurrentPage("about")}
              />
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState(
    JSON.parse(localStorage.getItem("notable")) || defaultSettings
  );

  const [notes, setNotes] = React.useState([]);
  const [currentNote, setCurrentNote] = React.useState([]);

  const [folders, setFolders] = React.useState([]);
  const [currentFolder, setCurrentFolder] = React.useState(null);

  const [content, setContent] = React.useState("");

  const addNote = () => {
    api("add_note", { folder: currentFolder }, (data) => {
      setCurrentNote(data);
      getNotes();
    });
  };

  const getNote = (path) => {
    api("note", { path: path }, (data) => {
      setCurrentNote(data);
    });
  };

  const getNotes = () => {
    api("notes", { sort: settings.sort, filter_: currentFolder }, (data) => {
      setNotes(data.notes);
    });
  };

  const editNote = (path, content) => {
    api("edit_note", { path: path, content: content }, (data) => {
      setCurrentNote(data);
      getNotes();
    });
  };

  const deleteNote = (path) => {
    api("delete_note", { path: path }, (data) => {
      getNotes();
    });
  };

  const duplicateNote = (path) => {
    api("duplicate_note", { path: path }, (data) => {
      setCurrentNote(data);
      getNotes();
    });
  };

  const renameNote = (e, path, newName) => {
    e.preventDefault();
    api("rename_note", { path: path, new_name: newName }, (data) => {
      setCurrentNote(data);
      getNotes();
    });
  };

  const pinNote = (path) => {
    api("toggle_favorite", { path: path }, (data) => {
      setCurrentNote({ ...currentNote, favorited: !currentNote.favorited });
      getNotes();
    });
  };

  const addFolder = () => {
    api("add_folder", {}, (data) => {
      getFolders();
    });
  };

  const getFolders = () => {
    api("folders", {}, (data) => {
      setFolders(data.folders);
    });
  };

  const deleteFolder = (name) => {
    api("delete_folder", { name: name }, (data) => {
      getFolders();
    });
  };

  const renameFolder = (e, name, newName) => {
    e.preventDefault();
    api("rename_folder", { name: name, new_name: newName }, (data) => {
      getFolders();
    });
  };

  const changeFolder = (newFolder) => {
    api(
      "change_folder",
      { path: currentNote.path, new_folder: newFolder },
      (data) => {
        setCurrentNote(data);
        getNotes();
      }
    );
  };

  const contextValue = {
    loading: loading,
    setLoading: setLoading,
    settings: settings,
    setSettings: setSettings,
    currentPage: currentPage,
    setCurrentPage: setCurrentPage,

    notes: notes,
    setNotes: setNotes,

    currentNote: currentNote,
    setCurrentNote: setCurrentNote,
    content: content,
    setContent: setContent,

    folders: folders,
    setFolders: setFolders,

    currentFolder: currentFolder,
    setCurrentFolder: setCurrentFolder,

    addNote: addNote,
    getNote: getNote,
    getNotes: getNotes,
    editNote: editNote,
    deleteNote: deleteNote,
    duplicateNote: duplicateNote,
    renameNote: renameNote,
    pinNote: pinNote,

    addFolder: addFolder,
    getFolders: getFolders,
    deleteFolder: deleteFolder,
    renameFolder: renameFolder,
    changeFolder: changeFolder,
  };

  React.useEffect(() => {
    localStorage.setItem("notable", JSON.stringify(settings));

    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings]);

  React.useEffect(() => {
    settings.lastOpened !== "" && setCurrentNote({ ...settings.lastOpened });
  }, []);

  return (
    <MultiContext.Provider value={contextValue}>
      <div className="full p-4">
        <Nav className="" />
        <Display />
      </div>
    </MultiContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
