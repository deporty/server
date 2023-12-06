import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Timestamp } from 'firebase-admin/firestore';
import { of } from 'rxjs';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { FinancialStatementsMapper } from './financialStatements.mapper';
import { TournamentLayoutMapper } from './tournament-layout.mapper';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';

export class TournamentMapper extends Mapper<TournamentEntity> {
  constructor(private financialStatementsMapper: FinancialStatementsMapper, private tournamentLayoutMapper: TournamentLayoutMapper) {
    super();
    this.attributesMapper = {
      id: { name: 'id' },
      name: { name: 'name' },
      edition: { name: 'edition' },
      schema: { name: 'schema' },
      year: { name: 'year' },
      version: { name: 'version' },
      podium: { name: 'podium' },
      refereeIds: { name: 'referee-ids' },
      flayer: {
        name: 'flayer',
      },
      locations: { name: 'locations', default: [] },
      category: { name: 'category' },
      reward: { name: 'reward' },
      status: { name: 'status' },
      inscription: { name: 'inscription' },
      startsDate: {
        name: 'starts-date',
        from: (date: Timestamp) => (date ? of(date.toDate()) : of(date)),
      },
      organizationId: { name: 'organization-id' },
      tournamentLayoutId: { name: 'tournament-layout-id' },
      tournamentLayout: {
        name: 'tournament-layout',
        from: (value) => {
          return value ? this.tournamentLayoutMapper.fromJson(value) : of(undefined);
        },
        to: (value: TournamentLayoutEntity | undefined) => {
          
          return value ? this.tournamentLayoutMapper.toJson(value) : undefined;
        },
      },
      requestRequiredDocs: { name: 'request-required-docs', default: false },
      financialStatus: {
        name: 'financial-status',
        default: 'paid',
      },
      financialStatements: {
        name: 'financial-statements',
        from: (value) => {
          return this.financialStatementsMapper.fromJson(value);
        },
      },
    };
  }
}
