import { Timestamp } from 'firebase-admin/firestore';
export declare function formatDateFromJson(date: Timestamp | string | object, defaultValue?: undefined): Date | undefined;
