import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Signin from './Pages/Signin';
import Main from './Pages/Main';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/task" element={<Main />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
