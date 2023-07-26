import { IPlayerModel } from '@deporty-org/entities/players';
import { Express, Request, Response } from 'express';
import {
  BaseController,
  IMessagesConfiguration,
} from '../../core/controller/controller';
import { Container } from '../../core/DI';
import { CreatePlayerUsecase } from '../usecases/create-player/create-player.usecase';
import { DeletePlayerUsecase } from '../usecases/delete-player/delete-player.usecase';
import { GetPlayerByDocumentUsecase } from '../usecases/get-player-by-document/get-player-by-document.usecase';

export class PlayerController extends BaseController {
  static identifier = 'PLAYER';

  constructor() {
    super();
  }

  static registerEntryPoints(app: Express, container: Container) {
    app.delete(`/:id`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: IMessagesConfiguration = {
        exceptions: {
          VariableNotDefinedException: 'DELETE:ERROR',
          PlayerDoesNotExistException: 'DELETE:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'DELETE:ERROR': '{message}',
        },
        successCode: 'DELETE:SUCCESS',
        extraData: {
          entitiesName: 'player',
        },
      };

      this.handlerController<DeletePlayerUsecase, any>(
        container,
        'DeletePlayerUsecase',
        response,
        config,
        undefined,
        id
      );
    });

    app.get(`/document/:document`, (request: Request, response: Response) => {
      const document = request.params.document;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: {
          code: 'GET:DOCUMENT:SUCCESS',
          message: 'Information for player with document {document}',
        },
        extraData: {
          document,
        },
      };

      this.handlerController<GetPlayerByDocumentUsecase, any>(
        container,
        'GetPlayerByDocumentUsecase',
        response,
        config,
        undefined,
        document
      );
    });

    app.post(`/`, (request: Request, response: Response) => {
      const player = request.body;

      const config: IMessagesConfiguration = {
        exceptions: {
          PlayerAlreadyExistsException: 'POST:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'POST:ERROR': '{message}',
        },
        successCode: {
          name: 'POST:SUCCESS',
          message: 'Player saved successfully',
        },
        extraData: {
          entitiesName: 'player',
        },
      };

      this.handlerPostController<CreatePlayerUsecase, IPlayerModel>(
        container,
        'CreatePlayerUsecase',
        response,
        config,
        'PlayerMapper',
        player
      );
    });
  }
}
