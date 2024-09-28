// src/components/CharacterCard.js

import React from 'react';
import './CharacterCard.css'; // Import the CSS for styling the card

const CharacterCard = ({ character }) => {
  return (
    <div className="character-card">
      <img src={character.image} alt={character.name} className="character-image" /> {/* Add image */}
      <h2 className="character-name">{character.name}</h2>
      <p className="character-date">{new Date(character.created).toLocaleDateString()}</p>
      <div className="character-details">
        <p className="character-gender-status">Gender: {character.gender}</p>
        <p className="character-gender-status">Status: {character.status}</p>
      </div>
    </div>
  );
};

export default CharacterCard;
