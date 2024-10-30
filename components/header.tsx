"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

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
    <header className='sm:py-2 lg:py-2'>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/80 dark:bg-gray-900/80' : 'bg-transparent'
        }`}
      >
        <div className='container flex items-center justify-between'>
          <div className='flex items-center'>
            <Link href='/analyzer/meeting'>
              <h1 className='text-xl md:text-2xl font-bold'>PinPoint AI</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
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


          {/* Mobile Navigation */}
          <div className='md:hidden flex items-center ml-auto gap-4'>
            <ThemeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>
  );
}
