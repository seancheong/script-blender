import { render, waitFor } from '@testing-library/react';
import { CodePanel } from '.';

jest.mock('@/services/codeService', () => ({
  buildCode: jest.fn().mockResolvedValue({ output: '', error: '' })
}));

jest.mock('@/hooks/useMobileLayout', () => ({
  useMobileLayout: jest.fn().mockReturnValue(false)
}));

describe('CodePanel component', () => {
  it('renders the Skeleton component initially', () => {
    const { getByTestId } = render(<CodePanel />);

    expect(getByTestId('skeleton-panel')).toBeInTheDocument();
  });

  it('renders the CodeEditor component after some time has passed', async () => {
    const { getByText } = render(<CodePanel />);

    await waitFor(() => expect(getByText(/console/i)).toBeInTheDocument());
  });
});
