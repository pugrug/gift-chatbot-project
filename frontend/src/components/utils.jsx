// Keep your existing localStorage functions
export const saveFavorites = (favorites) => {
  try {
    localStorage.setItem('giftFavorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

export const loadFavorites = () => {
  try {
    const favorites = localStorage.getItem('giftFavorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

// Updated parseRecommendations function
export const parseRecommendations = (text) => {
  try {
    // Split on clear gift boundaries
    const gifts = text.split(/Gift Suggestion \d+:|Gift \d+:/);
    
    return gifts
      .filter(gift => gift.trim().length > 0) // Remove empty entries
      .map((gift) => {
        // Extract price if present (common formats: $XX-XX, $XX to $XX, $XX)
        const priceMatch = gift.match(/\$\d+(?:[-–—]\$?\d+)?/);
        const priceRange = priceMatch ? priceMatch[0] : '';

        // Extract URL if present
        const urlMatch = gift.match(/https?:\/\/[^\s]+|www\.[^\s]+/);
        const link = urlMatch ? urlMatch[0] : '';

        // Clean up the description and title
        let cleanText = gift
          .replace(priceRange, '') // Remove price
          .replace(link, '') // Remove URL
          .replace(/^\s*[-:.]\s*/, '') // Remove leading punctuation
          .trim();

        // Split into lines and clean them
        const lines = cleanText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

        return {
          title: lines[0] || 'Gift Idea',
          description: lines.slice(1).join('\n') || lines[0] || '',
          priceRange,
          link,
          id: Math.random().toString(36).substr(2, 9) // Keep your existing ID generation
        };
      });
  } catch (error) {
    console.error('Error parsing recommendations:', error);
    return [{
      title: 'Gift Idea',
      description: text, // Return raw text as fallback
      priceRange: '',
      link: '',
      id: Math.random().toString(36).substr(2, 9)
    }];
  }
};

// Add this new validation function
export const validateApiResponse = (data) => {
  if (!data) {
    throw new Error('Empty response received');
  }
  
  if (!data.recommendations) {
    throw new Error('No recommendations in response');
  }
  
  if (typeof data.recommendations === 'string') {
    return data.recommendations;
  }
  
  if (Array.isArray(data.recommendations)) {
    return data.recommendations.join('\n');
  }
  
  throw new Error('Invalid recommendations format');
};