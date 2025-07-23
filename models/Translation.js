const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  phraseKey: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['greeting', 'direction', 'emergency', 'cultural'],
    required: true
  },
  translations: {
    en: { type: String, required: true }, // English
    sw: { type: String, required: true }, // Swahili
    luo: { type: String, required: true }, // Dholuo
    kik: { type: String, required: true }  // Kikuyu
  },
  // Add audio support
  audioUrls: {
    en: String, // URL to English audio
    sw: String  // URL to Swahili audio
  }
});

// Text search index
translationSchema.index({ 
  'translations.en': 'text', 
  'translations.sw': 'text' 
});

module.exports = mongoose.model('Translation', translationSchema);