import { ToastContainer } from "react-toastify";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <ToastContainer theme="dark" autoClose={2000} />
      <Outlet />
    </div>
  );
}

export default App;
