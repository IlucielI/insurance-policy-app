// Midtrans Snap Payment Integration
// Docs: https://docs.midtrans.com/docs/snap-integration

export interface MidtransSnapOptions {
  token: string
  onSuccess?: (result: MidtransResult) => void
  onPending?: (result: MidtransResult) => void
  onError?: (result: MidtransResult) => void
  onClose?: () => void
}

export interface MidtransResult {
  status_code: string
  status_message: string
  transaction_id: string
  order_id: string
  gross_amount: string
  payment_type: string
  transaction_time: string
  transaction_status: string
  fraud_status?: string
}

// Load Midtrans Snap script dynamically
export const loadMidtransScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.snap) {
      resolve()
      return
    }

    const script = document.createElement('script')
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-YOUR_KEY'
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
    
    script.src = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'
    
    script.setAttribute('data-client-key', clientKey)
    script.async = true
    
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Midtrans Snap script'))
    
    document.body.appendChild(script)
  })
}

// Open Midtrans Snap payment popup
export const openSnapPayment = async (options: MidtransSnapOptions): Promise<void> => {
  await loadMidtransScript()

  if (!window.snap) {
    throw new Error('Midtrans Snap not loaded')
  }

  window.snap.pay(options.token, {
    onSuccess: (result: MidtransResult) => {
      console.log('Payment success:', result)
      options.onSuccess?.(result)
    },
    onPending: (result: MidtransResult) => {
      console.log('Payment pending:', result)
      options.onPending?.(result)
    },
    onError: (result: MidtransResult) => {
      console.error('Payment error:', result)
      options.onError?.(result)
    },
    onClose: () => {
      console.log('Payment popup closed')
      options.onClose?.()
    }
  })
}

// Global type augmentation for window.snap
declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess?: (result: MidtransResult) => void
        onPending?: (result: MidtransResult) => void
        onError?: (result: MidtransResult) => void
        onClose?: () => void
      }) => void
    }
  }
}
