"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  value:      number;
  editable?:  boolean;
  size?:      number;
  onChange?:  (v: number) => void;
}

export default function StarRating({ value, editable = false, size = 16, onChange }: Props) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (editable ? hover || value : value) >= star;
        return (
          <Star
            key={star}
            size={size}
            fill={filled ? "#F59E0B" : "none"}
            stroke={filled ? "#F59E0B" : "#D1D5DB"}
            className={editable ? "cursor-pointer transition-all" : ""}
            onMouseEnter={() => editable && setHover(star)}
            onMouseLeave={() => editable && setHover(0)}
            onClick={() => editable && onChange?.(star)}
          />
        );
      })}
    </div>
  );
}
