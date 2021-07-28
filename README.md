# testclass

Test-class is testing utility which helps programmers to write tests faster and with less code.
Library works only with jest right now, but we are planing to support more testing frameworks in the future.


## Install

```bash
npm install -D @michalicat/test-class
```

or

```bash
yarn add -D @michalicat/test-class
```

## Usage

```ts

// Implementation
import { describe, expect } from '@jest/globals';

interface CarInterface {
  start(): void;

  getColor(): string;

  getIsOn(): boolean;
}

class Car implements CarInterface {

  isOn: boolean = false;

  start(): void {
    this.isOn = true;
  }

  getColor(): string {
    return 'red';
  }

  getIsOn(): boolean {
    return this.isOn;
  }
}

class Garage {

  constructor(
    private car: Car = new Car(),
  ) {
  }

  hasStartedCarInside(): boolean {
    return this.car.isOn();
  }
}


// Test file

import TestClass from '@michalicat/test-class/lib';

describe('test has startedCarInside', () => {
  it('should call isOn', () => {
    const car = TestClass.for<Car, CarInterface>(Car).getMock();
    const garage = new Garage(car);

    garage.hasStartedCarInside();

    expect(car.isOn).toHaveBeenCalled();
  });
  it('should call isOn and retun false', () => {
    const car = TestClass.for<Car, CarInterface>(Car)
      .mockMethod('isOn')
      .willReturn(false)
      .getMock();


    expect(garage.hasStartedCarInside()).toBe(false);
    expect(car.isOn).toHaveBeenCalled();
    
  });
})
```
