import { Id, TournamentEntity } from '@deporty-org/entities';
import { OrganizationEntity, TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { getImageExtension, validateImage } from '@scifamek-open-source/tairona';
import { Observable, from, of, throwError, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { OrganizationContract } from '../../contracts/organization.contract';
import { TournamentContract } from '../../contracts/tournament.contract';
import { GetTournamentsByUniqueAttributesUsecase } from '../exists-tournament/exists-tournament.usecase';
import { ImplementSchemaIntoTournamentUsecase } from '../implement-schema-into-tournament/implement-schema-into-tournament.usecase';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { EmptyAttributeError } from '@deporty-org/core';

export const TournamentLayoutNotFoundError = generateError('TournamentLayoutNotFoundError', `The tournament layout was not found.`);
export const OrganizationNotFoundError = generateError(
  'OrganizationNotFoundError',

  `The organization was not found.`
);
export const TournamentAlreadyExistsError = generateError(
  'TournamentAlreadyExistsError',
  `The tournament with these properties already exists: {properties}`
);

export class CreateTournamentUsecase extends Usecase<TournamentEntity, TournamentEntity> {
  constructor(
    private tournamentContract: TournamentContract,
    private organizationContract: OrganizationContract,
    private fileAdapter: FileAdapter,
    private getTournamentsByUniqueAttributesUsecase: GetTournamentsByUniqueAttributesUsecase,
    private implementSchemaIntoTournamentUsecase: ImplementSchemaIntoTournamentUsecase
  ) {
    super();
  }

  call(tournament: TournamentEntity): Observable<TournamentEntity> {
    const requiredAttributes = ['category', 'organizationId', 'tournamentLayoutId', 'version'];

    for (const att of requiredAttributes) {
      if (!(tournament as any)[att]) {
        return throwError(new EmptyAttributeError(att));
      }
    }

    return this.organizationContract.getTournamentLayoutByIdUsecase(tournament.organizationId, tournament.tournamentLayoutId).pipe(
      mergeMap((tournamentLayout: TournamentLayoutEntity | undefined) => {
        if (!tournamentLayout) {
          return throwError(new TournamentLayoutNotFoundError());
        }
        return zip(of(tournament), of(tournamentLayout));
      }),
      mergeMap(([tournament, tournamentLayout]) => {
        return this.organizationContract.getOrganizationById(tournament.organizationId!).pipe(
          mergeMap((organization: OrganizationEntity | undefined) => {
            if (!organization) {
              return throwError(new OrganizationNotFoundError());
            }

            return zip(of(organization), of(tournamentLayout));
          }),
          mergeMap(([organization, tournamentLayout]: any) => {
            return zip(of(organization), of(tournamentLayout), this.getTournamentsByUniqueAttributesUsecase.call(tournament));
          }),
          mergeMap(
            ([organization, tournamentLayout, existingTournaments]: [OrganizationEntity, TournamentLayoutEntity, TournamentEntity[]]) => {
              if (existingTournaments.length > 0) {
                const availables = existingTournaments.filter((x) => x.status !== 'deleted');
                if (availables.length > 0) {
                  return throwError(
                    new TournamentAlreadyExistsError({properties: ['category', 'edition', 'organizationId', 'tournamentLayoutId', 'version']})
                  );
                }
              }
              if (!tournament.status) {
                tournament.status = 'draft';
              }

              const prevFlayer = tournament.flayer;
              tournament.flayer = undefined;

              if (!!prevFlayer) {
                const validations = {
                  maxWidth: 400,
                  maxHeight: 400,
                  mustBeTransparent: false,
                  maxAspectRatio: 1.3,
                };

                const isValid = from(validateImage(prevFlayer, validations));

                return isValid.pipe(
                  mergeMap(() => {
                    return this.tournamentContract.save(tournament).pipe(
                      map((id) => {
                        return { ...tournament, id };
                      })
                    );
                  }),

                  mergeMap((fullTournament: TournamentEntity) => {
                    const extension = getImageExtension(prevFlayer!);
                    const path = `tournaments/${fullTournament.id}/flayer.${extension}`;

                    return this.fileAdapter.uploadFile(path, prevFlayer!).pipe(
                      mergeMap((mn) => {
                        const updatedTournamentLayout = {
                          ...fullTournament,
                          flayer: path,
                        };
                        return this.tournamentContract.update(updatedTournamentLayout.id!, updatedTournamentLayout).pipe(
                          map((x) => {
                            return updatedTournamentLayout;
                          })
                        );
                      })
                    );
                  })
                );
              } else {
                return this.tournamentContract.save(tournament).pipe(
                  mergeMap((id: Id) => {
                    return zip(
                      this.implementSchemaIntoTournamentUsecase.call({
                        tournamentId: id,
                        schema: tournament.schema,
                      }),
                      of(id)
                    );
                  }),
                  map(([schemaResponse, id]) => {
                    return { ...tournament, id };
                  })
                );
              }
            }
          )
        );
      })
    );
  }
}
