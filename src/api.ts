// =====================================================
// DILITE — typed client for the kitchen API (Express + MongoDB)
// =====================================================
const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:3003/api").replace(/\/+$/, "");

export type ApiMenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  veg: boolean;
  rating: string;
  time: number;
  tag?: string;
  available: boolean;
  productKind: string;
  group?: string;
  sortOrder?: number;
};

export type ApiPricing = {
  sizes: { label: string; sub: string; price: number }[];
  addons: { name: string; price: number }[];
  deliveryFee: number;
  freeDeliveryOver: number;
};

export type ApiOrderItem = {
  itemId: string;
  name: string;
  image: string;
  veg: boolean;
  qty: number;
  size?: string;
  addons: string[];
  unitPrice: number;
};

export type ApiOrder = {
  id: string;
  createdAt: string;
  createdAtISO: string;
  elapsedMinutes: number;
  estimatedDelivery: string;
  status: "New" | "Preparing" | "Out for delivery" | "Delivered" | "Cancelled";
  customer: { name: string; phone: string; hostel: string; room: string; landmark: string };
  items: ApiOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  payment: { method: "Cash on delivery" | "UPI"; status: "Pending" | "Paid" };
  notes?: string;
  statusHistory?: { status: string; at: string }[];
  itemCount: number;
};

export type NewOrderPayload = {
  customer: { name: string; phone: string; hostel: string; room: string; landmark: string };
  items: { itemId: string; qty: number; size?: string; addons: string[] }[];
  notes?: string;
  payment: { method: "Cash on delivery" | "UPI" };
  coupon?: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      (body as { message?: string } | null)?.message ?? `Request failed (${response.status})`;
    throw new Error(message);
  }
  return body as T;
}

export const api = {
  baseUrl: API_BASE,

  health() {
    return request<{ status: string; counts: Record<string, number> }>("/health");
  },

  async menu(): Promise<{ items: ApiMenuItem[]; categories: { name: string; slug: string }[]; pricing: ApiPricing }> {
    return request("/menu");
  },

  async orders(limit = 100): Promise<ApiOrder[]> {
    const body = await request<{ orders: ApiOrder[] }>(`/orders?limit=${limit}`);
    return body.orders;
  },

  async order(orderNumber: string): Promise<ApiOrder> {
    const body = await request<{ order: ApiOrder }>(`/orders/${encodeURIComponent(orderNumber)}`);
    return body.order;
  },

  async ordersForPhone(phone: string, limit = 50): Promise<ApiOrder[]> {
    const digits = phone.replace(/\D/g, "");
    const body = await request<{ orders: ApiOrder[] }>(
      `/orders?phone=${encodeURIComponent(digits)}&limit=${limit}`,
    );
    return body.orders;
  },

  async createOrder(payload: NewOrderPayload): Promise<ApiOrder> {
    const body = await request<{ order: ApiOrder }>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return body.order;
  },

  async setStatus(orderNumber: string, status: ApiOrder["status"]): Promise<ApiOrder> {
    const body = await request<{ order: ApiOrder }>(`/orders/${orderNumber}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return body.order;
  },

  async setPayment(orderNumber: string, status: "Pending" | "Paid"): Promise<ApiOrder> {
    const body = await request<{ order: ApiOrder }>(`/orders/${orderNumber}/payment`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return body.order;
  },

  async setAvailability(itemId: string, available: boolean) {
    return request<{ success: boolean }>(`/menu/${itemId}/availability`, {
      method: "PATCH",
      body: JSON.stringify({ available }),
    });
  },
};
