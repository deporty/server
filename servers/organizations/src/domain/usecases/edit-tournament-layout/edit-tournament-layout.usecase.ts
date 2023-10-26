import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { TournamentLayoutContract } from '../../contracts/tournament-layout.contract';
import { GetTournamentLayoutByIdUsecase } from '../get-tournament-layout-by-id/get-tournament-layout-by-id.usecase';
import { generateError } from '@scifamek-open-source/iraca/helpers';

export const TournamentLayoutDoesNotExistsError = generateError(
  'TournamentLayoutDoesNotExistsError',
  'The tournament layout does not exists'
);
export class EditTournamentLayoutUsecase extends Usecase<TournamentLayoutEntity, TournamentLayoutEntity> {
  constructor(
    private tournamentLayoutContract: TournamentLayoutContract,
    private getTournamentLayoutByIdUsecase: GetTournamentLayoutByIdUsecase
  ) {
    super();
  }

  call(tournamentLayout: TournamentLayoutEntity): Observable<TournamentLayoutEntity> {
    return this.getTournamentLayoutByIdUsecase
      .call({
        organizationId: tournamentLayout.organizationId,
        tournamentLayoutId: tournamentLayout.id!,
      })
      .pipe(
        mergeMap((prevTournamentLayout: TournamentLayoutEntity) => {
          const toSave: TournamentLayoutEntity = {
            ...prevTournamentLayout,
            fixtureStagesConfiguration: tournamentLayout.fixtureStagesConfiguration,
            name: tournamentLayout.name,
            description: tournamentLayout.description,
            categories: tournamentLayout.categories,
            allowAutoInscriptionFromTeamModifications: tournamentLayout.allowAutoInscriptionFromTeamModifications,
            editions: tournamentLayout.editions,
            registeredTeamsVisibleStatus: tournamentLayout.registeredTeamsVisibleStatus,
            requiredDocsConfig: tournamentLayout.requiredDocsConfig,
          };

          if (toSave.editions == null) {
            toSave.editions = ['Única'];
          }
        
          return this.tournamentLayoutContract
            .update(
              {
                organizationId: tournamentLayout.organizationId,
                tournamentLayoutId: tournamentLayout.id,
              },
              toSave
            )
            .pipe(
              map(() => {
                return toSave;
              })
            );
        })
      );
  }
}
