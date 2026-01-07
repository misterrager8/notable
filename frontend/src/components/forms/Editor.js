import { useContext, useEffect, useState } from "react";
import Input from "../atoms/Input";
import { MultiContext } from "../../context";
import markdownit from "markdown-it";
import Button from "../atoms/Button";
import Dropdown from "../atoms/Dropdown";
import Toolbar from "../Toolbar";

export default function Editor() {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");
  // const [content, setContent] = useState("");
  const [mode, setMode] = useState(
    localStorage.getItem("notable-mode") || "split"
  );

  const [deleting, setDeleting] = useState(false);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeContent = (e) => multiCtx.setContent(e.target.value);

  const [selection, setSelection] = useState({
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

  useEffect(() => {
    setName(multiCtx.currentNote?.name);
    multiCtx.setContent(multiCtx.currentNote?.content);
  }, [multiCtx.currentNote]);

  useEffect(() => {
    localStorage.setItem("notable-mode", mode);
  }, [mode]);

  return (
    <form onSubmit={(e) => multiCtx.renameNote(e, name)}>
      <div className="d-flex">
        <div className="d-flex my-auto">
          <Button
            onClick={() => multiCtx.editNote(multiCtx.content)}
            className={
              "px-1" +
              (multiCtx.currentNote?.content === multiCtx.content
                ? " green"
                : " orange")
            }
            icon={
              multiCtx.currentNote?.content === multiCtx.content
                ? "check-lg"
                : "record-fill"
            }
          />
        </div>
        <Input className="title-input" value={name} onChange={onChangeName} />
        <div className="d-flex my-auto">
          <Dropdown
            icon="folder"
            target="change-folder"
            text={
              multiCtx.currentNote.folder ? multiCtx.currentNote.folder : "-"
            }>
            <a
              onClick={() => multiCtx.changeFolder(null)}
              className="dropdown-item">
              No Folder
            </a>
            {multiCtx.folders.map((x) => (
              <a
                onClick={() => multiCtx.changeFolder(x.name)}
                className={
                  "dropdown-item" +
                  (x.name === multiCtx.currentNote?.folder ? " active" : "")
                }>
                {x.name}
              </a>
            ))}
          </Dropdown>

          <Button
            onClick={() => multiCtx.toggleBookmark()}
            icon={"bookmark" + (multiCtx.currentNote?.favorited ? "-fill" : "")}
          />
          {deleting && (
            <Button
              className="red"
              onClick={() => {
                multiCtx.deleteNote();
                setDeleting(false);
              }}
              icon="question-lg"
            />
          )}
          <Button
            className="red"
            onClick={() => setDeleting(!deleting)}
            icon="trash2"
          />

          <Button
            onClick={() => setMode("write")}
            active={mode === "write"}
            icon="pencil"
          />
          <Button
            onClick={() => setMode("read")}
            active={mode === "read"}
            icon="eye"
          />
          <Button
            onClick={() => setMode("split")}
            active={mode === "split"}
            icon="layout-split"
          />
        </div>
      </div>
      {["split", "write"].includes(mode) && <Toolbar selection={selection} />}
      <div className="d-flex editor mt-3">
        {["split", "write"].includes(mode) && (
          <textarea
            onMouseUp={() => getSelection()}
            id="editor"
            autoComplete="off"
            className="form-control font-monospace col"
            value={multiCtx.content}
            onChange={onChangeContent}></textarea>
        )}
        {mode === "split" && <div className="divider-y"></div>}
        {["split", "read"].includes(mode) && (
          <div
            className="col overflow-auto"
            id="reader"
            dangerouslySetInnerHTML={{
              __html: markdownit({ html: true }).render(multiCtx.content),
            }}></div>
        )}
      </div>
    </form>
  );
}
