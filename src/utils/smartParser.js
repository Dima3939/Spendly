export const parseSmartInput = (input) => {
  if (!input) return { amount: '', category: '', description: '' };

  const result = {
    amount: '',
    category: '',
    description: ''
  };

  // Match the first sequence of digits (with optional decimal point/comma)
  const amountMatch = input.match(/\d+[.,]?\d*/);
  if (amountMatch) {
    result.amount = amountMatch[0].replace(',', '.');
  }

  // Common keywords mapping
  const categoryKeywords = {
    'Food & Drinks': ['food', 'drink', 'coffee', 'кофе', 'еда', 'ресторан', 'кафе', 'burger', 'пицца', 'pizza', 'обед', 'lunch', 'dinner', 'ужин', 'завтрак', 'breakfast'],
    'Transport': ['transport', 'taxi', 'такси', 'uber', 'bus', 'автобус', 'метро', 'metro', 'train', 'поезд', 'gas', 'бензин', 'fuel', 'топливо', 'машина', 'car', 'parking', 'парковка'],
    'Shopping': ['shop', 'shopping', 'покупки', 'магазин', 'одежда', 'clothes', 'обувь', 'shoes', 'amazon'],
    'Entertainment': ['entertainment', 'развлечения', 'кино', 'movie', 'cinema', 'игра', 'game', 'клуб', 'club', 'party', 'вечеринка', 'бассейн', 'pool'],
    'Health': ['health', 'здоровье', 'аптека', 'pharmacy', 'врач', 'doctor', 'лекарства', 'medicine', 'gym', 'зал', 'фитнес', 'fitness'],
    'Home': ['home', 'дом', 'аренда', 'rent', 'коммуналка', 'utilities', 'интернет', 'internet', 'мебель', 'furniture', 'ремонт'],
  };

  const lowerInput = input.toLowerCase();
  
  // Find category based on keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => lowerInput.includes(kw))) {
      result.category = category;
      break; // Pick the first matching category
    }
  }

  // Remove the amount from the description and clean up
  let desc = input;
  if (amountMatch) {
    desc = desc.replace(amountMatch[0], '');
  }
  
  // Remove currency symbols if attached
  desc = desc.replace(/[$€£¥₽₴]/g, '');
  
  // Clean up extra spaces
  result.description = desc.trim().replace(/\s{2,}/g, ' ');

  return result;
};
