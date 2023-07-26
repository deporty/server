import { ITeamModel } from '@deporty-org/entities/teams';
import { of } from 'rxjs';
import { DataSource } from '../../../core/datasource';
import { Container } from '../../../core/DI';
import { buildContainer } from '../../../test/factories';
import { TeamContract } from '../../team.contract';
import { TeamsModulesConfig } from '../../teams-modules.config';

describe('TeamRepository', () => {
  let container: Container;

  let teamRepository: TeamContract;
  let dataSource: DataSource<any>;

  beforeAll(() => {
    container = buildContainer(TeamsModulesConfig);

    teamRepository = container.getInstance<TeamContract>('TeamContract');
    dataSource = container.getInstance<DataSource<any>>('DataSource');
   
  });
  test('should create', () => {
    expect(teamRepository).not.toBeNull();
  });

  test('should save a team with the exact info', (done) => {
    const teamWithId = {
      id: 'id',
      name: 'string',
      athem: 'string',
      shield: 'string',
      members: [],
      agent: 'string',
    } as ITeamModel;

    const expectedId = '123456890';

    jest.spyOn(dataSource, 'save').mockImplementation((team: any) => {
      return of(expectedId);
    });

    teamRepository.save(teamWithId).subscribe((response: any) => {
      expect(response).toBe(expectedId);
      done();
    });
  });
});
