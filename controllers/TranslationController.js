const Translation = require('../models/Translation');

exports.translateText = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    // 1. Check database first
    const translation = await Translation.findOne({
      $or: [
        { 'translations.en': text },
        { 'translations.sw': text }
      ]
    });

    if (translation && translation.translations[targetLanguage]) {
      return res.json({
        success: true,
        translatedText: translation.translations[targetLanguage],
        source: 'database'
      });
    }

    // 2. Fallback to API (mock implementation)
    const translatedText = mockTranslate(text, targetLanguage);
    
    res.json({
      success: true,
      translatedText,
      source: 'api'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Mock translation function
function mockTranslate(text, targetLanguage) {
  const mockData = {
    hello: { sw: 'habari', luo: 'amosi', kik: 'wendo' },
    welcome: { sw: 'karibu', luo: 'oyawore', kik: 'watho' }
  };
  return mockData[text.toLowerCase()]?.[targetLanguage] || text;
}