import { useContext, useEffect, useState } from "react";
import Input from "../atoms/Input";
import ButtonGroup from "../molecules/ButtonGroup";
import Button from "../atoms/Button";
import { MultiContext } from "../../MultiContext";

export default function FolderItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const onChangeName = (e) => setName(e.target.value);

  useEffect(() => {
    setName(item);
  }, []);

  return (
    <div
      className={
        className +
        " between item px-3 rounded" +
        (multiCtx.currentFolder === item ? " selected" : "")
      }>
      {editing ? (
        <form
          className="input-group input-group-sm "
          style={{ marginBlockEnd: 0 }}
          onSubmit={(e) => multiCtx.renameFolder(e, item, name)}>
          <Input
            onChange={onChangeName}
            value={name}
            className="border-0 opacity-50"
          />
        </form>
      ) : (
        <a
          className="py-1 text-truncate small fw-bold"
          onClick={() => multiCtx.setCurrentFolder(item)}>
          {item}
        </a>
      )}
      <ButtonGroup size="sm">
        <Button
          onClick={() => setEditing(!editing)}
          className={"border-0"}
          icon={editing ? "arrow-left" : "pencil"}
        />
        {deleting && (
          <Button
            onClick={() => multiCtx.deleteFolder(item)}
            className="border-0 red"
            icon="question-lg"
          />
        )}
        <Button
          onClick={() => setDeleting(!deleting)}
          className="border-0 red"
          icon="trash2"
        />
      </ButtonGroup>
    </div>
  );
}
