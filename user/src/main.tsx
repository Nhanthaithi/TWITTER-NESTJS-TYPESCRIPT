import "./index.css";
import "@radix-ui/themes/styles.css";

// import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { Theme } from "@radix-ui/themes";

import App from "./App.tsx";
import store from "./Redux/Store/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Theme>
        <App />
      </Theme>
    </Provider>
  </React.StrictMode>
);
