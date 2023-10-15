import { RegisteredTeamEntity, RequiredDocsInRegisteredTeam, TournamentInscriptionEntity } from '@deporty-org/entities';
import { RequiredDocConfig } from '@deporty-org/entities/organizations';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { Observable, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { OrganizationContract } from '../../../contracts/organization.contract';
import { RegisteredTeamsContract } from '../../../contracts/registered-teams.contract';
import { TeamContract } from '../../../contracts/team.contract';

export interface Param {
  teamId: string;
  tournamentId: string;
  tournamentLayoutId: string;
  organizationId: string;
  requiredDocs?: RequiredDocsInRegisteredTeam;
}

export const RequiredDocsForTeamIncompleteError = generateError(
  'RequiredDocsForTeamIncompleteError',
  'You must provide all files for team.'
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

export class RegisterTeamIntoATournamentUsecase extends Usecase<Param, TournamentInscriptionEntity> {
  constructor(
    private registeredTeamsContract: RegisteredTeamsContract,
    private teamContract: TeamContract,
    private organizationContract: OrganizationContract
  ) {
    super();
  }
  call(param: Param): Observable<TournamentInscriptionEntity> {
    if (!param.organizationId || !param.teamId || !param.tournamentId || !param.tournamentLayoutId) {
      return throwError(new DataIncompleteError());
    }

    const $tournamentLayout = this.organizationContract.getTournamentLayoutByIdUsecase(param.organizationId, param.tournamentLayoutId);

    return $tournamentLayout.pipe(
      mergeMap((tournamentLayout) => {
        const requiredDocs = tournamentLayout.requiredDocsConfig;
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
        return $previousRegisteredTeam;
      }),

      mergeMap((previousRegisteredTeam) => {
        if (previousRegisteredTeam.length) {
          return throwError(new TeamAlreadyRegisteredError({ l: previousRegisteredTeam.length }));
        }
        const $members = this.teamContract.getMembersByTeam(param.teamId);
        return $members;
      }),

      map(
        /**
         * Delete the members who are not in the required docs.
         * @param members
         * @returns
         */
        (members) => {
          return members.filter((member) => param.requiredDocs?.players[member.member.id!]);
        }
      ),
      map(
        /**
         *
         * @param members
         * @returns
         */
        (members) => {
          const registeredTeam: RegisteredTeamEntity = {
            enrollmentDate: new Date(),
            members: members.map((x) => x.member),
            teamId: param.teamId,
            tournamentId: param.tournamentId,
            requiredDocs: param.requiredDocs,
            status: 'pre-registered',
          };
          return registeredTeam;
        }
      ),
      mergeMap((registeredTeam: RegisteredTeamEntity) => {
        return this.registeredTeamsContract.save({ tournamentId: param.tournamentId }, registeredTeam).pipe(
          map((id: string) => {
            return { ...registeredTeam, id };
          })
        );
      }),

      mergeMap((inscription: TournamentInscriptionEntity) => {
        return this.teamContract.saveTournamentInscriptionsByTeamUsecase(inscription);
      })
    );
  }

  private areRequiredDocsForTeamComplete(param: Param, requiredDocsForTeam: RequiredDocConfig[]) {
    return !!param.requiredDocs && Object.keys(param.requiredDocs?.team).length == requiredDocsForTeam.length;
  }
  private areRequiredDocsForMembersComplete(param: Param, requiredDocsForMembers: RequiredDocConfig[]) {
    if (requiredDocsForMembers.length > 0) {
      if (!param.requiredDocs) {
        return false;
      }
      if (!param.requiredDocs?.players) {
        return false;
      }

      if (Object.keys(param.requiredDocs?.players).length == 0) {
        return false;
      }
      let flag = true;
      let i = 0;
      const keys = Object.keys(param.requiredDocs?.players);
      while (flag && i < keys.length) {
        const key = keys[i];
        const requiredDocsSentByMember = param.requiredDocs.players[key];

        flag = Object.keys(requiredDocsSentByMember).length == requiredDocsForMembers.length;
        i++;
      }
      if (!flag) {
        return false;
      }
    }

    return true;
  }
}
