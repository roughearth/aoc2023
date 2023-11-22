import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { currentDay } from './lib/utils/dates';

export function middleware(request: NextRequest) {
  const { nextUrl: { pathname } } = request;

  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/day/${currentDay()}`;
    return NextResponse.rewrite(url);
  }
}