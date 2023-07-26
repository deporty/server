import express = require('express');
import { Container } from '../core/DI';
import { AccessKeyModulesConfig } from './access-key/access-key-modules.config';
import { AuthorizationModulesConfig } from './authorization-modules.config';
import { AuthorizationController } from './authorization.controller';
import cors = require('cors');
import { PermissionModulesConfig } from './permissions/permissions-modules.config';
import { ResourceModulesConfig } from './resources/resources-modules.config';
import { RoleModulesConfig } from './roles/roles-modules.config';

export function main(generalContainer: Container) {
  const app = express();
  app.use(cors());

  const ownContainer = new Container();
  ownContainer.addAll(generalContainer);

  RoleModulesConfig.config(ownContainer);
  PermissionModulesConfig.config(ownContainer);
  ResourceModulesConfig.config(ownContainer);
  AccessKeyModulesConfig.config(ownContainer);
  AuthorizationModulesConfig.config(ownContainer);

  // const middleware = ownContainer
  //   .getInstance<IsKeyPresentMiddleware>('IsKeyPresentMiddleware')
  //   .instance.getValidator();
  // app.use(middleware);

  AuthorizationController.registerEntryPoints(app, ownContainer);

  return app;
}
