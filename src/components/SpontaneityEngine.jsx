import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const trips = [
  { city: "Mexico City", country: "Mexico", time: "48 hours", vibe: "tacos + rooftop nights", price: "$420", emoji: "🌮" },
  { city: "Lisbon", country: "Portugal", time: "3 days", vibe: "sun + tiled streets", price: "$510", emoji: "🌊" },
  { city: "Montreal", country: "Canada", time: "2 nights", vibe: "jazz + late dinners", price: "$280", emoji: "🎷" },
  { city: "Tokyo", country: "Japan", time: "72 hours", vibe: "neon + tiny ramen bars", price: "$690", emoji: "🍜" },
  { city: "New Orleans", country: "USA", time: "48 hours", vibe: "brass bands + beignets", price: "$240", emoji: "🎺" },
  { city: "Copenhagen", country: "Denmark", time: "3 days", vibe: "bikes + bakeries", price: "$580", emoji: "🚲" },
];

export default function SpontaneityEngine() {
  const [index, setIndex] = useState(null);
  const trip = useMemo(() => (index === null ? null : trips[index]), [index]);

  function surprise() {
    let next = Math.floor(Math.random() * trips.length);
    if (next === index) next = (next + 1) % trips.length;
    setIndex(next);
  }

  return (
    <section className="engine-section bg-ink text-paper">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-flame">
              prototype / 001
            </span>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              Stop searching.
              <br />
              <em>Start going.</em>
            </h2>
            <p className="mt-5 max-w-md text-mist">
              Tell us nothing. We'll give you a reason to leave. This little
              prototype is a peek at what Spontraveous could feel like.
            </p>
            <button
              onClick={surprise}
              className="mt-8 rounded-full bg-flame px-7 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              {trip ? "Do it again →" : "Surprise me →"}
            </button>
          </div>

          <div className="relative min-h-[360px]">
            <AnimatePresence mode="wait">
              {trip ? (
                <motion.div
                  key={trip.city}
                  initial={{ opacity: 0, y: 18, rotate: -1.5 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -18, rotate: 1.5 }}
                  className="ticket-card"
                >
                  <div className="flex items-start justify-between border-b border-ink/15 pb-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-ink/45">
                        Your next move
                      </p>
                      <h3 className="mt-2 font-display text-4xl sm:text-5xl">
                        {trip.city}
                      </h3>
                      <p className="mt-1 text-ink/60">{trip.country}</p>
                    </div>
                    <span className="text-5xl" aria-hidden="true">{trip.emoji}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink/45">Time</p>
                      <p className="mt-1 font-semibold">{trip.time}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink/45">Vibe</p>
                      <p className="mt-1 font-semibold">{trip.vibe}</p>
                    </div>
                  </div>

                  <div className="dashed-divider pt-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-ink/45">Demo starting point</p>
                        <p className="mt-1 font-display text-2xl">{trip.price}</p>
                      </div>
                      <span className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper">
                        providers → soon
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="engine-empty"
                >
                  <span className="text-6xl" aria-hidden="true">✈︎</span>
                  <p className="mt-5 font-display text-2xl">Your plans are suspiciously empty.</p>
                  <p className="mt-2 max-w-sm text-ink/55">
                    Good. Hit the button and let chance make the first move.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
