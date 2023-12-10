import { TournamentInscriptionEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { Observable, throwError, zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { OrganizationContract } from '../../../contracts/organization.contract';
import { TeamContract } from '../../../contracts/team.contract';
import { RegisterTeamIntoATournamentUsecase } from '../register-team-into-a-tournament/register-team-into-a-tournament.usecase';
export interface Param {
  organizationId: string;
  requiredDocs?: {
    members: {
      [requiredDocName: string]: string;
    };
    team: {
      [requiredDocName: string]: string;
    };
  };
  teamId: string;
  tournamentId: string;
  tournamentLayoutId: string;
}

export const DataIncompleteError = generateError('DataIncompleteError', 'You have to pass all data for the transaction.');

export class RegisterTeamIntoATournamentLinealUsecase extends Usecase<Param, TournamentInscriptionEntity> {
  constructor(
    private teamContract: TeamContract,
    private organizationContract: OrganizationContract,
    private registerTeamIntoATournamentUsecase: RegisterTeamIntoATournamentUsecase
  ) {
    super();
  }

  call(param: Param): Observable<TournamentInscriptionEntity> {
    if (!param.organizationId || !param.teamId || !param.tournamentId || !param.tournamentLayoutId) {
      return throwError(new DataIncompleteError());
    }
    const $members = this.teamContract.getMembersByTeam(param.teamId);
    const $tournamentLayout = this.organizationContract.getTournamentLayoutByIdUsecase(param.organizationId, param.tournamentLayoutId);

    return zip($tournamentLayout, $members).pipe(
      mergeMap(([tournamentLayout, members]) => {
        const requiredDocsConfiguration = tournamentLayout.requiredDocsConfig;
        const response = {
          members: {} as any,
          team: {} as any,
        };

        if (requiredDocsConfiguration && requiredDocsConfiguration.length > 0) {
          const requiredDocsForMembers = requiredDocsConfiguration.filter((doc) => doc.applyTo === 'player');
          const requiredDocsForTeam = requiredDocsConfiguration.filter((doc) => doc.applyTo === 'team');

          for (const requiredDocName in param.requiredDocs?.members) {
            if (Object.prototype.hasOwnProperty.call(param.requiredDocs?.members, requiredDocName)) {
              const base64 = param.requiredDocs?.members[requiredDocName];

              const [document, alias] = requiredDocName.split(/\-|_/);

              const searchedUser = members.find((fullMember) => fullMember.user.document == document);
              const searchedDocument = requiredDocsForMembers.find((doc) => doc.alias.toUpperCase() === alias.toUpperCase());

              if (searchedUser && searchedDocument) {
                if (!response.members[searchedUser.member.id!]) {
                  response.members[searchedUser.member.id!] = {};
                }
                response.members[searchedUser.member.id!][searchedDocument.identifier] = base64;

              }
            }
          }
          for (const requiredDocName in param.requiredDocs?.team) {
            if (Object.prototype.hasOwnProperty.call(param.requiredDocs?.team, requiredDocName)) {
              const base64 = param.requiredDocs?.team[requiredDocName];

              const searchedDocument = requiredDocsForTeam.find((doc) => doc.alias.toUpperCase() === requiredDocName.toUpperCase());

              if (searchedDocument) {
                if (!response.team[requiredDocName]) {
                  response.team[requiredDocName] = {};
                }
                response.team[requiredDocName] = base64;
              }
            }
          }
        }

        const $previousRegisteredTeam = this.registerTeamIntoATournamentUsecase.call({
          tournamentId: param.tournamentId,
          organizationId: param.organizationId,
          teamId: param.teamId,
          tournamentLayoutId: tournamentLayout.id!,
          tournamentLayout,
          requiredDocs: response,
        });
        return $previousRegisteredTeam;
      })
    );
  }
}
