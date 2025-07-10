import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../MultiContext";
import markdownit from "markdown-it";
import Button from "../atoms/Button";
import Toolbar from "../organisms/Toolbar";
import Input from "../atoms/Input";
import Icon from "../atoms/Icon";
import Dropdown from "../molecules/Dropdown";

export default function Home({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const onChangeContent = (e) => multiCtx.setContent(e.target.value);
  const [saved, setSaved] = useState(false);
  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);

  const [name, setName] = useState("");
  const onChangeName = (e) => setName(e.target.value);

  useEffect(() => {
    setName(multiCtx.currentNote ? multiCtx.currentNote.name : "");
  }, [multiCtx.currentNote]);

  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
    selected: "",
  });

  const getSelection = (e) => {
    let elem = document.getElementById("editor");

    let start = elem.selectionStart;
    let end = elem.selectionEnd;
    let selected = multiCtx.content.substring(start, end);

    setSelection({ start: start, end: end, selected: selected });
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  };

  useEffect(() => {
    multiCtx.setContent(
      multiCtx.currentNote ? multiCtx.currentNote?.content : ""
    );
    localStorage.setItem(
      "notable-last-opened",
      JSON.stringify(multiCtx.currentNote)
    );
  }, [multiCtx.currentNote]);

  useEffect(() => {
    multiCtx.getNotes();
    multiCtx.getFolders();
  }, []);

  return (
    <div className="p-3">
      <div className={className + "d-flex mb-1"}>
        <div className="mx-auto" style={{ fontSize: ".775em" }}>
          <Dropdown
            icon="folder"
            showCaret={false}
            text={multiCtx.currentNote?.folder || ""}
            className="btn-group"
            classNameBtn="border-0"
            target="folders">
            <a
              onClick={() => multiCtx.changeFolder(null)}
              className={"dropdown-item"}>
              No Folder
            </a>
            {multiCtx.folders.map((x) => (
              <a
                onClick={() => multiCtx.changeFolder(x)}
                className={
                  "dropdown-item" +
                  (multiCtx.currentNote?.folder === x.folder ? " active" : "")
                }>
                {x}
              </a>
            ))}
          </Dropdown>
          <Icon name="slash-lg" className="mx-2" />
          <span className="btn-group">{multiCtx.currentNote?.name}</span>
        </div>
      </div>
      {multiCtx.currentNote && (
        <div>
          {selection.selected !== "" && (
            <div
              style={{
                position: "absolute",
                zIndex: "1",
                width: "400px",
                height: "200px",
                transform: `translate(${mouseX - 150}px, ${mouseY}px)`,
              }}>
              <Toolbar selection={selection} />
            </div>
          )}

          <form
            onSubmit={(e) =>
              multiCtx.renameNote(e, multiCtx.currentNote?.path, name)
            }>
            <div className="d-flex mb-3">
              {["write", "split"].includes(multiCtx.mode) && (
                <Button
                  size={null}
                  onClick={() => {
                    multiCtx.editNote(
                      multiCtx.currentNote.path,
                      multiCtx.content
                    );
                    setSaved(true);
                    setTimeout(() => setSaved(false), 1500);
                  }}
                  className={
                    "border-0 px-2 " +
                    (multiCtx.currentNote.content === multiCtx.content
                      ? "green"
                      : "orange")
                  }
                  icon={
                    saved
                      ? "check-circle-fill"
                      : multiCtx.currentNote.content !== multiCtx.content
                      ? "circle"
                      : "check-lg"
                  }
                />
              )}
              <Input
                size="lg"
                className="fw-bold ps-1"
                value={name}
                onChange={onChangeName}
              />

              <Button
                size={null}
                className={
                  "border-0 " + (multiCtx.mode === "read" ? "active" : "")
                }
                onClick={() => multiCtx.setMode("read")}
                icon="eye-fill"
              />
              <Button
                size={null}
                className={
                  "border-0 " + (multiCtx.mode === "write" ? "active" : "")
                }
                onClick={() => multiCtx.setMode("write")}
                icon="pencil"
              />
              <Button
                size={null}
                className={
                  "border-0 " + (multiCtx.mode === "split" ? "active" : "")
                }
                onClick={() => multiCtx.setMode("split")}
                icon="layout-split"
              />
            </div>
          </form>
          <div
            className={className + " row"}
            style={{ height: "80vh", overflowY: "auto" }}>
            {["write", "split"].includes(multiCtx.mode) && (
              <div
                className={
                  "col h-100" + (multiCtx.mode === "split" ? " border-end" : "")
                }>
                <textarea
                  style={{ height: "95%" }}
                  id="editor"
                  onMouseUp={(e) => getSelection(e)}
                  value={multiCtx.content}
                  onChange={onChangeContent}
                  className="form-control my-1"></textarea>
              </div>
            )}
            {["read", "split"].includes(multiCtx.mode) && (
              <div className="col h-100 overflow-y-auto">
                <div
                  id="reader"
                  dangerouslySetInnerHTML={{
                    __html: markdownit({ html: true }).render(multiCtx.content),
                  }}></div>
              </div>
            )}
          </div>

          <div
            className="between opacity-50 fst-italic mt-2"
            style={{ fontSize: ".775em" }}>
            <div>
              <Icon name="pencil" /> {multiCtx.currentNote?.last_modified}
            </div>
            <div>
              <Icon name="plus-lg" /> {multiCtx.currentNote?.date_created}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
