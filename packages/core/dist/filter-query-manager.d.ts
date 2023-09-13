import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { Filters } from '@scifamek-open-source/iraca/domain';
import { DocumentData, Query } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
export type CustomFilterOperators = '=' | 'contains';
export declare const CustomFilterOperators: string[];
export type FirebaseFilterOperators = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'not-in' | 'array-contains-any';
export declare function filterWizard<T>(query: Query<DocumentData>, filters?: Filters, mapper?: Mapper<T>): {
    query: Query<DocumentData>;
    pipe: ((source: Observable<any>) => Observable<any>)[];
};
