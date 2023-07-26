import { Express, Request, Response } from 'express';
import {
  BaseController,
  IMessagesConfiguration,
  readyHandler,
} from '../../core/controller/controller';
import { Container } from '../../core/DI';
import { GetLocationByIdUsecase } from '../domain/usecases/get-locations-by-id/get-location-by-id.usecase';
import { GetLocationsByIdsUsecase } from '../domain/usecases/get-locations-by-ids/get-locations-by-ids.usecase';

import { GetLocationsUsecase } from '../domain/usecases/get-locations/get-locations.usecase';
import { GetLocationsByRatioUsecase } from '../domain/usecases/get-locations-by-ratio/get-locations-by-ratio.usecase';

export class LocationController extends BaseController {
  constructor() {
    super();
  }

  static identifier = 'LOCATION';

  static registerEntryPoints(app: Express, container: Container) {
    app.get(`/ready`, readyHandler as any);

    app.get(`/`, (request: Request, response: Response) => {
      const params = request.query;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {},
      };

      this.handlerController<GetLocationsUsecase, any>(
        container,
        'GetLocationsUsecase',
        response,
        config,
        undefined,
        {
          pageSize: parseInt(params.pageSize as string),
          pageNumber: parseInt(params.pageNumber as string),
        }
      );
    });
    
    
    app.get(`/ids`, (request: Request, response: Response) => {
      const params = request.query;
      const ids = (params.ids as string)?.split(',').map((x) => x.trim());
      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {
          entitiesName: 'locations',
        },
      };

      this.handlerController<GetLocationsByIdsUsecase, any>(
        container,
        'GetLocationsByIdsUsecase',
        response,
        config,
        undefined,
        ids
      );
    });
    app.get(`/ratio`, (request: Request, response: Response) => {
      const params = request.query;
      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {
          entitiesName: 'locations',
        },
      };

      this.handlerController<GetLocationsByRatioUsecase, any>(
        container,
        'GetLocationsByRatioUsecase',
        response,
        config,
        undefined,
        {
          origin: {
            latitude: parseFloat(params.latitude as string),
            longitude: parseFloat(params.longitude as string),
          },
          ratio: parseFloat(params.ratio as string),
        }
      );
    });
    app.get(`/:id`, (request: Request, response: Response) => {
      const params = request.params;
      const id = params.id;
      const config: IMessagesConfiguration = {
        exceptions: {
          LocationDoesNotExistError: 'GET:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET:ERROR': '{message}',
        },
        successCode: 'GET:SUCCESS',
        extraData: {},
      };

      this.handlerController<GetLocationByIdUsecase, any>(
        container,
        'GetLocationByIdUsecase',
        response,
        config,
        undefined,
        id
      );
    });
  }
}
