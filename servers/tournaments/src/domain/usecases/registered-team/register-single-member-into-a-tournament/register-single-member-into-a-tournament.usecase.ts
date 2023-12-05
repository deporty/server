import { Id, MemberEntity, RegisteredTeamEntity, TournamentEntity, TournamentInscriptionEntity } from '@deporty-org/entities';
import { RequiredDocConfig, TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { getImageExtension } from '@scifamek-open-source/tairona';
import { Observable, of, throwError, zip } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { OrganizationContract } from '../../../contracts/organization.contract';
import { RegisteredTeamsContract } from '../../../contracts/registered-teams.contract';
import { TeamContract } from '../../../contracts/team.contract';
import { UpdateRegisteredTeamByIdUsecase } from '../update-registered-team-by-id/update-registered-team-by-id.usecase';
import { GetTournamentByIdUsecase } from '../../get-tournament-by-id/get-tournament-by-id.usecase';

export interface Param {
  teamId: Id;
  memberId: Id;
  tournamentId: Id;
  tournament?: TournamentEntity;
  tournamentLayoutId: Id;
  tournamentLayout?: TournamentLayoutEntity;
  organizationId: Id;
  requiredDocs?: {
    [requiredDocId: string]: string;
  };
}

export const RequiredDocsForMemberIncompleteError = generateError(
  'RequiredDocsForMembersIncompleteError',
  'You must provide all files for members.'
);

export const TeamIsNotRegisteredError = generateError('TeamIsNotRegisteredError', 'The team is not registered into the tournament. {l}');
export const MemberIsAlreadyRegisteredError = generateError(
  'MemberIsAlreadyRegisteredError',
  'The member is already registered into the tournament. {l}'
);
export const DataIncompleteError = generateError('DataIncompleteError', 'You have to pass all data for the transaction.');

export class RegisterSingleMemberIntoATournamentUsecase extends Usecase<Param, TournamentInscriptionEntity> {
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
    const t = (!param.organizationId || !param.tournamentLayoutId) && !param.tournamentLayout;
    if (t || !param.teamId || !param.tournamentId) {
      return throwError(new DataIncompleteError());
    }
    const $member = this.teamContract.getOnlyMemberById(param.teamId, param.memberId);

    const $tournamentLayout = param.tournamentLayout
      ? of(param.tournamentLayout)
      : this.organizationContract.getTournamentLayoutByIdUsecase(param.organizationId, param.tournamentLayoutId);

    const $tournament = param.tournament ? of(param.tournament) : this.getTournamentByIdUsecase.call(param.tournamentId);

    return zip($tournament, $tournamentLayout).pipe(
      filter(([tournament, tournamentLayout]) => {
        return !!tournament;
      }),
      mergeMap(([tournament, tournamentLayout]) => {
        const requiredDocs = tournamentLayout.requiredDocsConfig;
        if (tournament!.requestRequiredDocs && requiredDocs && requiredDocs.length > 0) {
          const requiredDocsForMembers = requiredDocs.filter((doc) => doc.applyTo === 'player');

          if (!this.areRequiredDocsForMembersComplete(param.requiredDocs, requiredDocsForMembers)) {
            return throwError(new RequiredDocsForMemberIncompleteError());
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
        const existMember = registeredTeam.members.find((x) => x.id == param.memberId);

        if (existMember) {
          return throwError(new MemberIsAlreadyRegisteredError());
        }
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
        toSave.requiredDocs.members[member.id!] = {};

        toSave.members.push(member);
        for (const docIdentifier in docs) {
          if (Object.prototype.hasOwnProperty.call(docs, docIdentifier)) {
            const bas64 = docs[docIdentifier];
            const extension = getImageExtension(bas64);

            const path = `tournaments/${param.tournamentId}/registered-teams/${registeredTeam.id}/required-docs/members/${member.id}/${docIdentifier}${extension}`;

            toSave.requiredDocs.members[member.id!][docIdentifier] = path;

            const $resizedImageUpload = this.fileAdapter.uploadFile(path, bas64).pipe(
              map((item) => {
                return { path, memberId: member.id, docIdentifier };
              })
            );
            $docsMembers.push($resizedImageUpload);
          }
        }

        return zip(
          $docsMembers.length > 0 ? zip(...$docsMembers) : of([]),
          this.updateRegisteredTeamByIdUsecase.call({
            registeredTeam: toSave,
            tournamentId: param.tournamentId,
          })
        );
      }),

      mergeMap(([docs, inscription]): Observable<TournamentInscriptionEntity> => {
        return this.teamContract.updateTournamentInscriptionsByTeamUsecase(inscription).pipe(map(() => inscription));
      })
    );
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
