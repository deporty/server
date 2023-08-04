import { of, zip } from 'rxjs';
import { FileAdapter } from '../../../core/file/file.adapter';
import { Mapper } from '../../../core/mapper';
import {
  DEFAULT_FIXTURE_STAGES_CONFIGURATION,
  DEFAULT_NEGATIVE_POINTS_PER_CARD_CONFIGURATION,
  DEFAULT_POINTS_CONFIGURATION_CONFIGURATION,
  DEFAULT_SCHEMAS_CONFIGURATION,
  DEFAULT_STADISTIS_KIND_CONFIGURATION,
  DEFAULT_TIE_BREAKING_ORDER_CONFIGURATION,
  FixtureStageConfiguration,
  FixtureStagesConfiguration,
  NegativePointsPerCard,
  PointsConfiguration,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';

export class SchemaMapper extends Mapper<any> {
  constructor(private fixtureStageConfigurationMapper: FixtureStageConfigurationMapper) {
    super();

    this.attributesMapper = {
      name: {
        name: 'name',
      },

      stages: {
        name: 'stages',
        default: [],
        from: (value: any[]) => {
          return value.length > 0 ? zip(...value.map((x) => this.fixtureStageConfigurationMapper.fromJson(x))) : of([]);
        },
        to: (value: FixtureStageConfiguration[]) => {
          return value.map((x) => this.fixtureStageConfigurationMapper.toJson(x));
        },
      },
    };
  }
}
export class FixtureStageConfigurationMapper extends Mapper<FixtureStageConfiguration> {
  constructor() {
    super();

    this.attributesMapper = {
      passedTeamsCount: {
        name: 'passed-teams-count',
      },
      groupCount: {
        name: 'group-count',
      },
      groupSize: {
        name: 'group-size',
      },
    };
  }
}

export class PointsConfigurationMapper extends Mapper<PointsConfiguration> {
  constructor() {
    super();
    this.attributesMapper = {
      wonMatchPoints: {
        name: 'won-match-points',
      },
      tieMatchPoints: {
        name: 'tie-match-points',
      },
      lostMatchPoints: {
        name: 'lost-match-points',
      },
    };
  }
}

export class NegativePointsPerCardMapper extends Mapper<NegativePointsPerCard> {
  constructor() {
    super();
    this.attributesMapper = {
      yellowCardsNegativePoints: {
        name: 'yellow-cards-negative-points',
      },
      redCardsNegativePoints: {
        name: 'red-cards-negative-points',
      },
    };
  }
}

export class FixtureStagesConfigurationMapper extends Mapper<FixtureStagesConfiguration> {
  constructor(
    private negativePointsPerCardMapper: NegativePointsPerCardMapper,
    private pointsConfigurationMapper: PointsConfigurationMapper,
    private schemaMapper: SchemaMapper
  ) {
    super();
    this.attributesMapper = {
      negativePointsPerCard: {
        name: 'negative-points-per-card',
        default: DEFAULT_NEGATIVE_POINTS_PER_CARD_CONFIGURATION,
        from: (value: any) => {
          return this.negativePointsPerCardMapper.fromJson(value);
        },
        to: (value: NegativePointsPerCard) => {
          return this.negativePointsPerCardMapper.toJson(value);
        },
      },
      schemas: {
        name: 'schemas',
        default: DEFAULT_SCHEMAS_CONFIGURATION,
        from: (value: any[]) => {
          return value.length > 0 ? zip(...value.map((x) => this.schemaMapper.fromJson(x))) : of([]);
        },
        to: (value: any[]) => {
          return value.map((x) => this.schemaMapper.toJson(x));
        },
      },
      pointsConfiguration: {
        name: 'points-configuration',
        default: DEFAULT_POINTS_CONFIGURATION_CONFIGURATION,
        from: (value: any) => {
          return this.pointsConfigurationMapper.fromJson(value);
        },
        to: (value: PointsConfiguration) => {
          return this.pointsConfigurationMapper.toJson(value);
        },
      },
      stadisticsOrder: {
        name: 'stadistics-order',
        default: DEFAULT_STADISTIS_KIND_CONFIGURATION,
      },
      tieBreakingOrder: {
        name: 'tie-breaking-order',
        default: DEFAULT_TIE_BREAKING_ORDER_CONFIGURATION,
      },
    };
  }
}
export class TournamentLayoutMapper extends Mapper<TournamentLayoutEntity> {
  constructor(private fileAdapter: FileAdapter, private fixtureStagesConfigurationMapper: FixtureStagesConfigurationMapper) {
    super();
    this.attributesMapper = {
      categories: { name: 'categories' },
      description: { name: 'description' },
      passedTeamsCount: { name: 'passed-teams-count' },
      editions: { name: 'editions' },
      name: { name: 'name' },
      organizationId: { name: 'organization-id' },
      registeredTeamsVisibleStatus: { name: 'registered-teams-visible-status' },
      fixtureStagesConfiguration: {
        name: 'fixture-stages-configuration',
        default: DEFAULT_FIXTURE_STAGES_CONFIGURATION,
        from: (value: any) => {
          return this.fixtureStagesConfigurationMapper.fromJson(value);
        },
        to: (value: FixtureStagesConfiguration) => {
          console.log('Layout::: ', value);

          return this.fixtureStagesConfigurationMapper.toJson(value);
        },
      },
      flayer: {
        name: 'flayer',
        from: (value: string) => {
          return value ? this.fileAdapter.getAbsoluteHTTPUrl(value) : of(undefined);
        },
        to: (value: string) => {
          return value ? this.fileAdapter.getRelativeUrl(value) : of(undefined);
        },
      },
      id: { name: 'id' },
    };
  }
}
