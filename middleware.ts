import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public routes that don't require authentication
    const isPublicPath = path === '/login' || path === '/register';

    // Extract the token from the cookies (we set this in your login API)
    const token = request.cookies.get('token')?.value || '';

    // 1. If the user hits the root URL ("/")
    if (path === '/') {
        if (token) {
            // Logged in? Go straight to the dashboard
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
            // Not logged in? Go to login
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 2. If the user is logged in, prevent them from seeing the login/register pages
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 3. If the user is NOT logged in, prevent them from accessing protected routes
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

// 4. Specify exactly which routes this middleware should run on
export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/login',
        '/register'
    ]
};