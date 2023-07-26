"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = exports.readyHandler = void 0;
const code_responses_1 = require("./code-responses");
const moment = require("moment");
const readyHandler = (request, response) => {
    return response.status(200).json({});
};
exports.readyHandler = readyHandler;
class BaseController {
    static handlerController(container, usecaseIdentifier, response, config, mapper, param) {
        let func = null;
        if (mapper) {
            const mapperObj = container.getInstance(mapper).instance;
            func = mapperObj.fromJson;
        }
        this.generalHandlerController(container, usecaseIdentifier, param, func, response, config);
    }
    static handlerPostController(container, usecaseIdentifier, response, config, mapper, param) {
        let func = null;
        if (mapper) {
            const mapperObj = container.getInstance(mapper).instance;
            func = mapperObj.fromJsonWithOutId;
        }
        this.generalHandlerController(container, usecaseIdentifier, param, func, response, config);
    }
    static makeErrorMessage(config, error) {
        const data = Object.assign({}, error);
        const name = data['name'];
        let httpMessageCode = config.exceptions[name];
        let message = '';
        if (httpMessageCode) {
            message = config.errorCodes[httpMessageCode];
            message = BaseController.formatMessage(message, data);
        }
        else {
            httpMessageCode = 'SERVER:ERROR';
            message = code_responses_1.DEFAULT_MESSAGES[httpMessageCode] + ' : ' + error.message;
        }
        const code = `${config.identifier}:${httpMessageCode}`;
        return {
            meta: {
                code,
                message,
            },
        };
    }
    static formatMessage(message, data) {
        const keys = this.getKeys(message);
        if (keys) {
            for (const key of keys) {
                message = message.replace(`{${key}}`, data[key]);
            }
        }
        return message;
    }
    static generalHandlerController(container, usecaseIdentifier, param, func, response, config) {
        const logger = container.getInstance('Logger').instance;
        const usecase = container.getInstance(usecaseIdentifier).instance;
        // const g = container.getInstance<T>('NodeMatchContract').instance;
        let dataRes = null;
        let params = param;
        const prev = moment();
        if (func) {
            if (param) {
                params = func(param);
                dataRes = usecase.call(params);
            }
            else {
                dataRes = usecase.call();
            }
        }
        else {
            if (param) {
                dataRes = usecase.call(param);
            }
            else {
                dataRes = usecase.call();
            }
        }
        dataRes.subscribe({
            next: (data) => {
                const final = moment();
                const rest = final.diff(prev, 'milliseconds');
                logger.info(`Process Time (${usecaseIdentifier}): ${rest}ms, ${rest / 1000}s`);
                let code = '';
                let message = '';
                if (typeof config.successCode == 'string') {
                    code = `${config.identifier}:${config.successCode}`;
                    message = code_responses_1.DEFAULT_MESSAGES[config.successCode];
                }
                else {
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
                });
                logger.info('Output ', usecaseIdentifier, new Date());
            },
            error: (error) => {
                console.error("*:* Error:: ", error.name, error.message);
                const resp = this.makeErrorMessage(config, error);
                response.send(resp);
            },
            complete: () => { },
        });
    }
    static getKeys(message) {
        const pattern = '{([A-Za-z]+)}';
        const regex = new RegExp(pattern);
        return regex.exec(message);
    }
}
exports.BaseController = BaseController;
