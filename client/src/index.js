import React, { createContext } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import CommentStore from "./store/CommentStore";
import UserStore from "./store/UserStore";

const container = document.getElementById("root");
const root = createRoot(container);

export const Context = createContext(null);

root.render(
  <Context.Provider
    value={{
      comment: new CommentStore(),
      user: new UserStore(),
    }}
  >
    <App />
  </Context.Provider>
);
