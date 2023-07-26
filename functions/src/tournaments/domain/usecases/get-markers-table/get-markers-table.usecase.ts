import { Id } from '@deporty-org/entities';
import {
  MatchEntity,
  StadisticSpecification,
  Stadistics,
} from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { GetAllGroupMatchesByTournamentUsecase } from '../get-all-group-matches-by-tournament/get-all-group-matches-by-tournament.usecase';

export interface StadisticResume {
  goals: number;
  memberId: Id;
  teamId: Id;
}

export class GetMarkersTableUsecase extends Usecase<string, StadisticResume[]> {
  constructor(
    private getAllGroupMatchesByTournamentUsecase: GetAllGroupMatchesByTournamentUsecase
  ) {
    super();
  }

  call(tournamentId: string): Observable<StadisticResume[]> {
    console.log(tournamentId);

    return this.getAllGroupMatchesByTournamentUsecase
      .call({ tournamentId, status: ['completed', 'in-review', 'published'] })
      .pipe(
        map((matches: MatchEntity[]) => {
          return matches.filter((m) => m.status != 'editing');
        }),
        map((matches: MatchEntity[]) => {
          const scorers: StadisticResume[] = [];

          for (const match of matches) {
            if (match.stadistics) {
              this.newFunction({
                stadisticsByTeam: match.stadistics.teamA,
                team: match.teamAId,
                scorers,
              });
              this.newFunction({
                stadisticsByTeam: match.stadistics.teamB,
                team: match.teamBId,
                scorers,
              });
            }
          }

          const response: StadisticResume[] = scorers;
          response.sort((prev, next) => {
            return prev.goals > next.goals ? -1 : 1;
          });
          return response;
        })
      );
  }

  isNotStadisticsEmpty(stadistic: Stadistics | undefined) {
    return (
      stadistic &&
      ((stadistic.teamA && stadistic.teamA.length > 0) ||
        (stadistic.teamB && stadistic.teamB.length > 0))
    );
  }

  private findStadisticInScores(
    scorers: StadisticResume[],
    playerStadistic: StadisticSpecification
  ): StadisticResume | undefined {
    const response = scorers.filter((x) => {
      return x.memberId === playerStadistic.memberId;
    });
    return response.length === 1 ? response.pop() : undefined;
  }

  private newFunction({
    stadisticsByTeam,
    team,
    scorers,
  }: {
    stadisticsByTeam: StadisticSpecification[] | undefined;
    team: Id;
    scorers: StadisticResume[];
  }): void {
    if (!!stadisticsByTeam) {
      for (const playerStadistic of stadisticsByTeam) {
        if (playerStadistic.totalGoals) {
          let stadistic = this.findStadisticInScores(scorers, playerStadistic);

          if (!stadistic) {
            stadistic = {
              memberId: playerStadistic.memberId,
              goals: 0,
              teamId: team,
            };
            scorers.push(stadistic);
          }
          stadistic['goals'] = stadistic['goals'] + playerStadistic.totalGoals;
        }
      }
    }
  }
}

// map((fixtureStages: FixtureStageEntity[]) => {
//
//   const stages = fixtureStages.map((stage: FixtureStageEntity) => {
//     const groupMatchesByStage: Observable<(MatchEntity | undefined)[]>[] =
//       [];

//     for (const group of stage.groups) {
//       groupMatchesByStage.push(
//         this.getGroupByIdUsecase
//           .call({
//             groupLabel: group.label,
//             stageId: stage.id || '',
//             tournamentId: tournamentId,
//           })
//           .pipe(
//             map((c) => {
//               return c.matches || [];
//             })
//           )
//       );
//     }

//     const $groupedMatchesByStage: Observable<
//       (MatchEntity | undefined)[]
//     > =
//       groupMatchesByStage.length > 0
//         ? zip(...groupMatchesByStage).pipe(
//             map((x: (MatchEntity | undefined)[][]) => {
//               const response = [];
//               for (const i of x) {
//                 response.push(...i);
//               }
//               return response;
//             })
//           )
//         : of([]);

//     // const $intergroupMatchesByStage: Observable<
//     //   (MatchEntity | undefined)[]
//     // > = this.getIntergroupMatchesUsecase
//     //   .call({
//     //     stageId: stage.id || '',
//     //     tournamentId: tournamentId,
//     //   })
//     //   .pipe(
//     //     map((intergroupMatches: IIntergroupMatchModel[]) => {
//     //       return intergroupMatches && intergroupMatches.length > 0
//     //         ? intergroupMatches.map((y) => y.match)
//     //         : [];
//     //     })
//     //   );

//     return zip($groupedMatchesByStage).pipe(
//       map((x) => {
//         return [...x[0]];
//       })
//     );
//   });
//   const $mainDrawMatches = this.tournamentContract
//     .getMainDrawNodeMatchesOverview(tournamentId)
//     .pipe(
//       map((x) => {
//         return x.map((y) => {
//           return y.match;
//         });
//       })
//     );
//   return zip(
//     stages.length > 0
//       ? zip(...stages).pipe(
//           map((y) => {
//             const response = [];
//             for (const stage of y) {
//               response.push(...stage);
//             }
//             return response;
//           })
//         )
//       : of([]),
//     $mainDrawMatches
//   ).pipe(
//     map((st) => {
//       return [...st[0], ...st[1]];
//     })
//   );
// }),
// mergeMap((x) => x),
// map((x) => {
//   return x.filter((x) => {
//     return x != undefined && this.isNotStadisticsEmpty(x.stadistics);
//   }) as MatchEntity[];
// }),
// map((x: MatchEntity[]) => {
//   const scorers: any[] = [];

//   for (const match of x) {
//     if (match.stadistics) {
//       newFunction({
//         stadisticsByTeam: match.stadistics.teamA,
//         team: match.teamA,
//         scorers,
//       });
//       newFunction({
//         stadisticsByTeam: match.stadistics.teamB,
//         team: match.teamB,
//         scorers,
//       });
//     }
//   }

//   const response: StadisticResume[] = scorers;
//   // return x;
//   return response.sort((prev, next) => {
//     return prev.goals > next.goals ? -1 : 1;
//   });
// }),
// map((x) => {
//   let response;
//   response = x.map(async (item) => {
//     return {
//       player: await this.getUserInformationByIdUsecase
//         .call(item.player.id)
//         .toPromise(),
//       team: await this.getTeamByIdUsecase.call(item.team.id).toPromise(),
//       goals: item.goals,
//     };
//   });

//   return response;
// }),
// // map((x) => {
// //   return x.length > 0 ? zip(...x.map(u=>from(x))) : of([]);
// // }),
// map((x) => {
//   return from(Promise.all(x));
// }),
// mergeMap((x) => x)
