import { Response } from 'express';
import { Mapper } from '../mapper';
import { IBaseResponse } from '@deporty-org/entities/general';
import { Container } from '../DI';
import { DEFAULT_MESSAGES } from './code-responses';
import moment = require('moment');

export interface IMessagesConfiguration {
  errorCodes: {
    [index: string]: string;
  };
  exceptions: {
    [index: string]: string;
  };
  extraData?: any;
  identifier: string;
  successCode:
    | string
    | {
        [index: string]: string;
      };
}

export const readyHandler = (request: Request, response: Response) => {
  return response.status(200).json({});
};

export abstract class BaseController {
  public static handlerController<T extends { call: (param?: any) => any }, M>(
    container: Container,

    usecaseIdentifier: string,
    response: Response,
    config: IMessagesConfiguration,
    mapper?: string,
    param?: any
  ) {
    let func = null;
    if (mapper) {
      const mapperObj = container.getInstance<Mapper<M>>(mapper).instance;
      func = mapperObj.fromJson;
    }

    this.generalHandlerController<T, M>(
      container,
      usecaseIdentifier,
      param,
      func,
      response,
      config
    );
  }

  public static handlerPostController<
    T extends { call: (param?: any) => any },
    M
  >(
    container: Container,
    usecaseIdentifier: string,
    response: Response,
    config: IMessagesConfiguration,
    mapper?: string,
    param?: any
  ) {
    let func = null;
    if (mapper) {
      const mapperObj = container.getInstance<Mapper<M>>(mapper).instance;
      func = mapperObj.fromJsonWithOutId;
    }

    this.generalHandlerController<T, M>(
      container,
      usecaseIdentifier,
      param,
      func,
      response,
      config
    );
  }

  static makeErrorMessage(config: IMessagesConfiguration, error: Error) {
    const data: any = { ...error };
    
    const name = data['name'];
    let httpMessageCode = config.exceptions[name];
    let message = '';
    if (httpMessageCode) {
      message = config.errorCodes[httpMessageCode];
      message = BaseController.formatMessage(message, data);
    } else {
      httpMessageCode = 'SERVER:ERROR';
      message = DEFAULT_MESSAGES[httpMessageCode] + ' : ' + error.message;
    }
    const code = `${config.identifier}:${httpMessageCode}`;
    return {
      meta: {
        code,
        message,
      },
    } as IBaseResponse<undefined>;
  }

  private static formatMessage(message: string, data: any) {
    const keys = this.getKeys(message);
    if (keys) {
      for (const key of keys) {
        message = message.replace(`{${key}}`, data[key]);
      }
    }
    return message;
  }

  private static generalHandlerController<
    T extends { call: (param?: any) => any },
    M
  >(
    container: Container,
    usecaseIdentifier: string,
    param: any,
    func: Function | null,
    response: Response<any, Record<string, any>>,
    config: IMessagesConfiguration
  ) {
    const logger = container.getInstance<any>('Logger').instance;
    const usecase = container.getInstance<T>(usecaseIdentifier).instance;

    
    // const g = container.getInstance<T>('NodeMatchContract').instance;
    let dataRes = null;
    let params = param;
    const prev = moment();
    if (func) {
      if (param) {
        params = func(param);
        dataRes = usecase.call(params);
      } else {
        dataRes = usecase.call();
      }
    } else {
      if (param) {
        dataRes = usecase.call(param);
      } else {
        dataRes = usecase.call();
      }
    }

    dataRes.subscribe({
      next: (data: any) => {
        const final = moment();
        const rest = final.diff(prev, 'milliseconds');
        logger.info(
          `Process Time (${usecaseIdentifier}): ${rest}ms, ${rest / 1000}s`
        );
        let code = '';
        let message = '';
        if (typeof config.successCode == 'string') {
          code = `${config.identifier}:${config.successCode}`;
          message = DEFAULT_MESSAGES[config.successCode];
        } else {
          code = `${config.identifier}:${config.successCode.code}`;
          message = config.successCode.message;
        }
        message = BaseController.formatMessage(message, config.extraData);

        response.send({
          meta: {
            code,
            message,
          },
          data,
        } as IBaseResponse<any>);
        logger.info('Output ', usecaseIdentifier, new Date());
      },
      error: (error: any) => {
        console.error("*:* Error:: ", error.name, error.message);
        
        const resp = this.makeErrorMessage(config, error);
        response.send(resp);
      },
      complete: () => {},
    });
  }

  private static getKeys(message: string) {
    const pattern = '{([A-Za-z]+)}';

    const regex = new RegExp(pattern);
    return regex.exec(message);
  }
}
