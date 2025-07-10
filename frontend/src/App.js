import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import { createContext, useEffect, useState } from "react";
import Home from "./components/pages/Home";
import { api } from "./util";
import Button from "./components/atoms/Button";
import MultiProvider from "./MultiContext";
import SideNav from "./components/organisms/SideNav";

export default function App() {
  return (
    <MultiProvider>
      <div>
        <SideNav />
        <Home />
      </div>
    </MultiProvider>
  );
}
