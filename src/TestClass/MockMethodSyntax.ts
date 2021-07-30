import TestClass from './TestClass';

export default class MockMethodSyntax<
  ClassImpl extends ConstructorOf<ClassImpl['prototype']>
> {
  public constructor(
    private testClass: TestClass<ClassImpl>,
    private methodName: string | number | symbol
  ) {}

  public withImplementation(implementation: jest.Mock): TestClass<ClassImpl> {
    this.testClass.setMockImplementation(
      this.methodName as keyof ClassImpl['prototype'],
      implementation
    );

    return this.testClass;
  }

  public willReturn(returnValue: unknown): TestClass<ClassImpl> {
    this.testClass.setMockImplementation(
      this.methodName as keyof ClassImpl['prototype'],
      jest.fn(() => returnValue)
    );

    return this.testClass;
  }

  /**
   * @description Returns a Promise which will resolve with the specified value
   */
  public willReturnResolvedValue(returnValue: unknown): TestClass<ClassImpl> {
    this.testClass.setMockImplementation(
      this.methodName as keyof ClassImpl['prototype'],
      jest.fn(() => Promise.resolve(returnValue))
    );

    return this.testClass;
  }

  /**
   * @description Returns a Promise which will reject with the specified value
   */
  public willReturnRejectedValue(returnValue: unknown): TestClass<ClassImpl> {
    this.testClass.setMockImplementation(
      this.methodName as keyof ClassImpl['prototype'],
      jest.fn(() => Promise.reject(returnValue))
    );

    return this.testClass;
  }

  public willThrow(exception: Error): TestClass<ClassImpl> {
    this.testClass.setMockImplementation(
      this.methodName as keyof ClassImpl['prototype'],
      jest.fn(() => {
        throw exception;
      })
    );

    return this.testClass;
  }
}
