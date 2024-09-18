import MainRouter from "../routers/MainRouter";
import "./App.css";
import axios from "axios";
import { ToastContainer } from "react-toastify";

function App() {
  axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
  return (
    <>
      <ToastContainer />
      <MainRouter />;
    </>
  );
}

export default App;
