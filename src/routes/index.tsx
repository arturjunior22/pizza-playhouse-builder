import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Monta a tua Pizza — Pizzaria" },
      { name: "description", content: "Monta a tua pizza como num jogo: escolhe o molho, os ingredientes e envia o pedido ao forno." },
      { property: "og:title", content: "Monta a tua Pizza" },
      { property: "og:description", content: "Escolhe o molho e os ingredientes e envia o pedido diretamente à pizzaria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Sauce = { id: string; name: string; color: string; price: number };
type Topping = { id: string; name: string; emoji: string; price: number; shape: (x: number, y: number, r: number, k: number) => React.ReactNode };

const SAUCES: Sauce[] = [
  { id: "tomate", name: "Tomate", color: "var(--sauce-tomato)", price: 0 },
  { id: "branco", name: "Natas", color: "var(--sauce-white)", price: 0.5 },
  { id: "pesto", name: "Pesto", color: "var(--sauce-pesto)", price: 1 },
  { id: "bbq", name: "Barbecue", color: "var(--sauce-bbq)", price: 1 },
];

const TOPPINGS: Topping[] = [
  { id: "queijo", name: "Mozzarella", emoji: "🧀", price: 1, shape: (x, y, r, k) => <ellipse key={k} cx={x} cy={y} rx={9} ry={6} transform={`rotate(${r} ${x} ${y})`} fill="var(--cheese)" opacity={0.95} /> },
  { id: "pepperoni", name: "Pepperoni", emoji: "🍕", price: 1.5, shape: (x, y, _r, k) => <g key={k}><circle cx={x} cy={y} r={10} fill="var(--pepperoni)" /><circle cx={x - 3} cy={y - 2} r={1.5} fill="var(--cheese)" opacity={0.5} /></g> },
  { id: "cogumelos", name: "Cogumelos", emoji: "🍄", price: 1.2, shape: (x, y, r, k) => <g key={k} transform={`rotate(${r} ${x} ${y})`}><path d={`M${x - 8} ${y} a8 7 0 0 1 16 0 z`} fill="var(--mushroom)" /><rect x={x - 2.5} y={y} width={5} height={6} fill="var(--mushroom)" opacity={0.8} /></g> },
  { id: "azeitonas", name: "Azeitonas", emoji: "🫒", price: 0.8, shape: (x, y, _r, k) => <circle key={k} cx={x} cy={y} r={4.5} fill="none" stroke="var(--olive)" strokeWidth={3} /> },
  { id: "pimento", name: "Pimento", emoji: "🫑", price: 0.8, shape: (x, y, r, k) => <path key={k} d={`M${x - 8} ${y} q8 -8 16 0`} stroke="var(--pepper)" strokeWidth={3.5} fill="none" strokeLinecap="round" transform={`rotate(${r} ${x} ${y})`} /> },
  { id: "cebola", name: "Cebola roxa", emoji: "🧅", price: 0.6, shape: (x, y, r, k) => <path key={k} d={`M${x - 7} ${y + 3} a7 7 0 0 1 14 0`} stroke="var(--onion)" strokeWidth={2.5} fill="none" transform={`rotate(${r} ${x} ${y})`} /> },
  { id: "fiambre", name: "Fiambre", emoji: "🥓", price: 1.2, shape: (x, y, r, k) => <rect key={k} x={x - 7} y={y - 5} width={14} height={10} rx={2} fill="var(--ham)" transform={`rotate(${r} ${x} ${y})`} /> },
  { id: "milho", name: "Milho", emoji: "🌽", price: 0.6, shape: (x, y, _r, k) => <circle key={k} cx={x} cy={y} r={2.8} fill="var(--corn)" /> },
  { id: "ananas", name: "Ananás", emoji: "🍍", price: 1, shape: (x, y, r, k) => <path key={k} d={`M${x} ${y - 6} l6 10 h-12 z`} fill="var(--pineapple)" transform={`rotate(${r} ${x} ${y})`} /> },
  { id: "manjericao", name: "Manjericão", emoji: "🌿", price: 0.5, shape: (x, y, r, k) => <ellipse key={k} cx={x} cy={y} rx={7} ry={3.5} fill="var(--basil)" transform={`rotate(${r} ${x} ${y})`} /> },
];

const BASE_PRICE = 7;

// deterministic scatter
function scatter(seed: number, count: number) {
  const pts: { x: number; y: number; r: number }[] = [];
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * 105;
    pts.push({ x: 150 + Math.cos(a) * d, y: 150 + Math.sin(a) * d, r: rnd() * 360 });
  }
  return pts;
}

