import { FlatPointsStadistics } from '@deporty-org/entities';
import { AdvancedTieBreakingOrderEnum, BasicTieBreakingOrderEnum, TieBreakingOrder } from '@deporty-org/entities/organizations';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { GetAnyMatchByTeamIdsUsecase } from '../groups/get-any-match-by-team-ids/get-any-match-by-team-ids.usecase';
import {
  ADVANCED_TIE_BREAKING_ORDER_MAP,
  AdvancedTieBreakingOrderConfig,
  BASIC_TIE_BREAKING_ORDER_MAP,
  BasicTieBreakingOrderConfig,
} from './tie-breaking-handlers';
export type orderType = {
  teamId: string;
  stadistics: FlatPointsStadistics;
  wasByRandom: boolean;
};

export function orderRecursively(
  a: {
    teamId: string;
    stadistics: FlatPointsStadistics;
    wasByRandom: boolean;
  },
  b: {
    teamId: string;
    stadistics: FlatPointsStadistics;
    wasByRandom: boolean;
  },
  order: TieBreakingOrder[],
  index: number,
  param: any,
  getAnyMatchByTeamIdsUsecase: GetAnyMatchByTeamIdsUsecase,
  setLength: number
): Observable<number> {

  if (index == order.length) {
    const randomNumber = Math.random();

    if (randomNumber > 0.5) {
      return of(-1);
    } else {
      return of(1);
    }
  }
  const currentOrder = order[index];

  if (BASIC_TIE_BREAKING_ORDER_MAP[currentOrder as BasicTieBreakingOrderEnum]) {
    const config: BasicTieBreakingOrderConfig = BASIC_TIE_BREAKING_ORDER_MAP[currentOrder as BasicTieBreakingOrderEnum];

    const property = config.property;
    const operator = config.operator;
    const result = operator((a.stadistics as any)[property], (b.stadistics as any)[property]).pipe(
      mergeMap((resultNumber) => {
        if (resultNumber === 0) {
          return orderRecursively(a, b, order, index + 1, param, getAnyMatchByTeamIdsUsecase, setLength);
        } else {
          return of(resultNumber);
        }
      })
    );

    return result;
  } else {
    const config: AdvancedTieBreakingOrderConfig = ADVANCED_TIE_BREAKING_ORDER_MAP[currentOrder as AdvancedTieBreakingOrderEnum];

    const operator = config.operator;
    let result;
    if (currentOrder == 'WB2') {
      if (setLength != 2) {
        result = of(0);
      } else {
        result = operator(getAnyMatchByTeamIdsUsecase, a.teamId, b.teamId, param.meta);
      }
    } else {
      result = operator();
    }

    result = result.pipe(
      mergeMap((resultNumber) => {

        if (resultNumber == 0) {
          return orderRecursively(a, b, order, index + 1, param, getAnyMatchByTeamIdsUsecase, setLength);
        } else {
          return of(resultNumber);
        }
      })
    );
    return result;
  }
}

export function quicksort(
  collection: orderType[],
  tieBreakingOrder: TieBreakingOrder[],
  setLength: number,
  param: any,
  getAnyMatchByTeamIdsUsecase: GetAnyMatchByTeamIdsUsecase
): Observable<orderType[]> {
  if (collection.length <= 1) {
    return of(collection); // Ya está ordenado (caso base)
  }

  const pivot = collection[0]; // Tomamos el primer elemento como pivote

  // Separamos los elementos en los arreglos left y right
  const consolidated = [];
  for (let i = 1; i < collection.length; i++) {

    const result = orderRecursively(collection[i], pivot, tieBreakingOrder, 0, param, getAnyMatchByTeamIdsUsecase, setLength);
    const res = zip(result, of(collection[i]));
    consolidated.push(res);
  }

  return zip(...consolidated).pipe(
    mergeMap((result) => {
      const left = [];
      const right = [];

      for (const r of result) {
        if (r[0] < 0) {
          left.push(r[1]);
        } else {
          right.push(r[1]);
        }
      }

      const $sortedLeft: Observable<orderType[]> = quicksort(left, tieBreakingOrder, setLength, param, getAnyMatchByTeamIdsUsecase);
      const $sortedRight: Observable<orderType[]> = quicksort(right, tieBreakingOrder, setLength, param, getAnyMatchByTeamIdsUsecase);
      return zip($sortedLeft, of(pivot), $sortedRight).pipe(
        map(([sortedLeft, pivot, sortedRight]) => {
          return [...sortedLeft, pivot, ...sortedRight];
        })
      );
    })
  );

  // Llamadas recursivas para ordenar los subarreglos

  // Combinamos los arreglos ordenados junto con el pivote en el medio
}
