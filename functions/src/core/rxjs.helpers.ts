import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function catchAndThrow<T>() {
  return catchError<T, Observable<never>>((x) => {
    return throwError(x);
  });
}
