import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../MultiContext";
import Button from "../atoms/Button";
import NoteItem from "./NoteItem";
import Icon from "../atoms/Icon";
import ButtonGroup from "../molecules/ButtonGroup";
import FolderItem from "./FolderItem";
import Dropdown from "../molecules/Dropdown";

export default function SideNav({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMainPanel, setShowMainPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  useEffect(() => {
    multiCtx.getNotes();
  }, [multiCtx.currentFolder]);

  const themes = [
    "light",
    "dark",
    "lavender",
    "forestry",
    "cotton-candy",
    "sky",
    "traffic-cone",
    "lemon",
    "royal",
    "maroon",
    "sunset",
    "green-apple",
  ];

  return (
    <>
      <div className={className + " nav-custom"}>
        <div className="mx-auto">
          <Button
            active={showMainPanel}
            onClick={() => setShowMainPanel(!showMainPanel)}
            size={null}
            className="mb-1 border-0"
            icon={"layout-sidebar-inset" + (showMainPanel ? "-reverse" : "")}
          />
          <Button
            onClick={() => multiCtx.addNote()}
            size={null}
            className="mb-1 border-0 green"
            icon="plus-circle-fill"
          />

          {multiCtx.currentNote && (
            <>
              <Button
                onClick={() => multiCtx.pinNote(multiCtx.currentNote?.path)}
                size={null}
                className="mb-1 border-0 purple"
                icon={
                  "bookmark" + (multiCtx.currentNote?.favorited ? "-fill" : "")
                }
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(multiCtx.content);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
                size={null}
                className="mb-1 border-0"
                icon={copied ? "check-lg" : "copy"}
              />
              <Button
                onClick={() => setDeleting(!deleting)}
                size={null}
                className="mb-1 border-0 red"
                icon="trash2"
              />
              {deleting && (
                <Button
                  onClick={() => {
                    multiCtx.deleteNote(multiCtx.currentNote?.path);
                    setDeleting(false);
                  }}
                  size={null}
                  className="mb-1 border-0 red"
                  icon="question-lg"
                />
              )}
            </>
          )}
        </div>

        <div className="bottom">
          <div className="mx-auto">
            <Button
              size={null}
              className="mb-1 border-0"
              onClick={() => {
                multiCtx.setCurrentNote(null);
                multiCtx.setCurrentFolder(null);
              }}
              icon="house-door-fill"
            />

            <Button
              active={showSettingsPanel}
              size={null}
              className=" border-0"
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              icon="gear-fill"
            />
          </div>
        </div>
      </div>
      <div className={"main-panel row " + (showMainPanel ? " show" : "")}>
        <div className="col-4 pt-3 border-end">
          <Button
            active={!multiCtx.currentFolder}
            onClick={() => multiCtx.setCurrentFolder(null)}
            className="w-100"
            text="All Notes"
          />
          <Button
            onClick={() => multiCtx.addFolder()}
            text="New Folder"
            icon="plus-lg"
            className="green w-100 my-2"
          />
          {multiCtx.folders.map((x) => (
            <FolderItem key={x} item={x} />
          ))}
        </div>
        <div
          className="col-8 pt-3"
          style={{ height: "98vh", overflowY: "auto" }}>
          {multiCtx.notes.map((x) => (
            <NoteItem item={x} />
          ))}
        </div>
      </div>
      <div className={"settings-panel " + (showSettingsPanel ? " show" : "")}>
        <div className="h5 text-center mb-3">Themes</div>
        {themes.map((x) => (
          <div
            className={
              "text-capitalize small" +
              (multiCtx.theme === x ? " text-decoration-underline" : "")
            }
            style={{ cursor: "pointer" }}
            onClick={() => multiCtx.setTheme(x)}>
            {x}
          </div>
        ))}
      </div>
    </>
  );
}
