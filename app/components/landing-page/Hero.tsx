import { Link } from "@remix-run/react";
import { Button } from "../ui/button";
import RainbowButton from "../RainbowButton";

const Hero = () => {
  return (
    <div className="my-10 flex w-full flex-col justify-center gap-1 px-3 py-4 text-center md:my-20 md:p-6">
      <div className="flex flex-col gap-6">
        <h1 className="font-cal text-4xl md:text-6xl bg-gradient-to-tl from-0% from-[hsl(var(--muted))] to-40% to-[hsl(var(--foreground))] bg-clip-text text-transparent">
          The ultimate marketplace to buy and sell tickets
        </h1>
        <p className="mx-auto max-w-md text-lg text-muted-foreground md:max-w-xl md:text-xl">
          Buy and sell tickets for upcoming events in your city. We provide a secure platform for
          ticket buyers and sellers to transact.
        </p>
      </div>
      <div className="my-4 flex items-center flex-col sm:flex-row space-y-2 sm:space-y-0 justify-center sm:space-x-5 max-w-48 mx-auto">
        <Link to="/tickets" className="w-full sm:w-auto">
          <RainbowButton>Explore Tickets</RainbowButton>
        </Link>
        <a href="https://google.com" target="_blank" className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="font-inter-medium text-sm h-11 shadow-md rounded-xl w-full sm:w-auto"
          >
            Star it on GitHub
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Hero;
