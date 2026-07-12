import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

/**
 * Next.js 16 Proxy Middleware.
 * 1. Proxies API requests matching /api/backend/* to the Express backend.
 * 2. Proxies auth requests matching /api/auth/* to Better Auth running on the Express backend.
 * 3. Restricts dashboard routes (/dashboard/*) to logged-in sessions by querying the backend auth session endpoint.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. API Request Proxying for /api/backend/*
  if (pathname.startsWith('/api/backend/')) {
    const path = pathname.replace('/api/backend/', '');
    const search = request.nextUrl.search;
    const url = `${BACKEND_URL}/${path}${search}`;
    return forwardRequest(request, url);
  }



  // 3. Route Guard for /dashboard/* and /items/*
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/items/')) {
    try {
      // Query the Better Auth get-session endpoint (which is proxied above to backend)
      const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
        cache: 'no-store',
      });

      const session = await res.json().catch(() => null);

      if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('[Auth Proxy Middleware Error]:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Helper to clone and forward the HTTP request to the backend server.
 */
async function forwardRequest(request: NextRequest, url: string) {
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('connection');
  headers.delete('content-length');

  const options: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      options.body = await request.arrayBuffer();
    } catch (e) {
      // Ignore if no payload
    }
  }

  try {
    const res = await fetch(url, options);
    const body = await res.arrayBuffer();

    const responseHeaders = new Headers();
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'transfer-encoding' && key.toLowerCase() !== 'content-encoding') {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(body, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`[Proxy Error] Failed to connect to backend at ${url}:`, error);
    return NextResponse.json(
      { message: 'Express backend server is currently unreachable.' },
      { status: 502 }
    );
  }
}

export const config = {
  // Specifying matches for dashboard, items pages, and backend API routing
  matcher: ['/dashboard/:path*', '/items/:path*', '/api/backend/:path*'],
};
