import { Moon, Sun, Laptop } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ModeToggle() {
  const systemTheme = "light";

  const handleClick = (theme: string) => {
    document.cookie = `theme=${theme}; path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax; Secure`;

    document.documentElement.setAttribute("data-theme", theme);

    // Add a temporary stylesheet for transitions
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        transition: background-color 200ms ease-out,
                    border-color 200ms ease-out,
                    color 200ms ease-out !important;
      }
    `;
    // document.head.appendChild(style);
    // setTimeout(() => {
    //   document.head.removeChild(style);
    // }, 300); // A bit longer than transition duration to ensure it completes
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none flex items-center">
          <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background">
          <DropdownMenuItem onClick={() => handleClick("light")} className="focus:bg-accent/50">
            <Sun className="h-4 w-4 mr-2" />
            <p>Light</p>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleClick("dark")} className="focus:bg-accent/50">
            <Moon className="h-4 w-4 mr-2" />
            <p>Dark</p>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleClick(systemTheme)} className="focus:bg-accent/50">
            <Laptop className="h-4 w-4 mr-2" />
            <p>System</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
