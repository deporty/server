import { Id, MemberEntity, RegisteredTeamEntity, RequiredDocsInRegisteredTeam, TournamentInscriptionEntity } from '@deporty-org/entities';
import { RequiredDocConfig, TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { getImageExtension } from '@scifamek-open-source/tairona';
import { Observable, of, throwError, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { OrganizationContract } from '../../../contracts/organization.contract';
import { RegisteredTeamsContract } from '../../../contracts/registered-teams.contract';
import { TeamContract } from '../../../contracts/team.contract';
import { UpdateRegisteredTeamByIdUsecase } from '../update-registered-team-by-id/update-registered-team-by-id.usecase';
import { GetTournamentByIdUsecase } from '../../get-tournament-by-id/get-tournament-by-id.usecase';

export interface Param {
  teamId: string;
  tournamentId: string;
  tournamentLayoutId: string;
  tournamentLayout?: TournamentLayoutEntity;
  organizationId: string;
  requiredDocs?: RequiredDocsInRegisteredTeam;
}

export const RequiredDocsForTeamIncompleteError = generateError(
  'RequiredDocsForTeamIncompleteError',
  'You must provide the same amount of files for team.'
);
export const RequiredDocsForMembersIncompleteError = generateError(
  'RequiredDocsForMembersIncompleteError',
  'You must provide all files for members.'
);
export const RequiredDocsNoPresentError = generateError(
  'RequiredDocsNoPresentError',
  'This tournament requires docs for performance the registration.'
);
export const TeamAlreadyRegisteredError = generateError(
  'TeamAlreadyRegisteredError',
  'The team is already registered into the tournament. {l}'
);
export const DataIncompleteError = generateError('DataIncompleteError', 'You have to pass all data for the transaction.');
export const MemberIdsNotFoundError = generateError('MemberIdsNotFoundError', 'These member ids were not found: {ids}.');

export class RegisterTeamIntoATournamentUsecase extends Usecase<Param, TournamentInscriptionEntity> {
  constructor(
    private registeredTeamsContract: RegisteredTeamsContract,
    private teamContract: TeamContract,
    private organizationContract: OrganizationContract,
    private fileAdapter: FileAdapter,
    private updateRegisteredTeamByIdUsecase: UpdateRegisteredTeamByIdUsecase,
    private getTournamentByIdUsecase: GetTournamentByIdUsecase
  ) {
    super();
  }
  call(param: Param): Observable<TournamentInscriptionEntity> {
    if (!param.organizationId || !param.teamId || !param.tournamentId || !param.tournamentLayoutId) {
      return throwError(new DataIncompleteError());
    }
    const $members = this.teamContract.getOnlyMembersByTeam(param.teamId, false);
    const $tournament = this.getTournamentByIdUsecase.call(param.tournamentId);

    const $tournamentLayout = param.tournamentLayout
      ? of(param.tournamentLayout)
      : this.organizationContract.getTournamentLayoutByIdUsecase(param.organizationId, param.tournamentLayoutId);

    return zip($tournamentLayout, $tournament).pipe(
      mergeMap(([tournamentLayout, tournament]) => {
        const requiredDocs = tournamentLayout.requiredDocsConfig;
        if (tournament.requestRequiredDocs) {
          if (requiredDocs && requiredDocs.length > 0) {
            const requiredDocsForMembers = requiredDocs.filter((doc) => doc.applyTo === 'player');
            const requiredDocsForTeam = requiredDocs.filter((doc) => doc.applyTo === 'team');

            if (!this.areRequiredDocsForTeamComplete(param, requiredDocsForTeam)) {
              return throwError(new RequiredDocsForTeamIncompleteError());
            }
            if (!this.areRequiredDocsForMembersComplete(param, requiredDocsForMembers)) {
              return throwError(new RequiredDocsForMembersIncompleteError());
            }
          }
        }

        const $previousRegisteredTeam = this.registeredTeamsContract.filter(
          {
            tournamentId: param.tournamentId,
          },
          {
            teamId: {
              operator: '==',
              value: param.teamId,
            },
          }
        );
        return zip($previousRegisteredTeam, of(requiredDocs!), of(tournamentLayout));
      }),

      mergeMap(([previousRegisteredTeam, requiredDocs, tournamentLayout]) => {
        if (previousRegisteredTeam.length) {
          return throwError(new TeamAlreadyRegisteredError({ l: previousRegisteredTeam.length }));
        }
        return zip($members, of(requiredDocs), of(tournamentLayout));
      }),

      map(
        /**
         * Delete the members who are not in the required docs.
         * @param members
         * @returns
         */
        ([members, requiredDocs, tournamentLayout]) => {
          return { members: members.filter((member) => param.requiredDocs?.members[member.id!]), requiredDocs, tournamentLayout };
        }
      ),

      mergeMap(
        /**
         * Verifiy the id members. Each memberId must be valid.
         * @param members
         * @returns
         */
        ({ members, requiredDocs, tournamentLayout }) => {
          const notFoundIds = [];
          for (const memberId in param.requiredDocs!.members) {
            if (!this.isAValidMember(memberId, members)) {
              notFoundIds.push(memberId);
            }
          }

          if (notFoundIds.length > 0) {
            return throwError(
              new MemberIdsNotFoundError({
                ids: notFoundIds.join(','),
              })
            );
          }
          return zip(of(members), of(tournamentLayout));
        }
      ),

      map(
        /**
         *
         * @param members
         * @returns
         */
        ([members, tournamentLayout]) => {
          const registeredTeam: RegisteredTeamEntity = {
            enrollmentDate: new Date(),
            members,
            teamId: param.teamId,
            tournamentId: param.tournamentId,
            requiredDocs: param.requiredDocs,
            status: tournamentLayout.defaultRegisteredTeamStatus!,
          };
          return registeredTeam;
        }
      ),
      mergeMap((registeredTeam: RegisteredTeamEntity) => {
        const toSave = {
          ...registeredTeam,
        };
        delete toSave['requiredDocs'];
        return this.registeredTeamsContract.save({ tournamentId: param.tournamentId }, toSave).pipe(
          map((id: string) => {
            return { registeredTeam: { ...registeredTeam, id }, requiredDocs: registeredTeam.requiredDocs };
          })
        );
      }),

      mergeMap(({ registeredTeam, requiredDocs }) => {
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
          for (const memberId in requiredDocs.members) {
            if (Object.prototype.hasOwnProperty.call(requiredDocs.members, memberId)) {
              const docs = requiredDocs.members[memberId];

              for (const docIdentifier in docs) {
                if (Object.prototype.hasOwnProperty.call(docs, docIdentifier)) {
                  const bas64 = docs[docIdentifier];
                  const extension = getImageExtension(bas64);

                  const path = `tournaments/${param.tournamentId}/registered-teams/${registeredTeam.id}/docs/members/${memberId}/${docIdentifier}${extension}`;
                  const $resizedImageUpload = this.fileAdapter.uploadFile(path, bas64).pipe(
                    map((item) => {
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
              const extension = getImageExtension(bas64);

              const path = `tournaments/${param.tournamentId}/registered-teams/${registeredTeam.id}/docs/team/${docIdentifier}${extension}`;
              const $resizedImageUpload = this.fileAdapter.uploadFile(path, bas64).pipe(
                map((item) => {
                  return { path, docIdentifier };
                })
              );
              $team.push($resizedImageUpload);
            }
          }

          return zip($members.length > 0 ? zip(...$members) : of(null), $team.length > 0 ? zip(...$team) : of(null), of(registeredTeam));
        }
        return zip(of(null), of(null), of(registeredTeam));
      }),
      mergeMap(([members, team, inscription]) => {
        const d = this.fusion([members, team, inscription]);

        return this.updateRegisteredTeamByIdUsecase.call({
          registeredTeam: d,
          tournamentId: param.tournamentId,
        });
      }),

      mergeMap((inscription): Observable<TournamentInscriptionEntity> => {
        return this.teamContract.saveTournamentInscriptionsByTeamUsecase(inscription).pipe(map(() => inscription));
      }),
   
    ) as Observable<TournamentInscriptionEntity>;
  }

  private fusion([members, team, inscription]: [
    Array<{
      path: string;
      memberId: string;
      docIdentifier: string;
    }> | null,
    Array<{
      path: string;
      docIdentifier: string;
    }> | null,
    RegisteredTeamEntity
  ]): RegisteredTeamEntity {
    if (members || team) {
      const newRequiredDocs: RequiredDocsInRegisteredTeam = {
        members: {},
        team: {},
      };

      if (members) {
        const rMembers: RequiredDocsInRegisteredTeam['members'] = {};
        for (const m of members) {
          if (!rMembers.hasOwnProperty(m.memberId)) {
            rMembers[m.memberId] = {};
          }
          rMembers[m.memberId][m.docIdentifier] = m.path;
        }
        newRequiredDocs.members = rMembers;
      }
      if (team) {
        const rTeam: RequiredDocsInRegisteredTeam['team'] = {};
        for (const m of team) {
          rTeam[m.docIdentifier] = m.path;
        }
        newRequiredDocs.team = rTeam;
      }

      return {
        ...inscription,
        requiredDocs: newRequiredDocs,
      };
    }

    return inscription;
  }
  private isAValidMember(memberId: Id, members: MemberEntity[]) {
    return members.filter((member: MemberEntity) => member.id === memberId).length > 0;
  }
  private areRequiredDocsForTeamComplete(param: Param, requiredDocsForTeam: RequiredDocConfig[]) {
    return !!param.requiredDocs && Object.keys(param.requiredDocs?.team).length == requiredDocsForTeam.length;
  }
  private areRequiredDocsForMembersComplete(param: Param, requiredDocsForMembers: RequiredDocConfig[]) {
    if (requiredDocsForMembers.length > 0) {
      const requiredDocsForMembersIds = requiredDocsForMembers.map((x) => x.identifier);
      if (!param.requiredDocs) {
        return false;
      }
      if (!param.requiredDocs?.members) {
        return false;
      }

      if (Object.keys(param.requiredDocs?.members).length == 0) {
        return false;
      }
      let flag = true;
      let i = 0;
      const keys = Object.keys(param.requiredDocs?.members);
      while (flag && i < keys.length) {
        const key = keys[i];
        const requiredDocsSentByMember = param.requiredDocs.members[key];

        // flag = Object.keys(requiredDocsSentByMember).sort().length == requiredDocsForMembers.length;
        const sonIguales = (arr1: string[], arr2: string[]) => JSON.stringify(arr1) === JSON.stringify(arr2);

        flag = sonIguales(Object.keys(requiredDocsSentByMember).sort(), requiredDocsForMembersIds.sort());
        i++;
      }
      if (!flag) {
        return false;
      }
    }

    return true;
  }
}
