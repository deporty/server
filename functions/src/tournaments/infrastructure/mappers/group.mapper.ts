import {
  FlatPointsStadistics,
  GroupEntity,
  PositionsTable,
} from '@deporty-org/entities/tournaments';
import { Mapper } from '../../../core/mapper';
import { of, zip } from 'rxjs';

export class FlatPointsStadisticsMapper extends Mapper<FlatPointsStadistics> {
  constructor() {
    super();
    this.attributesMapper = {
      playedMatches: { name: 'played-matches' },
      wonMatches: { name: 'won-matches' },
      fairPlay: { name: 'fair-play' },
      tiedMatches: { name: 'tied-matches' },
      lostMatches: { name: 'lost-matches' },
      goalsInFavor: { name: 'goals-in-favor' },
      goalsAgainst: { name: 'goals-against' },
      goalsDifference: { name: 'goals-difference' },
      goalsAgainstPerMatch: { name: 'goals-against-per-match' },
      points: { name: 'points' },
    };
  }
}
export class LinearStadisticMapper extends Mapper<any> {
  constructor(private flatPointsStadisticsMapper: FlatPointsStadisticsMapper) {
    super();
    this.attributesMapper = {
      teamId: { name: 'team-id' },
      wasByRandom: { name: 'was-by-random' },
      stadistics: {
        name: 'stadistics',
        from: (value: any) => {
          return this.flatPointsStadisticsMapper.fromJson(value);
        },
        to: (value: FlatPointsStadistics) => {
          return this.flatPointsStadisticsMapper.toJson(value);
        },
      },
    };
  }
}

export class PositionTableMapper extends Mapper<PositionsTable> {
  constructor(private linearStadisticMapper: LinearStadisticMapper) {
    super();
    this.attributesMapper = {
      table: {
        name: 'table',

        to: (values: Array<any>) => {
          return values.length > 0
            ? values.map((v) => this.linearStadisticMapper.toJson(v))
            : [];
        },
        from: (values: Array<any>) => {
          return values.length > 0
            ? zip(...values.map((v) => this.linearStadisticMapper.fromJson(v)))
            : of([]);
        },
      },

      analizedMatches: { name: 'analized-matches' },
    };
  }
}
export class GroupMapper extends Mapper<GroupEntity> {
  constructor(private positionTableMapper: PositionTableMapper) {
    super();
    this.attributesMapper = {
      id: { name: 'id' },
      fixtureStageId: { name: 'fixture-stage-id' },
      label: { name: 'label' },
      order: { name: 'order' },
      teamIds: { name: 'teams' },
      positionsTable: {
        name: 'positions-table',
        from: (value: any) => {
          return this.positionTableMapper.fromJson(value);
        },
        to: (value: PositionsTable) => {
          return this.positionTableMapper.toJson(value);
        },
      },
    };
  }
}
