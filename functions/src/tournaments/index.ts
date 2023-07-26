import * as cors from 'cors';
import * as express from 'express';
import { Container } from '../core/DI';
import { TournamentController } from './infrastructure/tournament.controller';
import { TournamentsModulesConfig } from './tournaments-modules.config';
import { IsKeyPresentMiddleware } from '../core/middlewares/is-key-present.middleware';
import { env } from './environments/env';
import { AuthorizationContract } from './domain/contracts/authorization.contract';
import { IsAuthorizedUserMiddleware } from '../core/middlewares/is-authorized-user.middleware';

export function main(generalContainer: Container) {
  const app = express();
  app.use(cors());

  const ownContainer = new Container();
  ownContainer.addAll(generalContainer);

  TournamentsModulesConfig.config(ownContainer);

  ownContainer.addValue({
    id: 'is-key-present-flag',
    value: env.middlewares['is-key-present'],
  });

  const authorizationContract: AuthorizationContract =
    ownContainer.getInstance<AuthorizationContract>(
      'AuthorizationContract'
    ).instance;

  ownContainer.addValue({
    id: 'IsAValidAccessKeyFunction',
    value: (key: string) => {
      return authorizationContract.isAValidAccessKey(key);
    },
  });

  ownContainer.add({
    id: 'IsKeyPresentMiddleware',
    kind: IsKeyPresentMiddleware,
    dependencies: ['IsAValidAccessKeyFunction', 'is-key-present-flag'],
    strategy: 'singleton',
  });

  ownContainer.addValue({
    id: 'is-authorized-user-flag',
    value: env.middlewares['is-authorized-user'],
  });

  ownContainer.add({
    id: 'IsAuthorizedUserMiddleware',
    kind: IsAuthorizedUserMiddleware,
    strategy: 'singleton',
    dependencies: ['is-authorized-user-flag'],
  });

  const middleware = ownContainer
    .getInstance<IsKeyPresentMiddleware>('IsKeyPresentMiddleware')
    .instance.getValidator();

  app.use(middleware);

  TournamentController.registerEntryPoints(app, ownContainer);

  return app;
}
