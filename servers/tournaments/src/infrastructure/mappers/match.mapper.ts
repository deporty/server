import { formatDateFromJson } from '@deporty-org/core';
import { IScoreModel, MatchEntity, PlayerForm, Stadistics } from '@deporty-org/entities/tournaments';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { Timestamp } from 'firebase-admin/firestore';
import { of, zip } from 'rxjs';
import { PlayerFormMapper, PlayersInMatchDataMapper } from './player-form.mapper';
import { ScoreMapper } from './score.mapper';
import { StadisticsMapper } from './stadistics.mapper';
import { PlayersInMatchData } from '@deporty-org/entities/tournaments/player-form.entity';

export class RefereeInMatchMapper extends Mapper<MatchEntity> {
  constructor() {
    super();
    this.attributesMapper = {
      refereeId: { name: 'referee-id' },
      rol: { name: 'rol' },
    };
  }
}

export class MatchMapper extends Mapper<MatchEntity> {
  constructor(
    private scoreMapper: ScoreMapper,
    private playFormMapper: PlayerFormMapper,
    private playersInMatchDataMapper: PlayersInMatchDataMapper,
    private stadisticsMapper: StadisticsMapper,
    private refereeInMatchMapper: RefereeInMatchMapper
  ) {
    super();
    this.attributesMapper = {
      id: { name: 'id' },

      score: {
        name: 'score',
        to: (value: IScoreModel) => {
          return this.scoreMapper.toJson(value);
        },
        from: (value: any) => {
          return this.scoreMapper.fromJson(value);
        },
      },

      stadistics: {
        name: 'stadistics',
        to: (value: Stadistics) => {
          return value ? this.stadisticsMapper.toJson(value) : undefined;
        },
        from: (value: any) => {
          return this.stadisticsMapper.fromJson(value);
        },
      },
      playerForm: {
        name: 'player-form',
        to: (value: PlayerForm) => {
          return value ? this.playFormMapper.toJson(value) : undefined;
        },
        from: (value: any) => {
          return value ? this.playFormMapper.fromJson(value) : of(undefined);
        },
      },
      playersInMatchData: {
        name: 'players-in-match-data',
        to: (value: PlayersInMatchData) => {
          return value ? this.playersInMatchDataMapper.toJson(value) : undefined;
        },
        from: (value: any) => {
          return value ? this.playersInMatchDataMapper.fromJson(value) : of(undefined);
        },
      },
      teamAId: { name: 'team-a-id' },
      phase: { name: 'phase' },
      teamBId: { name: 'team-b-id' },
      date: {
        name: 'date',
        from: (date: Timestamp) => {
          return of(formatDateFromJson(date));
        },
      },
      observations: { name: 'observations' },
      captainASignature: {
        name: 'captain-a-signature',
      },
      captainBSignature: {
        name: 'captain-b-signature',
      },
      judgeSignature: {
        name: 'judge-signature',
      },
      status: { name: 'status' },
      locationId: { name: 'location-id' },
      refereeIds: {
        name: 'referee-ids',

        from: (value: Array<any>) => {
          return value.length > 0 ? zip(...value.map((x) => this.refereeInMatchMapper.fromJson(x))) : of([]);
        },
        to: (values: Array<any>) => {
          return values.map((x) => this.refereeInMatchMapper.toJson(x));
        },
      },
      playground: { name: 'playground' },
    };
  }
}
