import React from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Gift, Heart } from 'lucide-react';

export const GiftCard = ({ gift, isCoalMode, onFavorite, isFavorite }) => {
  const Icon = isFavorite ? Heart : Gift;
  const iconColor = isCoalMode ? 'text-gray-600' : 'text-red-500';

  return (
    <Card className={`w-full border-2 ${
      isCoalMode ? 'border-gray-600 bg-gray-100' : 'border-red-600 bg-pink-50'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className={`font-['Comic_Sans_MS'] text-lg ${
            isCoalMode ? 'text-gray-700' : 'text-red-700'
          }`}>
            {gift.title}
          </h3>
          <button 
            onClick={() => onFavorite(gift)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Icon className={`w-6 h-6 ${isFavorite ? iconColor : 'text-gray-300'}`} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {gift.priceRange && (
          <p className="font-['Comic_Sans_MS'] text-gray-600">{gift.priceRange}</p>
        )}
        {gift.description && (
          <p className="font-['Comic_Sans_MS'] text-gray-700">{gift.description}</p>
        )}
        {gift.link && (
          <div className="pt-2">
            <button 
              className={`${
                isCoalMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'
              } text-white font-['Comic_Sans_MS'] px-4 py-2 rounded-lg transition-colors`}
              onClick={() => window.open(`https://${gift.link.replace(/https?:\/\//, '')}`, '_blank')}
            >
              {isCoalMode ? '🪨 Find "Gift"' : '🎁 Find Gift'}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};