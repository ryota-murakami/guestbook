import { render, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'

import { SignInButton } from '../auth/SignInButton'
import { SignOutButton } from '../auth/SignOutButton'

// Mock functions
const mockSignIn = vi.fn()
const mockSignOut = vi.fn()

// Mock the next-auth/react module
vi.mock('next-auth/react', () => ({
  signIn: (...args: any[]) => mockSignIn(...args),
  signOut: (...args: any[]) => mockSignOut(...args),
}))

describe('Auth Buttons', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockSignIn.mockReset()
    mockSignOut.mockReset()
  })

  describe('SignInButton', () => {
    it('should render correctly', () => {
      const { getByRole } = render(<SignInButton />)

      const button = getByRole('button', { name: 'Sign in with GitHub' })
      expect(button).toBeInTheDocument()
    })

    it('should call signIn when clicked', () => {
      const { getByRole } = render(<SignInButton />)

      const button = getByRole('button', { name: 'Sign in with GitHub' })
      fireEvent.click(button)

      expect(mockSignIn).toHaveBeenCalledWith('github')
    })
  })

  describe('SignOutButton', () => {
    it('should render correctly', () => {
      const { getByRole } = render(<SignOutButton />)

      const button = getByRole('button', { name: 'Sign out' })
      expect(button).toBeInTheDocument()
    })

    it('should call signOut when clicked', () => {
      const { getByRole } = render(<SignOutButton />)

      const button = getByRole('button', { name: 'Sign out' })
      fireEvent.click(button)

      expect(mockSignOut).toHaveBeenCalled()
    })
  })
})
