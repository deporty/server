import { formatDateFromJson } from '@deporty-org/core';
import { MemberEntity } from '@deporty-org/entities';
import { RegisteredTeamEntity, RequiredDocsInRegisteredTeam } from '@deporty-org/entities/tournaments';
import { FileAdapter, Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { Timestamp } from 'firebase-admin/firestore';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MemberMapper } from './member.mapper';

export class RequiredDocsMapper extends Mapper<RequiredDocsInRegisteredTeam> {
  constructor() {
    super();
    this.attributesMapper = {
      players: {
        name: 'players',
        from: (docs) => {
          return of(docs);
        },
      },
      team: { name: 'team' },
    };
  }
}
export class RegisteredTeamMapper extends Mapper<RegisteredTeamEntity> {
  constructor(private memberMapper: MemberMapper, private fileAdapter: FileAdapter) {
    super();
    this.attributesMapper = {
      tournamentId: { name: 'tournament-id' },
      id: {
        name: 'id',
      },
      requiredDocs: {
        name: 'required-docs',
        from: (requiredDocs) => {
          return of(requiredDocs).pipe(
            mergeMap((requiredDocsInRegisteredTeam: RequiredDocsInRegisteredTeam) => {
              const requiredDocs = requiredDocsInRegisteredTeam;
              if (requiredDocs) {
                const $members: Array<
                  Observable<{
                    path: string;
                    memberId: string;
                    docIdentifier: string;
                  }>
                > = [];
                const $team: Array<
                  Observable<{
                    path: string;
                    docIdentifier: string;
                  }>
                > = [];
                for (const memberId in requiredDocs.players) {
                  if (Object.prototype.hasOwnProperty.call(requiredDocs.players, memberId)) {
                    const docs = requiredDocs.players[memberId];

                    for (const docIdentifier in docs) {
                      if (Object.prototype.hasOwnProperty.call(docs, docIdentifier)) {
                        const bas64 = docs[docIdentifier];
                        const $resizedImageUpload = this.fileAdapter.getAbsoluteHTTPUrl(bas64).pipe(
                          map((path) => {
                            return { path, memberId, docIdentifier };
                          })
                        );
                        $members.push($resizedImageUpload);
                      }
                    }
                  }
                }
                for (const docIdentifier in requiredDocs.team) {
                  if (Object.prototype.hasOwnProperty.call(requiredDocs.team, docIdentifier)) {
                    const bas64 = requiredDocs.team[docIdentifier];
                    const $resizedImageUpload = this.fileAdapter.getAbsoluteHTTPUrl(bas64).pipe(
                      map((path) => {
                        return { path, docIdentifier };
                      })
                    );
                    $team.push($resizedImageUpload);
                  }
                }

                return zip(
                  $members.length > 0 ? zip(...$members) : of(null),
                  $team.length > 0 ? zip(...$team) : of(null),
                  of(requiredDocsInRegisteredTeam)
                );
              }
              return zip(of(null), of(null), of(requiredDocsInRegisteredTeam));
            }),
            map(
              ([members, team, requiredDocsInRegisteredTeam]: [
                Array<{
                  path: string;
                  memberId: string;
                  docIdentifier: string;
                }> | null,
                Array<{
                  path: string;
                  docIdentifier: string;
                }> | null,
                RequiredDocsInRegisteredTeam
              ]): RequiredDocsInRegisteredTeam => {
                if (members || team) {
                  const newRequiredDocs: RequiredDocsInRegisteredTeam = {
                    players: {},
                    team: {},
                  };

                  if (members) {
                    const rMembers: RequiredDocsInRegisteredTeam['players'] = {};
                    for (const m of members) {
                      if (!rMembers.hasOwnProperty(m.memberId)) {
                        rMembers[m.memberId] = {};
                      }
                      rMembers[m.memberId][m.docIdentifier] = m.path;
                    }
                    newRequiredDocs.players = rMembers;
                  }
                  if (team) {
                    const rTeam: RequiredDocsInRegisteredTeam['team'] = {};
                    for (const m of team) {
                      rTeam[m.docIdentifier] = m.path;
                    }
                    newRequiredDocs.team = rTeam;
                  }

                  return newRequiredDocs;
                }

                return requiredDocsInRegisteredTeam;
              }
            )
          );
        },
      },

      enrollmentDate: {
        name: 'enrollment-date',
        from: (date: Timestamp) => {
          return of(formatDateFromJson(date));
        },
      },
      members: {
        name: 'members',

        from: (members: Array<any>) => {
          return members.length > 0
            ? zip(
                ...members.map((element) => {
                  return this.memberMapper.fromJson(element);
                })
              )
            : of([]);
        },
        to: (members: Array<MemberEntity>) => {
          return members.length > 0
            ? members.map((element) => {
                return this.memberMapper.toJson(element);
              })
            : [];
        },
      },

      teamId: {
        name: 'team-id',
      },
      status: { name: 'status' },
    };
  }
}
