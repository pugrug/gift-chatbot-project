import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Gift, Heart, HeartOff, Trash2 } from 'lucide-react';

const GiftRecommender = () => {
  const [recipientInfo, setRecipientInfo] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // ... existing handleSubmit, toggleFavorite, and removeFavorite functions remain the same ...

  return (
    <div className="min-h-screen bg-green-900 p-4 md:p-8" 
         style={{
           backgroundImage: `
             linear-gradient(45deg, #146B3A 25%, transparent 25%),
             linear-gradient(-45deg, #146B3A 25%, transparent 25%),
             linear-gradient(45deg, transparent 75%, #146B3A 75%),
             linear-gradient(-45deg, transparent 75%, #146B3A 75%)
           `,
           backgroundSize: '20px 20px',
           backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
         }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Title Banner */}
          <div className="text-center animate-bounce">
            <h1 className="text-4xl font-bold text-red-600 bg-white p-4 rounded-lg shadow-lg border-4 border-red-600"
                style={{
                  fontFamily: "'Comic Sans MS', cursive",
                  textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff',
                }}>
              🎅 Santa's Gift Helper 🎄
            </h1>
          </div>

          {/* Input Card */}
          <Card className="border-8 border-red-600 shadow-xl bg-white">
            <CardHeader className="bg-red-600">
              <CardTitle className="text-center text-2xl text-white animate-pulse"
                        style={{ fontFamily: "'Comic Sans MS', cursive" }}>
                Tell Santa's Elves About Your Friend!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="relative">
                <textarea
                  value={recipientInfo}
                  onChange={(e) => setRecipientInfo(e.target.value)}
                  className="w-full min-h-[120px] p-4 border-4 border-green-600 rounded-lg focus:ring-4 focus:ring-red-400 outline-none"
                  style={{ fontFamily: "'Comic Sans MS', cursive" }}
                  placeholder="Example: My friend loves cooking and Christmas movies..."
                />
                <img 
                  src="/api/placeholder/50/50"
                  alt="Elf"
                  className="absolute -top-6 -right-6 w-12 h-12"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !recipientInfo.trim()}
                className={`w-full py-3 px-6 rounded-lg text-white font-bold text-xl transition-all
                  ${isLoading || !recipientInfo.trim() 
                    ? 'bg-gray-400' 
                    : 'bg-red-600 hover:bg-red-700 hover:scale-105 animate-pulse'}
                  border-4 border-white shadow-lg`}
                style={{ fontFamily: "'Comic Sans MS', cursive" }}
              >
                {isLoading ? '🎄 The Elves Are Working...' : '🎁 Ask Santa\'s Elves!'}
              </button>
            </CardContent>
          </Card>

          {/* Recommendations Card */}
          {recommendations.length > 0 && (
            <Card className="border-8 border-green-600 shadow-xl bg-white">
              <CardHeader className="bg-green-600">
                <CardTitle className="text-center text-2xl text-white"
                          style={{ fontFamily: "'Comic Sans MS', cursive" }}>
                  🎄 Magic Gift Ideas 🎄
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div 
                      key={rec.id} 
                      className="flex items-start justify-between p-4 rounded-lg bg-red-50 border-4 border-red-600 hover:shadow-xl transition-all hover:scale-102"
                    >
                      <p className="flex-1 text-gray-800" style={{ fontFamily: "'Comic Sans MS', cursive" }}>
                        {rec.text}
                      </p>
                      <button
                        onClick={() => toggleFavorite(rec)}
                        className="ml-4 p-2 hover:bg-red-100 rounded-full transition-all"
                      >
                        {favorites.some(fav => fav.id === rec.id) ? (
                          <Heart className="w-6 h-6 text-red-600 fill-current animate-pulse" />
                        ) : (
                          <HeartOff className="w-6 h-6 text-gray-400" />
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
          <Card className="sticky top-4 border-8 border-red-600 shadow-xl bg-white">
            <CardHeader className="bg-red-600">
              <CardTitle className="text-center text-xl text-white"
                        style={{ fontFamily: "'Comic Sans MS', cursive" }}>
                🎅 Santa's Nice List 🎄
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {favorites.length === 0 ? (
                <div className="text-center py-4 space-y-4">
                  <Gift className="w-12 h-12 mx-auto text-green-600 animate-bounce" />
                  <p className="text-gray-500" style={{ fontFamily: "'Comic Sans MS', cursive" }}>
                    No gifts on your nice list yet! Click the heart to save your favorite ideas!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((fav) => (
                    <div 
                      key={fav.id}
                      className="relative p-4 rounded-lg bg-green-50 border-4 border-green-600 hover:shadow-lg transition-all"
                    >
                      <div className="text-sm text-gray-600 mb-2 italic"
                           style={{ fontFamily: "'Comic Sans MS', cursive" }}>
                        For: {fav.recipient.slice(0, 50)}...
                      </div>
                      <p className="text-gray-800" style={{ fontFamily: "'Comic Sans MS', cursive" }}>
                        {fav.text}
                      </p>
                      <button
                        onClick={() => removeFavorite(fav.id)}
                        className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-full transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 hover:scale-110" />
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