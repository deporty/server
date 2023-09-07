import { Express, Request, Response } from 'express';

import { GetLocationByIdUsecase, LocationDoesNotExistError } from '../domain/usecases/get-locations-by-id/get-location-by-id.usecase';
import { GetLocationsByIdsUsecase } from '../domain/usecases/get-locations-by-ids/get-locations-by-ids.usecase';

import { GetLocationsUsecase } from '../domain/usecases/get-locations/get-locations.usecase';
import { GetLocationsByRatioUsecase } from '../domain/usecases/get-locations-by-ratio/get-locations-by-ratio.usecase';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { SERVER_NAME } from './locations.constants';
import { Container } from '@scifamek-open-source/iraca/dependency-injection';

export class LocationController extends HttpController {
  constructor() {
    super();
  }

  static identifier = SERVER_NAME;

  static registerEntryPoints(app: Express, container: Container) {
    app.get(`/ready`, this.readyHandler as any);

    app.get(`/`, (request: Request, response: Response) => {
      const params = request.query;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET:SUCCESS',
        extraData: {
          entitiesName: 'locations',
        },
      };

      this.handler<GetLocationsUsecase>({
        container,
        usecaseId: 'GetLocationsUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: {
          pageSize: parseInt(params.pageSize as string),
          pageNumber: parseInt(params.pageNumber as string),
        },
      });
    });

    app.get(`/ids`, (request: Request, response: Response) => {
      const params = request.query;
      const ids = (params.ids as string)?.split(',').map((x) => x.trim());
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET:SUCCESS',
        extraData: {
          entitiesName: 'locations',
        },
      };

      this.handler<GetLocationsByIdsUsecase>({
        container,
        usecaseId: 'GetLocationsByIdsUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: ids,
      });
    });
    app.get(`/ratio`, (request: Request, response: Response) => {
      const params = request.query;
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET:SUCCESS',
        extraData: {
          entitiesName: 'locations',
        },
      };

      this.handler<GetLocationsByRatioUsecase>({
        container,
        usecaseId: 'GetLocationsByRatioUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: {
          origin: {
            latitude: parseFloat(params.latitude as string),
            longitude: parseFloat(params.longitude as string),
          },
          ratio: parseFloat(params.ratio as string),
        },
      });
    });
    app.get(`/:id`, (request: Request, response: Response) => {
      const params = request.params;
      const id = params.id;
      const config: MessagesConfiguration = {
        exceptions: {
          [LocationDoesNotExistError.id]: 'GET:ERROR',
        },
        identifier: this.identifier,
        successCode: 'GET:SUCCESS',
      };

      this.handler<GetLocationByIdUsecase>({
        container,
        usecaseId: 'GetLocationByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: id,
      });
    });
  }
}
