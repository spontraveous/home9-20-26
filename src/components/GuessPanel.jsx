import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPONTANEOUS_WORDS = [
  "spontaneous", "impulsive", "random", "unplanned", "last minute",
  "last-minute", "no plan", "whim", "instant", "sponte", "impromptu",
  "on a whim",
];

const TRAVEL_WORDS = [
  "travel", "trip", "journey", "adventure", "vacation", "wanderlust",
  "flight", "explore", "getaway", "holiday", "voyage", "trav",
];

const HINTS = [
  "It isn't just two words stitched together — it's a way of deciding to go.",
  "Half of it moves fast. The other half moves far.",
  "You'll know it the moment you stop waiting for the 'right time' to book.",
];

function checkGuess(text) {
  const t = text.toLowerCase();
  const hasSpontaneous = SPONTANEOUS_WORDS.some((w) => t.includes(w));
  const hasTravel = TRAVEL_WORDS.some((w) => t.includes(w));
  return hasSpontaneous && hasTravel;
}

export default function GuessPanel({ onGuessResult }) {
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!guess.trim()) return;
    const isCorrect = checkGuess(guess);
    setSubmitted(true);
    setCorrect(isCorrect);
    setAttempts((a) => a + 1);
    onGuessResult?.({ guess, correct: isCorrect });
  }

  const hintToShow = HINTS[Math.min(attempts, HINTS.length) - 1];

  return (
    <section id="guess" className="bg-paper py-28 text-ink">
      <div className="mx-auto max-w-xl px-6">
        <h2 className="font-display text-3xl sm:text-4xl">
          What do you think it means?
        </h2>
        <p className="mt-3 text-ink/70">
          One guess at a time. Get the meaning right and we'll remember you
          were first.
        </p>

        <div className="stub-edge dashed-divider mt-10 rounded-[4px] border border-ink/15 bg-white/60 px-8 py-10">
          <AnimatePresence mode="wait">
            {!correct ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="type your best guess"
                  className="flex-1 rounded-full border border-ink/20 bg-white px-5 py-3 text-ink outline-none placeholder:text-ink/40"
                />
                <button
                  type="submit"
                  className="rounded-full bg-ink px-6 py-3 font-semibold text-paper transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  Submit guess
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left"
              >
                <p className="font-display text-xl text-flame">You got it.</p>
                <p className="mt-3 font-display text-2xl leading-snug">
                  spontraveous, adj. — describes a trip booked before doubt
                  has time to catch up with you.
                </p>
                <p className="mt-4 text-ink/70">
                  As a founding member, you get first access and locked-in
                  pricing when we launch. Leave your email below and we'll
                  hold your spot.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {submitted && !correct && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-sm text-ink/60"
            >
              Not quite. {hintToShow ?? "Keep guessing — you're closer than you think."}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
