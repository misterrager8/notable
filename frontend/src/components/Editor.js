import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../context";
import Input from "./Input";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Icon from "./Icon";
import markdownit from "markdown-it";

export default function Editor({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [changed, setChanged] = useState(false);

  const [content, setContent] = useState("");
  const onChangeContent = (e) => setContent(e.target.value);

  const [name, setName] = useState("");
  const onChangeName = (e) => setName(e.target.value);

  useEffect(() => {
    setContent(multiCtx.currentNote.content);
    setName(multiCtx.currentNote.name);
  }, [multiCtx.currentNote]);

  useEffect(() => {
    setChanged(content !== multiCtx.currentNote?.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, multiCtx.currentNote]);

  return (
    <div className={className}>
      <form
        className="input-group mb-3"
        onSubmit={(e) => multiCtx.renameNote(e, name)}>
        {["split", "write"].includes(multiCtx.mode) && (
          <Button
            onClick={() => multiCtx.editNote(content)}
            className={changed ? "orange" : "green"}
            border={false}
            icon={changed ? "circle-fill" : "check-lg"}
          />
        )}
        <Dropdown
          target="change-folder"
          showCaret={false}
          icon="folder"
          border={false}
          text={multiCtx.currentNote.folder}>
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
          <a
            onClick={() => multiCtx.changeFolder(null)}
            className="dropdown-item">
            No Folder
          </a>
          {multiCtx.folders.map((x) => (
            <a
              onClick={() => multiCtx.changeFolder(x.name)}
              className="dropdown-item">
              {x.name}
            </a>
          ))}
        </Dropdown>
        <span className="my-auto">
          <Icon name="slash-lg" />
        </span>
        <Input
          className="fw-bold"
          border={false}
          value={name}
          onChange={onChangeName}
        />
      </form>
      <div className={"row"}>
        {["split", "write"].includes(multiCtx.mode) && (
          <div className="col" style={{ height: "78vh" }}>
            <textarea
              style={{ resize: "none" }}
              onChange={onChangeContent}
              value={content}
              className="form-control h-100 fst-italic"
              placeholder="..."></textarea>
          </div>
        )}
        {["split", "read"].includes(multiCtx.mode) && (
          <div className="col overflow-auto" style={{ height: "78vh" }}>
            <div
              id="reader"
              dangerouslySetInnerHTML={{
                __html: markdownit({ html: true }).render(content),
              }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
