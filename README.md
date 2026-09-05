# Insurance Policy App

Next.js 16 insurance customer portal with Google reCAPTCHA v2 and Google OAuth authentication.

## Stack

- **Framework**: Next.js 16.3.4 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Auth**: NextAuth v5 (Google OAuth)
- **Security**: Google reCAPTCHA v2 (checkbox with audio accessibility)
- **API**: RESTful backend at `https://insurance-app-api.bayuanugerah.my.id/api/v1`

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required environment variables in `.env.local`:

#### reCAPTCHA v2 (Checkbox)
Get keys from: https://www.google.com/recaptcha/admin

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**Setup Instructions:**
1. Go to Google reCAPTCHA Admin Console
2. Register a new site with reCAPTCHA v2 "I'm not a robot" checkbox
3. Add your domains (localhost for dev, production domain)
4. Copy Site Key to `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
5. Copy Secret Key to `RECAPTCHA_SECRET_KEY`

#### Google OAuth
Get credentials from: https://console.cloud.google.com/apis/credentials

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

**Setup Instructions:**
1. Go to Google Cloud Console > APIs & Services > Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
4. Copy Client ID to `GOOGLE_CLIENT_ID`
5. Copy Client Secret to `GOOGLE_CLIENT_SECRET`

#### NextAuth Secret

```env
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
```

Generate secret with:
```bash
openssl rand -base64 32
```

For production, update `NEXTAUTH_URL` to your production domain.

#### API URL

```env
NEXT_PUBLIC_API_URL=https://insurance-app-api.bayuanugerah.my.id/api/v1
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

### Authentication

#### Register Page (`/auth/register`)
- **reCAPTCHA v2 Integration**: Checkbox verification before registration
- **Accessibility**: Supports audio challenge for visually impaired users
- **Backend Verification**: Token verified server-side via `/api/verify-recaptcha`
- Form fields: Name, Email, Phone, Password, Confirm Password
- Client-side validation before API call

#### Login Page (`/auth/login`)
- **Email/Password Login**: Traditional login flow
- **Google OAuth**: One-click sign-in with Google account
- **Unified Flow**: Google OAuth users auto-registered to backend
- Demo credentials provided for testing
- Success message after registration redirect

### API Routes

#### `/api/auth/[...nextauth]/route.ts`
- NextAuth v5 route handler
- Google OAuth provider configuration
- Custom callbacks:
  - `signIn`: Sends Google user data to backend `/auth/google` endpoint
  - `jwt`: Stores backend token in JWT
  - `session`: Exposes backend token to client
- Type-safe with extended NextAuth types

#### `/api/verify-recaptcha/route.ts`
- Server-side reCAPTCHA verification
- Validates token with Google's API
- Returns success/failure with error codes
- Used by register page before backend registration

### Security Features

1. **reCAPTCHA v2**: Prevents bot registrations, supports audio accessibility
2. **Server-side Verification**: reCAPTCHA token validated on backend
3. **Google OAuth**: Secure third-party authentication via NextAuth
4. **Password Validation**: Minimum 6 characters, client-side matching
5. **Token Storage**: Auth tokens stored in localStorage after successful login

### Backend Integration

The app expects these backend endpoints:

- `POST /auth/register`: Register new user (name, email, phone, password)
- `POST /auth/login`: Login with email/password (returns token)
- `POST /auth/google`: Google OAuth login/register (email, name, googleId, returns token)

## Files Created/Modified

### New Files
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth v5 Google OAuth handler
- `src/app/api/verify-recaptcha/route.ts` - reCAPTCHA server-side verification
- `.env.local.example` - Environment variables template

### Modified Files
- `src/app/auth/register/page.tsx` - Added reCAPTCHA v2 checkbox
- `src/app/auth/login/page.tsx` - Added Google OAuth sign-in button

## TypeScript

All code is fully typed with TypeScript 5. Custom type extensions for NextAuth are in the route handler.

Build check:
```bash
npx tsc --noEmit
```

## Production Checklist

Before deploying:

- [ ] Set production `NEXTAUTH_URL` in environment
- [ ] Add production domain to Google reCAPTCHA allowed domains
- [ ] Add production callback URL to Google OAuth credentials
- [ ] Generate secure `NEXTAUTH_SECRET` (never reuse dev secret)
- [ ] Verify backend API CORS allows production domain
- [ ] Test reCAPTCHA in production (works differently than localhost)
- [ ] Test Google OAuth callback redirect in production

## License

Private
