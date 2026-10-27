
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LiveOrders from "@/components/LiveOrders";

export const metadata = {
  title: "Orders",
  description: "View your previous orders and order history.",
};

export default async function OrdersPage() {
  const session = await getSession();

  // Signed-out visitors must sign in first.
  if (!session) {
    redirect("/login?next=%2Forders");
  }

  // Staff must use the Admin area, not the customer Orders page.
  if (session.role === "staff") {
    redirect("/login?next=%2Forders");
  }

  return (
    <main className="min-h-screen bg-[#fbf8f2] px-5 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a263a]">
            Order history
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#342a22] sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-2 text-sm text-[#716b61]">
            Keep an eye on your recent Addis Eats orders.
          </p>
        </div>

        <LiveOrders username={session.username} initialOrders={[]} />
      </div>
    </main>
  );
}
