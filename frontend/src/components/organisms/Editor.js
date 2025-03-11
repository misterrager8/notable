import { useContext, useEffect, useState } from "react";
import Button from "../atoms/Button";

import markdownit from "markdown-it";
import Toolbar from "./Toolbar";
import ButtonGroup from "../molecules/ButtonGroup";
import { MultiContext } from "../../MultiContext";

export default function Editor({ className }) {
  const multiCtx = useContext(MultiContext);

  const onChangeContent = (e) => multiCtx.setContent(e.target.value);
  const [saved, setSaved] = useState(false);

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
    multiCtx.setContent(
      multiCtx.currentNote.length !== 0 ? multiCtx.currentNote.content : ""
    );
    localStorage.setItem(
      "notable-last-opened",
      JSON.stringify(multiCtx.currentNote)
    );
  }, [multiCtx.currentNote]);

  return (
    <div className={className}>
      <div id="save-sm">
        <div className="between mb-3">
          <ButtonGroup className="" size="sm">
            <Button
              className={multiCtx.mode === "read" ? "active" : ""}
              onClick={() => multiCtx.setMode("read")}
              icon="eye-fill"
            />
            <Button
              className={multiCtx.mode === "write" ? "active" : ""}
              onClick={() => multiCtx.setMode("write")}
              icon="pencil"
            />
            <Button
              className={multiCtx.mode === "split" ? "active" : ""}
              onClick={() => multiCtx.setMode("split")}
              icon="layout-split"
            />
          </ButtonGroup>
          <div>
            {["write", "split"].includes(multiCtx.mode) && (
              <Button
                className={
                  "me-2" +
                  (multiCtx.currentNote.content === multiCtx.content
                    ? " green"
                    : " orange")
                }
                onClick={() => {
                  multiCtx.editNote(
                    multiCtx.currentNote.path,
                    multiCtx.content
                  );
                  setSaved(true);
                  setTimeout(() => setSaved(false), 1500);
                }}
                icon={saved ? "check-lg" : "floppy2-fill"}
              />
            )}
            <Button
              onClick={() =>
                multiCtx.setTheme(multiCtx.theme === "light" ? "dark" : "light")
              }
              icon={multiCtx.theme === "light" ? "sun-fill" : "moon-fill"}
            />
          </div>
        </div>
      </div>
      {multiCtx.mode !== "read" && (
        <Toolbar selection={selection} className="mb-3" />
      )}
      <div className="row">
        {["split", "write"].includes(multiCtx.mode) && (
          <div
            id="editor-parent"
            className={
              "px-3 border-end col-" + (multiCtx.mode === "write" ? "12" : "6")
            }>
            <textarea
              style={{ height: "77vh" }}
              onMouseUp={() => getSelection()}
              id="editor"
              className="form-control"
              value={multiCtx.content}
              onChange={onChangeContent}
              placeholder="..."></textarea>
          </div>
        )}
        {["split", "read"].includes(multiCtx.mode) && (
          <div
            style={{ height: "77vh" }}
            className={
              "overflow-auto px-5 col-" +
              (multiCtx.mode === "read" ? "12" : "6")
            }>
            <div
              id="reader"
              dangerouslySetInnerHTML={{
                __html: markdownit({ html: true }).render(multiCtx.content),
              }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
