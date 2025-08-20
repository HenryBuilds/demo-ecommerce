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
  Info,
  ChevronDown,
  Package,
  HelpCircle,
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

  const NavItems = ({ mobile = false, onItemClick = () => {} }) => (
    <>
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
    </>
  );

  const UserDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-secondary/80 transition-colors"
        >
          <User className="w-5 h-5 mr-2 text-primary" />
          {user?.name || user?.email}
          <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
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
  );

  const MobileUserMenu = ({ onItemClick = () => {} }) => (
    <>
      {user && (
        <>
          <Button
            variant="ghost"
            onClick={() => {
              router.push("/my-purchases");
              onItemClick();
            }}
            className="w-full justify-start hover:bg-secondary/80 transition-colors"
          >
            <Package className="w-5 h-5 mr-2 text-primary" />
            My Purchases
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              router.push("/support");
              onItemClick();
            }}
            className="w-full justify-start hover:bg-secondary/80 transition-colors"
          >
            <HelpCircle className="w-5 h-5 mr-2 text-primary" />
            Support
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              handleLogout();
              onItemClick();
            }}
            className="w-full justify-start hover:bg-secondary/80 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2 text-primary" />
            Logout
          </Button>
        </>
      )}
    </>
  );

  return (
    <>
      {/* Demo disclaimer bar */}
      <div className="w-full bg-yellow-400 text-black text-center text-sm py-2 px-4 font-semibold sticky top-0 z-50">
        <div className="flex items-center justify-center space-x-2">
          <Info className="w-4 h-4" />
          <span>This is a demo project. Purchases are not possible.</span>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="sticky top-[42px] z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo / Shop Title */}
            <Link href="/" className="flex items-center space-x-3 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Template Shop
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              <NavItems />
              {user && <UserDropdown />}
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
                    <div className="flex items-center pb-4 border-b">
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
                      <MobileUserMenu onItemClick={() => setIsOpen(false)} />
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
