import { Container } from '../../../core/DI';
import { buildContainer } from '../../../test/factories';
import { TeamsModulesConfig } from '../../teams-modules.config';
import { AsignPlayerToTeamUsecase } from './asign-player-to-team.usecase';
describe('AsignPlayerToTeamUsecase', () => {
  let asignPlayerToTeamUsecase: AsignPlayerToTeamUsecase;
  let container: Container;

  beforeAll(() => {
    container = buildContainer(TeamsModulesConfig);

    asignPlayerToTeamUsecase =
      container.getInstance<AsignPlayerToTeamUsecase>('AsignPlayerToTeamUsecase');
  });
  test('Should create instance', () => {
    expect(asignPlayerToTeamUsecase).not.toBeNull();
  });
});
