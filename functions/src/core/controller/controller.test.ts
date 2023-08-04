import { Observable, of } from 'rxjs';
import { BaseController } from './controller';
import { Usecase } from '../usecase';
import { Container } from '../DI';

class FakeUsecase extends Usecase<any, any> {
  call(param?: any): Observable<any> {
    return of('NULL');
  }
}
describe('Base controller functions', () => {
  const usecaseIdentifier = 'sf';
  let container: Container;

  beforeAll(() => {
    container = new Container();

    container.add({
      id: usecaseIdentifier,
      kind: FakeUsecase,
      strategy: 'singleton',
      dependencies: [],
    });

    container.addValue({
      id: 'Logger',
      value: {
        info: () => {},
      },
    });
  });
  test('should ', () => {
    const fakeResponse = {
      send: (data: any) => {},
    };

    const spy = jest.spyOn(fakeResponse, 'send');
    BaseController.handlerController(container, usecaseIdentifier, fakeResponse as any, {
      errorCodes: {},
      exceptions: {},
      identifier: '',
      successCode: '',
    });
    expect(spy).toHaveBeenCalled();
  });
});
