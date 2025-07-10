import { useContext, useEffect, useState } from "react";
import ButtonGroup from "../molecules/ButtonGroup";
import Spinner from "../atoms/Spinner";
import Button from "../atoms/Button";
import Dropdown from "../molecules/Dropdown";
import { MultiContext } from "../../MultiContext";
import Icon from "../atoms/Icon";
import Input from "../atoms/Input";

export default function Nav({ className }) {
  const multiCtx = useContext(MultiContext);
  const [name, setName] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const onChangeName = (e) => setName(e.target.value);

  useEffect(() => {
    setName(multiCtx.currentNote ? multiCtx.currentNote.name : "");
  }, [multiCtx.currentNote]);

  useEffect(() => {
    multiCtx.getNotes();
  }, [multiCtx.currentFolder]);

  useEffect(() => {
    multiCtx.getNotes();
    multiCtx.getFolders();
  }, []);

  const copyNote = () => {
    navigator.clipboard.writeText(multiCtx.currentNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={className + " between"}>
      <ButtonGroup>
        <a
          onClick={() => {
            multiCtx.setCurrentPage("");
            multiCtx.setCurrentNote(null);
          }}
          className="btn btn-sm border-0">
          <img className="me-2" src="favicon.svg" width={20} height={20} />
          notable
        </a>
        <Dropdown
          autoClose="inside"
          icon="folder2"
          className="btn-group"
          classNameBtn="btn btn-sm border-0"
          target="folders"
          text={multiCtx.currentFolder}>
          <a
            onClick={() => multiCtx.setCurrentFolder(null)}
            className="dropdown-item mb-2">
            All Notes
          </a>
          {multiCtx.folders.map((x) => (
            <a
              onClick={() => multiCtx.setCurrentFolder(x)}
              className="dropdown-item">
              {x}
            </a>
          ))}
        </Dropdown>
        <Button className="non-btn px-0" icon="slash-lg" />
        <ButtonGroup>
          <Dropdown
            autoClose="outside"
            icon="file-earmark"
            className="btn-group"
            classNameBtn="btn btn-sm border-0"
            target="notes">
            <div className="px-2 mb-2">
              <Button
                onClick={() => multiCtx.addNote()}
                className="green w-100"
                icon="plus-lg"
                text="New Note"
              />
            </div>
            {multiCtx.notes.map((x) => (
              <a
                onClick={() => multiCtx.setCurrentNote(x)}
                className={
                  "dropdown-item" +
                  (multiCtx.currentNote?.path === x.path ? " active" : "")
                }>
                <Icon
                  name="pin-angle-fill"
                  className={"orange me-2" + (x.favorited ? "" : " invisible")}
                />
                {x.name}
              </a>
            ))}
          </Dropdown>
          {multiCtx.currentNote && (
            <Input
              className="fst-italic"
              style={{ width: "500px" }}
              value={name}
              onChange={onChangeName}
            />
          )}
        </ButtonGroup>
      </ButtonGroup>
      <div>
        {multiCtx.currentNote && (
          <ButtonGroup className="me-2">
            <Button
              active={multiCtx.currentNote.favorited}
              onClick={() => multiCtx.pinNote(multiCtx.currentNote.path)}
              className="orange"
              icon={
                "pin-angle" + (multiCtx.currentNote.favorited ? "-fill" : "")
              }
            />
            {deleting && (
              <Button
                onClick={() => {
                  multiCtx.deleteNote(multiCtx.currentNote.path);
                  setDeleting(false);
                }}
                className="red"
                icon="question-lg"
              />
            )}
            <Button
              onClick={() => setDeleting(!deleting)}
              className="red"
              icon="trash2"
            />
          </ButtonGroup>
        )}
        <Button
          onClick={() =>
            multiCtx.setTheme(multiCtx.theme === "light" ? "dark" : "light")
          }
          icon={multiCtx.theme === "light" ? "sun-fill" : "moon-fill"}
        />
      </div>
    </div>
  );
}
