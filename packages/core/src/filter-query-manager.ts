import { Mapper, OPERATORS_HANDLER_MAPPER } from '@scifamek-open-source/iraca/infrastructure';
import { Filters, Operator } from '@scifamek-open-source/iraca/domain';
import { DocumentData, Query } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';

export type CustomFilterOperators = '=' | 'contains';
export const CustomFilterOperators = ['=', 'contains'];

export type FirebaseFilterOperators = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'not-in' | 'array-contains-any';

export function filterWizard<T>(query: Query<DocumentData>, filters?: Filters, mapper?: Mapper<T>) {
  const customOperators: ((source: Observable<any>) => Observable<any>)[] = [];
  if (filters)
    for (const key in filters) {
      const config = filters[key];
      if (Array.isArray(config)) {
        for (const innerConfig of config) {
          query = _map(key, innerConfig, query);
        }
      } else {
        query = _map(key, config, query);
      }
    }

  const response = {
    query,
    pipe: customOperators,
  };
  return response;

  function _map(
    key: string,
    config: {
      operator: Operator;
      value: any;
    },
    query: Query<DocumentData>
  ) {
    let transformKey = key;

    if (!!mapper) {
      if (!mapper.attributesMapper[key]) {
      } else {
        transformKey = mapper.attributesMapper[key].name;
      }
    }

    if (CustomFilterOperators.indexOf(config.operator) == -1) {
      query = query.where(transformKey, config.operator as FirebaseFilterOperators, config.value);
      return query;
    } else {
      const handler = OPERATORS_HANDLER_MAPPER[config.operator];
      if (handler) {
        customOperators.push(handler(transformKey, config.value));
      }
    }
    return query;
  }
}
