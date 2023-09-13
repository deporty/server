import { Id } from '@deporty-org/entities';
import { TeamEntity } from '@deporty-org/entities/teams';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { TeamContract } from '../../contracts/team.contract';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';

export const TeamDoesNotExistError = generateError('TeamDoesNotExistError', `The team with the id {id} does not exist`);

export class GetTeamByIdUsecase extends Usecase<Id, TeamEntity> {
  constructor(private teamContract: TeamContract) {
    super();
  }
  call(id: Id): Observable<TeamEntity> {
    return this.teamContract.getById(id).pipe(
      mergeMap((team: TeamEntity | undefined) => {
        if (!!team) {
          return of(team);
        } else {
          return throwError(new TeamDoesNotExistError({id}));
        }
      })
    );
  }
}
