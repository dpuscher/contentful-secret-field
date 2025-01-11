// test/mocks/index.ts
export const mockSdk: any = {
  app: {
    onConfigure: jest.fn(),
    getParameters: jest.fn().mockReturnValueOnce({}),
    setReady: jest.fn(),
    getCurrentState: jest.fn(),
  },
  ids: {
    app: 'test-app',
  },
  field: {
    getValue: jest.fn().mockReturnValue(''), // default to returning empty
    setValue: jest.fn().mockResolvedValue(undefined),
  },
  parameters: {
    instance: {
      secretLength: 16,
    },
  },
  window: {
    startAutoResizer: jest.fn(),
  },
};

export const mockCma: any = {};
