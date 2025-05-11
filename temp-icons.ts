import * as Icons from '@lobehub/icons';

// Find icons related to AI models
const aiModelIcons = Object.keys(Icons).filter(key => 
  key.toLowerCase().includes('chatgpt') || 
  key.toLowerCase().includes('gemini') || 
  key.toLowerCase().includes('claude') ||
  key.toLowerCase().includes('anthropic') ||
  key.toLowerCase().includes('openai') ||
  key.toLowerCase().includes('google')
);

console.log('AI Model Icons:', aiModelIcons);
