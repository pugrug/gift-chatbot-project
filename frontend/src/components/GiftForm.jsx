import React from 'react';

export const GiftForm = ({ input, setInput, isLoading, error, onSubmit }) => (
  <form onSubmit={onSubmit} className="mb-8">
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
      <p className="text-red-500 font-['Comic_Sans_MS'] mb-4">{error}</p>
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
);