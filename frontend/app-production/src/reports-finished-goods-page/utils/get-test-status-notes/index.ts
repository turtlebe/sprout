import { PackagingLot } from '@plentyag/core/src/types';

export const getTestStatusNotes = (lot: PackagingLot) => {
  const notesArray = [];
  if (lot.properties?.overriddenQaNotes?.length > 0) {
    notesArray.push(`QA: ${lot.properties?.overriddenQaNotes}`);
  }
  if (lot.properties?.overriddenLtNotes?.length > 0) {
    notesArray.push(`LT: ${lot.properties?.overriddenLtNotes}`);
  }

  return notesArray.join('. ');
};
