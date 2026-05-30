"use client";

import { CATEGORIAS } from "@/lib/constants";

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onChange("")}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all
          ${selected === ""
            ? "bg-primary text-white border-primary"
            : "bg-white text-neutral-600 border-neutral-200 hover:border-primary hover:text-primary"
          }`}
      >
        🌐 Todos
      </button>
      {CATEGORIAS.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all
            ${selected === cat.id
              ? "bg-primary text-white border-primary"
              : "bg-white text-neutral-600 border-neutral-200 hover:border-primary hover:text-primary"
            }`}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  );
}
