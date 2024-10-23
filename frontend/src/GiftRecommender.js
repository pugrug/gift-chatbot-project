import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { SendHorizontal, Heart, HeartOff, Trash2 } from 'lucide-react';

const GiftRecommender = () => {
  const [recipientInfo, setRecipientInfo] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientInfo }),
      });

      const data = await response.json();
      if (data.success) {
        // Split recommendations into an array and take only the first 3
        const recommendationArray = data.recommendations
          .split('\n')
          .filter(rec => rec.trim())
          .slice(0, 3)
          .map((rec, index) => ({
            id: Date.now() + index,
            text: rec,
            recipient: recipientInfo
          }));
        setRecommendations(recommendationArray);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (recommendation) => {
    const isFavorited = favorites.some(fav => fav.id === recommendation.id);
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav.id !== recommendation.id));
    } else {
      setFavorites([...favorites, recommendation]);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl text-gray-800">
                Gift Recommendation Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label 
                    htmlFor="recipientInfo" 
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tell me about the person you're shopping for...
                  </label>
                  <textarea
                    id="recipientInfo"
                    value={recipientInfo}
                    onChange={(e) => setRecipientInfo(e.target.value)}
                    className="w-full min-h-[120px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Example: My dad is 45, loves golf and gardening, and has recently taken up cooking..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !recipientInfo.trim()}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-white font-medium transition
                    ${isLoading || !recipientInfo.trim() 
                      ? 'bg-blue-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isLoading ? (
                    <span className="inline-block animate-pulse">Thinking...</span>
                  ) : (
                    <>
                      Get Recommendations
                      <SendHorizontal className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Recommendations Card */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Top 3 Gift Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div 
                      key={rec.id} 
                      className="flex items-start justify-between p-4 rounded-lg bg-white border hover:shadow-md transition"
                    >
                      <p className="flex-1 text-gray-700">{rec.text}</p>
                      <button
                        onClick={() => toggleFavorite(rec)}
                        className="ml-4 p-2 hover:bg-gray-100 rounded-full transition"
                      >
                        {favorites.some(fav => fav.id === rec.id) ? (
                          <Heart className="w-5 h-5 text-red-500 fill-current" />
                        ) : (
                          <HeartOff className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Favorites Side Panel */}
        <div className="hidden md:block w-80">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Shortlisted Gifts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No gifts shortlisted yet. Click the heart icon to save recommendations you like!
                </p>
              ) : (
                <div className="space-y-4">
                  {favorites.map((fav) => (
                    <div 
                      key={fav.id}
                      className="relative p-4 rounded-lg bg-white border hover:shadow-md transition"
                    >
                      <div className="text-sm text-gray-500 mb-2 italic">
                        For: {fav.recipient.slice(0, 50)}...
                      </div>
                      <p className="text-gray-700 text-sm">{fav.text}</p>
                      <button
                        onClick={() => removeFavorite(fav.id)}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GiftRecommender;