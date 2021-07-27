import MockMethodSyntax from './MockMethodSyntax';

class TestClass<
  ClassImpl extends Record<string, any>,
  ClassInterface extends Record<string, any>
> {
  constructor(
    private classImpl: { new (): ClassImpl },
    private options?: CreateTestClassOptions<ClassInterface>
  ) {}

  public static for<
    T extends Record<string, any>,
    I extends Record<string, any>
  >(
    classImpl: { new (...args: any[]): T },
    options?: CreateTestClassOptions<I>
  ): TestClass<T, I> {
    return new TestClass<T, I>(classImpl, options);
  }

  public mockMethod(
    methodName: keyof Partial<ClassInterface>
  ): MockMethodSyntax<ClassImpl, ClassInterface> {
    return new MockMethodSyntax(this, methodName);
  }

  public setMockImplementation(
    methodName: keyof Partial<ClassInterface>,
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

  public getMock(): ClassImpl {
    const methodsToMockMap = this.getMethodsToMockMap();

    return new Proxy<ClassImpl>(Object.create({}), {
      get(target: ClassImpl, prop: string | symbol): jest.Mock {
        if (Object.keys(methodsToMockMap).includes(prop as string)) {
          return methodsToMockMap[prop as keyof ClassInterface];
        }

        return jest.fn();
      },
    });
  }

  /**
   * @deprecated use static for() instead
   */
  public static testClassFor<
    T extends Record<string, any>,
    I extends Record<string, any>
  >(
    instance: T,
    options?: CreateTestClassOptions<I>
  ): TestClassStructure<T, I> {
    let methodsToMockMap = {} as {
      [key in keyof I]: jest.Mock;
    };

    const methodsToMock: Array<keyof I> = this.getAllMethodsFromInstance<T>(
      instance
    ) as Array<keyof I>;
    const customMocks:
      | {
          [key in keyof Partial<I>]: jest.Mock;
        }
      | undefined = options?.customMocks;

    methodsToMock.forEach((method: keyof I) => {
      methodsToMockMap = {
        ...methodsToMockMap,
        [method]: jest.fn(),
      };
    });

    methodsToMockMap = {
      ...methodsToMockMap,
      ...customMocks,
    };

    return {
      instance: new Proxy<T>(instance, {
        get(target: T, prop: string): jest.Mock {
          if (methodsToMock.includes(prop)) {
            return methodsToMockMap[prop];
          }

          return jest.fn();
        },
      }),
      methodsToMockMap,
    };
  }

  private getMethodsToMockMap(): {
    [key in keyof ClassInterface]: jest.Mock;
  } {
    let methodsToMockMap = {} as {
      [key in keyof ClassInterface]: jest.Mock;
    };

    const methodsToMock: Array<keyof ClassInterface> =
      this.getAllMethods() as Array<keyof ClassInterface>;
    const customMocks:
      | {
          [key in keyof Partial<ClassInterface>]: jest.Mock;
        }
      | undefined = this.options?.customMocks;

    methodsToMock.forEach((method: keyof ClassInterface) => {
      methodsToMockMap = {
        ...methodsToMockMap,
        [method]: jest.fn(),
      };
    });

    methodsToMockMap = {
      ...methodsToMockMap,
      ...customMocks,
    };

    return methodsToMockMap;
  }

  private getAllMethods(): string[] {
    return Object.getOwnPropertyNames(this.classImpl.prototype).filter(
      m => !m.includes('constructor')
    );
  }

  private static getAllMethodsFromInstance<T>(instance: T): string[] {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).filter(
      (m: string) => m !== 'constructor'
    );
  }
}

export default TestClass;

interface TestClassStructure<T, I> {
  instance: T;
  methodsToMockMap: {
    [key in keyof I]: jest.Mock;
  };
}

export interface CreateTestClassOptions<I> {
  customMocks?: {
    [key in keyof Partial<I>]: jest.Mock;
  };
}
