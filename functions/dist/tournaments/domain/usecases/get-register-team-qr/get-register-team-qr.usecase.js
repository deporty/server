"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRegisterTeamQRUsecase = void 0;
const qr_image_1 = require("qr-image");
const rxjs_1 = require("rxjs");
const usecase_1 = require("../../../../core/usecase");
class GetRegisterTeamQRUsecase extends usecase_1.Usecase {
    constructor() {
        super();
    }
    call(param) {
        const qrCode = (0, qr_image_1.imageSync)('https://www.example.com', { type: 'png' });
        const base64Image = qrCode.toString('base64');
        return (0, rxjs_1.of)(base64Image);
    }
}
exports.GetRegisterTeamQRUsecase = GetRegisterTeamQRUsecase;
