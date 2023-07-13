import {Route } from "react-router-dom";
import "./App.css";
import LoginRegister from "./components/LoginRegister/LoginRegister";
import Home from './components/Home/Home'
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <div className="App">
        <Route exact path="/login-register" component={LoginRegister} />
        <ProtectedRoute exact path="/" component={Home}/>
    </div>
  );
}

export default App;

//color:1D9BF0