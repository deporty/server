import { formatDateFromJson } from '@deporty-org/core';
import { MobileVersionEntity } from '@deporty-org/entities';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { of } from 'rxjs';

export class MobileVersionMapper extends Mapper<MobileVersionEntity> {
  constructor() {
    super();

    this.attributesMapper = {
      semver: {
        name: 'semver',
      },
      id: {
        name: 'id',
      },
      releaseDate: {
        name: 'release-date',
        from:(value) =>{
            return of(formatDateFromJson(value))
        },
      },
      releaseNotes: {
        name: 'release-notes',
      },
      status: {
        name: 'status',
      },
    };
  }
}
