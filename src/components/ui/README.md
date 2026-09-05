# Design System Documentation

## 📚 Overview

Design system konsisten untuk Insurance Policy App (Customer) dan CMS (Admin). Terinspirasi dari Stripe, Linear, dan Vercel.

## 🎨 Design Tokens

### Colors

#### Primary (Blue)
- `--primary-50` hingga `--primary-900`
- Primary: `#3b82f6` (500)
- Hover: `#2563eb` (600)

#### Semantic Colors
- Success: Green (`--success-*`)
- Danger: Red (`--danger-*`)
- Warning: Orange (`--warning-*`)
- Gray: Neutral (`--gray-*`)

#### Dark Mode
Toggle dengan `data-theme="dark"` pada `<html>` atau `document.documentElement`.

### Typography
- Font: System font stack (SF Pro, Segoe UI, Roboto)
- Sizes: `--text-xs` (12px) hingga `--text-5xl` (48px)

### Spacing
Base 4px scale: `--space-1` (4px) hingga `--space-16` (64px)

### Shadows
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
- Auto-adjust untuk dark mode

### Border Radius
- `--radius-sm` (6px) hingga `--radius-2xl` (24px)

### Transitions
- Fast: 150ms
- Base: 200ms
- Slow: 300ms

## 🧩 Components

### Button
```tsx
import { Button } from '@/components/ui'

<Button variant="primary" size="md" loading={false}>
  Simpan
</Button>

// Variants: primary, secondary, danger, ghost, outline
// Sizes: sm, md, lg
```

### Input
```tsx
import { Input } from '@/components/ui'

<Input
  label="Email"
  type="email"
  placeholder="nama@email.com"
  error={errors.email}
  helperText="Kami tidak akan membagikan email Anda"
  leftIcon={<MailIcon />}
/>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'

<Card variant="default" padding="md" hoverable>
  <CardHeader>
    <CardTitle>Judul Card</CardTitle>
    <CardDescription>Deskripsi singkat</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Modal
```tsx
import { Modal } from '@/components/ui'

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Konfirmasi"
  description="Apakah Anda yakin?"
  size="md"
>
  {/* Modal content */}
</Modal>
```

### Toast
```tsx
import { Toast, ToastContainer } from '@/components/ui'

// Di root component
<ToastContainer position="top-right" toasts={toasts} />

// Trigger toast
const showToast = () => {
  addToast({
    id: Date.now().toString(),
    variant: 'success',
    title: 'Berhasil',
    message: 'Data berhasil disimpan',
    duration: 5000,
    onClose: (id) => removeToast(id)
  })
}
```

### Loading States
```tsx
import { LoadingSpinner } from '@/components/ui'

<LoadingSpinner size="md" text="Memuat..." />

// Full screen
<LoadingSpinner size="lg" text="Memuat data..." fullScreen />
```

### Empty State
```tsx
import { EmptyState } from '@/components/ui'

<EmptyState
  icon={<InboxIcon className="w-16 h-16" />}
  title="Belum ada data"
  description="Mulai dengan membuat data pertama Anda"
  action={{
    label: 'Buat Baru',
    onClick: () => router.push('/create')
  }}
/>
```

### Error State
```tsx
import { ErrorState } from '@/components/ui'

<ErrorState
  title="Gagal memuat data"
  message="Terjadi kesalahan saat mengambil data. Silakan coba lagi."
  retry={() => refetch()}
/>
```

### Dark Mode Toggle
```tsx
import DarkModeToggle from '@/components/ui/DarkModeToggle'

<DarkModeToggle />
```

## 📱 Responsive Design

Semua komponen mobile-first dengan breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## ♿ Accessibility

- Focus states dengan `focus:ring-2`
- ARIA labels pada interactive elements
- Keyboard navigation (Modal: ESC to close)
- Color contrast ratio WCAG AA compliant

## 🎯 Best Practices

### Button Usage
- **Primary**: Main action (Simpan, Submit, Buat)
- **Secondary**: Alternative action (Batal, Kembali)
- **Danger**: Destructive action (Hapus, Tolak)
- **Ghost**: Tertiary/subtle action
- **Outline**: Secondary dengan emphasis

### Color Semantics
- Blue: Primary brand, info
- Green: Success, approved, active
- Red: Danger, error, rejected
- Yellow/Orange: Warning, pending
- Gray: Neutral, disabled

### Loading States
1. Show spinner immediately on action
2. Disable form during loading
3. Show text for long operations (>2s)
4. Use skeleton loaders for initial page load

### Error Handling
1. Inline errors for form fields
2. Toast notifications for actions
3. Error states for failed data fetch
4. Retry mechanism for recoverable errors

## 🚀 Usage Example

```tsx
'use client'

import { useState } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Modal, LoadingSpinner, ErrorState } from '@/components/ui'

export default function ExamplePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // API call
      await saveData()
      setShowModal(true)
    } catch (err) {
      setError('Gagal menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" text="Menyimpan..." fullScreen />
  if (error) return <ErrorState message={error} retry={() => window.location.reload()} />

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Form Example</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama"
              placeholder="Masukkan nama"
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="nama@email.com"
              required
            />
            <Button type="submit" variant="primary" fullWidth>
              Simpan
            </Button>
          </form>
        </CardContent>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Berhasil"
      >
        <p>Data berhasil disimpan!</p>
      </Modal>
    </div>
  )
}
```

## 🎨 Tailwind CSS Usage

Design tokens tersedia sebagai CSS variables dan dapat digunakan langsung di Tailwind:

```tsx
<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
  {/* Content */}
</div>
```

## 📦 File Structure

```
src/
├── components/
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       ├── Toast.tsx
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       ├── DarkModeToggle.tsx
│       └── index.ts
└── app/
    └── globals.css  (Design tokens)
```

## 🔄 Migration Guide

### Dari komponen existing ke design system:

1. **Button lama:**
```tsx
// Before
<button className="bg-blue-600 text-white px-4 py-2 rounded">Click</button>

// After
<Button variant="primary" size="md">Click</Button>
```

2. **Input lama:**
```tsx
// Before
<input className="border px-4 py-2 rounded" />

// After
<Input placeholder="Masukkan nilai" />
```

3. **Card lama:**
```tsx
// Before
<div className="bg-white shadow rounded p-6">
  <h3>Title</h3>
</div>

// After
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
</Card>
```

## ⚡ Performance

- Komponen tree-shakeable via barrel export
- CSS variables untuk runtime theme switching tanpa re-render
- React.memo untuk komponen berat
- Portal rendering untuk Modal/Toast (di luar main tree)

## 🔧 Customization

Override design tokens di `globals.css`:

```css
:root {
  --primary-500: #your-color;
  --radius-md: 1rem;
}
```

---

**Version:** 1.0  
**Last Updated:** 2026-09-05  
**Maintained by:** Bayu Anugerah
