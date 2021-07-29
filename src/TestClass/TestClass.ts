import MockMethodSyntax from './MockMethodSyntax';

class TestClass<
  ConcreteClass extends ConstructorOf<ConcreteClass['prototype']>
> {
  constructor(
    private classImpl: ConcreteClass,
    private options?: CreateTestClassOptions<ConcreteClass>
  ) {}

  public static for<T extends ConstructorOf<T['prototype']>>(
    classImpl: T,
    options?: CreateTestClassOptions<T['prototype']>
  ): TestClass<T> {
    return new TestClass<T>(classImpl, options);
  }

  public mockMethod(
    methodName: keyof ConcreteClass['prototype']
  ): MockMethodSyntax<ConcreteClass> {
    return new MockMethodSyntax(this, methodName);
  }

  public setMockImplementation(
    methodName: keyof ConcreteClass['prototype'],
    implementation: jest.Mock
  ): void {
    if (!this.options) {
      this.options = {};
    }

    if (!this.options.customMocks) {
      // @ts-ignore
      this.options.customMocks = {
        [methodName]: implementation,
      };
    } else {
      this.options.customMocks[methodName] = implementation;
    }
  }

  public getMock(): ConcreteClass['prototype'] {
    const methodsToMockMap = this.getMethodsToMockMap();
    const classImpl = this.classImpl;

    return new Proxy<ConcreteClass>(Object.create(classImpl.prototype), {
      get(
        target: ConcreteClass,
        prop: keyof ConcreteClass['prototype']
      ): unknown {
        if (Object.keys(methodsToMockMap).includes(prop as string)) {
          return methodsToMockMap[prop];
        }

        return jest.fn();
      },
    });
  }

  private getMethodsToMockMap(): {
    [key in keyof ConcreteClass['prototype']]: jest.Mock;
  } {
    let methodsToMockMap = {} as {
      [key in keyof ConcreteClass['prototype']]: jest.Mock;
    };

    const methodsToMock: Array<keyof ConcreteClass['prototype']> =
      this.getAllMethods();

    methodsToMock.forEach((method: keyof ConcreteClass['prototype']) => {
      methodsToMockMap = {
        ...methodsToMockMap,
        [method]: jest.fn(),
      };
    });

    methodsToMockMap = {
      ...methodsToMockMap,
      ...this.options?.customMocks,
    };

    return methodsToMockMap;
  }

  private getAllMethods(): string[] {
    const methods = Object.getOwnPropertyNames(this.classImpl.prototype).filter(
      m => !m.includes('constructor')
    );

    return methods;
  }
}

export default TestClass;

export interface CreateTestClassOptions<I> {
  customMocks?: {
    [key in keyof Partial<I>]: jest.Mock;
  };
}
