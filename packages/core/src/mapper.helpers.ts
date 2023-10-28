import { Timestamp } from 'firebase-admin/firestore';

export function formatDateFromJson(date: Timestamp | string | object, defaultValue = undefined) {
  if (!date) {
    return defaultValue;
  }
  if (typeof date === 'string') {
    if (date != '') {
      return new Date(date);
    }
  } else if (date instanceof Timestamp) {
    if (Object.keys(date).length != 0) {
      return date.toDate();
    }
  }
  return defaultValue;
}
