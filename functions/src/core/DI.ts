export type Status = 'resolved' | 'pending' | 'no-resolved';
export interface AddConfiguration {
  dependencies?: any[];
  id: string;
  kind: any;
  override?: any;
  strategy: 'singleton' | 'factory';
}

export interface AddValueConfiguration {
  id: string;
  value: any;
}

export interface SavedKindConfiguration<T> {
  constructor: Function | null;
  instanceObject: InstanceObject<T>;
}

export interface InstanceObject<T> {
  instance: any;
  status: Status;
}

export class Container {
  pending: any;
  table: {
    [index: string]: SavedKindConfiguration<any>;
  };

  constructor() {
    this.table = {};
    this.pending = [];
  }
  addAll(container: Container) {
    this.table = { ...container.table };
  }
  add(config: AddConfiguration): boolean {
    if (this.table[config.id] && this.table[config.id].constructor !== null) {
      return true;
    }
    let typeClass = config.kind;
    if (config.override) {
      typeClass = config.override;
    }

    const dependencies = this.getDependencies(config.dependencies || []);

    if (dependencies.status === 'resolved') {
      const constructor = () =>
        Reflect.construct(
          typeClass,
          dependencies.dependencies.map((x) => x.instance)
        );

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
    } else {
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

  addValue(config: AddValueConfiguration) {
    this.table[config.id] = {
      constructor: () => config.value,
      instanceObject: {
        instance: config.value,
        status: 'resolved',
      },
    };
    this.resolvePending(config);
  }

  getDependencies(dependenciesId: string[]) {
    const response: any[] = [];
    let generalStatus: Status = 'resolved';
    for (const dep of dependenciesId) {
      const instance = this.getInstance(dep);

      if (instance.status === 'no-resolved' || instance.status === 'pending') {
        generalStatus = 'pending';
      }
      response.push(instance);
    }
    return { dependencies: response, status: generalStatus };
  }

  getInstance<T>(id: string): InstanceObject<T> {
    const savedKindConfiguration: SavedKindConfiguration<T> = this.table[id];
    if (!savedKindConfiguration) {
      const temp: SavedKindConfiguration<T> = {
        constructor: null,
        instanceObject: {
          instance: null,
          status: 'no-resolved',
        },
      };
      this.table[id] = temp;

      return temp.instanceObject;
    } else {
      return savedKindConfiguration.instanceObject;
    }
  }

  removeDependencieTrigger(config: AddConfiguration | AddValueConfiguration) {
    for (const key in this.pending) {
      if (Object.prototype.hasOwnProperty.call(this.pending, key)) {
        const dependencies: any[] = this.pending[key];

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
        const dependencies: any[] = this.pending[key];
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

  resolvePending(config: AddConfiguration | AddValueConfiguration) {
    if (Object.prototype.hasOwnProperty.call(this.pending, config.id)) {
      const dependencies: any[] = this.pending[config.id];
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
        const element: any[] = this.pending[key];
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

  private addPending(
    config: AddConfiguration,
    dependencies: InstanceObject<any>[]
  ) {
    for (let i = 0; i < dependencies.length; i++) {
      const dependencyObj = dependencies[i];
      const dependencyName: string = config.dependencies
        ? config.dependencies[i]
        : null;

      if (dependencyObj.status !== 'resolved') {
        if (!this.pending[dependencyName]) {
          this.pending[dependencyName] = [];
        }
        const exist =
          (this.pending[dependencyName] as []).filter(
            (x: any) => x.id == config.id
          ).length > 0;
        if (!exist) {
          this.pending[dependencyName].push(config);
        }
      }
    }
  }
}
