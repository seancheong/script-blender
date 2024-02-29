import { act, renderHook } from '@testing-library/react';

import { useMobileLayout } from './useMobileLayout';

/**
 * Mock implementation of ResizeObserver
 */
class MockResizeObserver {
  callback: ResizeObserverCallback;
  observedElements: Element[] = [];

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(element: Element) {
    this.observedElements.push(element);
  }

  unobserve(element: Element) {
    this.observedElements = this.observedElements.filter((e) => e !== element);
  }

  triggerResize(width: number, height: number) {
    for (const element of this.observedElements) {
      this.callback(
        [
          {
            target: element,
            contentRect: {
              width,
              height,
              x: 0,
              y: 0,
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              toJSON: function () {
                console.log('Function not implemented.');
              },
            },
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: [],
          },
        ],
        this as any,
      );
    }
  }
}

let mockResizeObserver: MockResizeObserver;
let mockElement: HTMLElement;

describe('useMobileLayout hook', () => {
  beforeEach(() => {
    global.ResizeObserver = jest.fn(function (
      callback: ResizeObserverCallback,
    ) {
      mockResizeObserver = new MockResizeObserver(callback);

      return {
        observe: mockResizeObserver.observe.bind(mockResizeObserver),
        unobserve: mockResizeObserver.unobserve.bind(mockResizeObserver),
        disconnect: jest.fn(),
      };
    });

    mockElement = document.createElement('div');
  });

  it('returns true after if the width is less than threshold after resize', () => {
    const { result } = renderHook(() => useMobileLayout(mockElement));

    act(() => {
      mockResizeObserver.triggerResize(400, 400);
    });

    expect(result.current).toBe(true);
  });

  it('returns false after if the width is more than threshold after resize', () => {
    const { result } = renderHook(() => useMobileLayout(mockElement));

    act(() => {
      mockResizeObserver.triggerResize(600, 600);
    });

    expect(result.current).toBe(false);
  });
});