function Pizza({ sauce, toppings, baking }: { sauce?: Sauce; toppings: string[]; baking: boolean }) {
  const layers = useMemo(
    () =>
      toppings.map((id, i) => {
        const t = TOPPINGS.find((x) => x.id === id)!;
        const n = id === "milho" ? 30 : id === "queijo" ? 26 : 12;
        return (
          <g key={id} className="animate-drop" style={{ transformOrigin: "150px 150px" }}>
            {scatter(i + id.length * 7, n).map((p, k) => t.shape(p.x, p.y, p.r, k))}
          </g>
        );
      }),
    [toppings],
  );
  return (
    <svg viewBox="0 0 300 300" className={`w-full max-w-[460px] drop-shadow-2xl ${baking ? "animate-slide-away" : ""}`}>
      <circle cx={150} cy={150} r={145} fill="var(--wood)" />
      <circle cx={150} cy={150} r={145} fill="none" stroke="var(--wood-dark)" strokeWidth={4} />
      <circle cx={150} cy={150} r={132} fill="var(--crust)" />
      <circle cx={150} cy={150} r={120} fill="var(--dough)" />
      {sauce && <circle key={sauce.id} cx={150} cy={150} r={116} fill={sauce.color} className="animate-in zoom-in-50 duration-500" />}
      {layers}
    </svg>
  );
}

type Step = "molho" | "ingredientes" | "pedido" | "enviado";

