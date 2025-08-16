import TopNav from "./TopNav";
import SideNav from "./SideNav";
import { useContext } from "react";
import { MultiContext } from "../context";
import Editor from "./Editor";

export default function Display() {
  const multiCtx = useContext(MultiContext);

  return (
    <>
      <TopNav />
      <SideNav />
      <div onClick={() => multiCtx.setShowSide(false)} className="p-3">
        {multiCtx.currentNote && <Editor />}
      </div>
    </>
  );
}
