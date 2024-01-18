import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WorldRegistry from './WorldRegistry';

describe('<WorldRegistry />', () => {
  test('it should mount', () => {
    render(<WorldRegistry />);
    
    const worldRegistry = screen.getByTestId('WorldRegistry');

    expect(worldRegistry).toBeInTheDocument();
  });
});