import React from 'react'
import { Skeleton } from '../ui/skeleton'



function DocumentLoader() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 bg-gray-100 rounded-lg shadow-md">
      <Skeleton className="h-8 w-3/4 animate-pulse bg-gray-300" />
      <Skeleton className="h-4 w-full animate-pulse bg-gray-300" />
      <Skeleton className="h-4 w-full animate-pulse bg-gray-300" />
      <Skeleton className="h-4 w-2/3 animate-pulse bg-gray-300" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full animate-pulse bg-gray-300" />
        <Skeleton className="h-4 w-full animate-pulse bg-gray-300" />
        <Skeleton className="h-4 w-5/6 animate-pulse bg-gray-300" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full animate-pulse bg-gray-300" />
        <Skeleton className="h-4 w-full animate-pulse bg-gray-300" />
        <Skeleton className="h-4 w-4/5 animate-pulse bg-gray-300" />
      </div>
    </div>
  )
}

export default DocumentLoader