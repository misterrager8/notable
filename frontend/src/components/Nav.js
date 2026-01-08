import { createContext, useContext, useEffect, useState } from "react";
import Dropdown from "./atoms/Dropdown";
import Button from "./atoms/Button";
import Search from "./forms/Search";
import { MultiContext } from "../context";
import NoteItem from "./items/NoteItem";
import Icon from "./atoms/Icon";
import Badge from "./atoms/Badge";
import FolderItem from "./items/FolderItem";
import Spinner from "./atoms/Spinner";

export const FolderContext = createContext();

export default function Nav() {
  const multiCtx = useContext(MultiContext);

  const [theme, setTheme] = useState(
    localStorage.getItem("notable-theme") || "light"
  );
  const [showFolders, setShowFolders] = useState(false);

  useEffect(() => {
    localStorage.setItem("notable-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const sorts = [
    {
      icon: "bookmark-fill",
      label: "Favorited",
      value: "favorited",
    },
    {
      icon: "type",
      label: "Name",
      value: "name",
    },
    {
      icon: "plus-lg",
      label: "Date Created",
      value: "date_created",
    },
    {
      icon: "pencil",
      label: "Last Modified",
      value: "last_modified",
    },
  ];

  const themes = [
    "light",
    "raspberry",
    "lavender",
    "sky",
    "sepia",
    "coconut",
    "jade",
    "dark",
    "plum",
    "walnut",
    "aqua",
    "azul",
  ];

  return (
    <>
      <div className="nav-y">
        <div className="between">
          <div className="d-flex">
            {multiCtx.loading ? (
              <div className="my-auto">
                <Spinner />
              </div>
            ) : (
              <Button
                onClick={() => {
                  showFolders ? multiCtx.addFolder() : multiCtx.createNote();
                }}
                border={true}
                className="green"
                text={"New " + (showFolders ? "Folder" : "Note")}
                icon="plus-lg"
              />
            )}
          </div>
          <Dropdown
            classNameBtn="text-capitalize"
            classNameMenu="text-center"
            target="themes"
            showCaret={true}
            icon="paint-bucket">
            {themes.map((x) => (
              <a
                onClick={() => setTheme(x)}
                className={
                  (theme === x ? "active" : "") +
                  " dropdown-item text-capitalize"
                }>
                {x}
              </a>
            ))}
          </Dropdown>
        </div>
        {/* <Search className="mt-3" /> */}
        <div className="between mt-3">
          <div>
            {multiCtx.currentFolder && (
              <Button
                className="px-1"
                onClick={() => multiCtx.setCurrentFolder(null)}
                icon="chevron-compact-left"
              />
            )}
            <Button
              active={showFolders || multiCtx.currentFolder}
              onClick={() => setShowFolders(!showFolders)}
              icon="folder"
              text={
                multiCtx.currentFolder
                  ? multiCtx.currentFolder
                  : `All Notes (${multiCtx.notes.length})`
              }
            />
          </div>
          <Dropdown
            target="sort-notes"
            icon={sorts.find((x) => x.value === multiCtx.sort)?.icon}
            text={sorts.find((x) => x.value === multiCtx.sort)?.label}>
            {sorts.map((x) => (
              <a
                className={
                  "dropdown-item" + (x.value === multiCtx.sort ? " active" : "")
                }
                onClick={() => multiCtx.setSort(x.value)}>
                <Icon name={x.icon} className="me-2" />
                {x.label}
              </a>
            ))}
          </Dropdown>
        </div>
        <div
          className="mt-3"
          style={{
            height: "85vh",
            overflowY: "auto",
          }}>
          {showFolders ? (
            <FolderContext.Provider
              value={{
                showFolders: showFolders,
                setShowFolders: setShowFolders,
              }}>
              {multiCtx.folders.map((x) => (
                <FolderItem item={x} />
              ))}
            </FolderContext.Provider>
          ) : (
            <>
              {multiCtx.notes.map((x) => (
                <NoteItem item={x} />
              ))}
            </>
          )}
        </div>
      </div>
      <div className="nav-x">
        <div className="d-flex">
          {multiCtx.loading ? (
            <div className="my-auto me-3">
              <Spinner />
            </div>
          ) : (
            <Button
              onClick={() => multiCtx.createNote()}
              border={true}
              className="green me-3"
              text="New Note"
              icon="plus-lg"
            />
          )}
          {multiCtx.currentFolder && (
            <Button
              onClick={() => multiCtx.setCurrentFolder(null)}
              className="px-1"
              icon="chevron-compact-left"
            />
          )}
          <Dropdown
            showCaret={false}
            text={
              multiCtx.currentFolder || `All Notes (${multiCtx.notes.length})`
            }
            target="folders">
            {multiCtx.folders.map((x) => (
              <a
                onClick={() => multiCtx.setCurrentFolder(x.name)}
                className={
                  "dropdown-item between" +
                  (x.name === multiCtx.currentFolder ? " active" : "")
                }>
                <span>{x.name}</span>
                {x.notes > 0 && (
                  <Badge
                    className="my-auto p-0"
                    border={false}
                    icon="record-fill"
                    text={x.notes}
                  />
                )}
              </a>
            ))}
          </Dropdown>
          <Icon className="my-auto" name="slash-lg" />
          <Dropdown
            classNameBtn="px-2"
            showCaret={false}
            text={multiCtx.currentNote?.name || "-"}
            target="notes">
            <div
              style={{
                maxHeight: "600px",
                width: "300px",
                overflow: "auto",
              }}>
              {multiCtx.notes.map((x) => (
                <a
                  title={x.name}
                  onClick={() => multiCtx.setCurrentNote(x)}
                  className={
                    "dropdown-item between" +
                    (multiCtx.currentNote?.path === x.path ? " active" : "")
                  }>
                  <div className="d-flex text-truncate">
                    {x.favorited && (
                      <Icon className="me-2" name="bookmark-fill" />
                    )}
                    <span className="text-truncate">{x.name}</span>
                  </div>
                  {x.folder && <Badge icon="folder" text={x.folder} />}
                </a>
              ))}
            </div>
          </Dropdown>
          {multiCtx.currentNote && (
            <Button
              onClick={() => multiCtx.setCurrentNote(null)}
              className="px-1"
              icon="x"
            />
          )}
        </div>
        <div>
          <Dropdown
            classNameBtn="text-capitalize"
            classNameMenu="text-center"
            target="themes"
            icon="paint-bucket"
            showCaret={true}>
            {themes.map((x) => (
              <a
                onClick={() => setTheme(x)}
                className={
                  (theme === x ? "active" : "") +
                  " dropdown-item text-capitalize"
                }>
                {x}
              </a>
            ))}
          </Dropdown>
        </div>
      </div>
    </>
  );
}
