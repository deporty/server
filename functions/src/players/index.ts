import * as cors from 'cors';
import * as express from 'express';
import { Container } from '../core/DI';
import { PlayerController } from './infrastructure/player.controller';
import { PlayersModulesConfig } from './players-modules.config';

export function main(generalContainer: Container) {
  const app = express();
  app.use(cors());

  const ownContainer = new Container();
  ownContainer.addAll(generalContainer);

  PlayersModulesConfig.config(ownContainer);

  PlayerController.registerEntryPoints(app, ownContainer);
  return { app, controller: PlayerController.registerEntryPoints };
}
