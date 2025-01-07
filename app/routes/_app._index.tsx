import type { MetaFunction } from "@remix-run/cloudflare";
export const meta: MetaFunction = () => {
  return [{ title: "TixBee - Home" }, { name: "description", content: "Welcome to Remix!" }];
};

import Card from "~/components/landing-page/Card";
import Count from "~/components/landing-page/Count";
import Hero from "~/components/landing-page/Hero";
import Circles from "~/components/landing-page/Circles";
import Testimonials from "~/components/landing-page/Testimonials";
import FAQ from "~/components/landing-page/FAQ";
import TechShowcase from "~/components/landing-page/TechShowcase";

export default function Index() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-8 mb-8 px-4 lg:px-0 max-w-5xl mx-auto">
      <section className="flex w-full flex-1 flex-col items-start justify-center px-41">
        <section className="grid gap-8">
          {/* <Meteors number={20} /> */}
          <Hero />
          <Card />
          <Count />
          <Circles />
          <TechShowcase />
          <Testimonials />
          <FAQ />
        </section>
      </section>
    </main>
  );
}
