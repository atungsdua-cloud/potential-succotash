import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, size = 16 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300 dark:text-gray-600'
          } transition-colors`}
        />
      ))}
    </div>
  );
}
