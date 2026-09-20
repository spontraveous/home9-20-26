const FAQS = [
  {
    q: "Is spontraveous a misspelling of spontaneous?",
    a: "No. Spontraveous is a word we made up on purpose. It's related in spirit to \u201cspontaneous,\u201d but it isn't the same word, isn't spelled the same way, and isn't defined the same way.",
  },
  {
    q: "So what does spontraveous mean?",
    a: "Spontraveous (adjective): describes a trip booked before doubt has time to catch up with you. That's the real definition — the guessing game above is how we're introducing it.",
  },
  {
    q: "How do you spell it?",
    a: "S-P-O-N-T-R-A-V-E-O-U-S. One word, no hyphen.",
  },
];

export default function Disambiguation() {
  return (
    <section id="faq" className="bg-paper py-24 text-ink">
      <div className="mx-auto max-w-xl px-6">
        <h2 className="font-display text-2xl sm:text-3xl">
          Before you ask autocorrect
        </h2>
        <dl className="mt-10 space-y-8">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="dashed-divider pt-6 first:border-t-0 first:pt-0">
              <dt className="font-display text-lg">{q}</dt>
              <dd className="mt-2 text-ink/70">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
