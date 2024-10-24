export const parseRecommendations = (text) => {
    const suggestions = text.split(/Gift Suggestion \d+:/).filter(Boolean);
    
    return suggestions.map(suggestion => {
      const lines = suggestion.trim().split(/\d+\.\s+/).filter(Boolean);
      return {
        title: lines[0]?.trim() || '',
        priceRange: lines.find(l => l.includes('$'))?.trim() || '',
        description: lines.find(l => !l.includes('$') && !l.includes('www') && !l.includes('.com'))?.trim() || '',
        link: lines.find(l => l.includes('www') || l.includes('.com'))?.trim() || '',
        id: Math.random().toString(36).substr(2, 9)
      };
    });
  };