beforeEach(() => {
  jest.restoreAllMocks();
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
  }
});
