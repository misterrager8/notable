import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import { createContext, useEffect, useState } from "react";
import Home from "./components/pages/Home";
import Nav from "./components/organisms/Nav";
import { api } from "./util";
import Button from "./components/atoms/Button";

export const MultiContext = createContext();

export default function MultiProvider({ children }) {
  const [currentPage, setCurrentPage] = useState("");
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(
    localStorage.getItem("notable-theme") || "light"
  );

  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(
    JSON.parse(localStorage.getItem("notable-last-opened")) || []
  );

  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);

  const [content, setContent] = useState("");
  const [mode, setMode] = useState(
    localStorage.getItem("notable-mode") || "split"
  );
  const [sort, setSort] = useState(
    localStorage.getItem("notable-sort") || "favorited"
  );

  const addNote = () => {
    api("add_note", { folder: currentFolder }, (data) => {
      setCurrentNote(data.note);
      setNotes(data.notes);
    });
  };

  const getAll = () => {
    api("get_all", {}, (data) => {
      setFolders(data.folders);
      setNotes(data.notes);
    });
  };

  const getNote = (path) => {
    api("note", { path: path }, (data) => {
      setCurrentNote(data);
    });
  };

  const getNotes = () => {
    api("notes", { sort: sort, filter_: currentFolder }, (data) => {
      setNotes(data.notes);
    });
  };

  const editNote = (path, content) => {
    api("edit_note", { path: path, content: content }, (data) => {
      setCurrentNote(data.note);
      setNotes(data.notes);
    });
  };

  const deleteNote = (path) => {
    api("delete_note", { path: path }, (data) => {
      setNotes(data.notes);
      setCurrentNote([]);
    });
  };

  const duplicateNote = (path) => {
    api("duplicate_note", { path: path }, (data) => {
      setCurrentNote(data);
    });
  };

  const renameNote = (e, path, newName) => {
    e.preventDefault();
    api("rename_note", { path: path, new_name: newName }, (data) => {
      setCurrentNote(data.note);
      setNotes(data.notes);
    });
  };

  const pinNote = (path) => {
    api("toggle_favorite", { path: path }, (data) => {
      setCurrentNote(data.note);
      setNotes(data.notes);
    });
  };

  const addFolder = () => {
    api("add_folder", {}, (data) => {
      setCurrentFolder(data.folder);
      setFolders(data.folders);
    });
  };

  const getFolders = () => {
    api("folders", {}, (data) => {
      setFolders(data.folders);
    });
  };

  const deleteFolder = (name) => {
    api("delete_folder", { name: name }, (data) => setFolders(data.folders));
  };

  const renameFolder = (e, name, newName) => {
    e.preventDefault();
    api("rename_folder", { name: name, new_name: newName }, (data) => {
      setFolders(data.folders);
    });
  };

  const changeFolder = (newFolder) => {
    api(
      "change_folder",
      { path: currentNote.path, new_folder: newFolder },
      (data) => {
        setCurrentNote(data.note);
        setNotes(data.notes);
      }
    );
  };

  useEffect(() => {
    localStorage.setItem("notable-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("notable-mode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("notable-sort", sort);
  }, [sort]);

  const contextValue = {
    theme: theme,
    setTheme: setTheme,
    loading: loading,
    setLoading: setLoading,

    currentPage: currentPage,
    setCurrentPage: setCurrentPage,

    notes: notes,
    setNotes: setNotes,

    currentNote: currentNote,
    setCurrentNote: setCurrentNote,
    content: content,
    setContent: setContent,

    folders: folders,
    setFolders: setFolders,

    currentFolder: currentFolder,
    setCurrentFolder: setCurrentFolder,

    addNote: addNote,
    getNote: getNote,
    getNotes: getNotes,
    editNote: editNote,
    deleteNote: deleteNote,
    duplicateNote: duplicateNote,
    renameNote: renameNote,
    pinNote: pinNote,

    addFolder: addFolder,
    getFolders: getFolders,
    deleteFolder: deleteFolder,
    renameFolder: renameFolder,
    changeFolder: changeFolder,

    mode: mode,
    setMode: setMode,
    sort: sort,
    setSort: setSort,

    getAll: getAll,
  };

  return (
    <MultiContext.Provider value={contextValue}>
      {children}
    </MultiContext.Provider>
  );
}
