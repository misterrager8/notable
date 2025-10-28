import { useContext, useState } from "react";
import { MultiContext } from "../../context";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

export default function FolderItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(item.name);
  const onChangeName = (e) => setName(e.target.value);

  return (
    <div
      className={
        className +
        " folder-item" +
        (multiCtx.currentFolder === item.name ? " active" : "")
      }>
      <div className="between">
        {editing ? (
          <form onSubmit={(e) => multiCtx.renameFolder(e, item.name, name)}>
            <Input value={name} onChange={onChangeName} />
          </form>
        ) : (
          <div
            className="d-flex my-auto small"
            onClick={() => multiCtx.setCurrentFolder(item.name)}>
            <i className="bi bi-folder me-2"></i>
            <div className="text-truncate">{item.name}</div>
          </div>
        )}
        <div className="d-flex">
          <div className="small my-auto mx-3">{item.notes}</div>
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
            className="red"
            onClick={() => setDeleting(!deleting)}
            icon="trash2"
            border={false}
          />
        </div>
      </div>
    </div>
  );
}
