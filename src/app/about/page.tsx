import type { Metadata } from "next";
import { AboutContent } from "@/components/about-content";
import { BackButton } from "@/components/back-button";
import { UnionJack } from "@/components/union-jack";

export const metadata: Metadata = {
  title: "About",
  description: "About Brit Ready and the non-official disclaimer.",
};

// Public, standalone page (no app shell) — distinct from "/" (landing) and the
// "/app" experience. Reachable from both.
const AboutPage = () => (
  <main className="mx-auto w-full max-w-2xl px-5 py-10">
    <BackButton className="mb-8" />

    <div className="mb-6 flex items-center gap-3">
      <UnionJack className="h-6 w-auto rounded-[3px]" />
      <h1 className="text-4xl font-extrabold tracking-tight">About</h1>
    </div>

    <AboutContent />
  </main>
);

export default AboutPage;
