import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('Should render the app', () => {
  render(<App />);
});

test('renders text input', () => {
  render(<App />);
  const textArea = screen.getByRole('textbox');

  expect(textArea).toBeInTheDocument();
});

describe('Should render specific elements based on Markdown', () => {
  it('Should render an H1 when typing # in the first character followed by a sequence of words', async () => {
    render(<App />);

    const textArea = screen.getByTestId('markdown');
    const preview = screen.queryByTestId('preview');

    userEvent.type(textArea, '# Hey this is a title');

    expect(preview).toContainHTML(`<h1>Hey this is a title</h1>`);
  });

  it('Should render an H2 when typing ## in the first character followed by a sequence of words', () => {
    render(<App />);

    const textArea = screen.getByTestId('markdown');
    const preview = screen.queryByTestId('preview');

    userEvent.type(textArea, '## Hey this is a secondary title');

    expect(preview).toContainHTML(`<h2>Hey this is a secondary title</h2>`);
  });

  it('Should render a P element when only typing text without markdown identifiers', () => {
    render(<App />);

    const textArea = screen.getByTestId('markdown');
    const preview = screen.queryByTestId('preview');

    userEvent.type(textArea, 'Hey this is common paragraph');

    expect(preview).toContainHTML(`<p>Hey this is common paragraph</p>`);
  });

  it('Should render a list with two elements with proper markdown typing', () => {
    render(<App />);

    const textArea = screen.getByTestId('markdown');
    const preview = screen.queryByTestId('preview');

    userEvent.type(textArea, '* My first list item\n');
    userEvent.type(textArea, '* My second list item\n');

    expect(preview).toContainHTML(
      `<ul><li> My first list item</li><li> My second list item</li></ul>`,
    );
  });
});
