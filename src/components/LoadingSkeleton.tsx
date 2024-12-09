export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <LoadingSkeleton className="aspect-video rounded-lg md:rounded-xl" />
      <div className="px-1 space-y-2">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-3 w-1/2" />
        <LoadingSkeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <LoadingSkeleton className="h-8 w-32 mb-6" />
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center gap-6">
            {/* Avatar Skeleton */}
            <div className="relative">
              <LoadingSkeleton className="w-32 h-32 rounded-full" />
              <LoadingSkeleton className="absolute bottom-0 right-0 w-10 h-10 rounded-full border-4 border-white dark:border-gray-800" />
            </div>

            {/* Content Skeleton */}
            <div className="w-full max-w-xl space-y-8">
              <div className="space-y-6">
                <div>
                  <LoadingSkeleton className="h-5 w-20 mb-2" />
                  <LoadingSkeleton className="h-12 w-full rounded-lg" />
                </div>
                
                <div>
                  <LoadingSkeleton className="h-5 w-20 mb-2" />
                  <LoadingSkeleton className="h-12 w-full rounded-lg" />
                </div>
                
                <div>
                  <LoadingSkeleton className="h-5 w-20 mb-2" />
                  <LoadingSkeleton className="h-32 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UploadSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <LoadingSkeleton className="h-8 w-48" />
      
      {/* Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video Upload Skeleton */}
        <div className="space-y-2">
          <LoadingSkeleton className="h-5 w-24" />
          <LoadingSkeleton className="w-full aspect-[4/3] rounded-lg" />
        </div>
        
        {/* Thumbnail Upload Skeleton */}
        <div className="space-y-2">
          <LoadingSkeleton className="h-5 w-24" />
          <LoadingSkeleton className="w-full aspect-[4/3] rounded-lg" />
        </div>
      </div>

      {/* Title Input Skeleton */}
      <div className="space-y-2">
        <LoadingSkeleton className="h-5 w-16" />
        <LoadingSkeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Genre and Year Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <LoadingSkeleton className="h-5 w-16" />
          <LoadingSkeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <LoadingSkeleton className="h-5 w-16" />
          <LoadingSkeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Description Input Skeleton */}
      <div className="space-y-2">
        <LoadingSkeleton className="h-5 w-24" />
        <LoadingSkeleton className="h-32 w-full rounded-lg" />
      </div>

      {/* Submit Button Skeleton */}
      <LoadingSkeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

export function VideoPlayerSkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <LoadingSkeleton className="w-full aspect-video rounded-xl" />
            
            {/* Video Info */}
            <LoadingSkeleton className="h-8 w-3/4" />
            <div className="flex gap-2">
              <LoadingSkeleton className="h-4 w-20" />
              <LoadingSkeleton className="h-4 w-20" />
              <LoadingSkeleton className="h-4 w-20" />
            </div>
            
            {/* Actions */}
            <div className="flex gap-4">
              <LoadingSkeleton className="h-10 w-24" />
              <LoadingSkeleton className="h-10 w-24" />
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <LoadingSkeleton className="h-6 w-32" />
              <LoadingSkeleton className="h-24 w-full rounded-lg" />
              {/* Comment Items */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <LoadingSkeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <LoadingSkeleton className="h-4 w-32" />
                    <LoadingSkeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Videos Skeleton */}
          <div className="lg:col-span-1">
            <LoadingSkeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}