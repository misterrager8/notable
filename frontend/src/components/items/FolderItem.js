import { useContext, useState } from "react";
import { MultiContext } from "../../context";
import ButtonGroup from "../ButtonGroup";
import Button from "../Button";
import Input from "../Input";

export default function FolderItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(item.name);
  const onChangeName = (e) => setName(e.target.value);

  return (
    /* eslint-disable jsx-a11y/anchor-is-valid */
    <div
      className={
        "folder-item between" +
        (multiCtx.currentFolder === item.name ? " active" : "")
      }>
      {!editing ? (
        <a
          onClick={() => multiCtx.setCurrentFolder(item.name)}
          className="small my-auto w-100 between me-2">
          <span className="fw-bold">{item.name}</span>
          <span>{item.notes}</span>
        </a>
      ) : (
        <form onSubmit={(e) => multiCtx.renameFolder(e, item.name, name)}>
          <Input
            className="p-0 fst-italic"
            border={false}
            value={name}
            onChange={onChangeName}
          />
        </form>
      )}
      <div>
        <ButtonGroup>
          <Button
            onClick={() => setEditing(!editing)}
            icon="pencil"
            border={false}
          />
          {deleting && (
            <Button
              onClick={() => multiCtx.deleteFolder(item.name)}
              className="red"
              icon="question-lg"
              border={false}
            />
          )}
          <Button
            onClick={() => setDeleting(!deleting)}
            className="red"
            icon="trash2"
            border={false}
          />
        </ButtonGroup>
      </div>
    </div>
  );
}
