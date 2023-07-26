import * as cors from 'cors';
import * as express from 'express';
import { Container } from '../core/DI';

import { TeamController } from './infrastructure/team.controller';
import { TeamsModulesConfig } from './teams-modules.config';
import { AuthorizationContract } from './domain/contracts/authorization.contract';
import { env } from './environments/env';
import { IsKeyPresentMiddleware } from '../core/middlewares/is-key-present.middleware';
import { IsAuthorizedUserMiddleware } from '../core/middlewares/is-authorized-user.middleware';

export function main(generalContainer: Container) {
  const app = express();

  app.use(cors());

  const ownContainer = new Container();
  ownContainer.addAll(generalContainer);

  TeamsModulesConfig.config(ownContainer);

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

  TeamController.registerEntryPoints(app, ownContainer);
  return app;
}
