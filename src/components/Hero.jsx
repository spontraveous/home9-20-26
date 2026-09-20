import { motion } from "framer-motion";
import Header from "./Header.jsx";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero({ onScrollToGuess }) {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden text-paper">
      <div className="sky" aria-hidden="true" />
      <Header />
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-28 text-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={rise}
            className="postmark inline-flex items-center px-4 py-1 text-sm tracking-wide text-mist"
          >
            a word that doesn't exist yet
          </motion.span>

          <motion.h1
            variants={rise}
            className="mt-8 font-display font-medium leading-[0.95] text-[15vw] sm:text-[9vw] lg:text-[7rem]"
          >
            spon·tra·ve·ous
          </motion.h1>

          <motion.p
            variants={rise}
            className="mx-auto mt-8 max-w-xl text-lg text-mist sm:text-xl"
          >
            We made it up — it's not a misspelling of "spontaneous." Nobody
            outside our team has defined it correctly yet. Get it right and
            you're in, before anyone else.
          </motion.p>

          <motion.div variants={rise} className="mt-12">
            <button
              onClick={onScrollToGuess}
              className="rounded-full bg-flame px-8 py-4 font-body font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Take a guess
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
