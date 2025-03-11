import { LucideLoaderCircle } from 'lucide-react'
import React from 'react'


export default function Loader() {
  return (
    <div className='w-full h-full flex p-8 justify-center items-center'>
      <LucideLoaderCircle className='animate-spin'/>
    </div>
  )
}