import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateWorld from './CreateWorld';

describe('<CreateWorld />', () => {
  test('it should mount', () => {
    render(<CreateWorld />);
    
    const CreateWorld = screen.getByTestId('CreateWorld');

    expect(CreateWorld).toBeInTheDocument();
  });
});