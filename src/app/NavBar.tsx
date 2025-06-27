'use client';
import React from 'react'
import Link from 'next/link'
import { FaBug } from "react-icons/fa";
import { usePathname } from 'next/navigation';
import classNames from 'classnames';

const NavBar = () => {
    const pathname = usePathname();
    const links= 
    [
        {label: "Dashboard", href: "/"},
        {label: "Issues", href: "/issues"},
    ];
  return (
  <nav className='flex space-x-6 p-4 border-b-2 h-16 items-center mb-4'> 
    <Link href="/"><FaBug/>
    </Link>
    <ul className='flex space-x-6'>
        {links.map((link) => 
            <Link 
                key={link.href} 
                className={classNames({
                    'text-zinc-900':link.href === pathname,
                    'text-zinc-500': link.href !== pathname,
                    'hover:text-zinc-800 transition-colors': true,
                })}
                 href={link.href}>{link.label}
            </Link>
        )}
    </ul>
  </nav>

)
}

export default NavBar