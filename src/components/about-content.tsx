import { KofiButton } from "@/components/kofi-button";

// Shared About body — rendered both on the public /about page and as a
// sub-view inside the Settings sheet (so the sheet never has to navigate away).
export const AboutContent = () => (
  <div className="flex flex-col gap-4">
    <p className="text-muted">
      Brit Ready turns revising for the Life in the UK Test into something you can actually
      enjoy. Every examinable fact is tracked as you go, so instead of memorising a fixed
      list of questions you build genuine mastery of the material behind them.
    </p>
    <p className="text-muted">
      Learn the facts, practise under real exam conditions, and let a single readiness score
      tell you exactly when you&rsquo;re ready to book the real thing. It&rsquo;s free,
      works offline, and keeps all your progress on your own device.
    </p>

    <div className="pixel-panel px-4 py-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold">
        Disclaimer
      </p>
      <p className="text-sm leading-relaxed text-muted">
        This is an independent, non-official preparation tool for the Life in the UK Test.
        It is not affiliated with, endorsed by, or produced by GOV.UK, the Home Office, TSO,
        or any official Life in the UK Test provider. Questions in this product are original
        practice questions designed to help learners study knowledge areas covered by the
        official Guide for New Residents. This product does not contain real exam questions
        and does not guarantee that you will pass the official test.
      </p>
    </div>

    <div className="pixel-panel px-4 py-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">
        Your data
      </p>
      <p className="text-sm leading-relaxed text-muted">
        All your progress is stored only on this device, in your browser. No account is
        needed and nothing is sent to a server. Clearing your browser data or using the
        reset option will permanently erase your progress.
      </p>
    </div>

    <div className="mt-2 flex flex-col gap-2">
      <p className="text-sm text-muted">
        Enjoying Brit Ready? You can support its development:
      </p>
      <KofiButton className="w-fit" />
    </div>
  </div>
);
