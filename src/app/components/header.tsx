'use client'

import Link from 'next/link';

export default function HeaderUI() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/rooms">Room</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </nav>
      <hr/>
      <br/>
    </header>
  );
}
