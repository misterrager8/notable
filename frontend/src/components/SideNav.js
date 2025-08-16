import { useContext } from "react";
import { MultiContext } from "../context";
import { Search } from "./forms/Search";
import FilterSortMenu from "./FilterSortMenu";
import NoteItem from "./items/NoteItem";
import ButtonGroup from "./ButtonGroup";
import FolderItem from "./items/FolderItem";
import Button from "./Button";

export default function SideNav({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  return (
    <>
      <div
        className={
          className + " side-nav" + (multiCtx.showSide ? "" : " minimized")
        }>
        <Search className="m-2" />
        <FilterSortMenu className="m-2" />
        <div className="m-2">
          <Button
            onClick={() => {
              !multiCtx.showFolders
                ? multiCtx.createNote()
                : multiCtx.addFolder();
            }}
            className="w-100"
            text={"New " + (multiCtx.showFolders ? "Folder" : "Note")}
            icon="plus-lg"
          />
        </div>
        <div style={{ height: "76vh", overflowY: "auto" }}>
          {multiCtx.showFolders ? (
            <>
              <div
                className={
                  "folder-item between" +
                  (!multiCtx.currentFolder ? " active" : "")
                }>
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                <a
                  onClick={() => multiCtx.setCurrentFolder(null)}
                  className="small my-auto w-100 between me-2">
                  <span className="fw-bold">All Notes</span>
                  {!multiCtx.currentFolder && (
                    <span>{multiCtx.notes.length}</span>
                  )}
                </a>
                <div>
                  <ButtonGroup></ButtonGroup>
                </div>
              </div>
              {multiCtx.folders.map((x) => (
                <FolderItem key={x.name} item={x} />
              ))}
            </>
          ) : (
            <>
              {multiCtx.notes.map((x) => (
                <NoteItem item={x} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
