import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccessKeyEntity } from '@deporty-org/entities/authorization';
import * as moment from 'moment';
import { AccessKeyContract } from '../../contracts/access-key.contract';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export class IsAValidAccessKeyUsecase extends Usecase<string, boolean> {
  constructor(private accessKeyContract: AccessKeyContract) {
    super();
  }
  call(key: string): Observable<boolean> {
    if (!key) {
      return of(false);
    }

    return this.accessKeyContract
      .filter({
        key: {
          operator: '=',
          value: key,
        },
      })
      .pipe(
        map((accessKey: AccessKeyEntity[]) => {
          if (accessKey.length != 1) {
            return false;
          }
          const now = moment(new Date());
          const accessKeyDate = moment(accessKey[0].expirationDate);
          return accessKeyDate.isAfter(now);
        })
      );
  }
}
