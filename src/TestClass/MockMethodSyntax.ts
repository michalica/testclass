import TestClass from './TestClass';

export default class MockMethodSyntax<
  A extends Record<string, unknown>,
  B extends Record<string, unknown>
> {
  public constructor(
    private testClass: TestClass<A, B>,
    private methodName: string | number | symbol
  ) {}

  public withImplementation(implementation: jest.Mock): TestClass<A, B> {
    this.testClass.setMockImplementation(
      this.methodName as keyof B,
      implementation
    );

    return this.testClass;
  }

  public willReturn(returnValue: unknown): TestClass<A, B> {
    this.testClass.setMockImplementation(
      this.methodName as keyof B,
      jest.fn(() => returnValue)
    );

    return this.testClass;
  }

  /**
   * @description Returns a Promise which will resolve with the specified value
   */
  public willReturnResolvedValue(returnValue: unknown): TestClass<A, B> {
    this.testClass.setMockImplementation(
      this.methodName as keyof B,
      jest.fn(() => Promise.resolve(returnValue))
    );

    return this.testClass;
  }

  /**
   * @description Returns a Promise which will reject with the specified value
   */
  public willReturnRejectedValue(returnValue: unknown): TestClass<A, B> {
    this.testClass.setMockImplementation(
      this.methodName as keyof B,
      jest.fn(() => Promise.reject(returnValue))
    );

    return this.testClass;
  }

  public willThrow(exception: Error): TestClass<A, B> {
    this.testClass.setMockImplementation(
      this.methodName as keyof B,
      jest.fn(() => {
        throw exception;
      })
    );

    return this.testClass;
  }
}
