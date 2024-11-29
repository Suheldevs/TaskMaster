import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Signin from './Pages/Signin';
import Main from './Pages/Main';
import Header from './components/Header';
function App() {
  return (
    <Router>
      <Header/>
        <Routes>
          <Route path="/task" element={<Main />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/signin" element={<Signin />} />
        </Routes>
    </Router>
  );
}

export default App;
