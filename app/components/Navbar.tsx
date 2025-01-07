import React from "react";
import { Form, Link } from "@remix-run/react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { OutletContext } from "~/types/types";
import TicketLogo from "~/components/TicketLogoWithBg";
import { ModeToggle } from "~/components/ModeToggle";
import { useLocation } from "@remix-run/react";

const NAVIGATION_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/tickets/?category=conference", label: "Tickets" },
  { path: "/tickets/new", label: "Create ticket" },
] as const;

const USER_MENU_ITEMS = [
  { path: "/billing-address", label: "Billing address" },
  { path: "/view-orders", label: "Orders" },
] as const;

const NavigationLink = ({
  to,
  children,
  className,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Link
    to={to}
    className={`group inline-flex w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 h-9 rounded-full bg-transparent text-muted-foreground hover:bg-accent/50 font-inter-medium`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <SheetClose asChild>
    <Link
      to={to}
      className="flex flex-1 items-center justify-between border-b py-4 font-medium transition-all hover:underline"
    >
      {children}
    </Link>
  </SheetClose>
);

const UserAvatar = ({ email }: { email: string }) => (
  <div className="h-10 w-10 rounded-full bg-muted flex justify-center items-center">
    {email[0].toUpperCase()}
  </div>
);

interface DropDownProps extends OutletContext {
  // currentUser: User | null
  isMobile: boolean;
}

const UserDropdownMenu = ({ currentUser, isMobile }: DropDownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="outline-none">
      <div className="cursor-pointer">
        <UserAvatar email={currentUser!.email} />
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="bottom" align={isMobile ? "start" : "end"} className="bg-background">
      <DropdownMenuLabel className="font-light font-inter-medium">My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {isMobile
        ? USER_MENU_ITEMS.map(({ path, label }) => (
            <SheetClose asChild>
              <Link key={path} to={path}>
                <DropdownMenuItem className="hover:cursor-pointer font-inter-light font-light focus:bg-accent/50">
                  {label}
                </DropdownMenuItem>
              </Link>
            </SheetClose>
          ))
        : USER_MENU_ITEMS.map(({ path, label }) => (
            <Link key={path} to={path}>
              <DropdownMenuItem className="hover:cursor-pointer font-inter-light font-light focus:bg-accent/50">
                {label}
              </DropdownMenuItem>
            </Link>
          ))}
      {isMobile ? (
        <SheetClose asChild>
          <div className="ml-2 my-2">
            <Form method="post" action="/signout">
              <Button variant="destructive" size="sm" type="submit">
                Logout
              </Button>
            </Form>
          </div>
        </SheetClose>
      ) : (
        <div className="ml-2 my-2">
          <Form method="post" action="/signout">
            <Button variant="destructive" size="sm" type="submit">
              Logout
            </Button>
          </Form>
        </div>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

const MobileMenu = ({ currentUser }: OutletContext) => (
  <Sheet>
    <div className="flex items-center md:hidden">
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden rounded-full mr-2">
          <Menu className="p-0.5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      {/* {currentUser && <UserDropdownMenu currentUser={currentUser} />} */}
      <ModeToggle />
    </div>
    <SheetContent side="left" className="md:hidden">
      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
      <SheetDescription className="sr-only">Use arrow keys to navigate</SheetDescription>
      {/* for screen reader sr-only class is used */}
      <div className="grid gap-4 p-4">
        <SheetClose asChild>
          <Link to="/" className="flex items-center gap-2">
            <TicketLogo className="h-10 w-10" />
            <span className="sr-only">TixBee</span>
          </Link>
        </SheetClose>
        <nav className="grid gap-2">
          {NAVIGATION_ITEMS.map(({ path, label }) => (
            <MobileNavLink key={path} to={path}>
              {label}
            </MobileNavLink>
          ))}
          {!currentUser && (
            <>
              <MobileNavLink to="/auth/signin">Signin</MobileNavLink>
              <MobileNavLink to="/auth/signup">Signup</MobileNavLink>
            </>
          )}
          {/* <ModeToggle /> */}
          {currentUser && (
            <div className="flex flex-1 items-center justify-between border-b py-4 font-medium transition-all">
              <UserDropdownMenu currentUser={currentUser} isMobile={true} />
            </div>
          )}
        </nav>
      </div>
    </SheetContent>
  </Sheet>
);

export default function Header({ currentUser }: OutletContext) {
  const location = useLocation();
  const width = location.pathname === "/tickets/" ? "max-w-5xl" : "max-w-5xl";

  return (
    <header className={`sticky top-3 z-10 ${width} mx-auto w-full px-4 lg:px-0`}>
      <div className="flex items-center justify-between gap-8 rounded-full border border-border px-2.5 py-1.5 backdrop-blur-lg md:top-6 mx-auto w-full">
        <div className="mx-4">
          <Link to="/" className="flex items-center">
            <TicketLogo className="h-8 w-8" />
            <span className="font-semibold pl-2">TixBee</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-3 font-medium md:flex">
          {NAVIGATION_ITEMS.map(({ path, label }) => (
            <NavigationLink key={path} to={path}>
              {label}
            </NavigationLink>
          ))}
          {currentUser ? (
            <UserDropdownMenu currentUser={currentUser} isMobile={false} />
          ) : (
            <>
              <NavigationLink to="/auth/signin">Signin</NavigationLink>
              <NavigationLink to="/auth/signup">Signup</NavigationLink>
            </>
          )}
          <ModeToggle />
        </nav>

        <MobileMenu currentUser={currentUser} />
      </div>
    </header>
  );
}
