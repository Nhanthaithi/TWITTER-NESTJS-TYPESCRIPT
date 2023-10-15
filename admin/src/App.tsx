import "./App.css";

import { BrowserRouter } from "react-router-dom";

import Router from "./Router/Router";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
