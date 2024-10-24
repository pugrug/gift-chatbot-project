import React, { useState, useEffect } from 'react';
import { GiftCard } from './GiftCard';
import { GiftForm } from './GiftForm';
import { 
  parseRecommendations, 
  validateApiResponse,
  loadFavorites,
  saveFavorites 
} from './utils';

export const GiftRecommender = () => {
  const [isCoalMode, setIsCoalMode] = useState(false);
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const savedFavorites = loadFavorites();
    if (savedFavorites.length > 0) {
      setFavorites(savedFavorites);
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      const coalPrompt = isCoalMode 
        ? `You are a snarky gift recommender. Give me 3-4 slightly disappointing but funny gift suggestions for someone who ${input}. For each gift:
           1. Start with "Gift Suggestion X:"
           2. Give it a short memorable name
           3. Include a price range ($XX-XX format)
           4. Add a slightly sarcastic but relevant description
           Keep prices realistic but make items seem less appealing.`
        : `You are a thoughtful gift recommender. Give me 3-4 creative gift suggestions for someone who ${input}. For each gift:
           1. Start with "Gift Suggestion X:"
           2. Give it a short memorable name
           3. Include a price range ($XX-XX format)
           4. Add an enthusiastic, detailed description
           Focus on unique and personalized suggestions.`;
  
      const response = await fetch('http://localhost:5000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: coalPrompt }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }
  
      const validatedResponse = validateApiResponse(data);
      const formattedRecommendations = parseRecommendations(validatedResponse);
  
      if (formattedRecommendations.length === 0) {
        throw new Error('No valid recommendations generated');
      }
  
      setRecommendations(formattedRecommendations);
    } catch (err) {
      console.error('Error:', err);
      setError(isCoalMode 
        ? '🪨 Even the coal ran out! Please try again!' 
        : '🎄 The elves are taking a cookie break! Please try again!');
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = (gift) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(fav => fav.id === gift.id);
      const newFavorites = isAlreadyFavorite
        ? prevFavorites.filter(fav => fav.id !== gift.id)
        : [...prevFavorites, gift];
        saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="font-['Comic_Sans_MS'] text-2xl text-red-700 mb-4">
          Tell Santa's Elves About Your Friend!
        </h1>
        {favorites.length > 0 && (
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="font-['Comic_Sans_MS'] text-green-600 hover:text-green-700 transition-colors"
          >
            {showFavorites ? '← Back to Recommendations' : `View Favorites (${favorites.length})`}
          </button>
        )}
      </div>

      {!showFavorites && (
        <GiftForm
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          error={error}
          onSubmit={handleSubmit}
        />
      )}

      {!showFavorites && recommendations.length > 0 && (
        <div>
          <h2 className="font-['Comic_Sans_MS'] text-xl text-green-700 mb-4 text-center">
            🎄 Magic Gift Ideas 🎄
          </h2>
          <div className="space-y-4">
            {recommendations.map(gift => (
              <GiftCard
                key={gift.id}
                gift={gift}
                isCoalMode={isCoalMode}
                onFavorite={handleFavorite}
                isFavorite={favorites.some(fav => fav.id === gift.id)}
              />
            ))}
          </div>
        </div>
      )}

      {showFavorites && (
        <div>
          <h2 className="font-['Comic_Sans_MS'] text-xl text-red-700 mb-4 text-center">
            ⭐ Your Favorite Gift Ideas ⭐
          </h2>
          <div className="space-y-4">
            {favorites.map(gift => (
              <GiftCard
                key={gift.id}
                gift={gift}
                isCoalMode={isCoalMode}
                onFavorite={handleFavorite}
                isFavorite={true}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => {
            setIsCoalMode(!isCoalMode);
            setRecommendations([]);
            setError(null);
          }}
          className={`font-['Comic_Sans_MS'] px-4 py-2 rounded-lg transition-colors ${
            isCoalMode
              ? 'bg-gray-600 text-white hover:bg-gray-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isCoalMode ? '🎄 Back to Nice List' : '🪨 Switch to Naughty List'}
        </button>
      </div>
    </div>
  );
};

export default GiftRecommender;