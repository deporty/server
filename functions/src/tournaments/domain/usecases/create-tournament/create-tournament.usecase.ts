import { TournamentEntity } from '@deporty-org/entities';
import {
  OrganizationEntity,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { getImageExtension, validateImage } from '@deporty-org/utilities';
import { Observable, from, of, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { EmptyAttributeError } from '../../../../core/exceptions';
import { FileAdapter } from '../../../../core/file/file.adapter';
import { Usecase } from '../../../../core/usecase';
import { TournamentLayoutContract } from '../../../../organizations/domain/contracts/tournament-layout.contract';
import { OrganizationContract } from '../../contracts/organization.contract';
import { TournamentContract } from '../../contracts/tournament.contract';
import { GetTournamentsByUniqueAttributesUsecase } from '../exists-tournament/exists-tournament.usecase';

export class TournamentLayoutNotFoundError extends Error {
  constructor() {
    super(`The tournament layout was not found.`);
    this.name = 'TournamentLayoutNotFoundError';
  }
}
export class OrganizationNotFoundError extends Error {
  constructor() {
    super(`The organization was not found.`);
    this.name = 'OrganizationNotFoundError';
  }
}
export class TournamentAlreadyExistsError extends Error {
  constructor(properties: string[]) {
    super();
    this.name = 'TournamentAlreadyExistsError';
    this.message = `The tournament with these properties already exists: ${properties.join(
      ', '
    )} `;
  }
}

export class CreateTournamentUsecase extends Usecase<
  TournamentEntity,
  TournamentEntity
> {
  constructor(
    private tournamentContract: TournamentContract,
    private tournamentLayoutContract: TournamentLayoutContract,
    private organizationContract: OrganizationContract,
    private fileAdapter: FileAdapter,
    private getTournamentsByUniqueAttributesUsecase: GetTournamentsByUniqueAttributesUsecase
  ) {
    super();
  }

  call(tournament: TournamentEntity): Observable<TournamentEntity> {
    const requiredAttributes = [
      'category',
      'organizationId',
      'tournamentLayoutId',
      'version',
    ];

    for (const att of requiredAttributes) {
      if (!(tournament as any)[att]) {
        return throwError(new EmptyAttributeError(att));
      }
    }

    return this.tournamentLayoutContract
      .getById(
        { organizationId: tournament.organizationId },
        tournament.tournamentLayoutId
      )
      .pipe(
        mergeMap((tournamentLayout: TournamentLayoutEntity | undefined) => {
          if (!tournamentLayout) {
            return throwError(new TournamentLayoutNotFoundError());
          }
          return of(tournament);
        }),
        mergeMap((tournament: TournamentEntity) => {
          return this.organizationContract
            .getOrganizationById(tournament.organizationId!)
            .pipe(
              mergeMap((organization: OrganizationEntity | undefined) => {
                if (!organization) {
                  return throwError(new OrganizationNotFoundError());
                }

                return of(organization);
              }),
              mergeMap((data: any) => {
                return this.getTournamentsByUniqueAttributesUsecase.call(
                  tournament
                );
              }),
              mergeMap((existingTournaments: TournamentEntity[]) => {
                if (existingTournaments.length > 0) {
                  const availables = existingTournaments.filter(
                    (x) => x.status !== 'deleted'
                  );
                  if (availables.length > 0) {
                    return throwError(
                      new TournamentAlreadyExistsError([
                        'category',
                        'edition',
                        'organizationId',
                        'tournamentLayoutId',
                        'version',
                      ])
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

                      return this.fileAdapter
                        .uploadFile(path, prevFlayer!)
                        .pipe(
                          mergeMap((mn) => {
                            const updatedTournamentLayout = {
                              ...fullTournament,
                              flayer: path,
                            };
                            return this.tournamentContract
                              .update(
                                updatedTournamentLayout.id!,
                                updatedTournamentLayout
                              )
                              .pipe(
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
                    map((id) => {
                      return { ...tournament, id };
                    })
                  );
                }
              })
            );
        })
      );
  }
}
