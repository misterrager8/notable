import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";
import { MultiContext } from "./context";
import { useContext, useState } from "react";
import Nav from "./components/Nav";
import Editor from "./components/forms/Editor";
import Input from "./components/atoms/Input";
import Button from "./components/atoms/Button";

export default function Display() {
  const multiCtx = useContext(MultiContext);
  const [changingDir, setChangingDir] = useState(false);
  const onChangeHomeDir = (e) => multiCtx.setHomeDir(e.target.value);

  const changeHomeDir = (e) => {
    e.preventDefault();
    localStorage.setItem("looseleaf-home-dir", multiCtx.homeDir);
    multiCtx.getAll();
    multiCtx.setCurrentNote(null);
    setChangingDir(false);
  };

  return (
    <div>
      <Nav />
      <div className="body">
        <div className="d-flex">
          <Button
            active={changingDir}
            icon="door-open"
            onClick={() => setChangingDir(!changingDir)}
          />
          <form className="w-75" onSubmit={(e) => changeHomeDir(e)}>
            <Input
              className="fst-italic"
              border={false}
              disabled={!changingDir}
              value={multiCtx.homeDir}
              onChange={onChangeHomeDir}
            />
          </form>
          <></>
        </div>
        {multiCtx.currentNote && <Editor />}
      </div>
    </div>
  );
}
