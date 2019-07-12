export interface ISaver {
  setHmset(
    category: string,
    speciesName: string,
    speciesSound: string,
    timestamp?: number
  ): void;

  getValue(name: string): string;

  setValue(name: string, value: string): void;

  setValueWithExpire(name: string, value: string, timestamp: number): void;

  getHmsetValue(category: string, speciesName: string): string;

  deleteHsetValue(category: string, speciesName: string): void;
}
