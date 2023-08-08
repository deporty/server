import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Timestamp } from 'firebase-admin/firestore';
import { of } from 'rxjs';
import { FileAdapter } from '../../../core/file/file.adapter';
import { Mapper } from '../../../core/mapper';
import { FinancialStatementsMapper } from './financialStatements.mapper';


export class TournamentMapper extends Mapper<TournamentEntity> {
  constructor(
    private financialStatementsMapper: FinancialStatementsMapper,
    private fileAdapter: FileAdapter
  ) {
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
        from: (value: string) => {
          return this.fileAdapter.getAbsoluteHTTPUrl(value);
        },
        to: (value: string) => {
          return this.fileAdapter.getRelativeUrl(value);
        },
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
      financialStatements: {
        name: 'financial-statements',
        from: (value) => {
          return this.financialStatementsMapper.fromJson(value);
        },
      },
    };
  }
}
