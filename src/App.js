import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import {Toaster} from 'react-hot-toast';

function App() {
  return (
    <>
      <div>
        <Toaster
        position="top-right">
        </Toaster>
      </div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/editor/:roomID" element={<Editor />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
