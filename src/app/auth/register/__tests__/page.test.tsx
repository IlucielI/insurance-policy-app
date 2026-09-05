import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { server } from '@/mocks/server'
import RegisterPage from '../page'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock ReCAPTCHA
vi.mock('react-google-recaptcha', () => ({
  default: vi.fn(({ onChange }: any) => (
    <div data-testid="recaptcha" onClick={() => onChange('test-token')}>
      reCAPTCHA
    </div>
  )),
}))

describe('RegisterPage', () => {
  it('renders registration form', () => {
    render(<RegisterPage />)
    
    expect(screen.getByLabelText(/nama lengkap/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nomor telepon/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/konfirmasi password/i)).toBeInTheDocument()
  })

  it('validates password match', async () => {
    render(<RegisterPage />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmInput = screen.getByLabelText(/konfirmasi password/i)
    const recaptcha = screen.getByTestId('recaptcha')
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmInput, { target: { value: 'different' } })
    fireEvent.click(recaptcha)
    
    const submitButton = screen.getByRole('button', { name: /daftar/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/password tidak cocok/i)).toBeInTheDocument()
    })
  })

  it('validates minimum password length', async () => {
    render(<RegisterPage />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmInput = screen.getByLabelText(/konfirmasi password/i)
    const recaptcha = screen.getByTestId('recaptcha')
    
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.change(confirmInput, { target: { value: '123' } })
    fireEvent.click(recaptcha)
    
    const submitButton = screen.getByRole('button', { name: /daftar/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/password minimal 6 karakter/i)).toBeInTheDocument()
    })
  })

  it('requires reCAPTCHA verification', async () => {
    render(<RegisterPage />)
    
    const nameInput = screen.getByLabelText(/nama lengkap/i)
    const emailInput = screen.getByLabelText(/^email$/i)
    const phoneInput = screen.getByLabelText(/nomor telepon/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmInput = screen.getByLabelText(/konfirmasi password/i)
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(phoneInput, { target: { value: '08123456789' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmInput, { target: { value: 'password123' } })
    
    const submitButton = screen.getByRole('button', { name: /daftar/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/silakan selesaikan verifikasi recaptcha/i)).toBeInTheDocument()
    })
  })
})
