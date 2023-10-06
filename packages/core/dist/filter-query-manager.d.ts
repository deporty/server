import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { Filters } from '@scifamek-open-source/iraca/domain';
import { Filter as F } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { CompositeFilters } from '@scifamek-open-source/iraca/domain/filters';
export type CustomFilterOperators = '=' | 'contains';
export declare const CustomFilterOperators: string[];
export type FirebaseFilterOperators = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'not-in' | 'array-contains-any';
interface SingleResponse {
    query: F | null;
    pipe: ((source: Observable<any>) => Observable<any>)[];
}
export declare function filterWizard<T>(filters?: Filters | CompositeFilters, mapper?: Mapper<T>): SingleResponse;
export {};
