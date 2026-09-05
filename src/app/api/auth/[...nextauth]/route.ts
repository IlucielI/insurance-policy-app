import NextAuth, { DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Extend NextAuth types - NextAuth v5 uses @auth/core
declare module "@auth/core/types" {
  interface Session extends DefaultSession {
    accessToken?: string
  }
  interface User {
    accessToken?: string
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Send Google OAuth data to backend for registration/login
      if (account?.provider === 'google') {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://insurance-app-api.bayuanugerah.my.id/api/v1'
          const res = await fetch(`${apiUrl}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: account.providerAccountId,
            })
          })
          
          if (res.ok) {
            const data = await res.json()
            // Store token for later use
            user.accessToken = data.token
            return true
          }
          return false
        } catch (error) {
          console.error('Google auth backend error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
  },
})

export const { GET, POST } = handlers
