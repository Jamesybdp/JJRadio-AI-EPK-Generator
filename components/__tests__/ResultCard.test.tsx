import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot, Root } from 'react-dom/client';
import { ResultCard } from '../ResultCard';

describe('ResultCard', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    jest.useFakeTimers();
    (navigator.clipboard.writeText as jest.Mock).mockClear();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    jest.useRealTimers();
  });

  it('renders the provided title and content', () => {
    act(() => {
      root.render(<ResultCard title="Artist Bio" content="This is the artist bio." />);
    });

    expect(container.textContent).toContain('Artist Bio');
    expect(container.textContent).toContain('This is the artist bio.');
  });

  it('copies content to the clipboard when the copy button is clicked', () => {
    act(() => {
      root.render(<ResultCard title="Artist Bio" content="Copy me" />);
    });

    const button = container.querySelector('button');
    expect(button).not.toBeNull();

    act(() => {
      button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copy me');

    act(() => {
      jest.advanceTimersByTime(2000);
    });
  });
});
