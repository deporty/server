import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { FinancialStatementsMapper } from '../infrastructure/mappers/financialStatements.mapper';
import { FixtureStageMapper } from '../infrastructure/mappers/fixture-stage.mapper';
import {
  FlatPointsStadisticsMapper,
  GroupMapper,
  LinearStadisticMapper,
  PositionTableMapper,
} from '../infrastructure/mappers/group.mapper';
import { IntergroupMatchMapper } from '../infrastructure/mappers/intergroup-match.mapper';
import { MatchMapper, RefereeInMatchMapper } from '../infrastructure/mappers/match.mapper';
import { MatchesByRefereeIdMapper } from '../infrastructure/mappers/matches-by-referee-id.mapper';
import { MemberMapper } from '../infrastructure/mappers/member.mapper';
import { NodeMatchMapper } from '../infrastructure/mappers/node-match.mapper';
import { PlayerFormMapper } from '../infrastructure/mappers/player-form.mapper';
import { PlaygroundMapper } from '../infrastructure/mappers/playground.mapper';
import { RegisteredTeamMapper } from '../infrastructure/mappers/registered-teams.mapper';
import { ScoreMapper } from '../infrastructure/mappers/score.mapper';
import { StadisticSpecificationMapper, StadisticsMapper } from '../infrastructure/mappers/stadistics.mapper';
import { TournamentMapper } from '../infrastructure/mappers/tournament.mapper';

export class MapperModulesConfig {
  static config(container: Container) {
    container.add({
      id: 'ScoreMapper',
      kind: ScoreMapper,
      strategy: 'singleton',
    });
    container.add({
      id: 'MatchesByRefereeIdMapper',
      kind: MatchesByRefereeIdMapper,
      strategy: 'singleton',
    });
    container.add({
      id: 'PlaygroundMapper',
      kind: PlaygroundMapper,
      strategy: 'singleton',
    });

    container.add({
      id: 'StadisticSpecificationMapper',
      kind: StadisticSpecificationMapper,
      strategy: 'singleton',
    });
    container.add({
      id: 'StadisticsMapper',
      kind: StadisticsMapper,
      dependencies: ['StadisticSpecificationMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'PlayerFormMapper',
      kind: PlayerFormMapper,
      strategy: 'singleton',
    });
    container.add({
      id: 'RefereeInMatchMapper',
      kind: RefereeInMatchMapper,

      strategy: 'singleton',
    });

    container.add({
      id: 'MatchMapper',
      kind: MatchMapper,
      dependencies: ['ScoreMapper', 'PlayerFormMapper', 'StadisticsMapper', 'RefereeInMatchMapper', 'FileAdapter'],
      strategy: 'singleton',
    });
    container.add({
      id: 'IntergroupMatchMapper',
      kind: IntergroupMatchMapper,
      dependencies: ['MatchMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'FlatPointsStadisticsMapper',
      kind: FlatPointsStadisticsMapper,
      dependencies: [],
      strategy: 'singleton',
    });
    container.add({
      id: 'LinearStadisticMapper',
      kind: LinearStadisticMapper,
      dependencies: ['FlatPointsStadisticsMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'PositionTableMapper',
      kind: PositionTableMapper,
      dependencies: ['LinearStadisticMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'GroupMapper',
      kind: GroupMapper,
      dependencies: ['PositionTableMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'NodeMatchMapper',
      kind: NodeMatchMapper,
      dependencies: ['MatchMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'FixtureStageMapper',
      kind: FixtureStageMapper,
      dependencies: ['GroupMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'MemberMapper',
      kind: MemberMapper,
      strategy: 'singleton',
    });
    container.add({
      id: 'RegisteredTeamMapper',
      kind: RegisteredTeamMapper,
      dependencies: ['MemberMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'FinancialStatementsMapper',
      kind: FinancialStatementsMapper,
      strategy: 'singleton',
    });

    container.add({
      id: 'TournamentMapper',
      kind: TournamentMapper,
      dependencies: ['FinancialStatementsMapper', 'FileAdapter'],
      strategy: 'singleton',
    });
  }
}
