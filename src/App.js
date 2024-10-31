import { useState, useEffect, useCallback } from 'react';
import './App.css';
import './index.css';
import SingleCard from './components/SingleCard';
import correctSound from './sounds/correct.mp3';
import incorrectSound from './sounds/incorrect.mp3';

const cardImages = Array.from({ length: 26 }, (_, index) => ({
  src: `/img/image${index}.jpg`,
  matched: false,
}));

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gridSize, setGridSize] = useState(4);
  const [theme, setTheme] = useState('dark-theme');
  const [startTime, setStartTime] = useState(null);

  const shuffleCards = useCallback((size = gridSize) => {
    const totalCards = size * size;
    const selectedCards = [...cardImages.slice(0, totalCards / 2), ...cardImages.slice(0, totalCards / 2)];
    
    const shuffledCards = selectedCards
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setTurns(0);
    setStartTime(Date.now());
  }, [gridSize]);

  useEffect(() => {
    shuffleCards();
  }, [shuffleCards]);

  const handleChoice = (card) => {
    if (disabled) return;
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        new Audio(correctSound).play();
        setCards(prevCards =>
          prevCards.map(card =>
            card.src === choiceOne.src ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        new Audio(incorrectSound).play();
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  const handleGridSizeChange = (event) => {
    const size = parseInt(event.target.value);
    setGridSize(size);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'dark-theme' ? 'light-theme' : 'dark-theme';
      document.body.classList.remove(prevTheme);
      document.body.classList.add(newTheme);
      localStorage.setItem('theme', newTheme); 
      return newTheme;
    });
  };

  const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

  return (
    <div className="App">
      <h1 className="game-title">Memory Game</h1>
      <button onClick={() => shuffleCards(gridSize)} className={`button-${theme}`}>
        New Game
      </button>
      <button onClick={toggleTheme} className={`button-${theme}`}>
        Toggle Theme
      </button>
      <select onChange={handleGridSizeChange} value={gridSize}>
        <option value="4">4x4</option>
        <option value="6">6x6</option>
      </select>
      <div className="card-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {cards.map(card => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
            theme={theme}
          />
        ))}
      </div>
      <p>Turns: {turns}</p>
    </div>
  );
}

export default App;
