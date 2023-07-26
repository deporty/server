import * as cors from 'cors';
import * as express from 'express';
import { Container } from '../core/DI';
import { UserController } from './infrastructure/user.controller';
import { UserModulesConfig } from './users-modules.config';
import { env } from './environments/env';
import { AuthorizationContract } from './domain/contracts/authorization.contract';
import { IsKeyPresentMiddleware } from '../core/middlewares/is-key-present.middleware';

export function main(generalContainer: Container) {
  const app = express();
  app.use(cors());

  const ownContainer = new Container();
  ownContainer.addAll(generalContainer);

  UserModulesConfig.config(ownContainer);


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

  const middleware = ownContainer
    .getInstance<IsKeyPresentMiddleware>('IsKeyPresentMiddleware')
    .instance.getValidator();

  app.use(middleware);
  UserController.registerEntryPoints(app, ownContainer);

  return app;
}
