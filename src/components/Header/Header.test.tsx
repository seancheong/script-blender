import { render } from '@testing-library/react';

import { Header } from '.';

describe('Header component', () => {
  it('renders the component successfully', () => {
    const { getByText } = render(<Header />);

    expect(getByText(/script blender/i)).toBeInTheDocument();
  });
});
