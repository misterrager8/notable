import { useContext, useEffect, useState } from "react";
import Button from "./atoms/Button";
import { MultiContext } from "../context";
import Dropdown from "./atoms/Dropdown";

export default function Nav({ className = "" }) {
  const [theme, setTheme] = useState(localStorage.getItem("notable-theme"));
  const multiCtx = useContext(MultiContext);

  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    localStorage.setItem("notable-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const editNote = () => {
    multiCtx.editNote(multiCtx.content);
    setSaved(true);
    setTimeout(() => setSaved(false), 1000);
  };

  const copyNote = () => {
    navigator.clipboard.writeText(multiCtx.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const themes = ["light", "dark", "manila", "navy"];

  return (
    <>
      <div className={className + " between"}>
        <div className="between w-100">
          <div className="d-flex">
            <div className="me-3" id="responsive-hide">
              <Button
                onClick={() => multiCtx.setShowSide(!multiCtx.showSide)}
                icon="list"
                border={false}
              />
            </div>
            <Button
              onClick={() => multiCtx.setMode("view")}
              active={multiCtx.mode === "view"}
              icon="eye"
            />
            <Button
              onClick={() => multiCtx.setMode("split")}
              active={multiCtx.mode === "split"}
              icon="layout-split"
            />
            <Button
              onClick={() => multiCtx.setMode("edit")}
              active={multiCtx.mode === "edit"}
              icon="pencil"
            />
            {["split", "edit"].includes(multiCtx.mode) && (
              <Button
                text={
                  multiCtx.currentNote?.content === multiCtx.content
                    ? null
                    : "Changed"
                }
                className={
                  multiCtx.currentNote?.content === multiCtx.content
                    ? "green"
                    : "yellow"
                }
                onClick={() => editNote()}
                border={false}
                icon={
                  saved
                    ? "check-lg"
                    : multiCtx.currentNote?.content === multiCtx.content
                    ? "save2"
                    : "record-fill"
                }
              />
            )}
          </div>
          <div className="d-flex">
            <Button
              onClick={() => multiCtx.toggleBookmark()}
              className="red"
              icon={
                "pin-angle" + (multiCtx.currentNote?.favorited ? "-fill" : "")
              }
            />
            <Button
              onClick={() => copyNote()}
              icon={copied ? "check-lg" : "copy"}
            />
            {deleting && (
              <Button
                onClick={() => multiCtx.deleteNote()}
                className="red"
                icon="question-lg"
              />
            )}
            <Button
              className="red"
              onClick={() => setDeleting(!deleting)}
              icon="trash2"
            />

            <div className="ms-3" id="responsive-hide">
              <a
                className="btn btn-sm"
                href="https://github.com/misterrager8/notable"
                target="blank">
                <i className="bi bi-info-circle"></i>
              </a>
              <Dropdown icon="paint-bucket" classNameBtn="text-capitalize">
                {themes.map((x) => (
                  <>
                    {x !== theme && (
                      <div
                        onClick={() => setTheme(x)}
                        className="dropdown-item text-capitalize text-center">
                        {x}
                      </div>
                    )}
                  </>
                ))}
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      <div className="between top-nav">
        <div className="between">
          <Button
            onClick={() => multiCtx.setShowSide(!multiCtx.showSide)}
            icon="list"
            border={false}
          />

          <div className="">
            <a
              className="btn btn-sm"
              href="https://github.com/misterrager8/notable"
              target="blank">
              <i className="bi bi-info-circle"></i>
            </a>
            <Dropdown icon="paint-bucket" classNameBtn="text-capitalize">
              {themes.map((x) => (
                <div
                  onClick={() => setTheme(x)}
                  className="dropdown-item text-capitalize text-center">
                  {x}
                </div>
              ))}
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
}
