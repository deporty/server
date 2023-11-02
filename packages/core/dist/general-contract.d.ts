import { Id } from '@deporty-org/entities';
import { Firestore } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { CompositeFilters, Filters } from '@scifamek-open-source/iraca/domain';
export interface RouteParam {
    collection: string;
    id?: string;
}
export declare abstract class GeneralContract<AccessParams, Entity> {
    protected datasource: Firestore;
    protected mapper: Mapper<Entity>;
    constructor(datasource: Firestore, mapper: Mapper<Entity>);
    innerSave(accessParams: Array<RouteParam>, entity: Entity): Observable<string>;
    innerUpdate(accessParams: Array<RouteParam>, entity: Entity): Observable<void>;
    abstract delete(accessParams: AccessParams, id: Id): Observable<void>;
    abstract filter(accessParams: AccessParams, filter: Filters | CompositeFilters): Observable<Array<Entity>>;
    abstract get(accessParams: AccessParams, pagination?: {
        pageNumber: number;
        pageSize: number;
    }): Observable<Entity[]>;
    abstract getById(accessParams: AccessParams, id: Id): Observable<Entity | undefined>;
    abstract save(accessParams: AccessParams, entity: Entity): Observable<string>;
    abstract update(accessParams: AccessParams, entity: Entity): Observable<void>;
    protected innerDelete(accessParams: Array<RouteParam>): Observable<void>;
    protected innerFilter(accessParams: Array<RouteParam>, config?: {
        filters?: Filters | CompositeFilters;
        pagination?: {
            pageSize: number;
            pageNumber: number;
        };
    }): Observable<Entity[]>;
    protected innerGet(accessParams: Array<RouteParam>, pagination?: {
        pageNumber: number;
        pageSize: number;
    }): Observable<Entity[]>;
    protected innerGetById(accessParams: Array<RouteParam>): Observable<Entity | undefined>;
    private getRouteToColl;
    private getRouteToDoc;
    private mapItems;
}
