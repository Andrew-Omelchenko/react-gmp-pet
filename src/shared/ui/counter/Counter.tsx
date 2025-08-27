import React, { Component } from 'react';

type CounterProps = {
  initialValue: number;
};

type CounterState = {
  value: number;
};

export default class Counter extends Component<CounterProps, CounterState> {
  state: CounterState = { value: this.props.initialValue };

  private increment = () => {
    this.setState((prev) => ({ value: prev.value + 1 }));
  };

  private decrement = () => {
    this.setState((prev) => ({ value: prev.value - 1 }));
  };

  public render() {
    return React.createElement(
      'div',
      { style: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem' } },
      React.createElement(
        'button',
        { type: 'button', onClick: this.decrement, 'data-testid': 'counter-decrement' },
        '-',
      ),
      React.createElement(
        'span',
        {
          'aria-live': 'polite',
          style: { minWidth: '2ch', textAlign: 'center', fontVariantNumeric: 'tabular-nums' },
          'data-testid': 'counter-value',
        },
        String(this.state.value),
      ),
      React.createElement(
        'button',
        { type: 'button', onClick: this.increment, 'data-testid': 'counter-increment' },
        '+',
      ),
    );
  }
}
