import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link href='/customer'>
      <a>
        <Image src='/rkchicken-logo.png' width={120} height={58} alt='logo' />
      </a>
    </Link>
  )
}
