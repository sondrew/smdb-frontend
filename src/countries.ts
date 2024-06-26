export type CountryList = {
  [countryCode: string]: Country;
};

export type Country = {
  englishCountryName: string;
  localCountryName: string;
  languages: string[];
  neighbouringCountryCodes: string[];
  flagEmoji: string;
};

export const countries: CountryList = {
  AD: {
    englishCountryName: 'Andorra',
    localCountryName: 'Andorra',
    languages: ['Catalan'],
    neighbouringCountryCodes: ['FR', 'ES'],
    flagEmoji: '🇦🇩',
  },
  AL: {
    englishCountryName: 'Albania',
    localCountryName: 'Shqipëria',
    languages: ['Albanian'],
    neighbouringCountryCodes: ['ME', 'XK', 'MK', 'GR'],
    flagEmoji: '🇦🇱',
  },
  AT: {
    englishCountryName: 'Austria',
    localCountryName: 'Österreich',
    languages: ['German'],
    neighbouringCountryCodes: ['DE', 'CZ', 'SK', 'HU', 'SI', 'IT', 'CH', 'LI'],
    flagEmoji: '🇦🇹',
  },
  BA: {
    englishCountryName: 'Bosnia and Herzegovina',
    localCountryName: 'Bosna i Hercegovina',
    languages: ['Bosnian', 'Croatian', 'Serbian'],
    neighbouringCountryCodes: ['HR', 'RS', 'ME'],
    flagEmoji: '🇧🇦',
  },
  BE: {
    englishCountryName: 'Belgium',
    localCountryName: 'België',
    languages: ['Dutch', 'French', 'German'],
    neighbouringCountryCodes: ['FR', 'LU', 'DE', 'NL'],
    flagEmoji: '🇧🇪',
  },
  BG: {
    englishCountryName: 'Bulgaria',
    localCountryName: 'България',
    languages: ['Bulgarian'],
    neighbouringCountryCodes: ['RO', 'RS', 'MK', 'GR', 'TR'],
    flagEmoji: '🇧🇬',
  },
  BY: {
    englishCountryName: 'Belarus',
    localCountryName: 'Беларусь',
    languages: ['Belarusian', 'Russian'],
    neighbouringCountryCodes: ['LV', 'LT', 'PL', 'UA', 'RU'],
    flagEmoji: '🇧🇾',
  },
  CH: {
    englishCountryName: 'Switzerland',
    localCountryName: 'Schweiz',
    languages: ['German', 'French', 'Italian', 'Romansh'],
    neighbouringCountryCodes: ['DE', 'FR', 'IT', 'AT', 'LI'],
    flagEmoji: '🇨🇭',
  },
  CY: {
    englishCountryName: 'Cyprus',
    localCountryName: 'Κύπρος',
    languages: ['Greek', 'Turkish'],
    neighbouringCountryCodes: [],
    flagEmoji: '🇨🇾',
  },
  CZ: {
    englishCountryName: 'Czech Republic',
    localCountryName: 'Česko',
    languages: ['Czech'],
    neighbouringCountryCodes: ['DE', 'PL', 'SK', 'AT'],
    flagEmoji: '🇨🇿',
  },
  DE: {
    englishCountryName: 'Germany',
    localCountryName: 'Deutschland',
    languages: ['German'],
    neighbouringCountryCodes: ['DK', 'PL', 'CZ', 'AT', 'CH', 'FR', 'LU', 'BE', 'NL'],
    flagEmoji: '🇩🇪',
  },
  DK: {
    englishCountryName: 'Denmark',
    localCountryName: 'Danmark',
    languages: ['Danish'],
    neighbouringCountryCodes: ['DE'],
    flagEmoji: '🇩🇰',
  },
  EE: {
    englishCountryName: 'Estonia',
    localCountryName: 'Eesti',
    languages: ['Estonian'],
    neighbouringCountryCodes: ['RU', 'LV'],
    flagEmoji: '🇪🇪',
  },
  ES: {
    englishCountryName: 'Spain',
    localCountryName: 'España',
    languages: ['Spanish'],
    neighbouringCountryCodes: ['PT', 'FR', 'AD'],
    flagEmoji: '🇪🇸',
  },
  FI: {
    englishCountryName: 'Finland',
    localCountryName: 'Suomi',
    languages: ['Finnish', 'Swedish'],
    neighbouringCountryCodes: ['SE', 'NO', 'RU'],
    flagEmoji: '🇫🇮',
  },
  FR: {
    englishCountryName: 'France',
    localCountryName: 'France',
    languages: ['French'],
    neighbouringCountryCodes: ['BE', 'LU', 'DE', 'CH', 'IT', 'MC', 'ES', 'AD'],
    flagEmoji: '🇫🇷',
  },
  GR: {
    englishCountryName: 'Greece',
    localCountryName: 'Ελλάδα',
    languages: ['Greek'],
    neighbouringCountryCodes: ['AL', 'MK', 'BG', 'TR'],
    flagEmoji: '🇬🇷',
  },
  HR: {
    englishCountryName: 'Croatia',
    localCountryName: 'Hrvatska',
    languages: ['Croatian'],
    neighbouringCountryCodes: ['SI', 'HU', 'RS', 'BA', 'ME'],
    flagEmoji: '🇭🇷',
  },
  HU: {
    englishCountryName: 'Hungary',
    localCountryName: 'Magyarország',
    languages: ['Hungarian'],
    neighbouringCountryCodes: ['AT', 'SK', 'UA', 'RO', 'RS', 'HR', 'SI'],
    flagEmoji: '🇭🇺',
  },
  IE: {
    englishCountryName: 'Ireland',
    localCountryName: 'Éire',
    languages: ['Irish', 'English'],
    neighbouringCountryCodes: ['GB'],
    flagEmoji: '🇮🇪',
  },
  IS: {
    englishCountryName: 'Iceland',
    localCountryName: 'Ísland',
    languages: ['Icelandic'],
    neighbouringCountryCodes: [],
    flagEmoji: '🇮🇸',
  },
  IT: {
    englishCountryName: 'Italy',
    localCountryName: 'Italia',
    languages: ['Italian'],
    neighbouringCountryCodes: ['FR', 'CH', 'AT', 'SI', 'SM', 'VA'],
    flagEmoji: '🇮🇹',
  },
  LI: {
    englishCountryName: 'Liechtenstein',
    localCountryName: 'Liechtenstein',
    languages: ['German'],
    neighbouringCountryCodes: ['CH', 'AT'],
    flagEmoji: '🇱🇮',
  },
  LT: {
    englishCountryName: 'Lithuania',
    localCountryName: 'Lietuva',
    languages: ['Lithuanian'],
    neighbouringCountryCodes: ['LV', 'BY', 'PL', 'RU'],
    flagEmoji: '🇱🇹',
  },
  LU: {
    englishCountryName: 'Luxembourg',
    localCountryName: 'Lëtzebuerg',
    languages: ['Luxembourgish', 'French', 'German'],
    neighbouringCountryCodes: ['BE', 'DE', 'FR'],
    flagEmoji: '🇱🇺',
  },
  LV: {
    englishCountryName: 'Latvia',
    localCountryName: 'Latvija',
    languages: ['Latvian'],
    neighbouringCountryCodes: ['EE', 'LT', 'RU', 'BY'],
    flagEmoji: '🇱🇻',
  },
  MC: {
    englishCountryName: 'Monaco',
    localCountryName: 'Monaco',
    languages: ['French'],
    neighbouringCountryCodes: ['FR'],
    flagEmoji: '🇲🇨',
  },
  MD: {
    englishCountryName: 'Moldova',
    localCountryName: 'Moldova',
    languages: ['Romanian'],
    neighbouringCountryCodes: ['RO', 'UA'],
    flagEmoji: '🇲🇩',
  },
  ME: {
    englishCountryName: 'Montenegro',
    localCountryName: 'Crna Gora',
    languages: ['Montenegrin'],
    neighbouringCountryCodes: ['HR', 'BA', 'RS', 'XK', 'AL'],
    flagEmoji: '🇲🇪',
  },
  MT: {
    englishCountryName: 'Malta',
    localCountryName: 'Malta',
    languages: ['Maltese', 'English'],
    neighbouringCountryCodes: [],
    flagEmoji: '🇲🇹',
  },
  NL: {
    englishCountryName: 'Netherlands',
    localCountryName: 'Nederland',
    languages: ['Dutch'],
    neighbouringCountryCodes: ['BE', 'DE'],
    flagEmoji: '🇳🇱',
  },
  NO: {
    englishCountryName: 'Norway',
    localCountryName: 'Norge',
    languages: ['Norwegian', 'Sámi'],
    neighbouringCountryCodes: ['SE', 'FI', 'RU'],
    flagEmoji: '🇳🇴',
  },
  PL: {
    englishCountryName: 'Poland',
    localCountryName: 'Polska',
    languages: ['Polish'],
    neighbouringCountryCodes: ['DE', 'CZ', 'SK', 'UA', 'BY', 'LT', 'RU'],
    flagEmoji: '🇵🇱',
  },
  PT: {
    englishCountryName: 'Portugal',
    localCountryName: 'Portugal',
    languages: ['Portuguese'],
    neighbouringCountryCodes: ['ES'],
    flagEmoji: '🇵🇹',
  },
  RO: {
    englishCountryName: 'Romania',
    localCountryName: 'România',
    languages: ['Romanian'],
    neighbouringCountryCodes: ['UA', 'MD', 'BG', 'RS', 'HU'],
    flagEmoji: '🇷🇴',
  },
  RS: {
    englishCountryName: 'Serbia',
    localCountryName: 'Србија',
    languages: ['Serbian'],
    neighbouringCountryCodes: ['HU', 'RO', 'BG', 'MK', 'HR', 'BA', 'ME', 'XK'],
    flagEmoji: '🇷🇸',
  },
  RU: {
    englishCountryName: 'Russia',
    localCountryName: 'Россия',
    languages: ['Russian'],
    neighbouringCountryCodes: ['NO', 'FI', 'EE', 'LV', 'LT', 'PL', 'UA', 'BY'],
    flagEmoji: '🇷🇺',
  },
  SE: {
    englishCountryName: 'Sweden',
    localCountryName: 'Sverige',
    languages: ['Swedish'],
    neighbouringCountryCodes: ['NO', 'FI'],
    flagEmoji: '🇸🇪',
  },
  SI: {
    englishCountryName: 'Slovenia',
    localCountryName: 'Slovenija',
    languages: ['Slovene'],
    neighbouringCountryCodes: ['IT', 'AT', 'HU', 'HR'],
    flagEmoji: '🇸🇮',
  },
  SK: {
    englishCountryName: 'Slovakia',
    localCountryName: 'Slovensko',
    languages: ['Slovak'],
    neighbouringCountryCodes: ['CZ', 'PL', 'UA', 'HU', 'AT'],
    flagEmoji: '🇸🇰',
  },
  SM: {
    englishCountryName: 'San Marino',
    localCountryName: 'San Marino',
    languages: ['Italian'],
    neighbouringCountryCodes: ['IT'],
    flagEmoji: '🇸🇲',
  },
  UA: {
    englishCountryName: 'Ukraine',
    localCountryName: 'Україна',
    languages: ['Ukrainian'],
    neighbouringCountryCodes: ['BY', 'PL', 'SK', 'HU', 'RO', 'MD', 'RU'],
    flagEmoji: '🇺🇦',
  },
  VA: {
    englishCountryName: 'Vatican City',
    localCountryName: 'Vaticano',
    languages: ['Italian'],
    neighbouringCountryCodes: ['IT'],
    flagEmoji: '🇻🇦',
  },
  XK: {
    englishCountryName: 'Kosovo',
    localCountryName: 'Kosovë',
    languages: ['Albanian', 'Serbian'],
    neighbouringCountryCodes: ['ME', 'AL', 'MK', 'RS'],
    flagEmoji: '🇽🇰',
  },
};
