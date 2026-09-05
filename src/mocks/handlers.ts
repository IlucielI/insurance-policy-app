import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:8080/api/v1'

export const handlers = [
  // Auth - Login
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as any
    
    if (body.email === 'user@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        token: 'mock-token-123',
        user: {
          id: '1',
          email: body.email,
          name: 'Test User',
        },
      })
    }
    
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }),

  // Auth - Register
  http.post(`${API_URL}/auth/register`, async ({ request }) => {
    const body = await request.json() as any
    
    return HttpResponse.json({
      id: '1',
      email: body.email,
      name: body.name,
      message: 'Registration successful',
    }, { status: 201 })
  }),

  // Products - List
  http.get(`${API_URL}/products`, () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          name: 'Asuransi Jiwa Premium',
          category: 'life',
          description: 'Perlindungan jiwa terbaik',
          premium_min: 500000,
          premium_max: 5000000,
        },
        {
          id: '2',
          name: 'Asuransi Kesehatan Plus',
          category: 'health',
          description: 'Perlindungan kesehatan menyeluruh',
          premium_min: 300000,
          premium_max: 3000000,
        },
      ],
    })
  }),

  // Applications - Submit
  http.post(`${API_URL}/applications`, async ({ request }) => {
    const body = await request.json() as any
    
    return HttpResponse.json({
      data: {
        id: '1',
        application_number: `APP-${Date.now()}`,
        status: 'pending',
        ...body,
      },
    }, { status: 201 })
  }),

  // Claims - Create
  http.post(`${API_URL}/claims`, async ({ request }) => {
    return HttpResponse.json({
      data: {
        id: '1',
        claim_number: `CLM-${Date.now()}`,
        status: 'submitted',
      },
    }, { status: 201 })
  }),

  // Policies - List
  http.get(`${API_URL}/policies`, () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          policy_number: 'POL-2026-001234',
          product_name: 'Asuransi Jiwa Premium',
          category: 'life',
          status: 'active',
        },
      ],
    })
  }),

  // Notifications
  http.get(`${API_URL}/notifications`, () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Notification',
        message: 'This is a test',
        read: false,
        created_at: new Date().toISOString(),
      },
    ])
  }),

  http.get(`${API_URL}/notifications/unread-count`, () => {
    return HttpResponse.json({ count: 1 })
  }),

  http.put(`${API_URL}/notifications/:id/read`, () => {
    return HttpResponse.json({ success: true })
  }),
]
