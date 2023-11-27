import { Id } from '@deporty-org/entities';
import { IntergroupMatchEntity, PositionsTable } from '@deporty-org/entities/tournaments';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { IntergroupMatchContract } from '../../../contracts/intergroup-match.contract';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { CalculatePositionTableOfGroupUsecase } from '../../calculate-position-table-of-group/calculate-position-table-of-group.usecase';
import { GetTournamentByIdUsecase } from '../../get-tournament-by-id/get-tournament-by-id.usecase';
import { GetIntergroupMatchByIdUsecase } from '../get-intergroup-match-by-id/get-intergroup-match-by-id.usecase';

export interface Response {
  intergroupMatch: IntergroupMatchEntity;
  positionsTable: { [index: Id]: PositionsTable };
}

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  intergroupMatch: IntergroupMatchEntity;
}

export class EditIntergroupMatchUsecase extends Usecase<Param, Response> {
  constructor(
    private intergroupMatchContract: IntergroupMatchContract,
    private getIntergroupMatchByIdUsecase: GetIntergroupMatchByIdUsecase,
    private fileAdapter: FileAdapter,
    private calculatePositionTableOfGroupUsecase: CalculatePositionTableOfGroupUsecase,
    private getTournamentByIdUsecase: GetTournamentByIdUsecase
  ) {
    super();
  }
  convertToImage(signature: string | undefined, path: string, fileAdapter: FileAdapter) {
    if (!!signature && signature.startsWith('data:image')) {
      return fileAdapter.uploadFile(path, signature).pipe(map(() => path));
    }
    return of(signature);
  }
  call(param: Param): Observable<Response> {
    const prefixSignaturePath = `tournaments/${param.tournamentId}/stages/${param.fixtureStageId}/intergroups/matches/${param.intergroupMatch.id}`;
    const captainASignaturePath = `${prefixSignaturePath}/captainASignature.jpg`;
    const captainBSignaturePath = `${prefixSignaturePath}/captainBSignature.jpg`;
    const judgeSignaturePath = `${prefixSignaturePath}/judgeSignature.jpg`;

    const signatures: Observable<string | undefined>[] = [
      this.convertToImage(param.intergroupMatch.match['captainASignature'], captainASignaturePath, this.fileAdapter),
      this.convertToImage(param.intergroupMatch.match['captainBSignature'], captainBSignaturePath, this.fileAdapter),
      this.convertToImage(param.intergroupMatch.match['judgeSignature'], judgeSignaturePath, this.fileAdapter),
    ];

    const $prevMatch = this.getIntergroupMatchByIdUsecase.call({
      fixtureStageId: param.fixtureStageId,
      intergroupMatchId: param.intergroupMatch.id!,
      tournamentId: param.tournamentId,
    });
    return zip(signatures[0], signatures[1], signatures[2], $prevMatch).pipe(
      mergeMap((data) => {
        param.intergroupMatch.match.captainASignature = data[0];
        param.intergroupMatch.match.captainBSignature = data[1];
        param.intergroupMatch.match.judgeSignature = data[2];
        const toSave = {
          ...data[3],
          match: param.intergroupMatch.match,
        };

        return this.intergroupMatchContract
          .update(
            {
              fixtureStageId: param.fixtureStageId,
              tournamentId: param.tournamentId,
            },
            toSave
          )
          .pipe(
            map((data) => {
              return toSave;
            })
          );
      }),
      mergeMap((match) => {
        return zip(
          of(match),

          this.getTournamentByIdUsecase.call(param.tournamentId)
        );
      }),
      mergeMap(([match, tournament]) => {
        return zip(
          this.calculatePositionTableOfGroupUsecase
            .call({
              fixtureStageId: param.fixtureStageId,
              groupId: match.teamAGroupId,
              organizationId: tournament.organizationId,
              tournamentLayoutId: tournament.tournamentLayoutId,
              tournamentId: param.tournamentId,
            })
            .pipe(
              map((data) => {
                return { groupId: match.teamAGroupId, positionsTable: data };
              })
            ),
          this.calculatePositionTableOfGroupUsecase
            .call({
              fixtureStageId: param.fixtureStageId,
              groupId: match.teamBGroupId,
              organizationId: tournament.organizationId,
              tournamentLayoutId: tournament.tournamentLayoutId,
              tournamentId: param.tournamentId,
            })
            .pipe(
              map((data) => {
                return { groupId: match.teamBGroupId, positionsTable: data };
              })
            ),

          of(match)
        );
      }),
      map(([positionTableA, positionTableB, match]) => {
        return {
          intergroupMatch: match,
          positionsTable: {
            [positionTableA['groupId']]: positionTableA['positionsTable'],
            [positionTableB['groupId']]: positionTableB['positionsTable'],
          },
        };
      })
    );
  }
}
