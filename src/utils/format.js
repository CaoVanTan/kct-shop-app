var formatCurrency = () => {};

import('intl')
  .then(() => import('intl/locale-data/jsonp/vi-VN'))
  .then(() => {
    formatCurrency = (value, hasPrefix = true) => {
      const formattedValue = Intl.NumberFormat('vi-VN', {
        style: hasPrefix ? 'currency' : undefined,
        currency: hasPrefix ? 'vnd' : undefined,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      return formattedValue.format(value);
    };
  });

export { formatCurrency };
