// import { NodeMatch } from '@deporty-org/entities/tournaments';
// import { Observable, zip } from 'rxjs';
// import { map, mergeMap } from 'rxjs/operators';
// import { FileAdapter } from '../../../../core/file/file.adapter';
// import { convertToImage } from '../../../../core/helpers';
// import { Usecase } from '../../../../core/usecase';
// import { TournamentContract } from '../../tournament.contract';

// export interface Param {
//   tournamentId: string;
//   nodeMatch: NodeMatch;
// }
// export class EditMatchInMainDrawInsideTournamentUsecase extends Usecase<
//   Param,
//   void
// > {
//   constructor(
//     private tournamentContract: TournamentContract,
//     private fileAdapter: FileAdapter
//   ) {
//     super();
//   }

//   call(param: Param): Observable<void> {
//     const prefixSignaturePath = `tournaments/${param.tournamentId}/main-draw/${param.nodeMatch.id}`;
//     const captainASignaturePath = `${prefixSignaturePath}/captainASignature.jpg`;
//     const captainBSignaturePath = `${prefixSignaturePath}/captainBSignature.jpg`;
//     const judgeSignaturePath = `${prefixSignaturePath}/judgeSignature.jpg`;

//     const signatures: Observable<string | undefined>[] = [
//       convertToImage(
//         param.nodeMatch.match?.captainASignature,
//         captainASignaturePath,
//         this.fileAdapter
//       ),
//       convertToImage(
//         param.nodeMatch.match?.captainBSignature,
//         captainBSignaturePath,
//         this.fileAdapter
//       ),
//       convertToImage(
//         param.nodeMatch.match?.judgeSignature,
//         judgeSignaturePath,
//         this.fileAdapter
//       ),
//     ];

//     return zip(...signatures).pipe(
//       map((data) => {
//         if (param.nodeMatch.match) {
//           param.nodeMatch.match.captainASignature = data[0];
//           param.nodeMatch.match.captainBSignature = data[1];
//           param.nodeMatch.match.judgeSignature = data[2];
//         }

//         return this.tournamentContract.editNodeMatch(
//           param.tournamentId,
//           param.nodeMatch
//         );
//       }),
//       mergeMap((x) => x)
//     );
//   }
// }
