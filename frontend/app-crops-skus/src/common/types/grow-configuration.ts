export enum GrowConfigurationType {
  isSeedableAlone = 'Seeded by itself', // example: WHC
  isBlendedAtSeedingMachine = 'Blended at seeding', // example: GFF
  isBlendedAtBlendingMachine = 'Blended at post harvest', // example: SMB
  isNotSeededOrBlended = 'Not seeded or blended', // example: strawberries (as currently done in sierra)
}
