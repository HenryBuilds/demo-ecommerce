"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, ShoppingCart, User, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const cartItemCount = 3;

  const NavItems = ({ mobile = false, onItemClick = () => {} }) => (
    <>
      {user && (
        <Button
          variant={mobile ? "ghost" : "ghost"}
          onClick={() => {
            handleLogout();
            onItemClick();
          }}
          className={`${
            mobile ? "w-full justify-start" : ""
          } hover:bg-secondary/80 transition-colors`}
        >
          <LogOut className="w-5 h-5 mr-2 text-primary" />
          Logout
        </Button>
      )}

      {!user && (
        <Button
          variant={mobile ? "ghost" : "ghost"}
          onClick={() => {
            router.push("/login");
            onItemClick();
          }}
          className={`${
            mobile ? "w-full justify-start" : ""
          } hover:bg-secondary/80 transition-colors`}
        >
          <User className="w-5 h-5 mr-2 text-primary" />
          Login
        </Button>
      )}

      <Button
        variant={mobile ? "ghost" : "ghost"}
        onClick={() => {
          router.push("/cart");
          onItemClick();
        }}
        className={`relative ${
          mobile ? "w-full justify-start" : ""
        } hover:bg-secondary/80 transition-colors`}
      >
        <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
        Cart
        {cartItemCount > 0 && (
          <Badge
            variant="secondary"
            className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground font-semibold rounded-full border-2 border-background shadow-lg"
          >
            {cartItemCount}
          </Badge>
        )}
      </Button>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Sparkles className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/20 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Template Shop
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            <NavItems />
          </div>

          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:bg-secondary/80 transition-colors"
                >
                  <Menu className="h-6 w-6 text-primary" />
                  {cartItemCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground font-semibold rounded-full border-2 border-background"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center space-x-3 pb-4 border-b">
                    <div className="relative">
                      <Sparkles className="h-7 w-7 text-primary" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/20 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Template Shop
                    </span>
                  </div>

                  {user && (
                    <div className="pb-4 border-b">
                      <p className="text-sm text-muted-foreground">
                        Welcome back,
                      </p>
                      <p className="font-medium text-foreground">
                        {user.name || user.email}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col space-y-2">
                    <NavItems
                      mobile={true}
                      onItemClick={() => setIsOpen(false)}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