function Index() {
  const [step, setStep] = useState<Step>("molho");
  const [sauce, setSauce] = useState<Sauce>();
  const [toppings, setToppings] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [baking, setBaking] = useState(false);

  const total = BASE_PRICE + (sauce?.price ?? 0) + toppings.reduce((s, id) => s + TOPPINGS.find((t) => t.id === id)!.price, 0);
  const toggle = (id: string) => setToppings((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    setBaking(true);
    setTimeout(() => setStep("enviado"), 900);
  };

  const reset = () => { setStep("molho"); setSauce(undefined); setToppings([]); setBaking(false); setName(""); setPhone(""); };

  const steps: { id: Step; label: string }[] = [
    { id: "molho", label: "Molho" },
    { id: "ingredientes", label: "Ingredientes" },
    { id: "pedido", label: "Pedido" },
  ];

  return (
    <div className="min-h-screen bg-pizzeria">
      <div className="h-3 bg-checker" />
      <header className="mx-auto max-w-6xl px-6 pt-8 text-center">
        <p className="font-hand text-2xl text-accent">Feita à mão, com amor</p>
        <h1 className="text-4xl font-bold md:text-6xl">Monta a tua Pizza</h1>
      </header>

      {step === "enviado" ? (
        <main className="mx-auto max-w-xl px-6 py-16 text-center animate-in fade-in zoom-in-95">
          <div className="text-7xl">🔥</div>
          <h2 className="mt-4 text-4xl font-bold">Pedido enviado!</h2>
          <p className="mt-3 text-lg opacity-80">Obrigado, {name}! A tua pizza já está a caminho do forno a lenha. Vamos ligar-te para {phone} quando estiver pronta.</p>
          <p className="mt-6 font-hand text-3xl text-accent">Total: {total.toFixed(2)} €</p>
          <button onClick={reset} className="mt-8 rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-warm transition hover:scale-105">
            Fazer outra pizza
          </button>
        </main>
      ) : (
        <main className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col items-center">
            <Pizza sauce={sauce} toppings={toppings} baking={baking} />
            <p className="mt-4 font-hand text-3xl text-accent">{total.toFixed(2)} €</p>
          </div>

          <section className="rounded-2xl bg-card p-6 text-card-foreground shadow-warm md:p-8">
            <ol className="mb-6 flex gap-2">
              {steps.map((s, i) => (
                <li key={s.id} className={`flex-1 rounded-full py-1.5 text-center text-sm font-bold ${s.id === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}. {s.label}
                </li>
              ))}
            </ol>

            {step === "molho" && (
              <>
                <h2 className="text-2xl font-bold">Primeiro, o molho</h2>
                <p className="mb-5 text-muted-foreground">A massa já está esticada. Escolhe a base.</p>
                <div className="grid grid-cols-2 gap-3">
                  {SAUCES.map((s) => (
                    <button key={s.id} onClick={() => setSauce(s)}
                      className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition hover:-translate-y-0.5 ${sauce?.id === s.id ? "border-primary bg-secondary" : "border-border"}`}>
                      <span className="h-8 w-8 rounded-full border border-border" style={{ background: s.color }} />
                      <span><b>{s.name}</b><br /><span className="text-sm text-muted-foreground">{s.price ? `+${s.price.toFixed(2)} €` : "incluído"}</span></span>
                    </button>
                  ))}
                </div>
                <button disabled={!sauce} onClick={() => setStep("ingredientes")}
                  className="mt-6 w-full rounded-full bg-primary py-3 font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-40">
                  Seguinte →
                </button>
              </>
            )}

            {step === "ingredientes" && (
              <>
                <h2 className="text-2xl font-bold">Agora, os ingredientes</h2>
                <p className="mb-5 text-muted-foreground">Toca para pôr ou tirar da pizza.</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {TOPPINGS.map((t) => {
                    const on = toppings.includes(t.id);
                    return (
                      <button key={t.id} onClick={() => toggle(t.id)}
                        className={`rounded-xl border-2 p-3 text-center transition hover:-translate-y-0.5 ${on ? "border-primary bg-secondary" : "border-border"}`}>
                        <div className="text-3xl">{t.emoji}</div>
                        <div className="text-sm font-bold">{t.name}</div>
                        <div className="text-xs text-muted-foreground">+{t.price.toFixed(2)} €</div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => setStep("molho")} className="rounded-full border-2 border-border px-5 py-3 font-bold">←</button>
                  <button disabled={!toppings.length} onClick={() => setStep("pedido")}
                    className="flex-1 rounded-full bg-primary py-3 font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-40">
                    Pizza pronta →
                  </button>
                </div>
              </>
            )}

            {step === "pedido" && (
              <form onSubmit={send}>
                <h2 className="text-2xl font-bold">Que bela pizza!</h2>
                <ul className="my-4 space-y-1 border-y border-dashed border-border py-3 text-sm">
                  <li className="flex justify-between"><span>Massa artesanal</span><span>{BASE_PRICE.toFixed(2)} €</span></li>
                  <li className="flex justify-between"><span>Molho {sauce?.name}</span><span>{sauce?.price.toFixed(2)} €</span></li>
                  {toppings.map((id) => { const t = TOPPINGS.find((x) => x.id === id)!; return (
                    <li key={id} className="flex justify-between"><span>{t.emoji} {t.name}</span><span>{t.price.toFixed(2)} €</span></li>
                  ); })}
                  <li className="flex justify-between pt-2 text-base font-bold"><span>Total</span><span>{total.toFixed(2)} €</span></li>
                </ul>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="O teu nome"
                  className="mb-3 w-full rounded-xl border-2 border-input bg-background/0 px-4 py-3 outline-none focus:border-ring" />
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telemóvel"
                  className="w-full rounded-xl border-2 border-input bg-background/0 px-4 py-3 outline-none focus:border-ring" />
                <div className="mt-6 flex gap-3">
                  <button type="button" onClick={() => setStep("ingredientes")} className="rounded-full border-2 border-border px-5 py-3 font-bold">←</button>
                  <button type="submit" disabled={baking} className="flex-1 rounded-full bg-primary py-3 font-bold text-primary-foreground transition hover:brightness-110">
                    Enviar para o forno 🔥
                  </button>
                </div>
              </form>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
