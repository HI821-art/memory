import './SingleCard.css';

export default function SingleCard({ card, handleChoice, flipped, disabled, theme }) {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <div className="card" onClick={handleClick}>
      <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
        <img className="front" src={card.src} alt="card front" />
        <img
          className="back"
          src={theme === 'dark-theme' ? '/img/card.webp' : '/img/Zen.webp'}
          alt="cover"
        />
      </div>
    </div>
  );
}
