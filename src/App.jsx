import { useRef, useState } from "react";
import Hero from "./components/Hero.jsx";
import GuessPanel from "./components/GuessPanel.jsx";
import Waitlist from "./components/Waitlist.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const guessRef = useRef(null);
  const [result, setResult] = useState({ guess: "", correct: false });

  return (
    <main className="font-body">
      <Hero onScrollToGuess={() => guessRef.current?.scrollIntoView({ behavior: "smooth" })} />
      <div ref={guessRef}>
        <GuessPanel onGuessResult={setResult} />
      </div>
      <Waitlist guess={result.guess} correct={result.correct} />
      <Footer />
    </main>
  );
}
