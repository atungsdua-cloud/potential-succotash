import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Honda car names', () => {
  render(<App />);
  const mobil = screen.getAllByText(/honda/i);
  expect(mobil.length).toBeGreaterThan(0);
});
