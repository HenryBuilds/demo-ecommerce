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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  ShoppingCart,
  User,
  LogOut,
  ChevronDown,
  Package,
  HelpCircle,
  Store,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const cartItemCount = getTotalItems();

  return (
    <>
      {/* Demo disclaimer */}
      <div className="w-full bg-primary text-primary-foreground text-center text-xs py-1.5 px-4 font-medium sticky top-0 z-50">
        Demo Project — Purchases are not possible
      </div>

      {/* Main nav */}
      <nav className="sticky top-[30px] z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Template Shop
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/cart")}
                className="relative gap-2 text-muted-foreground hover:text-foreground"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full bg-primary text-primary-foreground">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              {!user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/login")}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <User className="w-4 h-4" />
                  Login
                </Button>
              )}

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-secondary-foreground" />
                      </div>
                      <span className="max-w-[120px] truncate">{user.name || user.email}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => router.push("/purchases")}>
                      <Package className="w-4 h-4 mr-2" />
                      My Purchases
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/support")}>
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
                onClick={() => router.push("/cart")}
              >
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4.5 w-4.5 flex items-center justify-center p-0 text-[10px] rounded-full bg-primary text-primary-foreground">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex flex-col mt-8">
                    <div className="flex items-center gap-2.5 pb-6 border-b border-border">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                        <Store className="w-4 h-4" />
                      </div>
                      <span className="text-lg font-bold tracking-tight text-foreground">Template Shop</span>
                    </div>

                    {user && (
                      <div className="py-4 border-b border-border">
                        <p className="text-xs text-muted-foreground">Signed in as</p>
                        <p className="font-medium text-sm text-foreground truncate">{user.name || user.email}</p>
                      </div>
                    )}

                    <div className="flex flex-col gap-1 py-4">
                      {!user && (
                        <Button
                          variant="ghost"
                          className="justify-start gap-2 h-10"
                          onClick={() => { router.push("/login"); setIsOpen(false); }}
                        >
                          <User className="w-4 h-4" />
                          Login
                        </Button>
                      )}
                      {user && (
                        <>
                          <Button
                            variant="ghost"
                            className="justify-start gap-2 h-10"
                            onClick={() => { router.push("/purchases"); setIsOpen(false); }}
                          >
                            <Package className="w-4 h-4" />
                            My Purchases
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start gap-2 h-10"
                            onClick={() => { router.push("/support"); setIsOpen(false); }}
                          >
                            <HelpCircle className="w-4 h-4" />
                            Support
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start gap-2 h-10"
                            onClick={() => { handleLogout(); setIsOpen(false); }}
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
