const clipboardMock = {
  writeText: jest.fn()
};

const existingNavigator = typeof global.navigator === 'undefined' ? {} : global.navigator;
const navigatorValue = { ...existingNavigator, clipboard: clipboardMock } as Navigator;
Object.defineProperty(global, 'navigator', {
  value: navigatorValue,
  configurable: true
});
