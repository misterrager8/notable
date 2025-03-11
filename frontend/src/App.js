import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import { createContext, useEffect, useState } from "react";
import Home from "./components/pages/Home";
import Nav from "./components/organisms/Nav";
import { api } from "./util";
import Button from "./components/atoms/Button";
import MultiProvider from "./MultiContext";

export default function App() {
  return (
    <MultiProvider>
      <div className="full p-4">
        <Nav />
        <div className="py-4">
          <Home />
        </div>
      </div>
    </MultiProvider>
  );
}
