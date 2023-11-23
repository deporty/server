import { MobileVersionEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { compare } from 'semver';
import { MobileVersionContract } from '../../administration.contract';

export class GetCurrentMobileVersionsUsecase extends Usecase<void, Array<MobileVersionEntity>> {
  constructor(private mobileVersionContract: MobileVersionContract) {
    super();
  }

  call(): Observable<Array<MobileVersionEntity>> {
    return this.mobileVersionContract
      .filter({
        status: {
          operator: '==',
          value: 'current',
        },
      })
      .pipe(
        map((versions: MobileVersionEntity[]) => {
          return versions.sort((a, b) => compare(b.semver, a.semver));
        })
      );
  }
}
