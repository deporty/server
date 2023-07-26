import { GroupEntity, Id } from '@deporty-org/entities';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { GetGroupByIdUsecase } from '../get-group-by-id/get-group-by-id.usecase';
import { UpdateGroupUsecase } from '../update-group/update-group.usecase';
import { DeleteMatchesWhereTeamIdExistsUsecase } from '../../group-matches/delete-matches-where-team-id-exists/delete-matches-where-team-id-exists.usecase';

export interface Param {
  fixtureStageId: Id;
  groupId: Id;
  teamIds: Array<Id>;
  tournamentId: Id;
}

export class DeleteTeamsInGroupUsecase extends Usecase<Param, GroupEntity> {
  constructor(
    private getGroupByIdUsecase: GetGroupByIdUsecase,
    private updateGroupUsecase: UpdateGroupUsecase,
    private deleteMatchesWhereTeamIdExistsUsecase: DeleteMatchesWhereTeamIdExistsUsecase
  ) {
    super();
  }

  call(param: Param): Observable<GroupEntity> {
    const params = {
      tournamentId: param.tournamentId,
      fixtureStageId: param.fixtureStageId,
      groupId: param.groupId,
    };


    return this.getGroupByIdUsecase.call(params).pipe(
      mergeMap((group: GroupEntity) => {
        const newTeamIds: Id[] = group.teamIds.filter((t) => {
          return !param.teamIds.includes(t);
        });
        group.teamIds = newTeamIds;
        const matchesPerTeam = [];
        let deletedMatches;
        for (const id of param.teamIds) {
          matchesPerTeam.push(
            this.deleteMatchesWhereTeamIdExistsUsecase.call({
              fixtureStageId: param.fixtureStageId,
              groupId: param.groupId,
              teamId: id,
              tournamentId: param.tournamentId,
            })
          );
        }
        deletedMatches =
          matchesPerTeam.length == 0 ? of(void 0) : zip(...matchesPerTeam);


        return zip(
          deletedMatches,
          this.updateGroupUsecase.call({ ...params, group })
        ).pipe(
          map(() => {
            return group;
          })
        );
      })
    );
  }
}
