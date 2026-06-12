import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Fixtures from './pages/Fixtures';
import Teams from './pages/Teams';
import Standings from './pages/Standings';
import Bracket from './pages/Bracket';
import MatchDetails from './pages/MatchDetails';
import TeamDetails from './pages/TeamDetails';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#090d16] text-[#f8fafc]">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/bracket" element={<Bracket />} />
          <Route path="/match/:id" element={<MatchDetails />} />
          <Route path="/team/:id" element={<TeamDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
