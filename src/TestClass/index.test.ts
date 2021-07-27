import TestClass from './TestClass';

interface ClassToTestInterface {
  method1(): null;
  method2(): null;
  method3(): null;
}

class ClassToTest implements ClassToTestInterface {
  public method1(): null {
    return null;
  }

  public method2(): null {
    return null;
  }

  public method3(): null {
    return null;
  }
}

describe('assertion testing', () => {
  it('should create an instance', () => {
    const testClass = TestClass.for<ClassToTest, ClassToTestInterface>(
      ClassToTest
    );

    expect(testClass).toBeInstanceOf(TestClass);
  });

  it('should return correct mock', () => {
    const testClass = TestClass.for<ClassToTest, ClassToTestInterface>(
      ClassToTest
    ).getMock();

    expect(testClass.method1.toString()).toEqual(jest.fn().toString());
    expect(testClass.method2.toString()).toEqual(jest.fn().toString());
    expect(testClass.method3.toString()).toEqual(jest.fn().toString());
  });

  it('should return correct custom mock', () => {
    const method1 = jest.fn(() => 1);
    const testClass = TestClass.for<ClassToTest, ClassToTestInterface>(
      ClassToTest,
      {
        customMocks: {
          method1: method1,
        },
      }
    ).getMock();

    expect(testClass.method1).toEqual(method1);
  });

  it('should return all mocks', () => {
    const { instance, methodsToMockMap } = TestClass.testClassFor<
      ClassToTest,
      ClassToTestInterface
    >(new ClassToTest());
    expect(instance.method1).toBe(methodsToMockMap.method1);
    expect(instance.method2).toBe(methodsToMockMap.method2);
    expect(instance.method3).toBe(methodsToMockMap.method3);
  });

  it('should return custom mock', () => {
    const mock = jest.fn();

    const { instance, methodsToMockMap } = TestClass.testClassFor<
      ClassToTest,
      ClassToTestInterface
    >(new ClassToTest(), {
      customMocks: {
        method1: mock,
      },
    });

    expect(instance.method1).toBe(mock);
    expect(methodsToMockMap.method1).toBe(mock);
  });

  it('Mock syntax returns correct return value', () => {
    const mockedInstance = TestClass.for<ClassToTest, ClassToTestInterface>(
      ClassToTest
    )
      .mockMethod('method1')
      .willReturn('test')
      .getMock();

    expect(mockedInstance.method1()).toBe('test');
    expect(mockedInstance.method1).toHaveBeenCalled();
  });

  it('Mock syntax returns correct return value', () => {
    const mockedInstance = TestClass.for<ClassToTest, ClassToTestInterface>(
      ClassToTest
    )
      .mockMethod('method1')
      .willThrow(new Error())
      .getMock();

    expect(() => {
      mockedInstance.method1();
    }).toThrowError(new Error());
  });
});
