
export interface IDataWindow<T> {
  size: number;
  min: number;
  max: number;
  data: T[];
  add(data: T): void;
  clear(): void;
  setData(data: T[]): void;
}

export class DataWindow<T> implements IDataWindow<T> {
  size: number;
  min: number;
  max: number;
  data: T[];
  private parseMin: (data: T) => number;
  private parseMax: (data: T) => number;

  constructor(size: number,
    parseMin: (data: T) => number,
    parseMax: (data: T) => number,
    initialValues?: T[]) {
    this.size = size;
    this.parseMin = parseMin;
    this.parseMax = parseMax;
    this.data = initialValues ? initialValues : [];
    this.min = Number.MAX_SAFE_INTEGER;
    this.max = Number.MIN_SAFE_INTEGER;

    if (initialValues) {
      initialValues.forEach((d) => {
        const minValue = this.parseMin(d);
        const maxValue = this.parseMax(d);
        if (minValue < this.min) this.min = minValue;
        if (maxValue > this.max) this.max = maxValue;
      });
    }
  }

  add(data: T): void {
    if (data) {
      const minValue = this.parseMin(data);
      const maxValue = this.parseMax(data);
      if (minValue < this.min) this.min = minValue;
      if (maxValue > this.max) this.max = maxValue;
    }
    if (this.data.length >= this.size) {
      this.data = [...this.data.slice(1), data];
    } else {
      this.data = [...this.data, data];
    }
  }

  clear(): void {
    this.data = [];
    this.min = Number.MAX_SAFE_INTEGER;
    this.max = Number.MIN_SAFE_INTEGER;
  }

  setData(data: T[]): void {
    this.data = data;
    this.min = Number.MAX_SAFE_INTEGER;
    this.max = Number.MIN_SAFE_INTEGER;
    data.forEach((d) => {
      const minValue = this.parseMin(d);
      const maxValue = this.parseMax(d);
      if (minValue < this.min) this.min = minValue;
      if (maxValue > this.max) this.max = maxValue;
    });
  }
}