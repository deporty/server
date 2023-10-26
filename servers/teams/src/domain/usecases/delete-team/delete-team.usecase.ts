import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { TeamEntity, TournamentInscriptionEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { TeamContract } from '../../contracts/team.contract';
import { EditTeamUsecase } from '../edit-team/edit-team.usecase';
import { GetTeamByIdUsecase } from '../get-team-by-id/get-team-by-id.usecase';
import { GetTournamentInscriptionsByTeamIdUsecase } from '../get-tournament-inscriptions-by-team-id/get-tournament-inscriptions-by-team-id.usecase';
import { DeleteMembersFromTeamUsecase } from '../delete-members-from-team/delete-members-from-team.usecase';

export class DeleteTeamUsecase extends Usecase<string, TeamEntity | undefined> {
  constructor(
    public teamContract: TeamContract,
    private getTeamByIdUsecase: GetTeamByIdUsecase,
    private deleteMembersFromTeamUsecase: DeleteMembersFromTeamUsecase,
    private editTeamUsecase: EditTeamUsecase,
    private getTournamentInscriptionsByTeamIdUsecase: GetTournamentInscriptionsByTeamIdUsecase,
    private fileAdapter: FileAdapter
  ) {
    super();
  }

  call(id: string): Observable<TeamEntity | undefined> {
    return this.getTeamByIdUsecase.call(id).pipe(
      mergeMap((team: TeamEntity) => {
        return this.getTournamentInscriptionsByTeamIdUsecase.call(id).pipe(
          mergeMap((d: TournamentInscriptionEntity[]) => {
            if (d.length > 0) {
              const t: TeamEntity = { ...team, status: 'deleted' };
              return this.editTeamUsecase.call({ team: t, id: t.id! });
            } else {
              const $response = [];
              if (team.shield) {
                $response.push(this.fileAdapter.deleteFile(team.shield));
              }
              if (team.miniShield) {
                $response.push(this.fileAdapter.deleteFile(team.miniShield));
              }
              return $response.length > 0
                ? zip(...$response).pipe(
                    mergeMap(() => {
                      return this.delete(id);
                    })
                  )
                : of(undefined);
            }
          })
        );
      })
    );
  }

  private delete(id: string) {
    return this.deleteMembersFromTeamUsecase.call(id).pipe(
      mergeMap(() => {
        return this.teamContract.delete(id).pipe(map(() => undefined));
      })
    );
  }
}
