import React from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Routing from "./components/Routing/Routing";

const App = () => {
  return (
    <div>
      <Navbar></Navbar>
      <main>
        <Routing></Routing>
      </main>
    </div>
  );
};

export default App;
