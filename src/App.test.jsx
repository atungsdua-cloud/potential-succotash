import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Honda dealer main heading', () => {
  render(<App />);
  const heading = screen.getByText(/temukan honda/i);
  expect(heading).toBeDefined();
});
