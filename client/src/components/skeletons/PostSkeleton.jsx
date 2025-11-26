const PostSkeleton = () => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 animate-pulse w-full">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3 mb-3">
                {/* Avatar Circle */}
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>

                {/* Username & Date Lines */}
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
            </div>

            {/* Text Lines */}
            <div className="space-y-2 mb-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Image Block */}
            <div className="h-64 bg-gray-200 rounded-xl w-full mb-3"></div>

            {/* Actions (Like/Comment) */}
            <div className="flex gap-6 pt-2">
                <div className="h-5 w-10 bg-gray-200 rounded"></div>
                <div className="h-5 w-10 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
};

export default PostSkeleton;