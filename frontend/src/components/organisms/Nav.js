import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../App";
import ButtonGroup from "../molecules/ButtonGroup";
import Spinner from "../atoms/Spinner";
import Button from "../atoms/Button";
import Dropdown from "../molecules/Dropdown";

export default function Nav({ className }) {
  const multiCtx = useContext(MultiContext);
  const [name, setName] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const onChangeName = (e) => setName(e.target.value);

  useEffect(() => {
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
                  multiCtx.setSettings({
                    ...multiCtx.settings,
                    lastOpened: "",
                  });
                }}
                className="btn border-0">
                <img
                  className="me-2 pb-1"
                  src="favicon.svg"
                  width={20}
                  height={20}
                />
                notable
              </a>
            </ButtonGroup>
            <Button
              className="green"
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
            <div>
              {multiCtx.currentNote.length !== 0 &&
                multiCtx.currentPage === "" &&
                multiCtx.settings.mode !== "read" && (
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
                    // text={saved ? "Saved." : "Save"}
                    icon={saved ? "check-lg" : "floppy2-fill"}
                  />
                )}
              <ButtonGroup size="sm">
                {multiCtx.currentNote.length !== 0 &&
                  multiCtx.currentPage === "" && (
                    <>
                      <Button
                        onClick={() =>
                          multiCtx.pinNote(multiCtx.currentNote.path)
                        }
                        text={multiCtx.currentNote.favorited ? "Unpin" : "Pin"}
                        icon={
                          "pin-angle" +
                          (multiCtx.currentNote.favorited ? "-fill" : "")
                        }
                        className={
                          "orange" +
                          (multiCtx.currentNote.favorited ? " active" : "")
                        }
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
                        className="red"
                        onClick={() => setDeleting(!deleting)}
                        text={"Delete"}
                        icon={"trash2"}
                      />
                      {deleting && (
                        <Button
                          className="red"
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
            </div>
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
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
