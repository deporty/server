import { Id, SportEntity } from '@deporty-org/entities';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SportRepository } from '../../../infrastructure/repository/sport.repository';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export const SportDoesNotExistError = generateError('SportDoesNotExistError', `The sport with the id {id} does not exist`);

export class GetSportByIdUsecase extends Usecase<Id, SportEntity> {
  constructor(private sportRepository: SportRepository) {
    super();
  }
  call(id: Id): Observable<SportEntity> {
    return this.sportRepository.getById(id).pipe(
      mergeMap((team: SportEntity | undefined) => {
        if (!!team) {
          return of(team);
        } else {
          return throwError(new SportDoesNotExistError({id}));
        }
      })
    );
  }
}
