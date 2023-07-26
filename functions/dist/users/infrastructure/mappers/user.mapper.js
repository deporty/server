"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class UserMapper extends mapper_1.Mapper {
    constructor(fileAdapter) {
        super();
        this.fileAdapter = fileAdapter;
        this.attributesMapper = {
            secondLastName: { name: 'second-last-name' },
            firstLastName: { name: 'first-last-name' },
            firstName: { name: 'first-name' },
            secondName: { name: 'second-name' },
            id: { name: 'id' },
            document: { name: 'document' },
            image: {
                name: 'image',
                from: (value) => {
                    return this.fileAdapter.getAbsoluteHTTPUrl(value);
                },
            },
            phone: { name: 'phone' },
            email: { name: 'email' },
            roles: { name: 'roles' },
            birthDate: { name: 'birth-date' },
        };
    }
}
exports.UserMapper = UserMapper;
