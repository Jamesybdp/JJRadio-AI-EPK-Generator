declare const jest: any;

declare namespace jest {
  function mock<T extends (...args: any[]) => any>(moduleName: string, factory?: () => T): void;
  function clearAllMocks(): void;
  function useFakeTimers(): void;
  function useRealTimers(): void;
  function advanceTimersByTime(ms: number): void;
}
