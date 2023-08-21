import * as cors from 'cors';
import * as express from 'express';
import { Container } from '../core/DI';
import { NewsController } from './infrastructure/invoices.controller';
import { InvoicesModulesConfig } from './news-modules.config';

export function main(generalContainer: Container) {
  const app = express();
  app.use(cors());

  const ownContainer = new Container();
  ownContainer.addAll(generalContainer);

  InvoicesModulesConfig.config(ownContainer);

  // const middleware = ownContainer
  //   .getInstance<IsKeyPresentMiddleware>('IsKeyPresentMiddleware')
  //   .instance.getValidator();
  // app.use(middleware);
  NewsController.registerEntryPoints(app, ownContainer);

  return { app, controller: NewsController.registerEntryPoints };
}
