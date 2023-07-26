import { of, throwError, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileAdapter } from '../../../core/file/file.adapter';
import { TeamContract } from '../../infrastructure/contracts/team.contract';
import { EditTeamUsecase } from '../edit-team/edit-team.usecase';
import { GetTeamByNameUsecase } from '../get-team-by-name/get-team-by-name.usecase';
import { CreateTeamUsecase } from './create-team.usecase';
import { TeamAlreadyExistsException } from './create-team.exceptions';
import jest from 'jest';

describe('CreateTeamUsecase', () => {
  let usecase: CreateTeamUsecase;
  let teamContractMock: jest.Mocked<TeamContract>;
  let getTeamByNameUsecaseMock: jest.Mocked<GetTeamByNameUsecase>;
  let editTeamUsecaseMock: jest.Mocked<EditTeamUsecase>;
  let fileAdapterMock: jest.Mocked<FileAdapter>;

  beforeEach(() => {
    teamContractMock = {
      save: jest.fn().mockReturnValue(of('teamId')),
    } as jest.Mocked<TeamContract>;

    getTeamByNameUsecaseMock = {
      call: jest.fn().mockReturnValue(of(undefined)),
    } as jest.Mocked<GetTeamByNameUsecase>;

    editTeamUsecaseMock = {
      call: jest.fn().mockReturnValue(of({ id: 'teamId' })),
    } as jest.Mocked<EditTeamUsecase>;

    fileAdapterMock = {
      uploadFile: jest.fn().mockReturnValue(of('fileUrl')),
    } as jest.Mocked<FileAdapter>;

    usecase = new CreateTeamUsecase(
      teamContractMock,
      getTeamByNameUsecaseMock,
      editTeamUsecaseMock,
      fileAdapterMock
    );
  });

  it('should create a new team', (done) => {
    // Arrange
    const team = {
      name: 'Test Team',
      miniShield: 'data:image/png;base64,iVBORw0KG...',
      shield: 'data:image/png;base64,iVBORw0KG...',
      description: 'This is a test team',
    };

    // Act
    const observable = usecase.call(team);

    // Assert
    observable.subscribe((result) => {
      expect(teamContractMock.save).toHaveBeenCalledWith({
        name: 'Test Team',
        description: 'This is a test team',
      });
      expect(fileAdapterMock.uploadFile).toHaveBeenCalledTimes(2);
      expect(editTeamUsecaseMock.call).toHaveBeenCalledWith({
        id: 'teamId',
        name: 'Test Team',
        miniShield: 'fileUrl',
        shield: 'fileUrl',
        description: 'This is a test team',
      });
      expect(result).toBe('teamId');
      done();
    });
  });

  it('should throw a TeamAlreadyExistsException', (done) => {
    // Arrange
    const existingTeam = { id: 'existingId', name: 'Test Team' };
    getTeamByNameUsecaseMock.call.mockReturnValue(of(existingTeam));
    const team = { name: 'Test Team' };

    // Act
    const observable = usecase.call(team);

    // Assert
    observable.subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(TeamAlreadyExistsException);
        expect(error.message).toBe('A team with name "Test Team" already exists');
        done();
      },
    });
  });

})