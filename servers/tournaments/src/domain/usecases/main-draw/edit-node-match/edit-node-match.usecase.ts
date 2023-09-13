import { NodeMatchEntity } from '@deporty-org/entities/tournaments';
import { Observable, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Id } from '@deporty-org/entities';
import { NodeMatchContract } from '../../../contracts/node-match.contract';
import { convertToImage } from '@scifamek-open-source/iraca/helpers';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';

export interface Param {
  tournamentId: Id;
  nodeMatch: NodeMatchEntity;
}
export class EditNodeMatchUsecase extends Usecase<Param, NodeMatchEntity> {
  constructor(private nodeMatchContract: NodeMatchContract, private fileAdapter: FileAdapter) {
    super();
  }

  call(param: Param): Observable<NodeMatchEntity> {
    const prefixSignaturePath = `tournaments/${param.tournamentId}/main-draw/${param.nodeMatch.id}`;
    const captainASignaturePath = `${prefixSignaturePath}/captainASignature.jpg`;
    const captainBSignaturePath = `${prefixSignaturePath}/captainBSignature.jpg`;
    const judgeSignaturePath = `${prefixSignaturePath}/judgeSignature.jpg`;

    const signatures: Observable<string | undefined>[] = [
      convertToImage(param.nodeMatch.match?.captainASignature, captainASignaturePath, this.fileAdapter),
      convertToImage(param.nodeMatch.match?.captainBSignature, captainBSignaturePath, this.fileAdapter),
      convertToImage(param.nodeMatch.match?.judgeSignature, judgeSignaturePath, this.fileAdapter),
    ];

    return zip(...signatures).pipe(
      mergeMap((data) => {
        if (param.nodeMatch.match) {
          param.nodeMatch.match.captainASignature = data[0];
          param.nodeMatch.match.captainBSignature = data[1];
          param.nodeMatch.match.judgeSignature = data[2];
        }

        return this.nodeMatchContract
          .update(
            {
              tournamentId: param.tournamentId,
            },
            param.nodeMatch
          )
          .pipe(map(() => param.nodeMatch));
      })
    );
  }
}