import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../App";
import Button from "../atoms/Button";

import markdownit from "markdown-it";
import Toolbar from "./Toolbar";
import ButtonGroup from "../molecules/ButtonGroup";

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
    multiCtx.setSettings({
      ...multiCtx.settings,
      lastOpened:
        multiCtx.currentNote.length !== 0 ? { ...multiCtx.currentNote } : "",
    });
  }, [multiCtx.currentNote]);

  return (
    <div className={className}>
      <div id="save-sm">
        <div className="between mb-3">
          <ButtonGroup className="" size="sm">
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
          </ButtonGroup>
          <div>
            {["write"].includes(multiCtx.settings.mode) && (
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
                multiCtx.setSettings({
                  ...multiCtx.settings,
                  theme: multiCtx.settings.theme === "light" ? "dark" : "light",
                })
              }
              icon={
                multiCtx.settings.theme === "light" ? "sun-fill" : "moon-fill"
              }
            />
          </div>
        </div>
      </div>
      {multiCtx.settings.mode !== "read" && (
        <Toolbar selection={selection} className="mb-3" />
      )}
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
                __html: markdownit({ html: true }).render(multiCtx.content),
              }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
