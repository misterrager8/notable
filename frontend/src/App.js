import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";
import Display from "./Display";
import MultiProvider from "./context";

function App() {
  return (
    <MultiProvider>
      <Display />
    </MultiProvider>
  );
}

export default App;
