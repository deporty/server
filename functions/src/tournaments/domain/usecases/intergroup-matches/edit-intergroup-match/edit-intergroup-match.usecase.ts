import { Id } from '@deporty-org/entities';
import {
  IntergroupMatchEntity
} from '@deporty-org/entities/tournaments';
import { Observable, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { FileAdapter } from '../../../../../core/file/file.adapter';
import { convertToImage } from '../../../../../core/helpers';
import { Usecase } from '../../../../../core/usecase';
import { IntergroupMatchContract } from '../../../contracts/intergroup-match.contract';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  intergroupMatch: IntergroupMatchEntity;
}

export class EditIntergroupMatchUsecase extends Usecase<
  Param,
  IntergroupMatchEntity
> {
  constructor(
    private intergroupMatchContract: IntergroupMatchContract,
    private fileAdapter: FileAdapter
  ) {
    super();
  }

  call(param: Param): Observable<IntergroupMatchEntity> {
    
    const prefixSignaturePath = `tournaments/${param.tournamentId}/stages/${param.fixtureStageId}/intergroups/matches/${param.intergroupMatch.id}`;
    const captainASignaturePath = `${prefixSignaturePath}/captainASignature.jpg`;
    const captainBSignaturePath = `${prefixSignaturePath}/captainBSignature.jpg`;
    const judgeSignaturePath = `${prefixSignaturePath}/judgeSignature.jpg`;

    const signatures: Observable<string | undefined>[] = [
      convertToImage(
        param.intergroupMatch.match['captainASignature'],
        captainASignaturePath,
        this.fileAdapter
      ),
      convertToImage(
        param.intergroupMatch.match['captainBSignature'],
        captainBSignaturePath,
        this.fileAdapter
      ),
      convertToImage(
        param.intergroupMatch.match['judgeSignature'],
        judgeSignaturePath,
        this.fileAdapter
      ),
    ];
    return zip(...signatures).pipe(
      mergeMap((data) => {
        param.intergroupMatch.match.captainASignature = data[0];
        param.intergroupMatch.match.captainBSignature = data[1];
        param.intergroupMatch.match.judgeSignature = data[2];
        return this.intergroupMatchContract
          .update(
            {
              fixtureStageId: param.fixtureStageId,
              tournamentId: param.tournamentId,
            },
            param.intergroupMatch
          )
          .pipe(
            map((data) => {
              return param.intergroupMatch;
            })
          );
      })
    );
  }
}
