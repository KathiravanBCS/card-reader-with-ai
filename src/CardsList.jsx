import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CardsList() {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    fetch("/cards")
      .then((res) => res.json())
      .then(setCards);
  }, []);
  return (
    <div>
      <h2>Scanned Cards</h2>
      <ul>
        {cards.map((card) => (
          <li key={card.id}>
            <Link to={`/card/${card.id}`}>{card.name || "(No Name)"} - {card.company_name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/">Back to Home</Link>
    </div>
  );
}
