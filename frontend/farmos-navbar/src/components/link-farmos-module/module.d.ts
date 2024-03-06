interface FarmOsModule {
  label: string;
  resource: string;
  url: string;
  backend: 'sprout' | 'hypocotyl';
  react: boolean;
  groupUnder?: string;
}
