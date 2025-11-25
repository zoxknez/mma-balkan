import { renderHook, act } from '@testing-library/react';
import { useDebounce, useDebouncedCallback, useSearchInput } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 1000));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 1000),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial'); // Should still be initial

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBe('updated');
  });

  it('should reset timer on new value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 1000),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'first' });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    rerender({ value: 'second' });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('initial'); // Should still be initial

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('second');
  });
});

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should debounce callback execution', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 1000));

    act(() => {
      result.current('arg1');
      result.current('arg2');
      result.current('arg3');
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg3');
  });

  it('should reset timer on new callback', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 1000));

    act(() => {
      result.current('first');
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      result.current('second');
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('second');
  });
});

describe('useSearchInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with empty string by default', () => {
    const { result } = renderHook(() => useSearchInput());
    expect(result.current.value).toBe('');
    expect(result.current.debouncedValue).toBe('');
  });

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useSearchInput('initial', 1000));
    expect(result.current.value).toBe('initial');
    expect(result.current.debouncedValue).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result } = renderHook(() => useSearchInput('', 1000));

    act(() => {
      result.current.setValue('search');
    });

    expect(result.current.value).toBe('search');
    expect(result.current.debouncedValue).toBe(''); // Should still be empty

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.debouncedValue).toBe('search');
  });

  it('should clear value', () => {
    const { result } = renderHook(() => useSearchInput('initial', 1000));

    act(() => {
      result.current.clear();
    });

    expect(result.current.value).toBe('');
    expect(result.current.debouncedValue).toBe('initial'); // Debounced value should still be initial

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.debouncedValue).toBe('');
  });
});
