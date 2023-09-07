import { Express } from 'express';
import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController } from '@scifamek-open-source/iraca/web-api';
import { AccessKeyController } from './access-key/infrastructure/access-key.controller';
import { SERVER_NAME } from './infrastructure/authorization.constants';
import { ResourceController } from './resources/infrastructure/resource.controller';
import { RoleController } from './roles/infrastructure/role.controller';

export class AuthorizationController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();
  }

  static registerEntryPoints(app: Express, container: Container) {

    app.get(`/ready`, this.readyHandler as any);

    AccessKeyController.registerEntryPoints(app, container);
    ResourceController.registerEntryPoints(app, container);
    RoleController.registerEntryPoints(app, container);
  }
}
