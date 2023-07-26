import { ICreatePlayerModel } from '@deporty-org/entities/players';
import { of } from 'rxjs';
import { DataSource, DataSourceFilter } from '../../../core/datasource';
import { Container } from '../../../core/DI';
import { buildContainer } from '../../../test/factories';
import { PlayerContract } from '../../player.contract';
import { PlayersModulesConfig } from '../../players-modules.config';

describe('PlayerRepository', () => {
  let container: Container;

  const playersFromDB = [
    {
      name: 'Vegeta',
      lastName: 'Sayayin',
      id: '5467892135',
      document: '1234567892',
      alias: 'Principe de los sayayins',
      number: '1',
      role: 'Principe de los sayayins',
      email: '',
      phone: '',
      image: 'https://sayan.planet.king',
      power: 45,
    },
  ];
  const ALLOWED_KEY_NUMBER = 10;

  let playerRepository: PlayerContract;
  let dataSource: DataSource<any>;

  beforeAll(() => {
    container = buildContainer(PlayersModulesConfig);

    playerRepository = container.getInstance<PlayerContract>('PlayerContract');
    dataSource = container.getInstance<DataSource<any>>('DataSource');

  });
  test('should create', () => {
    expect(playerRepository).not.toBeNull();
  });

  test('should get players by filters with the exact info', (done) => {
    jest
      .spyOn(dataSource, 'getByFilter')
      .mockImplementation((filters: DataSourceFilter[]) => {
        return of(playersFromDB);
      });
    playerRepository.getByFilter([]).subscribe((response) => {
      for (const item of response) {
        const keys = Object.keys(item);
        expect(keys.length).toBe(ALLOWED_KEY_NUMBER);
      }
      expect(response.length).toBe(playersFromDB.length);

      done();
    });
  });

  test('should get players with the exact info', (done: any) => {
    jest
      .spyOn(dataSource, 'getByFilter')
      .mockImplementation((filters: DataSourceFilter[]) => {
        return of(playersFromDB);
      });
    playerRepository.getPlayers().subscribe((response) => {
      for (const item of response) {
        const keys = Object.keys(item);
        expect(keys.length).toBe(ALLOWED_KEY_NUMBER);
      }
      expect(response.length).toBe(playersFromDB.length);

      done();
    });
  });

  test('should save a player with the exact info', (done) => {
    const playerWithId = {
      name: 'Vegeta',
      lastName: 'Sayayin',
      document: '1234567892',
      alias: 'Principe de los sayayins',
      number: 1,
      role: 'Principe de los sayayins',
      image: 'https://sayan.planet.king',
    } as ICreatePlayerModel;

    const expectedId = '123456890';

    jest.spyOn(dataSource, 'save').mockImplementation((player: any) => {
      return of(expectedId);
    });

    playerRepository.save(playerWithId).subscribe((response) => {
      expect(response).toBe(expectedId);
      done();
    });
  });
});
