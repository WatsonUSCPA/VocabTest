import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import YouTubeLearning from './components/YouTubeLearning';
import LevelSelect from './components/LevelSelect';
import Test from './components/Test';
import LearningComplete from './components/LearningComplete';
import OtherLearning from './components/OtherLearning';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/youtube" element={<YouTubeLearning />} />
            <Route path="/youtube/level-select" element={<LevelSelect />} />
            <Route path="/test" element={<Test />} />
            <Route path="/learning-complete" element={<LearningComplete />} />
            <Route path="/other" element={<OtherLearning />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 