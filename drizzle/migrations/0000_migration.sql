CREATE TABLE public.pizza_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  sauce text NOT NULL,
  toppings text[] NOT NULL DEFAULT '{}',
  total_price numeric(8,2) NOT NULL,
  status text NOT NULL DEFAULT 'novo'
);
GRANT ALL ON public.pizza_orders TO service_role;
ALTER TABLE public.pizza_orders ENABLE ROW LEVEL SECURITY;