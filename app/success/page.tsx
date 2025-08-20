"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, ArrowLeft, Package } from "lucide-react";
import { useCart } from "@/hooks/CartContext";
import { Order } from "@/types/types";

function SuccessPageContent() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, clearCart } = useCart();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId && state.items.length > 0) {
      createOrder();
    } else if (!sessionId) {
      router.push("/");
    }
  }, [sessionId, state.items, router]);

  const createOrder = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        clearCart();
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto py-16 px-4 max-w-2xl">
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been processed
            successfully.
          </p>
        </div>

        {order && (
          <Card className="shadow-lg bg-background/80 backdrop-blur border-0 mb-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Order Number:</span>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Amount:</span>
                  <p className="font-medium">
                    €{Number(order.totalAmount).toFixed(2)}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Items Purchased:</h3>
                <div className="space-y-3">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × €
                            {Number(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {item.product.downloadUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(item.product.downloadUrl!, "_blank")
                          }
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center space-y-4">
          <Button
            onClick={() => router.push("/purchases")}
            size="lg"
            className="mr-4"
          >
            View my purchases
          </Button>
          <Button onClick={() => router.push("/")} size="lg" variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>

          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your email address.
          </p>
        </div>
      </div>
    </div>
  );
}

function SuccessPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessPageLoading />}>
      <SuccessPageContent />
    </Suspense>
  );
}
