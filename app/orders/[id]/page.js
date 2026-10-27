import { getOrder } from "@/lib/orders";
import { notFound } from "next/navigation";
import OrderStatus from "./OrderStatus";

async function OrderPage({ params }) {
  const { id } = await params;

  const order = getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fbf8f2] px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a263a]">
          Order tracking
        </p>
        <h1 className="mb-6 mt-2 text-3xl font-semibold tracking-tight text-[#342a22]">
          Order status
        </h1>

        <OrderStatus order={order} />
      </div>
    </main>
  );
}

export default OrderPage;