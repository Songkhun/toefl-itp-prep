import { render, screen, within } from '@testing-library/react';
import { Markdown } from '../../src/ui/Markdown';

describe('Markdown tables', () => {
  const src = 'Intro line.\n\n| Subject | Object |\n|---|---|\n| **he** | him |\n| they | them |\n\nAfter.';
  it('renders a pipe table as a real table with a header row and body rows', () => {
    const { container } = render(<Markdown source={src} />);
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Subject', 'Object']);
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getByText('he').tagName).toBe('STRONG');
    expect(container.textContent).not.toMatch(/\||---/);
  });
  it('wraps the table so a wide table scrolls on its own instead of the page', () => {
    render(<Markdown source={src} />);
    expect(screen.getByRole('table').parentElement).toHaveClass('table-scroll');
  });
});
