import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { GuestbookEntries } from '../guestbook/GuestbookEntries';

// Mock tRPC hook
const mockUseQuery = vi.fn();

// Mock the trpc module
vi.mock('@/utils/trpc', () => ({
  trpc: {
    guestbook: {
      getAll: {
        useQuery: (...args: any[]) => mockUseQuery(...args),
      },
    },
  },
}));

describe('GuestbookEntries', () => {
  const mockInitialEntries = [
    {
      id: '1',
      message: 'Hello world!',
      name: 'Test User',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
    },
    {
      id: '2',
      message: 'Another entry',
      name: 'Another User',
      createdAt: new Date('2023-01-02T00:00:00.000Z'),
    },
  ];

  beforeEach(() => {
    // Reset mock implementation
    mockUseQuery.mockReset();
    
    // Default mock implementation returns the initial data
    mockUseQuery.mockReturnValue({
      data: mockInitialEntries,
      isLoading: false,
      error: null,
    });
  });

  it('should render initial entries', () => {
    const { getByText } = render(
      <GuestbookEntries initialEntries={mockInitialEntries} />
    );
    
    expect(getByText('Hello world!')).toBeInTheDocument();
    expect(getByText('Test User')).toBeInTheDocument();
    expect(getByText('Another entry')).toBeInTheDocument();
    expect(getByText('Another User')).toBeInTheDocument();
  });

  it('should render loading state when loading and no initial entries', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { getByText } = render(
      <GuestbookEntries initialEntries={[]} />
    );
    
    expect(getByText('Loading entries...')).toBeInTheDocument();
  });

  it('should render error state when there is an error', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Failed to fetch' },
    });

    const { getByText } = render(
      <GuestbookEntries initialEntries={[]} />
    );
    
    expect(getByText('Error loading entries: Failed to fetch')).toBeInTheDocument();
    expect(getByText('Retry')).toBeInTheDocument();
  });

  it('should render empty state when there are no entries', () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    const { getByText } = render(
      <GuestbookEntries initialEntries={[]} />
    );
    
    expect(getByText('No entries yet. Be the first to sign the guestbook!')).toBeInTheDocument();
  });
}); 