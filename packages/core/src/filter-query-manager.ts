import { Mapper, OPERATORS_HANDLER_MAPPER } from '@scifamek-open-source/iraca/infrastructure';
import { Filters, Operator } from '@scifamek-open-source/iraca/domain';
import { Filter as F } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { CompositeFilters } from '@scifamek-open-source/iraca/domain/filters';

export type CustomFilterOperators = '=' | 'contains';
export const CustomFilterOperators = ['=', 'contains'];

export type FirebaseFilterOperators = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'not-in' | 'array-contains-any';

interface Response {
  query: F[];
  pipe: ((source: Observable<any>) => Observable<any>)[];
}
interface SingleResponse {
  query: F | null;
  pipe: ((source: Observable<any>) => Observable<any>)[];
}

export function filterWizard<T>(filters?: Filters | CompositeFilters, mapper?: Mapper<T>): SingleResponse {
  const response: Response = {
    query: [],
    pipe: [],
  };

  if (filters) {
    const castedFilters = filters as CompositeFilters;
    if (castedFilters.and || castedFilters.or) {
      if (castedFilters.and) {
        const andResponse = generateBaseFilters(castedFilters.and, F.and, mapper);
        response.pipe.push(...andResponse.pipe);
        if (andResponse.query) {
          response.query.push(andResponse.query);
        }
      }
      if (castedFilters.or) {
        const orResponse = generateBaseFilters(castedFilters.or, F.or, mapper);
        response.pipe.push(...orResponse.pipe);
        if (orResponse.query) {
          response.query.push(orResponse.query);
        }
      }
      if (response.query.length == 1) {
        return {
          pipe: response.pipe,
          query: response.query[0],
        };
      } else if (response.query.length > 1) {
        return {
          pipe: response.pipe,
          query: F.and(...response.query),
        };
      }
      return {
        pipe: response.pipe,
        query: null,
      };
    } else {
      return generateBaseFilters(filters as Filters, F.and, mapper);
    }
  }
  return {
    pipe: [],
    query: null,
  };
}

function generateBaseFilters<T>(filters: Filters, logicOperator: any, mapper?: Mapper<T>): SingleResponse {
  const customOperators: ((source: Observable<any>) => Observable<any>)[] = [];
  let q: F[] = [];
  for (const key in filters) {
    const config = filters[key];
    if (Array.isArray(config)) {
      // let r: F[] = [];

      for (const innerConfig of config) {
        let x = map(key, innerConfig, customOperators, mapper);
        if (x) {
          // r.push(x);
          q.push(x);
        }
      }

      // q.push(F.and(r));
    } else {
      let y = map(key, config, customOperators, mapper);
      if (y) {
        q.push(y);
      }
    }
  }

  const response = {
    query: logicOperator(...q),
    pipe: customOperators,
  };
  return response;
}

function map<T>(
  key: string,
  config: {
    operator: Operator;
    value: any;
  },
  customOperators: any[],
  mapper?: Mapper<T>
): F | null {
  let transformKey = key;

  if (!!mapper) {
    if (!mapper.attributesMapper[key]) {
    } else {
      transformKey = mapper.attributesMapper[key].name;
    }
  }

  if (CustomFilterOperators.indexOf(config.operator) == -1) {
    return F.where(transformKey, config.operator as FirebaseFilterOperators, config.value);
  } else {
    const handler = OPERATORS_HANDLER_MAPPER[config.operator];
    if (handler) {
      customOperators.push(handler(transformKey, config.value));
    }
  }
  return null;
}
