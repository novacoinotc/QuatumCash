interface WhyItemProps {
  number: string;
  title: string;
  desc: string;
}

export default function WhyItem({ number, title, desc }: WhyItemProps) {
  return (
    <div className="group flex gap-6 rounded-xl border-b border-[var(--dark-border)]/50 pb-6 transition-all duration-300 hover:pl-2 last:border-b-0">
      <span className="why-number font-[var(--font-primary)] text-4xl font-bold gradient-text shrink-0 transition-transform duration-500 group-hover:scale-110">
        {number}
      </span>
      <div>
        <h4 className="mb-1 font-[var(--font-primary)] text-base font-semibold text-white transition-colors duration-300 group-hover:text-[var(--purple-light)]">
          {title}
        </h4>
        <p className="text-sm leading-relaxed text-[var(--gray-400)]">{desc}</p>
      </div>
    </div>
  );
}
