import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./output.css";
import { ToastContainer } from 'react-toastify';
import io from "socket.io-client";
import Home from "./Home";
import Dashboard from "./Dashboard";

const socket = io("http://localhost:5000");

function App() {

  return (
    <BrowserRouter>
      <ToastContainer/>
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/dashboard" index element={<Dashboard socket={socket} />} />
        <Route path="/dashboard/:subpage" index element={<Dashboard socket={socket} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
