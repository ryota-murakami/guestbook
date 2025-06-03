import { render, fireEvent } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { GuestbookForm } from '../guestbook/GuestbookForm';

// Mock the trpc hook
vi.mock('@/utils/trpc', () => ({
  trpc: {
    guestbook: {
      postMessage: {
        useMutation: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
        }),
      },
    },
    useContext: vi.fn().mockReturnValue({
      guestbook: {
        getAll: {
          invalidate: vi.fn(),
        }
      }
    }),
  },
}));

describe('GuestbookForm', () => {
  let mockMutate: ReturnType<typeof vi.fn>;
  let mockInvalidate: ReturnType<typeof vi.fn>;
  
  beforeEach(async () => {
    // Reset the mock implementation before each test
    mockMutate = vi.fn();
    mockInvalidate = vi.fn();
    
    // Update the mock implementation
    const { trpc } = await import('@/utils/trpc');
    (trpc.guestbook.postMessage.useMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    
    (trpc.useContext as any).mockReturnValue({
      guestbook: {
        getAll: {
          invalidate: mockInvalidate,
        }
      }
    });
  });
  
  it('should render the form', () => {
    render(<GuestbookForm />);
    
    expect(screen.getByPlaceholderText('Your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
  
  it('should allow entering a message', () => {
    render(<GuestbookForm />);
    
    const input = screen.getByPlaceholderText('Your message...');
    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    
    expect(input).toHaveValue('Hello, world!');
  });
  
  it('should submit the form with a valid message', async () => {
    render(<GuestbookForm />);
    
    const input = screen.getByPlaceholderText('Your message...');
    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ message: 'Hello, world!' });
    });
  });
  
  it('should show an error when submitting an empty message', async () => {
    render(<GuestbookForm />);
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Message cannot be empty')).toBeInTheDocument();
    });
  });
  
  it('should show a pending state when submitting', async () => {
    // Mock the mutation to show pending state
    const { trpc } = await import('@/utils/trpc');
    (trpc.guestbook.postMessage.useMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });
    
    render(<GuestbookForm />);
    
    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
  });
}); 