import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { server } from '@/mocks/server'
import ApplicationPage from '../page'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: vi.fn((key) => {
      if (key === 'product') return '1'
      if (key === 'premium') return '500000'
      return null
    }),
  }),
}))

// Mock IDCardOCR
vi.mock('@/components/IDCardOCR', () => ({
  default: ({ onDataExtracted }: any) => (
    <div data-testid="ocr-upload">
      <button onClick={() => onDataExtracted({
        nama: 'John Doe',
        nik: '1234567890123456',
        tanggal_lahir: '01-01-1990',
      })}>
        Upload KTP
      </button>
    </div>
  ),
}))

describe('ApplicationPage', () => {
  it('renders step 1 - personal data form', () => {
    render(<ApplicationPage />)
    
    expect(screen.getByText(/data diri/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nama lengkap/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
  })

  it('fills form data from OCR', async () => {
    render(<ApplicationPage />)
    
    const uploadButton = screen.getByText(/upload ktp/i)
    fireEvent.click(uploadButton)
    
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/nama lengkap/i) as HTMLInputElement
      expect(nameInput.value).toBe('John Doe')
    })
  })

  it('validates step 1 before proceeding', async () => {
    render(<ApplicationPage />)
    
    const nextButton = screen.getByRole('button', { name: /lanjut/i })
    fireEvent.click(nextButton)
    
    // Should stay on step 1 due to validation
    expect(screen.getByText(/^1$/)).toHaveClass(/bg-blue-600/)
  })

  it('proceeds to step 2 after completing step 1', async () => {
    render(<ApplicationPage />)
    
    // Fill step 1
    fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/nomor telepon/i), { target: { value: '08123456789' } })
    fireEvent.change(screen.getByLabelText(/tanggal lahir/i), { target: { value: '1990-01-01' } })
    fireEvent.change(screen.getByLabelText(/nomor ktp/i), { target: { value: '1234567890123456' } })
    fireEvent.change(screen.getByLabelText(/alamat lengkap/i), { target: { value: 'Jakarta' } })
    
    const nextButton = screen.getByRole('button', { name: /lanjut/i })
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText(/kesehatan & pembayaran/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/pekerjaan/i)).toBeInTheDocument()
    })
  })

  it('submits application successfully', async () => {
    render(<ApplicationPage />)
    
    // Fill step 1
    fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/nomor telepon/i), { target: { value: '08123456789' } })
    fireEvent.change(screen.getByLabelText(/tanggal lahir/i), { target: { value: '1990-01-01' } })
    fireEvent.change(screen.getByLabelText(/nomor ktp/i), { target: { value: '1234567890123456' } })
    fireEvent.change(screen.getByLabelText(/alamat lengkap/i), { target: { value: 'Jakarta' } })
    
    fireEvent.click(screen.getByRole('button', { name: /lanjut/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/pekerjaan/i)).toBeInTheDocument()
    })
    
    // Fill step 2
    fireEvent.change(screen.getByLabelText(/pekerjaan/i), { target: { value: 'Software Engineer' } })
    fireEvent.click(screen.getByRole('checkbox'))
    
    const submitButton = screen.getByRole('button', { name: /ajukan sekarang/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })
})
