export function MapSkeleton() {
    return (
        <div className="flex h-screen">
            {/* 左側地圖區域 skeleton */}
            <div className="flex-1 bg-gray-200 animate-pulse relative">
                {/* Search bar skeleton */}
                <div className="absolute top-4 left-4 w-80 h-12 bg-gray-300 rounded-lg" />

                {/* Current location button skeleton */}
                <div className="absolute bottom-4 right-4 w-14 h-14 bg-gray-300 rounded-full" />

                {/* Map markers skeleton (optional - just a few scattered circles) */}
                <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-gray-400 rounded-full" />
                <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-gray-400 rounded-full" />
                <div className="absolute top-2/3 left-3/4 w-8 h-8 bg-gray-400 rounded-full" />
            </div>

            {/* 右側側邊欄 skeleton (desktop only) */}
            <div className="hidden md:block w-[360px] bg-white border-l border-gray-200 p-4 space-y-4">
                {/* Header skeleton */}
                <div className="h-8 bg-gray-200 rounded animate-pulse" />

                {/* Place list items skeleton */}
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
