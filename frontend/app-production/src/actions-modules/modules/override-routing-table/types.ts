export interface Rule {
  from: string;
  condition: string;
  to: string;
}

export interface RuleChoices {
  fromChoices: string[];
  conditionChoices: string[];
  toChoices: string[];
}
