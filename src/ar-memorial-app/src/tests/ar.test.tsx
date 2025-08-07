import React from 'react';
import { render, screen } from '@testing-library/react';
import ARIntegration from '../ar/ARIntegration';
import HologramLayer from '../ar/HologramLayer';
import MovementScripts from '../ar/MovementScripts';

describe('AR Components', () => {
  test('renders ARIntegration component', () => {
    render(<ARIntegration />);
    const arElement = screen.getByTestId('ar-integration');
    expect(arElement).toBeInTheDocument();
  });

  test('renders HologramLayer component', () => {
    render(<HologramLayer />);
    const hologramElement = screen.getByTestId('hologram-layer');
    expect(hologramElement).toBeInTheDocument();
  });

  test('executes movement scripts correctly', () => {
    const movement = MovementScripts();
    expect(movement).toHaveProperty('male');
    expect(movement).toHaveProperty('female');
    expect(movement).toHaveProperty('child');
  });
});