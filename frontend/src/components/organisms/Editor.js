import { useContext, useEffect, useRef, useState } from "react";
import { MultiContext } from "../../App";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import ButtonGroup from "../molecules/ButtonGroup";
import Button from "../atoms/Button";

export default function Editor({ className }) {
  const multiCtx = useContext(MultiContext);
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }], // Heading levels
            [{ font: [] }], // Font selection
            [{ size: ["small", false, "large", "huge"] }], // Font sizes
            ["bold", "italic", "underline", "strike"], // Basic formatting
            [{ color: [] }, { background: [] }], // Text and background colors
            [{ script: "sub" }, { script: "super" }], // Subscript / superscript
            [{ list: "ordered" }, { list: "bullet" }], // Lists
            [{ indent: "-1" }, { indent: "+1" }], // Indentation
            [{ align: [] }], // Text alignment
            ["blockquote", "code-block"], // Block elements
            ["link", "image", "video"], // Media embedding
            ["clean"], // Remove formatting button
          ],
        },
      });

      quillInstance.current.on("text-change", () => {
        multiCtx.setContent(quillInstance.current.root.innerHTML);
      });
    }
  }, [multiCtx.setContent]);

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

  useEffect(() => {
    const quill = quillInstance.current;
    if (quill) {
      const editorContent = quill.root.innerHTML;

      if (multiCtx.content !== editorContent) {
        quill.root.innerHTML = multiCtx.content;
      }
    }
  }, [multiCtx.content]);

  return (
    <div
      className={
        className + (multiCtx.settings.mode === "write" ? "" : " hide-tools")
      }>
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
                className="green me-2"
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
      <div id="reader" ref={editorRef} />
    </div>
  );
}
