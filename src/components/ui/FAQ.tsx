"use client";

import { useState } from "react";
import { RiAddLine, RiSubtractLine } from "react-icons/ri";

type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ({ items, className = "" }: { items: FAQItem[]; className?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className={`divide-y divide-[var(--color-border)] ${className}`}>
      {items.map((item, index) => {
        const isOpen = activeIndex === index;
        return (
          <details
            key={index}
            open={isOpen}
            className="group"
          >
            <summary
              onClick={(e) => {
                e.preventDefault();
                setActiveIndex(isOpen ? null : index);
              }}
              className="flex w-full items-start justify-between py-5 text-left gap-4 group cursor-pointer list-none [&::-webkit-details-marker]:hidden"
            >
              <span
                className="font-heading text-[var(--color-black)] text-lg leading-snug group-hover:text-[var(--color-accent-dark)] transition-colors duration-200"
              >
                {item.question}
              </span>
              <span
                className={`shrink-0 w-7 h-7 flex items-center justify-center border transition-colors duration-200 mt-0.5 ${
                  isOpen
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                    : "bg-transparent border-[var(--color-border)] text-[var(--color-muted)] group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)]"
                }`}
              >
                {isOpen ? <RiSubtractLine size={14} /> : <RiAddLine size={14} />}
              </span>
            </summary>

            <div className="pb-6">
              <p className="text-[var(--color-gray)] leading-relaxed text-base border-l-2 border-[var(--color-accent)] pl-5">
                {item.answer}
              </p>
            </div>
          </details>
        );
      })}
    </div>
  );
}
