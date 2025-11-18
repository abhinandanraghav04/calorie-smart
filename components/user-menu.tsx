"use client";

import * as React from "react";
import { User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Profile", icon: User, href: "#" },
  { label: "Account Settings", icon: Settings, href: "#" },
  { label: "Sign out", icon: LogOut, href: "#" },
];

export function UserMenu() {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <User className="h-5 w-5" />
      </Button>
      <div
        className={cn(
          "bg-popover text-popover-foreground absolute right-0 mt-2 w-48 overflow-hidden rounded-md border shadow-lg transition-all",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <div className="text-muted-foreground py-2 text-sm">
          Signed in as{" "}
          <span className="text-foreground block font-medium">
            user@example.com
          </span>
        </div>
        <div className="border-t" />
        <ul className="py-1 text-sm">
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="hover:bg-muted hover:text-foreground flex items-center gap-2 px-4 py-2 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
