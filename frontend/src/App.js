import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";
import MultiProvider from "./context";
import Display from "./components/Display";

function App() {
  return (
    <MultiProvider>
      <Display />
    </MultiProvider>
  );
}

export default App;
