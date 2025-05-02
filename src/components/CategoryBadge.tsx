
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const badgeClasses = {
    'Food': 'bg-red-500',
    'Travel': 'bg-blue-500',
    'Bills': 'bg-amber-500',
    'Shopping': 'bg-purple-500',
    'Entertainment': 'bg-green-500',
    'Other': 'bg-gray-500',
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white",
        badgeClasses[category],
        className
      )}
    >
      {category}
    </span>
  );
}
