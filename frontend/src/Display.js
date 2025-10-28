import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";
import Nav from "./components/Nav";
import Editor from "./components/Editor";
import { MultiContext } from "./context";
import { useContext } from "react";
import Button from "./components/atoms/Button";
import NoteItem from "./components/items/NoteItem";
import FolderItem from "./components/items/FolderItem";
import { v4 as uuidv4 } from "uuid";
import Dropdown from "./components/atoms/Dropdown";
import Search from "./components/Search";
import SearchResultItem from "./components/items/SearchResultItem";

export default function Display() {
  const multiCtx = useContext(MultiContext);

  const sorts = [
    {
      name: "name",
      label: "Name",
      icon: "type",
    },
    {
      name: "last_modified",
      label: "Last Modified",
      icon: "pencil",
    },
    {
      name: "date_created",
      label: "Date Created",
      icon: "plus-lg",
    },
    {
      name: "favorited",
      label: "Pinned",
      icon: "bookmark-fill",
    },
  ];

  return (
    <div>
      <div className={"side-nav" + (multiCtx.showSide ? "" : " hidden")}>
        {!multiCtx.showFolders ? (
          <Button
            onClick={() => multiCtx.createNote()}
            icon="file-earmark-plus"
            className="green w-100 my-2"
            text="New Note"
          />
        ) : (
          <Button
            onClick={() => multiCtx.addFolder()}
            icon="folder-plus"
            className="green w-100 my-2"
            text="New Folder"
          />
        )}
        <Search className="my-2" />

        {multiCtx.searchResults.length === 0 && (
          <div className="between mb-3">
            <Dropdown
              icon={sorts.find((x) => x.name === multiCtx.sort).icon}
              text={sorts.find((x) => x.name === multiCtx.sort).label}>
              {sorts.map((x) => (
                <div
                  onClick={() => multiCtx.setSort(x.name)}
                  className="dropdown-item">
                  <i className={"me-2 bi bi-" + x.icon}></i>
                  {x.label}
                </div>
              ))}
            </Dropdown>
            <Button
              onClick={() => multiCtx.setShowFolders(!multiCtx.showFolders)}
              active={multiCtx.showFolders}
              icon="folder"
              text={
                multiCtx.currentFolder ? multiCtx.currentFolder : "All Notes"
              }
            />
          </div>
        )}

        <div
          style={{
            height: multiCtx.searchResults.length === 0 ? "76vh" : "83vh",
            overflowY: "auto",
          }}>
          {multiCtx.searchResults.length === 0 ? (
            <>
              {multiCtx.showFolders ? (
                <>
                  <div
                    className={
                      "folder-item mb-3" +
                      (!multiCtx.currentFolder ? " active" : "")
                    }
                    onClick={() => multiCtx.setCurrentFolder(null)}>
                    <div className="d-flex small">
                      <i className="bi bi-folder me-2"></i>
                      <div className="text-truncate">All Notes</div>
                    </div>
                  </div>
                  {multiCtx.folders.map((x) => (
                    <FolderItem key={uuidv4()} item={x} />
                  ))}
                </>
              ) : (
                <>
                  {multiCtx.notes.map((x) => (
                    <NoteItem item={x} />
                  ))}
                </>
              )}
            </>
          ) : (
            <div>
              {multiCtx.searchResults.map((x) => (
                <SearchResultItem item={x} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className="body"
        onClick={() => {
          multiCtx.showSide && multiCtx.setShowSide(false);
        }}>
        <Nav />
        <div>{multiCtx.currentNote && <Editor />}</div>
      </div>
    </div>
  );
}
