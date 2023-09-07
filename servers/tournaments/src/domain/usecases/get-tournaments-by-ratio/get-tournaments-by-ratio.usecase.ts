import { Coordinate, LocationEntity } from '@deporty-org/entities';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Filters, Usecase } from '@scifamek-open-source/iraca/domain';
import { TournamentContract } from '../../contracts/tournament.contract';
import { LocationContract } from '../../contracts/location.contract';

export interface Params {
  origin: Coordinate;
  ratio: number;
  includeDraft: boolean;
}
export class GetTournamentsByRatioUsecase extends Usecase<
  Params,
  TournamentEntity[]
> {
  constructor(
    private tournamentContract: TournamentContract,
    private locationContract: LocationContract
  ) {
    super();
  }
  call(param: Params): Observable<TournamentEntity[]> {
    const $locations = this.locationContract.getLocationsByRatioUsecase(
      param.origin,
      param.ratio
    );

    return $locations.pipe(
      mergeMap((locations: LocationEntity[]) => {
        if (locations.length > 0) {
          const filters: Filters = {
            locations: {
              operator: 'array-contains-any',
              value: locations.map((x) => x.id),
            },
          };

          // if (!param.includeDraft) {
          //   filters['status'] = {
          //     operator: 'not-in',
          //     value: ['draft', 'deleted'],
          //   };
          // }
          return this.tournamentContract.filter(filters);
        } else {
          return of([]);
        }
      })
    );
  }
}
