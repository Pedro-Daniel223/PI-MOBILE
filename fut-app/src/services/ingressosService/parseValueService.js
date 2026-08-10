export const parseValue = (value) => {
    if (typeof value === 'number') {
      return value;
    }

    const str = String(value).trim();
    if (!str) {
      return 0;
    }

    const cleaned = str.replace(/[^\d.,-]/g, '');
    if (!cleaned) {
      return 0;
    }

    if (cleaned.includes(',')) {
      const parts = cleaned.split(',');
      const integerPart = parts[0].replace(/\./g, '');
      const decimalPart = parts.slice(1).join('');
      return parseFloat(`${integerPart}.${decimalPart}`);
    }

    return parseFloat(cleaned);
  };