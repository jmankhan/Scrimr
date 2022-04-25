import { Route, Routes } from 'react-router-dom';
import './App.css';
import CreateScrim from './components/CreateScrim';
import Home from './components/Home';
import NavBar from './components/Navbar';
import Team from './components/Team';

function App() {
  return (
    <div className="App">
        <NavBar>
            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path='/my-teams' element={<Team />}></Route>
                <Route path='/create-scrim' element={<CreateScrim />}></Route>
            </Routes>
        </NavBar>
    </div>
  );
}

export default App;
