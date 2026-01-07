import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";
import { MultiContext } from "./context";
import { useContext } from "react";
import Nav from "./components/Nav";
import Editor from "./components/forms/Editor";

export default function Display() {
  const multiCtx = useContext(MultiContext);

  return (
    <div>
      <Nav />
      <div className="body">{multiCtx.currentNote && <Editor />}</div>
    </div>
  );
}
