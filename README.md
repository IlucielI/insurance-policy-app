# Insurance Policy Application (Customer App)

Frontend aplikasi customer untuk Insurance Policy System, dibangun menggunakan Next.js 14 dengan App Router dan Tailwind CSS.

## 🏗️ Tech Stack

- **Next.js 14** (App Router, Server-Side Rendering)
- **React 18** dengan TypeScript
- **Tailwind CSS** untuk styling
- **Fetch API** untuk backend integration

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- npm atau yarn

### 1. Clone Repository

```bash
git clone https://github.com/IlucielI/insurance-policy-app.git
cd insurance-policy-app
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Environment Variables

Copy `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### 4. Run Development Server

```bash
npm run dev
# atau
yarn dev
```

Aplikasi akan jalan di `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
npm run start
# atau
yarn build
yarn start
```

## 📱 Pages & Features

### 🏠 Landing Page (`/`)
- Hero section dengan CTA
- Product preview cards (Jiwa, Kesehatan, Kendaraan)
- How it works section (4 steps)
- Chat CTA button

### 📦 Products Listing (`/products`)
- Grid layout produk asuransi
- Filter by category (Jiwa, Kesehatan, Kendaraan)
- Product cards dengan fitur utama
- Link ke detail page

### 📊 Product Detail (`/products/[id]`)
- Product description lengkap
- List manfaat & fitur
- **Premium Calculator**:
  - Input: Usia (18-65 tahun)
  - Input: Uang Pertanggungan (Rp 500jt - Rp 5M)
  - Output: Premi per bulan (real-time calculation)
  - Formula: `base_premium × age_factor × coverage_factor`
- CTA "Ajukan Sekarang" (redirect ke application form)

### 📝 Application Form (`/application`)
**2-Step Wizard:**

**Step 1: Data Diri**
- Nama lengkap
- Email & telepon
- Tanggal lahir
- Jenis kelamin
- No. KTP (16 digit)
- Alamat lengkap

**Step 2: Kesehatan & Pembayaran**
- Pekerjaan
- Riwayat penyakit (optional)
- Status merokok
- Ringkasan premi
- Metode pembayaran
- ✓ Accept terms & conditions

**Submission:**
- POST ke `/api/v1/applications`
- Success: Show application number
- Redirect ke home page

### 💬 Chat (AI Assistant) (`/chat`)
- Session-based chat interface
- Send message → AI response
- **RAG-powered**: Semantic search via pgvector
- **Fallback mode**: Static helpful responses when LLM down
- Chat history per session
- Example queries:
  - "Apa saja produk asuransi yang tersedia?"
  - "Berapa premi untuk usia 25 tahun?"
  - "Bagaimana cara mengajukan asuransi?"

## 🎨 UI/UX Features

- **Responsive Design** (mobile-first)
- **Loading States** (skeleton screens)
- **Error Handling** (user-friendly messages)
- **Form Validation** (client-side)
- **Optimistic UI** (instant feedback)
- **Fallback Mock Data** (works when API down)

## 🔌 API Integration

**Backend endpoints used:**

```typescript
// Products
GET ${API_URL}/products
GET ${API_URL}/products/:id
POST ${API_URL}/products/:id/calculate-premium

// Applications
POST ${API_URL}/applications

// Chat
POST ${API_URL}/chat
GET ${API_URL}/chat/:sessionId/history
```

**Fallback strategy:**

```typescript
try {
  const response = await fetch(apiUrl)
  if (response.ok) {
    const data = await response.json()
    return data
  }
} catch (err) {
  // Return mock data for demo
  return mockData
}
```

## 🐳 Docker

**Build image:**

```bash
docker build -t insurance-app .
```

**Run container:**

```bash
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://api-url/api/v1 \
  --name insurance-app \
  insurance-app
```

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# E2E tests (Playwright)
npm run test:e2e
```

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── products/
│   │   ├── page.tsx                # Products listing
│   │   └── [id]/page.tsx           # Product detail + calculator
│   ├── application/page.tsx        # 2-step application form
│   └── chat/page.tsx               # AI assistant chatbot
├── components/                     # Reusable components (if any)
└── styles/                         # Global styles
```

## 🎯 Key Components

### Premium Calculator

```typescript
// Calculate premium formula
const ageFactor = age < 30 ? 1.0 : age < 40 ? 1.2 : age < 50 ? 1.5 : 2.0
const coverageFactor = coverageAmount / 500000000
const totalPremium = basePremium * ageFactor * coverageFactor
```

### Chat Interface

```typescript
// Send message to AI
const response = await fetch(`${API_URL}/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    session_id: sessionId,
    message: userMessage
  })
})
const data = await response.json()
// Display AI response
```

## 🚨 Troubleshooting

**Problem: API connection failed**

Solution: Check `NEXT_PUBLIC_API_URL` in `.env.local` matches backend URL

**Problem: Premium calculator returns 0**

Solution: Ensure age is between 18-65 and coverage amount is valid

**Problem: Application form validation errors**

Solution: All required fields (*) must be filled, check ID number format (16 digits)

**Problem: Chat not responding**

Solution: Backend LLM endpoint may be down, app uses fallback responses

## 🔧 Configuration

**Environment variables:**

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080/api/v1` |

## 📝 Development Workflow

1. Create feature branch: `git checkout -b feat/feature-name`
2. Make changes, test on `localhost:3000`
3. Commit: `git commit -m "feat(scope): description"`
4. Push & create PR
5. Merge after code review

## 🌐 Deployment

**Deployed to:** http://insurance-app.bayuanugerah.my.id

**Production build:**

```bash
npm run build
# Output: .next/ folder (standalone mode)
```

**Environment (production):**

```env
NEXT_PUBLIC_API_URL=http://insurance-app-api.bayuanugerah.my.id/api/v1
```

## 📄 License

MIT License - Bayu Anugerah

## 🔗 Related Repositories

- Backend API: https://github.com/IlucielI/insurance-policy-core-api
- Admin CMS: https://github.com/IlucielI/insurance-policy-cms

## 📧 Contact

**Bayu Anugerah**  
Email: bayu.anugerah99@gmail.com  
GitHub: https://github.com/IlucielI
