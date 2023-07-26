import { Id, SportEntity } from '@deporty-org/entities';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { SportRepository } from '../../../infrastructure/repository/sport.repository';

export class SportDoesNotExistError extends Error {
  constructor(id: string) {
    super(`The sport with the id ${id} does not exist`);
    this.name = 'SportDoesNotExistError';
  }
}

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
          return throwError(new SportDoesNotExistError(id));
        }
      })
    );
  }
}
