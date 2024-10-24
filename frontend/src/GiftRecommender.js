import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './components/ui/card';
import { 
  Heart,
  Gift,
  Sparkles,
  Bell,
  Star,
  Coffee,
  Cake,
  Music,
  PartyPopper,
  Flame
} from 'lucide-react';

const CHRISTMAS_ICONS = [
  { icon: Heart, color: 'text-red-500' },
  { icon: Gift, color: 'text-green-500' },
  { icon: Sparkles, color: 'text-yellow-500' },
  { icon: Bell, color: 'text-yellow-400' },
  { icon: Star, color: 'text-yellow-400' },
  { icon: Coffee, color: 'text-amber-600' },
  { icon: Cake, color: 'text-pink-400' },
  { icon: Music, color: 'text-purple-500' },
  { icon: PartyPopper, color: 'text-blue-400' },
  { icon: Flame, color: 'text-orange-500' }
];

const GiftRecommender = () => {
  // Add new state for coal mode
  const [isCoalMode, setIsCoalMode] = useState(false);
  // Keep your existing state declarations
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const parseRecommendations = (text) => {
    // Split by "Gift Suggestion" and filter out empty strings
    const suggestions = text.split(/Gift Suggestion \d+:/).filter(Boolean);
    
    return suggestions.map(suggestion => {
      const lines = suggestion.trim().split(/\d+\.\s+/).filter(Boolean);
      return {
        title: lines[0]?.trim() || '',
        priceRange: lines.find(l => l.includes('$'))?.trim() || '',
        description: lines.find(l => !l.includes('$') && !l.includes('www') && !l.includes('.com'))?.trim() || '',
        link: lines.find(l => l.includes('www') || l.includes('.com'))?.trim() || '',
        iconIndex: Math.floor(Math.random() * CHRISTMAS_ICONS.length),
        id: Math.random().toString(36).substr(2, 9)
      };
    });
  };
  
      
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Modify the prompt based on coal mode
      const coalPrompt = isCoalMode 
        ? `Give me slightly disappointing, humorous gift ideas for someone who ${input}. Make them funny but still somewhat relevant. Format each gift suggestion with a slightly sarcastic description. Keep the price ranges realistic but make them seem less appealing.`
        : input;

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

      const formattedRecommendations = parseRecommendations(data.recommendations.join(' '));
      setRecommendations(formattedRecommendations);
      
    } catch (err) {
      console.error('Error:', err);
      setError(isCoalMode 
        ? '🪨 Even the coal ran out! Please try again!' 
        : 'Oops! Something went wrong. Please try again!');
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCoalMode = () => {
    setIsCoalMode(!isCoalMode);
    setRecommendations([]); // Clear existing recommendations
    setError(null);
  };

  const handleFavorite = (recommendation) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(fav => fav.id === recommendation.id);
      if (isAlreadyFavorite) {
        return prevFavorites.filter(fav => fav.id !== recommendation.id);
      } else {
        return [...prevFavorites, recommendation];
      }
    });
  };

  const renderRecommendationCard = (recommendation) => {
    const isFavorite = favorites.some(fav => fav.id === recommendation.id);
    const Icon = CHRISTMAS_ICONS[recommendation.iconIndex].icon;
    const iconColor = isCoalMode ? 'text-gray-600' : CHRISTMAS_ICONS[recommendation.iconIndex].color;

    return (
      <Card 
        key={recommendation.id} 
        className={`w-full border-2 ${
          isCoalMode 
            ? 'border-gray-600 bg-gray-100 shadow-lg' 
            : 'border-red-600 bg-pink-50'
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h3 className={`font-['Comic_Sans_MS'] text-lg ${
              isCoalMode ? 'text-gray-700' : 'text-red-700'
            }`}>
              {recommendation.title}
            </h3>
            <button 
              onClick={() => handleFavorite(recommendation)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Icon 
                className={`w-6 h-6 ${
                  isFavorite ? `fill-current ${iconColor}` : 'text-gray-300'
                }`}
              />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {recommendation.priceRange && (
            <p className="font-['Comic_Sans_MS'] text-gray-600">
              {recommendation.priceRange}
            </p>
          )}
          {recommendation.description && (
            <p className="font-['Comic_Sans_MS'] text-gray-700">
              {recommendation.description}
            </p>
          )}
          {recommendation.link && (
            <div className="pt-2">
              <button 
                className={`${
                  isCoalMode 
                    ? 'bg-gray-600 hover:bg-gray-700' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white font-['Comic_Sans_MS'] px-4 py-2 rounded-lg transition-colors`}
                onClick={() => window.open(`https://${recommendation.link.replace(/https?:\/\//, '')}`, '_blank')}
              >
                {isCoalMode ? '🪨 Find "Gift"' : '🎁 Find Gift'}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    );
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
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 border-2 border-green-600 rounded-lg font-['Comic_Sans_MS'] text-gray-700 focus:outline-none focus:border-red-500"
              rows="4"
              placeholder="Tell us about your friend..."
            />
          </div>
          
          {error && (
            <p className="text-red-500 font-['Comic_Sans_MS'] mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-red-600 text-white font-['Comic_Sans_MS'] py-2 px-4 rounded-lg 
              hover:bg-red-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? '🎅 Santa\'s Elves are Thinking...' : '🎁 Ask Santa\'s Elves!'}
          </button>
        </form>
      )}

      {!showFavorites && recommendations.length > 0 && (
        <div>
          <h2 className="font-['Comic_Sans_MS'] text-xl text-green-700 mb-4 text-center">
            🎄 Magic Gift Ideas 🎄
          </h2>
          <div className="space-y-4">
            {recommendations.map(renderRecommendationCard)}
          </div>
        </div>
      )}

      {showFavorites && (
        <div>
          <h2 className="font-['Comic_Sans_MS'] text-xl text-red-700 mb-4 text-center">
            ⭐ Your Favorite Gift Ideas ⭐
          </h2>
          <div className="space-y-4">
            {favorites.map(renderRecommendationCard)}
          </div>
        </div>
      )}
      <div className="mt-8 text-center">
        <button
          onClick={toggleCoalMode}
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