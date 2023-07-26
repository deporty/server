import { Container } from '../../../core/DI';
import { VariableNotDefinedException } from '../../../core/exceptions';
import { buildContainer } from '../../../test/factories';
import { TeamsModulesConfig } from '../../teams-modules.config';
import { DeleteTeamUsecase } from './delete-team.usecase';

describe('DeleteTeamUsecase', () => {
  let deleteTeamUsecase: DeleteTeamUsecase;
  let container: Container;

  beforeAll(() => {
    container = buildContainer(TeamsModulesConfig);

    deleteTeamUsecase = container.getInstance(
      'DeleteTeamUsecase'
    );
  });
  test('Should create instance', () => {
    expect(deleteTeamUsecase).not.toBeNull();
  });

  test('Should throw a VariableNotDefinedException exception when the id is empty', (done) => {
    const response = deleteTeamUsecase.call('');
    response.subscribe({
      error: (err: any) => {
        expect(err).toBeInstanceOf(VariableNotDefinedException);
        done();
      },
    });
  });
});
