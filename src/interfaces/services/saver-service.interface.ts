export interface ISaver {
  setHmset(category: string, values: string[], timestamp?: number): void;

  getValue(name: string): string;

  setValue(name: string, value: string, timestamp?: number): void;

  getHsetValue(category: string, speciesName: string): string;
  getHAllValue(category: string): any;

  deleteHsetValue(category: string, speciesName: string): void;

  deleteValue(speciesName: string): void;
}
