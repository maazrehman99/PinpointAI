"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = () => {
    setScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className='sm:py-0 lg:py-4'>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/80 dark:bg-gray-900/80' : 'bg-transparent'
        }`}
      >
        <div className='container flex items-center justify-between'>
          <div className='flex items-center'>
            <Link href='/'>
              <h1 className='text-2xl font-bold'>PinPoint AI</h1>
            </Link>
          </div>

          <div className='hidden md:flex items-center gap-10 ml-auto'>
            <ul className='flex gap-10 text-sm font-medium'>
              <SignedOut>
                <li>
                  <Link href='/features'>Features</Link>
                </li>
                <li>
                  <Link href='/pricing'>Pricing</Link>
                </li>
                <li>
                  <Link href='/docs'>Docs</Link>
                </li>
              </SignedOut>
              <SignedIn>
                {/* Render an empty li to maintain structure */}
                <li className='invisible' aria-hidden="true" />
              </SignedIn>
            </ul>
            <ThemeToggle />
            <SignedOut>
              <Link href='/sign-up'>
                <Button variant='secondary' size='sm' className='text-white bg-blue-500 hover:bg-blue-600'>
                  Get Started
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          <div className='md:hidden'>
            <button
              className='p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className='md:hidden bg-background dark:bg-gray-900 p-4'>
            <ul className='flex flex-col gap-4 text-sm font-medium'>
              <SignedOut>
                <li>
                  <Link href='/features'>Features</Link>
                </li>
                <li>
                  <Link href='/pricing'>Pricing</Link>
                </li>
                <li>
                  <Link href='/docs'>Docs</Link>
                </li>
                <li>
                  <Link href='/sign-up'>
                    <Button variant='secondary' size='sm' className='text-white bg-blue-500 hover:bg-blue-600'>
                      Get Started
                    </Button>
                  </Link>
                </li>
              </SignedOut>
              <SignedIn>
                {/* Render an empty li to maintain structure */}
                <li className='invisible' aria-hidden="true" />
              </SignedIn>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
