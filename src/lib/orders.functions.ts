import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Prices are recomputed on the server so the client can't tamper with the total.
export const BASE_PRICE = 7;
export const SAUCE_PRICES: Record<string, { name: string; price: number }> = {
  tomate: { name: "Tomate", price: 0 },
  branco: { name: "Natas", price: 0.5 },
  pesto: { name: "Pesto", price: 1 },
  bbq: { name: "Barbecue", price: 1 },
};
export const TOPPING_PRICES: Record<string, { name: string; price: number }> = {
  queijo: { name: "Mozzarella", price: 1 },
  pepperoni: { name: "Pepperoni", price: 1.5 },
  cogumelos: { name: "Cogumelos", price: 1.2 },
  azeitonas: { name: "Azeitonas", price: 0.8 },
  pimento: { name: "Pimento", price: 0.8 },
  cebola: { name: "Cebola roxa", price: 0.6 },
  fiambre: { name: "Fiambre", price: 1.2 },
  milho: { name: "Milho", price: 0.6 },
  ananas: { name: "Ananás", price: 1 },
  manjericao: { name: "Manjericão", price: 0.5 },
};

export function computeTotal(sauce: string, toppings: string[]) {
  const t = BASE_PRICE + (SAUCE_PRICES[sauce]?.price ?? 0) + toppings.reduce((s, id) => s + (TOPPING_PRICES[id]?.price ?? 0), 0);
  return Math.round(t * 100) / 100;
}

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().regex(/^[0-9+\s()-]{6,20}$/),
  sauce: z.string().refine((s) => s in SAUCE_PRICES),
  toppings: z.array(z.string().refine((t) => t in TOPPING_PRICES)).min(1).max(20),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const toppings = [...new Set(data.toppings)];
    const total = computeTotal(data.sauce, toppings);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("pizza_orders")
      .insert({
        customer_name: data.name,
        customer_phone: data.phone,
        sauce: SAUCE_PRICES[data.sauce]!.name,
        toppings: toppings.map((t) => TOPPING_PRICES[t]!.name),
        total_price: total,
      })
      .select("id")
      .single();
    if (error) {
      console.error(error);
      throw new Error("Não foi possível enviar o pedido.");
    }
    return { id: row.id, total };
  });
