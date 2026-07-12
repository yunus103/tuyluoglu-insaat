import { RiAddLine, RiSubtractLine } from "react-icons/ri";

type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ({ items, className = "" }: { items: FAQItem[]; className?: string }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`divide-y divide-[var(--color-border)] ${className}`}>
      {items.map((item, index) => {
        return (
          <details
            key={index}
            name="faq-accordion"
            className="group"
          >
            <summary
              className="flex w-full items-start justify-between py-5 text-left gap-4 group cursor-pointer list-none [&::-webkit-details-marker]:hidden"
            >
              <span
                className="font-heading text-[var(--color-black)] text-lg leading-snug group-hover:text-[var(--color-accent-dark)] transition-colors duration-200"
              >
                {item.question}
              </span>
              <span
                className="shrink-0 w-7 h-7 flex items-center justify-center border transition-colors duration-200 mt-0.5 bg-transparent border-[var(--color-border)] text-[var(--color-muted)] group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)] group-open:bg-[var(--color-accent)] group-open:border-[var(--color-accent)] group-open:text-white"
              >
                <RiAddLine size={14} className="group-open:hidden" />
                <RiSubtractLine size={14} className="hidden group-open:block" />
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

