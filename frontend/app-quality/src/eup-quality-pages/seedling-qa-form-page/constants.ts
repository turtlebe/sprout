export * from '../../common/constants';
export const EUPHRATES_PLUGS = ['C4', 'H4', 'C13', 'H13'];
export const EUPHRATES_PERCENTAGES = ['10-20%', '20-30%', '30-40%', '40-50%', '>50%'];
export const EUPHRATES_PLUGS_N_PERCENTAGES = [...EUPHRATES_PLUGS, ...EUPHRATES_PERCENTAGES];

export const DEFECT_VALIDATION = 'DEFECT_VALIDATION';
export const RECORD_SAVED_ERROR_SUBSTRING = 'Your seedling QA submissions has been saved';

export const PLANT_HEALTH = [
  {
    label: '[Abnormal growth](https://drive.google.com/file/d/13hMPL5cy-z3crGWPXwuBhZZwsRt1TF8i/view?usp=sharing)',
    value: 'Abnormal growth',
  },
  {
    label: '[Damp off](https://drive.google.com/file/d/1AH2x7wiWlBr4GVIMT-mEKfv-JSo6oHe3/view?usp=sharing)',
    value: 'Damp off',
  },
  {
    label: '[Mold](https://drive.google.com/file/d/13PKNEXfZ5Itr9Z_JnYQfKoVWrsbZxMOZ/view?usp=sharing)',
    value: 'Mold',
  },
  {
    label: '[Necrosis](https://drive.google.com/file/d/1JQxwV0QqCSob30_DDslf1MPNg5QLj39k/view?usp=sharing)',
    value: 'Necrosis',
  },
  {
    label: '[Root discoloration](https://drive.google.com/file/d/1IRQZTfnpbzq2SzE1bPb8Kz_eHEzi67H-/view?usp=sharing)',
    value: 'Root discoloration',
  },
  {
    label: '[Root rot](https://drive.google.com/file/d/10xYITmEtf3bhrS7rymsaza8y0WZCLw6U/view?usp=sharing)',
    value: 'Root rot',
  },
  {
    label: '[Stem lesions](https://drive.google.com/file/d/1S-Pb6ROVsuUs-aWZuaH9htcT2MxZoIiR/view?usp=sharing)',
    value: 'Stem lesions',
  },
  {
    label: '[Underdeveloped shoot](https://drive.google.com/file/d/1bqN1iasuNdQKlNX5LY8qoNqu1NaOuHjZ/view?usp=sharing)',
    value: 'Underdeveloped shoot',
  },
  {
    label: '[Wilting](https://drive.google.com/file/d/11LF0q88Ukk8pobdChYQOAOegxt6Cr0mk/view?usp=sharing)',
    value: 'Wilting',
  },
  {
    label: '[Browning in canopy](https://drive.google.com/file/d/1Vowr9bYw7-iIr6TNY371KHafI0L9lxdi/view?usp=sharing)',
    value: 'Browning in canopy',
  },
  {
    label: '[Purpling in canopy](https://drive.google.com/file/d/1kwfkZLp_SzGIMjXsgFA8zKt_uSbz2lty/view?usp=sharing)',
    value: 'Purpling in canopy',
  },
  {
    label: '[Yellowing in canopy](https://drive.google.com/file/d/1H2SGPQDTsdEjW2YKVyN2hZZdJXVzaP15/view?usp=sharing)',
    value: 'Yellowing in canopy',
  },
  {
    label: '[Stunting](https://drive.google.com/file/d/1JjMZIBg9z1Pdni2_pULCBE5k-kJ5NbrM/view?usp=sharing)',
    value: 'Stunting',
  },
  {
    label: '[Dead Plugs](https://drive.google.com/file/d/1Ygu6Gz7uX4KMCbO_LPAm3IeIuJaG07rb/view?usp=sharing)',
    value: 'Dead Plugs',
  },
];

export const PLANT_DEFECTS = [
  'Abnormal growth',
  'Damp off',
  'Mold',
  'Necrosis',
  'Root discoloration',
  'Root rot',
  'Stem lesions',
  'Underdeveloped shoot',
  'Wilting',
  'Browning in canopy',
  'Purpling in canopy',
  'Yellowing in canopy',
  'Stunting',
  'Dead Plugs',
];
