import { GroupEntity, Id } from '@deporty-org/entities';
import { Observable, of, zip } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { GroupContract } from '../../../contracts/group.contract';
import { TeamContract } from '../../../contracts/team.contract';
import { GetGroupByIdUsecase } from '../get-group-by-id/get-group-by-id.usecase';

export interface Param {
  fixtureStageId: Id;
  groupId: Id;
  teamIds: Array<Id>;
  tournamentId: Id;
}

interface TeamIdStatus {
  id: Id;
  status: 'unresolved' | boolean;
}

export class UpdateTeamsInGroupUsecase extends Usecase<Param, GroupEntity> {
  constructor(
    private getGroupByIdUsecase: GetGroupByIdUsecase,
    private teamContract: TeamContract,
    private groupContract: GroupContract
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
        return this.getTeamsStatusInner(param.teamIds, group.teamIds).pipe(
          map((status) => {
            return {
              status,
              group,
            };
          })
        );
      }),
      mergeMap((data) => {
        const newGroup = { ...data.group };
        return this.getTeamsStatusOuter(data.status).pipe(
          map((teamsStatus) => {
            return {
              group: newGroup,
              teamsStatus,
            };
          })
        );
      }),
      mergeMap((data) => {
        data.group.teamIds = data.teamsStatus
          .filter((x) => x.status === true)
          .map((x) => x.id);

        return this.groupContract
          .update(
            {
              tournamentId: param.tournamentId,
              fixtureStageId: param.fixtureStageId,
              groupId: param.groupId,
            },
            data.group
          )
          .pipe(
            map(() => {
              return data.group;
            })
          );
      })
    );
  }

  getTeamsStatusInner(
    teamIds: Array<Id>,
    previousTeamIds: Array<Id>
  ): Observable<Array<TeamIdStatus>> {
    const newTeamIds = teamIds.map<TeamIdStatus>((teamId) => {
      return {
        id: teamId,
        status: previousTeamIds.includes(teamId) || 'unresolved',
      };
    });
    return of(newTeamIds);
  }

  getTeamsStatusOuter(
    teamIds: Array<TeamIdStatus>
  ): Observable<Array<TeamIdStatus>> {
    if (teamIds.length > 0) {
      return zip(
        ...teamIds.map((statusId) => {
          if (statusId.status === true) {
            return of(statusId);
          }
          return this.teamContract.getTeamById(statusId.id).pipe(
            catchError((error) => {
              return of(null);
            }),
            map((data) => {
              return { status: !!data, id: statusId.id };
            })
          );
        })
      );
    }
    return of([]);
  }
}
