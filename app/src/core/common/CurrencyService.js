(function () {
  var currencies = {"JPY": "￥",
    "SGD": "S$",
    "ILS": "שח",
    "RUB": "руб.",
    "BYR": "Руб",
    "SVC": "C",
    "HRK": "Kn",
    "PEN": "S/",
    "CHF": "SFr.",
    "OMR": "ر.ع.‏",
    "NOK": "kr",
    "IQD": "د.ع.‏",
    "ALL": "Lek",
    "LTL": "Lt",
    "AUD": "$",
    "NZD": "$",
    "TRY": "TL",
    "USD": "US$",
    "UYU": "NU$",
    "BAM": "КМ.",
    "MAD": "د.م.‏",
    "BHD": "د.ب.‏",
    "SEK": "kr",
    "EUR": "€",
    "LBP": "ل.ل.‏",
    "AED": "د.إ.‏",
    "HKD": "HK$",
    "BOB": "B$",
    "VEF": "BsF.",
    "KRW": "￦",
    "KWD": "د.ك.‏",
    "RSD": "RSD",
    "QAR": "ر.ق.‏",
    "TND": "د.ت.‏",
    "MKD": "Den",
    "YER": "ر.ي.‏",
    "BRL": "R$",
    "LVL": "Ls",
    "GBP": "£",
    "RON": "LEI",
    "PAB": "B",
    "MXN": "$",
    "SDG": "ج.س.‏",
    "PYG": "G",
    "SYP": "ل.س.‏",
    "BGN": "лв.",
    "THB": "฿",
    "SAR": "ر.س.‏",
    "PLN": "zł",
    "GTQ": "Q",
    "ISK": "kr.",
    "NIO": "$C",
    "UAH": "грн.",
    "MYR": "RM",
    "CSD": "CSD",
    "INR": "Rs.",
    "DZD": "د.ج.‏",
    "VND": "đ",
    "EGP": "ج.م.‏",
    "PHP": "Php",
    "COP": "$",
    "HNL": "L",
    "CLP": "Ch$",
    "DOP": "RD$",
    "ARS": "$",
    "TWD": "NT$",
    "CNY": "￥",
    "HUF": "Ft",
    "CRC": "C",
    "JOD": "د.أ.‏",
    "ZAR": "R",
    "IDR": "Rp",
    "LYD": "د.ل.‏",
    "DKK": "kr",
    "CZK": "Kč",
    "CAD": "$CAN"
  };

  var safeCurrency = function (currencyCode) {
    return currencies[currencyCode] || currencyCode;
  };

  'use strict';
  var module = angular.module('core/common');
  module.factory('core/common/CurrencyService',
    [function () {
      var service = {};
      service.getCurrencySymbol = safeCurrency
      return service;

    }
    ]);

  module.filter('currencyWithSymbol', function () {
    return function (input, currencyCode) {
      input = input || '';
      var currency = safeCurrency(currencyCode);
      //FIXME very naive approach, use js-world or something like this
      var out = input + ' ' + currency;

      return out;
    };
  });
})();
  


