"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
class Container {
    constructor() {
        this.table = {};
        this.pending = [];
    }
    addAll(container) {
        this.table = Object.assign({}, container.table);
    }
    add(config) {
        if (this.table[config.id] && this.table[config.id].constructor !== null) {
            return true;
        }
        let typeClass = config.kind;
        if (config.override) {
            typeClass = config.override;
        }
        const dependencies = this.getDependencies(config.dependencies || []);
        if (dependencies.status === 'resolved') {
            const constructor = () => Reflect.construct(typeClass, dependencies.dependencies.map((x) => x.instance));
            this.table[config.id] = {
                constructor,
                instanceObject: {
                    instance: constructor(),
                    status: 'resolved',
                },
            };
            this.removeDependencieTrigger(config);
            this.resolvePending(config);
            this.removeEmptyPendings();
            return true;
        }
        else {
            this.addPending(config, dependencies.dependencies);
            this.table[config.id] = {
                constructor: null,
                instanceObject: {
                    instance: null,
                    status: 'pending',
                },
            };
            return false;
        }
    }
    addValue(config) {
        this.table[config.id] = {
            constructor: () => config.value,
            instanceObject: {
                instance: config.value,
                status: 'resolved',
            },
        };
        this.resolvePending(config);
    }
    getDependencies(dependenciesId) {
        const response = [];
        let generalStatus = 'resolved';
        for (const dep of dependenciesId) {
            const instance = this.getInstance(dep);
            if (instance.status === 'no-resolved' || instance.status === 'pending') {
                generalStatus = 'pending';
            }
            response.push(instance);
        }
        return { dependencies: response, status: generalStatus };
    }
    getInstance(id) {
        const savedKindConfiguration = this.table[id];
        if (!savedKindConfiguration) {
            const temp = {
                constructor: null,
                instanceObject: {
                    instance: null,
                    status: 'no-resolved',
                },
            };
            this.table[id] = temp;
            return temp.instanceObject;
        }
        else {
            return savedKindConfiguration.instanceObject;
        }
    }
    removeDependencieTrigger(config) {
        for (const key in this.pending) {
            if (Object.prototype.hasOwnProperty.call(this.pending, key)) {
                const dependencies = this.pending[key];
                for (let i = 0; i < dependencies.length; i++) {
                    const dep = dependencies[i];
                    if (dep.id == config.id) {
                        dependencies.splice(i, 1);
                    }
                }
            }
        }
    }
    removeEmptyPendings() {
        for (const key in this.pending) {
            if (Object.prototype.hasOwnProperty.call(this.pending, key)) {
                const dependencies = this.pending[key];
                const toDelete = [];
                for (let i = 0; i < dependencies.length; i++) {
                    const dep = dependencies[i];
                    if (dependencies.length == 0) {
                        toDelete.push(dep);
                    }
                }
                for (const tod of toDelete) {
                    delete this.pending[tod];
                }
            }
        }
    }
    resolvePending(config) {
        if (Object.prototype.hasOwnProperty.call(this.pending, config.id)) {
            const dependencies = this.pending[config.id];
            for (let i = 0; i < dependencies.length; i++) {
                const key = dependencies[i];
                const res = this.add(key);
                if (res) {
                    dependencies.splice(i, 1);
                }
            }
        }
    }
    resolvePendings() {
        for (const key in this.pending) {
            if (Object.prototype.hasOwnProperty.call(this.pending, key)) {
                const element = this.pending[key];
                for (let i = 0; i < element.length; i++) {
                    const key = element[i];
                    const res = this.add(key);
                    if (res) {
                        element.splice(i, 1);
                    }
                }
            }
        }
    }
    addPending(config, dependencies) {
        for (let i = 0; i < dependencies.length; i++) {
            const dependencyObj = dependencies[i];
            const dependencyName = config.dependencies
                ? config.dependencies[i]
                : null;
            if (dependencyObj.status !== 'resolved') {
                if (!this.pending[dependencyName]) {
                    this.pending[dependencyName] = [];
                }
                const exist = this.pending[dependencyName].filter((x) => x.id == config.id).length > 0;
                if (!exist) {
                    this.pending[dependencyName].push(config);
                }
            }
        }
    }
}
exports.Container = Container;
