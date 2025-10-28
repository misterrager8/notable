import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../context";
import markdownit from "markdown-it";
import Toolbar from "./Toolbar";
import Dropdown from "./atoms/Dropdown";

export const ContentContext = createContext();

export default function Editor({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const onChangeContent = (e) => multiCtx.setContent(e.target.value);

  const [name, setName] = useState("");
  const onChangeName = (e) => setName(e.target.value);

  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
    selected: "",
  });

  useEffect(() => {
    setName(multiCtx.currentNote?.name);
    multiCtx.setContent(multiCtx.currentNote?.content);
  }, [multiCtx.currentNote]);

  const getSelection = () => {
    let elem = document.getElementById("editor");

    let start = elem.selectionStart;
    let end = elem.selectionEnd;
    let selected = multiCtx.content.substring(start, end);

    setSelection({ start: start, end: end, selected: selected });
  };

  return (
    <div className={className}>
      <form
        onSubmit={(e) => multiCtx.renameNote(e, name)}
        className="between mt-3">
        <input
          className="title-input w-75"
          autoComplete="off"
          value={name}
          onChange={onChangeName}
        />
        <div className="my-auto">
          <Dropdown
            border={false}
            icon="folder"
            text={multiCtx.currentNote?.folder}>
            <a
              className="dropdown-item"
              onClick={() => multiCtx.changeFolder(null)}>
              No Folder
            </a>
            {multiCtx.folders.map((x) => (
              <>
                {x.name !== multiCtx.currentNote?.folder && (
                  <a
                    className="dropdown-item"
                    onClick={() => multiCtx.changeFolder(x.name)}>
                    {x.name}
                  </a>
                )}
              </>
            ))}
          </Dropdown>
        </div>
      </form>
      {multiCtx.mode !== "view" && (
        <Toolbar selection={selection} className="" />
      )}
      <div
        className="row mt-3"
        style={{
          height: multiCtx.mode === "view" ? "72vh" : "67vh",
          overflowY: "hidden",
        }}>
        {["split", "edit"].includes(multiCtx.mode) && (
          <div
            className={"p-1 col" + (multiCtx.mode === "edit" ? "-12" : "-6")}>
            <textarea
              id="editor"
              onMouseUp={() => getSelection()}
              value={multiCtx.content}
              onChange={onChangeContent}
              placeholder="..."
              className="form-control fst-italic h-100"></textarea>
          </div>
        )}
        {["split", "view"].includes(multiCtx.mode) && (
          <div
            className={"h-100 col" + (multiCtx.mode === "view" ? "-12" : "-6")}>
            <div
              className="small overflow-y-auto h-100"
              id="reader"
              dangerouslySetInnerHTML={{
                __html: markdownit({ html: true }).render(multiCtx.content),
              }}></div>
          </div>
        )}
      </div>
      <div className="between small my-2 opacity-50 fst-italic">
        <div>
          <i className="bi bi-pencil me-2"></i>
          <span>{multiCtx.currentNote?.last_modified}</span>
        </div>
        <div>
          <i className="bi bi-plus-lg me-2"></i>
          <span>{multiCtx.currentNote?.date_created}</span>
        </div>
      </div>
    </div>
  );
}
