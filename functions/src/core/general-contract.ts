import { Id } from '@deporty-org/entities';
import { CollectionReference, DocumentData, DocumentReference, Firestore, Query, QuerySnapshot } from 'firebase-admin/firestore';
import { from, Observable, of, zip } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { filterWizard } from './filter-query-manager';
import { Filters, unifyData } from './helpers';
import { Mapper } from './mapper';

export interface RouteParam {
  collection: string;
  id?: string;
}
export abstract class GeneralContract<AccessParams, Entity> {
  constructor(protected datasource: Firestore, protected mapper: Mapper<Entity>) {}

  innerSave(accessParams: Array<RouteParam>, entity: Entity) {
    const route = this.getRouteToColl(this.datasource, accessParams);

    return from(route.add(this.mapper.toJson(entity))).pipe(
      map((snapshot: DocumentReference<DocumentData>) => {
        return snapshot.id;
      })
    );
  }

  innerUpdate(accessParams: Array<RouteParam>, entity: Entity): Observable<void> {
    return new Observable((observer) => {
      const docReference = this.getRouteToDoc(this.datasource, accessParams);

      if (docReference) {
        docReference.update(this.mapper.toJson(entity)).then(() => {
          observer.next();
          observer.complete();
        });
      } else {
        observer.next();
        observer.complete();
      }
    });
  }

  abstract delete(accessParams: AccessParams, id: Id): Observable<void>;
  abstract filter(accessParams: AccessParams, filter: Filters): Observable<Array<Entity>>;
  abstract get(
    accessParams: AccessParams,
    pagination?: {
      pageNumber: number;
      pageSize: number;
    }
  ): Observable<Entity[]>;
  abstract getById(accessParams: AccessParams, id: Id): Observable<Entity | undefined>;
  abstract save(accessParams: AccessParams, entity: Entity): Observable<string>;
  abstract update(accessParams: AccessParams, entity: Entity): Observable<void>;

  protected innerDelete(accessParams: Array<RouteParam>): Observable<void> {
    const route = this.getRouteToDoc(this.datasource, accessParams);

    if (!route) {
      return of();
    }
    return from(route.delete()).pipe(
      map((item) => {
        return;
      })
    );
  }

  protected innerFilter(
    accessParams: Array<RouteParam>,
    config?: {
      filters?: Filters;
      pagination?: { pageSize: number; pageNumber: number };
    }
  ): Observable<Entity[]> {
    const route = this.getRouteToColl(this.datasource, accessParams);

    let query: Query<DocumentData> = route;

    const filters = config?.filters;

    const pagination = config?.pagination;

    if (!!pagination) {
      if (pagination.pageNumber != 0) {
        query = query.orderBy('id').limit((pagination.pageNumber + 1) * pagination.pageSize);

        return from(query.get())
          .pipe(
            map((items: QuerySnapshot<DocumentData>) => {
              return items.docs
                .map(
                  (item) =>
                    ({
                      ...item.data(),
                      id: item.id,
                    } as unknown as Entity)
                )
                .pop();
            }),
            map((last: Entity | undefined) => {
              if (last) {
                query = query.startAfter((last as any).id).limit(pagination.pageSize);
              }
              return query;
            }),
            mergeMap((query) => {
              return from(query.get()).pipe(
                map((items: QuerySnapshot<DocumentData>) => {
                  return items.docs.map(
                    (item) =>
                      ({
                        ...item.data(),
                        id: item.id,
                      } as unknown as Entity)
                  );
                })
              );
            })
          )
          .pipe(this.mapItems());
      } else {
        query = query.limit(pagination.pageSize);

        return from(query.get()).pipe(
          map((items: QuerySnapshot<DocumentData>) => {
            return items.docs.map(
              (item) =>
                ({
                  ...item.data(),
                  id: item.id,
                } as unknown as Entity)
            );
          })
        );
      }
    }

    const computedFilters = filterWizard(query, filters, this.mapper);

    query = computedFilters.query;
    let $query = from(query.get()).pipe(
      map((items: QuerySnapshot<DocumentData>) => {
        return items.docs.map(
          (item) =>
            ({
              ...item.data(),
              id: item.id,
            } as unknown as Entity)
        );
      })
    );
    for (const pipe of computedFilters.pipe) {
      $query = $query.pipe(pipe);
    }
    return $query.pipe(this.mapItems());
  }

  protected innerGet(
    accessParams: Array<RouteParam>,
    pagination?: {
      pageNumber: number;
      pageSize: number;
    }
  ): Observable<Entity[]> {
    return this.innerFilter(accessParams, {
      pagination,
    });
  }

  protected innerGetById(accessParams: Array<RouteParam>): Observable<Entity | undefined> {
    const route = this.getRouteToDoc(this.datasource, accessParams);

    if (!route) {
      return of(undefined);
    }
    return from(route.get()).pipe(
      map(unifyData),
      mergeMap((member) => {
        if (member) {
          return this.mapper.fromJson(member);
        } else {
          return of(member);
        }
      })
    );
  }

  private getRouteToColl(db: Firestore, params: Array<RouteParam>): CollectionReference<DocumentData> {
    let query: any = db;
    for (let i = 0; i < params.length - 1; i++) {
      const param = params[i];
      query = query.collection(param.collection).doc(param.id);
    }
    query = query.collection(params[params.length - 1].collection);
    return query as CollectionReference<DocumentData>;
  }

  private getRouteToDoc(db: Firestore, params: Array<RouteParam>): DocumentReference<DocumentData> | null {
    if (Object.keys(params).length === 0) {
      return null;
    }
    let query: any = db;
    for (const item of params) {
      const collection = item.collection;
      const id = item.id;
      query = query.collection(collection).doc(id);
    }
    return query as DocumentReference<DocumentData>;
  }

  private mapItems() {
    return mergeMap((items: Entity[]) => {
      return items.length > 0
        ? zip(
            ...items.map((item) => {
              return this.mapper.fromJson(item).pipe(filter((item) => !!item)) as Observable<Entity>;
            })
          ).pipe(
            map((items) => {
              return items;
            })
          )
        : of([]);
    });
  }
}
