import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { getImageExtension, validateImage } from '@deporty-org/utilities';
import { Observable, from, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { FileAdapter } from '../../../../core/file/file.adapter';
import { Usecase } from '../../../../core/usecase';
import { TournamentLayoutContract } from '../../contracts/tournament-layout.contract';

export class TournamentLayoutAlreadyExistsError extends Error {
  constructor() {
    super();
    this.name = 'TournamentLayoutAlreadyExistsError';
    this.message = 'The tournament layout with the same name already exists';
  }
}
export class CreateTournamentLayoutUsecase extends Usecase<
  TournamentLayoutEntity,
  TournamentLayoutEntity
> {
  constructor(
    private tournamentLayoutContract: TournamentLayoutContract,
    private fileAdapter: FileAdapter
  ) {
    super();
  }

  call(
    tournamentLayout: TournamentLayoutEntity
  ): Observable<TournamentLayoutEntity> {
    const prevFlayer = tournamentLayout.flayer;
    console.log("El mago: ", tournamentLayout);

    tournamentLayout.flayer = undefined;
    return this.tournamentLayoutContract
      .filter(
        {
          organizationId: tournamentLayout.organizationId,
        },
        {
          name: {
            operator: '==',
            value: tournamentLayout.name,
          },
        }
      )
      .pipe(
        mergeMap((prevTournamentLayout: Array<TournamentLayoutEntity>) => {
          if (prevTournamentLayout.length > 0) {
            return throwError(new TournamentLayoutAlreadyExistsError());
          }


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
                const toSave = { ...tournamentLayout };
                if (toSave.editions == null) {
                  toSave.editions = ['Única'];
                }
                return this.tournamentLayoutContract
                  .save(
                    {
                      organizationId: tournamentLayout.organizationId,
                    },
                    toSave
                  )
                  .pipe(
                    map((id) => {
                      return { ...tournamentLayout, id };
                    })
                  );
              }),

              mergeMap((fullTournamentLayout: TournamentLayoutEntity) => {
                const extension = getImageExtension(prevFlayer!);
                const path = `organizations/${tournamentLayout.organizationId}/tournament-layouts/${fullTournamentLayout.id}/flayer.${extension}`;

                return this.fileAdapter.uploadFile(path, prevFlayer!).pipe(
                  mergeMap((mn) => {
                    const updatedTournamentLayout = {
                      ...fullTournamentLayout,
                      flayer: path,
                    };
                    return this.tournamentLayoutContract
                      .update(
                        {
                          organizationId: tournamentLayout.organizationId,
                          tournamentLayoutId: fullTournamentLayout.id,
                        },
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
            
            return this.tournamentLayoutContract
              .save(
                {
                  organizationId: tournamentLayout.organizationId,
                },
                tournamentLayout
              )
              .pipe(
                map((id) => {
                  return { ...tournamentLayout, id };
                })
              );
          }
        })
      );
  }
}
