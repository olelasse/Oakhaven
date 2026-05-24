import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameLayout from './components/layout/GameLayout';
import { GameProvider } from './contexts/GameContext';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Inventory from './pages/Inventory';
import GuildBoard from './pages/GuildBoard';
import TravelHub from './pages/TravelHub';
import Shadowwood from './pages/Shadowwood';
import Frostpeak from './pages/Frostpeak';
import AshenWastes from './pages/AshenWastes';
import CrimsonCitadel from './pages/CrimsonCitadel';
import Blacksmith from './pages/Blacksmith';
import Marketplace from './pages/Marketplace';
import AuctionHouse from './pages/AuctionHouse';
import CharacterCreation from './pages/CharacterCreation';
import Combat from './pages/Combat';

const Home = () => (
  <div className="flex flex-col items-center justify-center h-full gap-6 text-center animate-fade-in">
    <h1 className="text-4xl font-cinzel text-medieval-gold drop-shadow-sm">Welcome to Oakhaven</h1>
    <p className="text-stone-800 font-sans font-medium text-lg max-w-lg leading-relaxed">
      You stand in the grand plaza of the central metropolis. 
      Merchants peddle their wares, and guards patrol the cobblestone streets. 
      Your journey begins here.
    </p>
  </div>
);

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <h1 className="text-2xl font-cinzel text-red-800">404 - Not Found</h1>
    <p className="text-stone-800 font-sans mt-4">The path you seek is obscured by fog.</p>
  </div>
);

function App() {
  return (
    <Router>
      <GameProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create-character" element={<CharacterCreation />} />
          
          <Route path="/play" element={<GameLayout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="quests" element={<GuildBoard />} />
            <Route path="travel" element={<TravelHub />} />
            <Route path="zones/shadowwood" element={<Shadowwood />} />
            <Route path="zones/frostpeak" element={<Frostpeak />} />
            <Route path="zones/ashen-wastes" element={<AshenWastes />} />
            <Route path="zones/crimson-citadel" element={<CrimsonCitadel />} />
            <Route path="combat/:enemyId" element={<Combat />} />
            <Route path="blacksmith" element={<Blacksmith />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="auction-house" element={<AuctionHouse />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </GameProvider>
    </Router>
  );
}

export default App;
