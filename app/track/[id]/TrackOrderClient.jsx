"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MapPanel from "./MapPanel";
import OrderLiveStatus from "./OrderLiveStatus";
import { etb, when, formatRelativeTime } from "@/lib/format";

const STORAGE_KEY = "addis-eats-orders";

export default function TrackOrderClient({
  orderId,
  username,
  role,
  initialOrder,
}) {
  const [order, setOrder] = useState(initialOrder ?? null);
  const [loading, setLoading] = useState(!initialOrder);
  const [usingLocalOrder, setUsingLocalOrder] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [relativePlacedAt, setRelativePlacedAt] = useState("");

  // Ensure server rendering and the first browser render match.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load the order from localStorage when server memory has no copy.
  useEffect(() => {
    function loadOrder() {
      if (initialOrder) {
        setOrder(initialOrder);
        setUsingLocalOrder(false);
        setLoading(false);
        return;
      }

      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];
        const savedOrders = Array.isArray(parsed) ? parsed : [];

        const found = savedOrders.find(
          (item) =>
            String(item.id) === String(orderId) &&
            (
              role === "staff" ||
              String(item.customerId).toLowerCase() ===
                String(username).toLowerCase()
            ),
        );

        setOrder(found || null);
        setUsingLocalOrder(Boolean(found));
      } catch (error) {
        console.error("Could not load the saved order:", error);
        setOrder(null);
        setUsingLocalOrder(false);
      }

      setLoading(false);
    }

    loadOrder();

    // Keep browser-saved order details synchronized across tabs
    // and with components that dispatch this custom event.
    window.addEventListener("storage", loadOrder);
    window.addEventListener("addis-eats-orders-updated", loadOrder);

    return () => {
      window.removeEventListener("storage", loadOrder);
      window.removeEventListener(
        "addis-eats-orders-updated",
        loadOrder,
      );
    };
  }, [orderId, username, role, initialOrder]);

  // Calculate relative time after mounting to avoid hydration mismatches.
  useEffect(() => {
    if (!mounted || !order?.createdAt) {
      setRelativePlacedAt("");
      return;
    }

    const date = new Date(order.createdAt);

    if (Number.isNaN(date.getTime())) {
      setRelativePlacedAt("");
      return;
    }

    setRelativePlacedAt(formatRelativeTime(date));
  }, [mounted, order?.createdAt]);

  // Keep the initial currency text deterministic during hydration.
  function formatMoney(value) {
    const amount = Number(value) || 0;

    return mounted
      ? etb.format(amount)
      : `ETB ${Math.round(amount)}`;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] p-8">
        <p className="text-center text-[#666666]">
          Finding your saved order...
        </p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#fbf8f2] px-5 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#e9e1d6] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-[#342a22]">
            Order Not Available in This Browser
          </h1>

          <p className="mt-4 text-[#666666]">
            We could not find this order on the server or in this
            browser&apos;s saved order history. Open the same browser
            and profile you used to place the order.
          </p>

          <Link
            href="/orders"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#7a263a] px-6 py-3 text-sm font-semibold text-white"
          >
            View My Orders
          </Link>
        </div>
      </main>
    );
  }

  const placedAt = order.createdAt
    ? new Date(order.createdAt)
    : null;

  const validPlacedAt =
    placedAt && !Number.isNaN(placedAt.getTime());

  return (
    <main className="min-h-screen bg-[#fbf8f2] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="border-b border-[#e9e1d6] pb-6">
          <p className="text-xs font-bold tracking-[0.18em] text-[#7a263a]">
            ADDIS EATS · DELIVERY TRACKING
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#342a22] sm:text-4xl">
            Track Your Order
          </h1>

          <p className="mt-2 text-sm text-[#716b61]">
            Order #{order.id}
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Map and accessible delivery-address text */}
          <div className="rounded-2xl border border-[#e9e1d6] bg-white p-5 sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-[#2F2F2F]">
              Delivery Map
            </h2>

            <MapPanel address={order.address} />

            <div className="mt-5 rounded-xl bg-[#F8F4EC] p-4">
              <h3 className="font-bold text-[#2F2F2F]">
                Delivery Destination
              </h3>

              <p className="mt-1 text-[#666666]">
                {order.address || "No delivery address recorded."}
              </p>

              <p className="mt-2 text-sm text-[#666666]">
                The Addis Eats courier marker uses a demonstration
                location, not live GPS. The delivery marker is based
                on address lookup and may be approximate.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Order status and SSE stream */}
            <section className="rounded-2xl border border-[#e9e1d6] bg-white p-6">
              <h2 className="text-xl font-bold text-[#2F2F2F]">
                Order Status
              </h2>

              {usingLocalOrder && (
                <p className="mt-4 rounded-xl bg-[#F8F4EC] p-4 text-sm text-[#666666]">
                  Order details are saved in this browser. The status
                  component below will attempt an SSE connection.
                  If the server cannot find this order, it may use
                  the server-seeded demonstration stream.
                </p>
              )}

              {/* Attempt SSE for both server-loaded and local orders. */}
              <OrderLiveStatus
                orderId={String(order.id)}
                initialStatus={order.status || "Preparing"}
              />

              <div className="mt-5 border-t border-[#E8DDD8] pt-4">
                <p className="text-sm text-[#666666]">
                  Order placed
                </p>

                <p className="mt-1 font-semibold text-[#2F2F2F]">
                  {validPlacedAt
                    ? mounted
                      ? when.format(placedAt)
                      : "Order date saved"
                    : "Date unavailable"}
                </p>

                {validPlacedAt && relativePlacedAt && (
                  <p className="mt-2 text-sm text-[#666666]">
                    {relativePlacedAt}
                  </p>
                )}
              </div>
            </section>

            {/* Order summary */}
            <section className="rounded-3xl border border-[#E8DDD8] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#2F2F2F]">
                Order Summary
              </h2>

              <ul className="mt-4 space-y-3">
                {(order.items || []).map((item, index) => (
                  <li
                    key={`${item.id ?? item.name}-${index}`}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <span className="text-[#666666]">
                      {item.name} × {item.quantity}
                    </span>

                    <span className="whitespace-nowrap font-semibold text-[#2F2F2F]">
                      {formatMoney(
                        Number(item.price) * Number(item.quantity),
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-3 border-t border-[#E8DDD8] pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#666666]">Subtotal</span>
                  <span className="font-semibold">
                    {formatMoney(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#666666]">Delivery Fee</span>
                  <span className="font-semibold">
                    {formatMoney(order.deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-t border-[#E8DDD8] pt-3">
                  <span className="font-bold text-[#2F2F2F]">
                    Total
                  </span>

                  <span className="text-lg font-bold text-[#7A263A]">
                    {formatMoney(order.total)}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
