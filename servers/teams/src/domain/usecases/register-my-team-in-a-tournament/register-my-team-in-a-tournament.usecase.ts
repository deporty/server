import { Id, TournamentInscriptionEntity } from '@deporty-org/entities';
import { RequiredDocConfig } from '@deporty-org/entities/organizations';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, zip } from 'rxjs';
import { GetMembersByTeamUsecase } from '../get-members-by-team/get-members-by-team.usecase';
import { OrganizationContract } from '../../contracts/organization.contract';
import { map } from 'rxjs/operators';

export interface Param {
  teamId: Id;
  tournamentId: Id;
  organizationId: Id;
  tournamentLayoutId: Id;
  requiredDocs?: RequiredDocConfig[];
}

export class RegisterMyTeamInATournamentUsecase extends Usecase<Param, TournamentInscriptionEntity> {
  constructor(private getMembersByTeamUsecase: GetMembersByTeamUsecase, private organizationContract: OrganizationContract) {
    super();
  }

  call(param: Param): Observable<TournamentInscriptionEntity> {
    const $members = this.getMembersByTeamUsecase.call(param.teamId);
    const $tournamentLayout = this.organizationContract.getTournamentLayoutByIdUsecase(param.organizationId, param.tournamentLayoutId);
    return zip($members, $tournamentLayout).pipe(
      map(([members, tournamentLayout]) => {
        if (tournamentLayout.requiredDocsConfig) {
        }
      }),
      map(() => {
        return {
          enrollmentDate: new Date(),
          members: [],
          status: 'pre-registered',
          teamId: param.teamId,
          tournamentId: param.tournamentId,
        };
      })
    );
  }
}
