import { useState } from "react";
import { motion } from "framer-motion";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  DONE: "done",
  ERROR: "error",
};

export default function Waitlist({ guess, correct }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(STATUS.IDLE);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus(STATUS.LOADING);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, guess: guess ?? "", correct: !!correct }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus(STATUS.DONE);
    } catch {
      setStatus(STATUS.ERROR);
    }
  }

  return (
    <section id="waitlist" className="bg-ink py-28 text-paper">
      <div className="mx-auto max-w-xl px-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl">
          {correct ? "Hold my founding spot" : "Get on the list either way"}
        </h2>
        <p className="mt-3 text-mist">
          {correct
            ? "You solved it first — this locks in your founding member perks."
            : "Didn't crack it this time? You'll still be first to hear when we launch, and you can always come back and guess again."}
        </p>

        {status === STATUS.DONE ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 font-display text-xl text-gold"
          >
            You're on the list. We'll be in touch.
          </motion.p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@somewhere.com"
              className="flex-1 rounded-full border border-paper/20 bg-transparent px-5 py-3 text-paper outline-none placeholder:text-mist"
            />
            <button
              type="submit"
              disabled={status === STATUS.LOADING}
              className="rounded-full bg-gold px-6 py-3 font-semibold text-paper transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60"
            >
              {status === STATUS.LOADING ? "Joining…" : "Join the list"}
            </button>
          </form>
        )}

        {status === STATUS.ERROR && (
          <p className="mt-4 text-sm text-flame">
            Something went wrong on our end — mind trying again in a moment?
          </p>
        )}

        <p className="mt-6 text-xs text-mist/70">
          No spam. One email when we launch, maybe a hint before that.
        </p>
      </div>
    </section>
  );
}
