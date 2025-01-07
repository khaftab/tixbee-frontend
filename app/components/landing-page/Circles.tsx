import { Button } from "~/components/ui/button";
import OrbitingCircles from "~/components/OrbitingCircles";
import { Ticket, Tag, CreditCard, DollarSign } from "lucide-react";
import { Link } from "@remix-run/react";

const Circles = () => {
  return (
    <div className="w-full rounded-lg border border-border px-3 py-4 backdrop-blur-[2px] md:p-6 flex flex-col gap-6 bg-gradient-to-br from-0% from-[hsl(var(--muted))] to-20% to-transparent md:min-h-[350px]">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:gap-8">
        {/* Content Side */}
        <div className="flex flex-col gap-6 md:max-w-[50%] lg:max-w-[55%] text-justify md:absolute md:left-7 md:top-1/2 md:-translate-y-1/2">
          <div className="space-y-4">
            <p className="mx-auto text-muted-foreground">
              Buy and sell tickets for concerts, sports, theater, and more. Secure, simple, and
              reliable.
            </p>
            <p className="mx-auto text-muted-foreground">
              Our platform ensures a seamless experience from buying to selling. Get started now and
              explore the endless possibilities.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/tickets">
              <Button size="lg" className="w-full sm:w-auto">
                Find Tickets
              </Button>
            </Link>
            <Link to="/tickets/new">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sell Tickets
              </Button>
            </Link>
          </div>
        </div>

        {/* Orbiting Circles Side */}
        <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 mx-auto">
          <div className="relative h-[250px] w-[250px] md:h-[300px] md:w-[350px]">
            {/* Center content */}
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground md:h-20 md:w-20">
                <Ticket className="h-8 w-8 md:h-10 md:w-10" />
              </div>
            </div>

            {/* Larger orbits for md and up */}
            <div className="hidden md:block">
              <OrbitingCircles radius={80} duration={20} delay={0}>
                <TicketLogo className="h-6 w-6" />
              </OrbitingCircles>
              <OrbitingCircles radius={80} duration={20} delay={10}>
                <CreditCard className="h-6 w-6" />
              </OrbitingCircles>
              <OrbitingCircles radius={140} duration={30} delay={0} reverse>
                <DollarSign className="h-6 w-6" />
              </OrbitingCircles>
              <OrbitingCircles radius={140} duration={30} delay={15} reverse>
                <Tag className="h-6 w-6" />
              </OrbitingCircles>
            </div>
            <div className="block md:hidden">
              <OrbitingCircles radius={70} duration={20} delay={0}>
                <TicketLogo className="h-6 w-6" />
              </OrbitingCircles>
              <OrbitingCircles radius={70} duration={20} delay={10}>
                <CreditCard className="h-6 w-6" />
              </OrbitingCircles>
              <OrbitingCircles radius={120} duration={30} delay={0} reverse>
                <DollarSign className="h-6 w-6" />
              </OrbitingCircles>
              <OrbitingCircles radius={120} duration={30} delay={15} reverse>
                <Tag className="h-6 w-6" />
              </OrbitingCircles>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Circles;

const TicketLogo = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-tickets"
    {...props}
  >
    <path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8M6 10V8M6 14v1M6 19v2" />
    <rect width={20} height={13} x={2} y={8} rx={2} />
  </svg>
);
