"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRepository = void 0;
const axios_1 = require("axios");
const rxjs_1 = require("rxjs");
const organization_contract_1 = require("../../domain/contracts/organization.contract");
const tournaments_constants_1 = require("../tournaments.constants");
class OrganizationRepository extends organization_contract_1.OrganizationContract {
    getLocationsByRatioUsecase(origin, ratio) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${tournaments_constants_1.LOCATION_SERVER}/ratio`, {
                headers: {
                    Authorization: 'Bearer f599e916-841b-4a1b-aa0a-65fefcaadf09',
                },
                params: {
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    ratio,
                },
            })
                .then((response) => {
                const data = response.data;
                if (data.meta.code === 'LOCATION:GET:SUCCESS') {
                    observer.next(data.data);
                }
                else {
                    observer.next([]);
                }
                observer.complete();
            })
                .catch((error) => {
                observer.error(error);
            });
        });
    }
}
exports.OrganizationRepository = OrganizationRepository;
