import React from 'react';

const AccessibilityToggle = ({ highContrast, setHighContrast }) => {
  return (
    <button 
      onClick={() => setHighContrast(!highContrast)} 
      title="Toggle High Contrast Mode" 
      className={`p-2 rounded transition-colors ${
        highContrast 
          ? 'bg-yellow-400 text-black border-2 border-white' 
          : 'bg-gray-700 text-white hover:bg-gray-600'
      }`}
    >
      {/* Eye Icon */}
      👁️
    </button>
  );
};

export default AccessibilityToggle;