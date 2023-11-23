import {
  Id,
  MemberDescriptionType,
  MemberEntity,
  RegisteredTeamEntity,
  RequiredDocsInRegisteredTeam,
  TournamentInscriptionEntity,
} from '@deporty-org/entities';
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

export interface Param {
  teamId: Id;
  memberId: Id;
  tournamentId: Id;
  tournamentLayoutId: Id;
  tournamentLayout?: TournamentLayoutEntity;
  organizationId: Id;
  requiredDocs?: {
    [requiredDocId: string]: string;
  };
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
export const TeamIsNotRegisteredError = generateError('TeamIsNotRegisteredError', 'The team is not registered into the tournament. {l}');
export const DataIncompleteError = generateError('DataIncompleteError', 'You have to pass all data for the transaction.');
export const MemberIdsNotFoundError = generateError('MemberIdsNotFoundError', 'These member ids were not found: {ids}.');

export class RegisterTeamIntoATournamentLinealUsecase extends Usecase<Param, TournamentInscriptionEntity> {
  constructor(
    private registeredTeamsContract: RegisteredTeamsContract,
    private teamContract: TeamContract,
    private organizationContract: OrganizationContract,
    private fileAdapter: FileAdapter,
    private updateRegisteredTeamByIdUsecase: UpdateRegisteredTeamByIdUsecase
  ) {
    super();
  }
  call(param: Param): Observable<TournamentInscriptionEntity> {
    const t = !param.tournamentLayout || !param.organizationId || !param.tournamentLayoutId;
    if (t || !param.teamId || !param.tournamentId) {
      return throwError(new DataIncompleteError());
    }
    const $member = this.teamContract.getOnlyMemberById(param.teamId, param.memberId);

    const $tournamentLayout = param.tournamentLayout
      ? of(param.tournamentLayout)
      : this.organizationContract.getTournamentLayoutByIdUsecase(param.organizationId, param.tournamentLayoutId);

    return $tournamentLayout.pipe(
      mergeMap((tournamentLayout) => {
        const requiredDocs = tournamentLayout.requiredDocsConfig;
        if (requiredDocs && requiredDocs.length > 0) {
          const requiredDocsForMembers = requiredDocs.filter((doc) => doc.applyTo === 'player');

          if (!this.areRequiredDocsForMembersComplete(param.requiredDocs, requiredDocsForMembers)) {
            return throwError(new RequiredDocsForMembersIncompleteError());
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
        return zip($previousRegisteredTeam, of(requiredDocs!));
      }),

      mergeMap(([previousRegisteredTeam, requiredDocs]) => {
        if (!previousRegisteredTeam.length) {
          return throwError(new TeamIsNotRegisteredError({ l: previousRegisteredTeam.length }));
        }
        return zip($member, of(requiredDocs), of(previousRegisteredTeam));
      }),

      mergeMap(([member, requiredDocs, registeredTeams]: [MemberEntity, RequiredDocConfig[], RegisteredTeamEntity[]]) => {
        const registeredTeam = registeredTeams[0];
        const docs = param.requiredDocs;
        const $docsMembers = [];

        const toSave = {
          ...registeredTeam,
        };

        if (!toSave.requiredDocs) {
          toSave.requiredDocs = {
            members: {},
            team: {},
          };
        }

        for (const docIdentifier in docs) {
          if (Object.prototype.hasOwnProperty.call(docs, docIdentifier)) {
            const bas64 = docs[docIdentifier];
            const extension = getImageExtension(bas64);

            const path = `tournaments/${param.tournamentId}/registered-teams/${registeredTeam.id}/required-docs/members/${member.id}/${docIdentifier}${extension}`;

            toSave.requiredDocs.members[member.id!] = {
              [docIdentifier]: bas64,
            };

            const $resizedImageUpload = this.fileAdapter.uploadFile(path, bas64).pipe(
              map((item) => {
                return { path, memberId: member.id, docIdentifier };
              })
            );
            $docsMembers.push($resizedImageUpload);
          }
        }

        return this.updateRegisteredTeamByIdUsecase.call({
          registeredTeam: toSave,
          tournamentId: param.tournamentId,
        });
      }),

      mergeMap((inscription): Observable<TournamentInscriptionEntity> => {
        return this.teamContract.updateTournamentInscriptionsByTeamUsecase(inscription).pipe(map(() => inscription));
      }),
      mergeMap(
        /**
         * Request for the absolute path of files
         * @param inscription
         * @returns
         */
        (inscription: TournamentInscriptionEntity) => {
          const requiredDocs = inscription.requiredDocs;
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

            return zip($members.length > 0 ? zip(...$members) : of(null), $team.length > 0 ? zip(...$team) : of(null), of(inscription));
          }
          return zip(of(null), of(null), of(inscription));
        }
      ),
      map(
        ([members, team, inscription]: [
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
        ]): RegisteredTeamEntity => {
          // return inscription as TournamentInscriptionEntity;
          return this.fusion([members, team, inscription]);
        }
      )
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

  private areRequiredDocsForMembersComplete(requiredDocs: any, requiredDocsForMembers: RequiredDocConfig[]) {
    if (requiredDocsForMembers.length > 0) {
      const requiredDocsForMembersIds = requiredDocsForMembers.map((x) => x.identifier);
      if (!requiredDocs) {
        return false;
      }

      if (Object.keys(requiredDocs).length != requiredDocsForMembersIds.length) {
        return false;
      }
    }

    return true;
  }
}
