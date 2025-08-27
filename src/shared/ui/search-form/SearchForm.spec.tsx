import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from './SearchForm';

describe('SearchForm', () => {
  it('renders input with initial value from props', () => {
    render(<SearchForm initialQuery="Matrix" onSearch={jest.fn()} />);
    const input = screen.getByRole('searchbox', { name: /search query/i });
    expect(input).toHaveValue('Matrix');
  });

  it('calls onSearch with typed value on button click', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchForm initialQuery="" onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: /search query/i });
    await user.type(input, 'Interstellar');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('Interstellar');
  });

  it('calls onSearch with typed value on Enter key', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchForm initialQuery="" onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: /search query/i });
    await user.type(input, 'Arrival{enter}');

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('Arrival');
  });
});
