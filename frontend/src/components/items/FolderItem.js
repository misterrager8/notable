import { useContext, useState } from "react";
import { MultiContext } from "../../context";
import { FolderContext } from "../Nav";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Badge from "../atoms/Badge";

export default function FolderItem({ item }) {
  const multiCtx = useContext(MultiContext);
  const folderCtx = useContext(FolderContext);

  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(item.name);
  const onChangeName = (e) => setName(e.target.value);

  return (
    <div
      className={
        "folder-item" + (multiCtx.currentFolder === item.name ? " active" : "")
      }>
      {!editing ? (
        <div
          style={{ fontSize: ".875rem", letterSpacing: "1.5px" }}
          className="my-auto"
          onClick={() => {
            multiCtx.setCurrentFolder(item.name);
            folderCtx.setShowFolders(false);
          }}>
          {item.name}
        </div>
      ) : (
        <form
          className="my-auto"
          onSubmit={(e) => multiCtx.renameFolder(e, item.name, name)}>
          <Input value={name} onChange={onChangeName} />
        </form>
      )}
      <div className="d-flex">
        {item.notes > 0 && (
          <Badge
            border={false}
            className="my-auto"
            icon="record-fill"
            text={item.notes}
          />
        )}
        <Button
          className="px-2"
          active={editing}
          onClick={() => setEditing(!editing)}
          icon="pencil"
        />
        {deleting && (
          <Button
            onClick={() => {
              multiCtx.deleteFolder(item.name);
              multiCtx.setCurrentFolder(null);
            }}
            className="red px-2"
            icon="question-lg"
          />
        )}
        <Button
          onClick={() => setDeleting(!deleting)}
          className="red px-2"
          icon="trash2"
        />
      </div>
    </div>
  );
}
