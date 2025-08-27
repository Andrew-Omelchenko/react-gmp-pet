import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SortControl, { type SortValue } from './SortControl';

describe('SortControl', () => {
  it('renders label and select with initial value', () => {
    const onChange = jest.fn();
    render(<SortControl value="releaseDate" onChange={onChange} />);

    // label is present
    expect(screen.getByText(/sort by/i)).toBeInTheDocument();

    // select is tied to the label via aria-label / htmlFor and has the initial value
    const select = screen.getByLabelText(/sort by/i) as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.value).toBe('releaseDate');

    // options visible
    expect(screen.getByRole('option', { name: /release date/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /title/i })).toBeInTheDocument();
  });

  it('calls onChange with new value when user selects a different option', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn<void, [SortValue]>();
    render(<SortControl value="releaseDate" onChange={onChange} />);

    const select = screen.getByLabelText(/sort by/i);

    await user.selectOptions(select, 'title');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('title');
  });
});
