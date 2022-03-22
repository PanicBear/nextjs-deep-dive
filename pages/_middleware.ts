import { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.ua?.isBot) {
    return new Response('no bots allowed', { status: 403 });
  }
  if (!req.url.includes('/api')) {
    if (!req.url.includes('/enter') && !req.cookies.carrotsession) {
      return NextResponse.redirect(new URL('/enter', req.url));
    }
  }
}
