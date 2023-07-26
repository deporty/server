import { Container } from '../../../core/DI';
import { buildContainer } from '../../../test/factories';
import { TeamsModulesConfig } from '../../teams-modules.config';
import { CreateTeamUsecase } from './create-team.usecase';
describe('CreateTeamUsecase', () => {
  let createTeamUsecase: CreateTeamUsecase;
  let container: Container;

  beforeAll(() => {
    container = buildContainer(TeamsModulesConfig);

    createTeamUsecase =
      container.getInstance<CreateTeamUsecase>('CreateTeamUsecase');
  });
  test('Should create instance', () => {
    expect(createTeamUsecase).not.toBeNull();
  });
});
