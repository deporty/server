"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DI_1 = require("./DI");
class A {
}
class B {
    constructor(a) { }
}
class C {
    constructor(b) { }
    hi() {
    }
}
class D {
    constructor(a) { }
}
const container = new DI_1.Container();
container.add({
    id: 'B',
    kind: B,
    strategy: 'singleton',
    dependencies: ['A'],
});
container.add({
    id: 'C',
    kind: C,
    strategy: 'singleton',
    dependencies: ['B'],
});
container.add({
    id: 'A',
    kind: A,
    strategy: 'singleton',
    dependencies: ['obj'],
});
container.add({
    id: 'D',
    kind: D,
    strategy: 'singleton',
    dependencies: ['A'],
});
const obj = { l: 213 };
const obj2 = { l: 555 };
container.addValue({
    id: 'obj',
    value: obj,
});
container.addValue({
    id: 'obj2',
    value: obj2,
});
const g = container.getInstance('C').instance;
g.hi();
