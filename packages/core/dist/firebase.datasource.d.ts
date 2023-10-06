import { DataSource } from '@scifamek-open-source/iraca/infrastructure';
import { Filters } from '@scifamek-open-source/iraca/domain';
import { Firestore } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { CompositeFilters } from '@scifamek-open-source/iraca/domain/filters';
export declare class FirebaseDataSource<T> extends DataSource<T> {
    db: Firestore;
    constructor(db: Firestore);
    deleteById(id: string): Observable<void>;
    getByFilter(config?: {
        filters?: Filters | CompositeFilters;
        pagination?: {
            pageSize: number;
            pageNumber: number;
        };
    }): Observable<T[]>;
    getById(id: string): Observable<T | undefined>;
    save(entity: any): Observable<string>;
    update(id: string, entity: any): Observable<any>;
}
