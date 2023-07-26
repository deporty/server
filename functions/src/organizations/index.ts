import * as cors from 'cors';
import * as express from 'express';
import { Container } from '../core/DI';
import { OrganizationController } from './infrastructure/organization.controller';
import { OrganizationModulesConfig } from './organization-modules.config';
import { AuthorizationContract } from './domain/contracts/authorization.contract';
import { env } from './environments/env';
import { IsKeyPresentMiddleware } from '../core/middlewares/is-key-present.middleware';
// import { IsKeyPresentMiddleware } from '../core/middlewares/is-key-present.middleware';

export function main(generalContainer: Container) {
  const app = express();
  app.use(cors());

  const ownContainer = new Container();
  ownContainer.addAll(generalContainer);

  OrganizationModulesConfig.config(ownContainer);

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

  OrganizationController.registerEntryPoints(app, ownContainer);

  return app;
}
