import localFont from 'next/font/local';
import { Inter } from 'next/font/google';

/**
 * PP Neue Machina Plain — brand display face.
 * Subset to latin + Spanish accents. A web licence from Pangram Pangram is
 * required before going live; without it, swap `display` for `sans`.
 */
export const display = localFont({
  src: [
    { path: '../app/fonts/machina-reg.woff2', weight: '400', style: 'normal' },
    { path: '../app/fonts/machina-bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
  fallback: ['Inter', 'system-ui', 'sans-serif'],
});

export const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
