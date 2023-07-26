import { Container } from '../../../core/DI';
import { VariableNotDefinedException } from '../../../core/exceptions';
import { buildContainer } from '../../../test/factories';
import { PlayersModulesConfig } from '../../players-modules.config';
import { DeletePlayerUsecase } from './delete-player.usecase';

describe('DeletePlayerUsecase', () => {
  let deletePlayerUsecase: DeletePlayerUsecase;
  let container: Container;

  beforeAll(() => {
    container = buildContainer(PlayersModulesConfig);

    deletePlayerUsecase = container.getInstance(
      'DeletePlayerUsecase'
    );
  });
  test('Should create instance', () => {
    expect(deletePlayerUsecase).not.toBeNull();
  });

  test('Should throw a VariableNotDefinedException exception when the id is empty', (done) => {
    const response = deletePlayerUsecase.call('');
    response.subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(VariableNotDefinedException);
        done();
      },
    });
  });
});
