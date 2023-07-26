import { GroupEntity, Id } from '@deporty-org/entities';
import { RegisteredTeamEntity } from '@deporty-org/entities/tournaments/registered-teams.entity';
import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { GroupContract } from '../../contracts/group.contract';
import { GetRegisteredTeamsByTournamentIdUsecase } from '../registered-team/get-registered-teams-by-tournaments/get-registered-teams-by-tournaments.usecase';
import { GetGroupsByFixtureStageUsecase } from '../groups/get-groups-by-fixture-stage/get-groups-by-fixture-stage.usecase';
import { CompleteGroupMatchesUsecase } from '../group-matches/complete-group-matches/complete-group-matches.usecase';

export class TeamAreNotRegisteredError extends Error {
  data: Id[];

  constructor(teamIds: Id[]) {
    super();
    this.name = 'TeamAreNotRegisteredError';
    this.message = `The following teams are not registerd in the tournament: ${teamIds.join(
      ', '
    )} `;
    this.data = teamIds;
  }
}

export class TeamAreRegisteredInOtherGroupError extends Error {
  constructor(public data: any) {
    super();
    this.name = 'TeamAreRegisteredInOtherGroupError';
    this.message = `There are teams wich are registered in other groups`;
  }
}

export class ThereAreTeamRegisteredPreviuslyError extends Error {
  constructor(public data: Id[]) {
    super();
    this.name = 'ThereAreTeamRegisteredPreviuslyError';
    this.message = `There are teams wich are registered in the same group`;
  }
}

export interface Param {
  fixtureStageId: Id;
  groupId: Id;
  teamIds: Id[];
  tournamentId: Id;
}

export class AddTeamsToGroupInsideTournamentUsecase extends Usecase<
  Param,
  GroupEntity
> {
  constructor(
    private getGroupsByFixtureStageUsecase: GetGroupsByFixtureStageUsecase,
    private getRegisteredTeamsByTournamentIdUsecase: GetRegisteredTeamsByTournamentIdUsecase,
    private groupContract: GroupContract,
    private completeGroupMatchesUsecase: CompleteGroupMatchesUsecase
  ) {
    super();
  }

  private ambulanc(
    groups: GroupEntity[],
    param: Param
  ): Observable<GroupEntity> {
    const currentGroup = groups.find((g) => g.id === param.groupId)!;
    const otherGroups = groups.filter((g) => g.id !== currentGroup.id);
    const teamsInOtherGroups: any = {};
    for (const teamId of param.teamIds) {
      for (const group of otherGroups) {
        const existingGroup = group.teamIds.includes(teamId);
        if (existingGroup) {
          teamsInOtherGroups[teamId] = group;
        }
      }
    }

    if (Object.keys(teamsInOtherGroups).length !== 0) {
      return throwError(
        new TeamAreRegisteredInOtherGroupError(teamsInOtherGroups)
      );
    }

    return of(currentGroup);
  }
  call(param: Param): Observable<GroupEntity> {
    return this.getRegisteredTeamsByTournamentIdUsecase
      .call(param.tournamentId)
      .pipe(
        mergeMap((registeredTeams: RegisteredTeamEntity[]) => {
          const noRegisteredTeams = [];
          for (const tid of param.teamIds) {
            const registeredTeam = registeredTeams.find((x) => x.teamId == tid);
            if (!registeredTeam) {
              noRegisteredTeams.push(tid);
            } else if (registeredTeam.status === 'pre-registered') {
              noRegisteredTeams.push(tid);
            }
          }
          if (noRegisteredTeams.length > 0) {
            return throwError(new TeamAreNotRegisteredError(noRegisteredTeams));
          }

          return this.getGroupsByFixtureStageUsecase
            .call({
              tournamentId: param.tournamentId,
              fixtureStageId: param.fixtureStageId,
            })
            .pipe(
              mergeMap((groups: GroupEntity[]) => {
                return this.ambulanc(groups, param);
              }),
              mergeMap((currentGroup: GroupEntity) => {
                const teamsToAdd: Id[] = [];
                const prevTeams: Id[] = [];
                const groupTeamIds = currentGroup.teamIds;
                for (const teamId of param.teamIds) {
                  const index = groupTeamIds.indexOf(teamId);
                  if (index == -1) {
                    teamsToAdd.push(teamId);
                  } else {
                    prevTeams.push(teamId);
                  }
                }

                if (prevTeams.length > 0) {
                  return throwError(
                    new ThereAreTeamRegisteredPreviuslyError(prevTeams)
                  );
                }
                currentGroup.teamIds.push(...teamsToAdd);
                return this.groupContract
                  .update(
                    {
                      fixtureStageId: param.fixtureStageId,
                      tournamentId: param.tournamentId,
                      groupId: param.groupId,
                    },
                    currentGroup
                  )
                  .pipe(
                    mergeMap(() => {
                      return this.completeGroupMatchesUsecase.call({
                        fixtureStageId: param.fixtureStageId,
                        groupId: param.groupId,
                        tournamentId: param.tournamentId,
                        teamIds: currentGroup.teamIds,
                      });
                    }),

                    map(() => {
                      return currentGroup;
                    })
                  );
              })
            );
        })
      );
  }
}
