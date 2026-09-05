import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { server } from '@/mocks/server'
import NewClaimPage from '../page'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}))

describe('NewClaimPage', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token')
  })

  it('renders claim form step 1', async () => {
    render(<NewClaimPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/pilih polis/i)).toBeInTheDocument()
    })
  })

  it('loads policies on mount', async () => {
    render(<NewClaimPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/POL-2026-001234/i)).toBeInTheDocument()
    })
  })

  it('validates policy and claim type selection', async () => {
    render(<NewClaimPage />)
    
    await waitFor(() => {
      const nextButton = screen.getByRole('button', { name: /lanjut/i })
      fireEvent.click(nextButton)
    })
    
    // Should stay on step 1 without valid selections
    expect(screen.getByText(/pilih polis/i)).toBeInTheDocument()
  })

  it('proceeds to step 2 after selecting policy and claim type', async () => {
    render(<NewClaimPage />)
    
    await waitFor(() => {
      const policySelect = screen.getByLabelText(/pilih polis/i)
      fireEvent.change(policySelect, { target: { value: '1' } })
    })
    
    const claimTypeSelect = screen.getByLabelText(/jenis klaim/i)
    fireEvent.change(claimTypeSelect, { target: { value: 'Rawat Inap' } })
    
    const nextButton = screen.getByRole('button', { name: /lanjut/i })
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/tanggal kejadian/i)).toBeInTheDocument()
    })
  })

  it('validates incident date is not in future', async () => {
    render(<NewClaimPage />)
    
    // Navigate to step 2
    await waitFor(() => {
      const policySelect = screen.getByLabelText(/pilih polis/i)
      fireEvent.change(policySelect, { target: { value: '1' } })
    })
    
    const claimTypeSelect = screen.getByLabelText(/jenis klaim/i)
    fireEvent.change(claimTypeSelect, { target: { value: 'Rawat Inap' } })
    fireEvent.click(screen.getByRole('button', { name: /lanjut/i }))
    
    await waitFor(() => {
      const dateInput = screen.getByLabelText(/tanggal kejadian/i)
      fireEvent.change(dateInput, { target: { value: '2030-01-01' } })
    })
    
    fireEvent.change(screen.getByLabelText(/lokasi kejadian/i), { target: { value: 'Jakarta' } })
    fireEvent.change(screen.getByLabelText(/deskripsi/i), { target: { value: 'Test incident description with enough characters' } })
    fireEvent.change(screen.getByLabelText(/jumlah klaim/i), { target: { value: '1000000' } })
    
    const nextButton = screen.getByRole('button', { name: /lanjut/i })
    fireEvent.click(nextButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/tanggal kejadian tidak boleh di masa depan/i)).toBeInTheDocument()
    })
  })
})
