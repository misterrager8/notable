import { useContext, useEffect, useState } from "react";
import Button from "./Button";
import { MultiContext } from "../context";
import Dropdown from "./Dropdown";
import ButtonGroup from "./ButtonGroup";

export default function TopNav({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [theme, setTheme] = useState(localStorage.getItem("notable-theme"));
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyNote = () => {
    navigator.clipboard.writeText(multiCtx.currentNote?.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  useEffect(() => {
    localStorage.setItem("notable-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    setDeleting(false);
  }, [multiCtx.currentNote]);

  const themes = ["light", "dark", "manila", "plum", "mint"];

  return (
    <div className={className + " top-nav"}>
      <div className="between w-100 my-auto">
        <div>
          <Button
            active={multiCtx.showSide}
            onClick={() => multiCtx.setShowSide(!multiCtx.showSide)}
            border={false}
            icon="list"
          />

          {multiCtx.currentNote && (
            <ButtonGroup className="ms-2">
              <Button
                active={multiCtx.mode === "read"}
                onClick={() => multiCtx.setMode("read")}
                icon="eye"
              />
              <Button
                active={multiCtx.mode === "write"}
                onClick={() => multiCtx.setMode("write")}
                icon="pencil"
              />
              <Button
                active={multiCtx.mode === "split"}
                onClick={() => multiCtx.setMode("split")}
                icon="layout-split"
              />
            </ButtonGroup>
          )}
        </div>
        <div>
          {multiCtx.currentNote && (
            <>
              <Button
                onClick={() => multiCtx.toggleBookmark()}
                className="red me-2"
                icon={
                  "bookmark" + (multiCtx.currentNote.favorited ? "-fill" : "")
                }
                border={false}
              />
              <Button
                onClick={() => copyNote()}
                className="me-2"
                icon={"clipboard" + (copied ? "-check" : "")}
                border={false}
              />
              {deleting && (
                <Button
                  onClick={() => multiCtx.deleteNote()}
                  className="red me-2"
                  icon="question-lg"
                  border={false}
                />
              )}
              <Button
                className="red me-2"
                onClick={() => setDeleting(!deleting)}
                icon="trash2"
                border={false}
              />
            </>
          )}

          <Dropdown
            border={false}
            target="themes"
            icon="paint-bucket"
            size="sm">
            {themes.map((x) => (
              <Button
                text={x}
                onClick={() => setTheme(x)}
                className={
                  "dropdown-item text-center text-capitalize" +
                  (x === theme ? " active" : "")
                }
              />
            ))}
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
