/* Editorial Blush: mídia em primeiro plano, frase centralizada e vitrine com duas peças por linha. */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, ChevronDown, Instagram, Menu, ShoppingBag, Sparkles, X } from "lucide-react";

const coverVideo = "/manus-storage/flor-de-menina-capa_f639974c.mp4";
const coverPoster = "/manus-storage/flor-de-menina-hero_1656e55b.jpg";
const logo = "/manus-storage/flor-de-menina-logo_ccbe2696.png";

const categories = ["Todos", "Vestidos", "Top"];
const pieces = [
  { name: "Top Nude", detail: "Malha macia · Bege", price: "R$ 89,00", image: "/manus-storage/flor-de-menina-top_fa697ea9.jfif", tag: "Top", category: "Top" },
  { name: "Vestido Azul Floral", detail: "Estampa floral · Azul e branco", price: "R$ 199,00", image: "/manus-storage/flor-de-menina-vestido-azul_3af2008e.jfif", tag: "Vestido", category: "Vestidos" },
  { name: "Vestido Color Block", detail: "Cores vibrantes · Midi", price: "R$ 199,00", image: "/manus-storage/flor-de-menina-vestido-colorido_9b68f8e7.jfif", tag: "Vestido", category: "Vestidos" },
  { name: "Vestido Turquesa", detail: "Tricoline leve · Longo", price: "R$ 199,00", image: "/manus-storage/flor-de-menina-vestido-turquesa_0993ed0f.jfif", tag: "Vestido", category: "Vestidos" },
  { name: "Vestido Estampado", detail: "Estampa autoral · Longo", price: "R$ 199,00", image: "/manus-storage/flor-de-menina-vestido-estampado_e045f0dd.jfif", tag: "Vestido", category: "Vestidos" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const initialOrder = new URLSearchParams(window.location.search).getAll("product").filter(Boolean);
  const [order, setOrder] = useState<string[]>(initialOrder);
  const [cartOpen, setCartOpen] = useState(() => new URLSearchParams(window.location.search).get("cart") === "open" || initialOrder.length > 0);
  const catalogQuery = trpc.catalog.useQuery();
  const storeInfo = trpc.storeInfo.useQuery();
  const activeLogo = storeInfo.data?.logoUrl || logo;
  const activeHeroVideo = storeInfo.data?.heroMediaType === "video" && storeInfo.data.heroMediaUrl ? storeInfo.data.heroMediaUrl : coverVideo;
  const heroHeadline = storeInfo.data?.heroHeadline || "Peças para os dias que merecem mais.";
  const catalogPieces = catalogQuery.data?.length ? catalogQuery.data.map((product) => ({ name: product.name, detail: product.description || `${product.category} · ${product.sizes || "Tamanhos a consultar"}`, price: product.compareAtPrice ? `DE R$ ${String(product.compareAtPrice).replace(".", ",")} · POR R$ ${String(product.price).replace(".", ",")}` : `R$ ${String(product.price).replace(".", ",")}`, image: product.image || coverPoster, tag: product.category, category: product.category })) : pieces;
  const visiblePieces = activeCategory === "Todos" ? catalogPieces : catalogPieces.filter((piece) => piece.category === activeCategory);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f1eb] text-[#242123]">
      {cartOpen && <div className="fixed inset-0 z-50 flex justify-end bg-[#242123]/35" role="dialog" aria-modal="true" aria-label="Meu pedido"><button type="button" className="absolute inset-0 cursor-default" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho" /><aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#f7f1eb] p-6 shadow-[-20px_0_60px_rgba(36,33,35,.18)]"><div className="flex items-center justify-between border-b border-[#242123]/10 pb-5"><div><p className="eyebrow">Seu pedido</p><h2 className="mt-2 font-display text-3xl">Peças escolhidas</h2></div><button type="button" onClick={() => setCartOpen(false)} className="rounded-full border border-[#242123]/15 p-2" aria-label="Fechar carrinho"><X size={18} /></button></div>{order.length ? <><div className="flex-1 space-y-3 overflow-y-auto py-6">{order.map((item) => <div key={item} className="flex items-center justify-between gap-4 rounded-xl bg-white/75 p-4"><span className="font-display text-xl">{item}</span><button type="button" onClick={() => setOrder((current) => current.filter((name) => name !== item))} className="rounded-full p-2 text-[#c98287] hover:bg-[#ead5d0]" aria-label={`Remover ${item} do pedido`}><X size={16} /></button></div>)}</div><div className="border-t border-[#242123]/10 pt-5"><p className="mb-4 text-sm text-[#242123]/60">Confira sua seleção e continue para montar o pedido no WhatsApp.</p><a href={storeInfo.data?.whatsapp ? `https://wa.me/${storeInfo.data.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`${storeInfo.data.defaultMessage ?? "Olá! Gostaria de fazer um pedido:"}\n${order.join("\n")}`)}` : "#atendimento"} target={storeInfo.data?.whatsapp ? "_blank" : undefined} rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#242123] px-5 py-4 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-white">Continuar no WhatsApp <ArrowUpRight size={15} /></a></div></> : <div className="flex flex-1 flex-col items-center justify-center text-center"><ShoppingBag className="mb-4 text-[#c98287]" size={28} strokeWidth={1.3} /><p className="font-display text-2xl">Seu pedido está vazio.</p><p className="mt-2 max-w-xs text-sm leading-6 text-[#242123]/55">Escolha uma peça na coleção para começar.</p><button type="button" onClick={() => { setCartOpen(false); document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-6 rounded-full bg-[#c98287] px-5 py-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white">Ver coleção</button></div>}</aside></div> }
      <header className="relative z-20 border-b border-[#242123]/10 bg-[#f7f1eb]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10 lg:px-16">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Flor de Menina — início">
            <img src={logo} alt="" className="h-10 w-10 object-contain" />
            <span className="font-display text-[1.35rem] leading-none tracking-[-0.04em]">Flor de <em>Menina</em></span>
          </a>
          <nav className="hidden items-center gap-9 text-[0.68rem] font-bold uppercase tracking-[0.2em] md:flex" aria-label="Navegação principal">
            <a className="nav-link" href="#colecao">Coleção</a>
            <a className="nav-link" href="#essencia">Nossa essência</a>
            <a className="nav-link" href="#atendimento">Atendimento</a>
          </nav>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setCartOpen(true)} className="hidden items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] md:flex" aria-label="Abrir meu pedido">
              <ShoppingBag size={16} strokeWidth={1.5} /> Meu pedido <span className="rounded-full bg-[#c98287] px-2 py-0.5 text-[0.6rem] text-white">{order.length}</span>
            </button>
            <button type="button" onClick={() => setCartOpen(true)} className="rounded-full border border-[#242123]/15 p-2 text-[#242123] md:hidden" aria-label="Abrir meu pedido"><ShoppingBag size={17} /></button>
            <button className="rounded-full border border-[#242123]/15 p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        {menuOpen && <div className="border-t border-[#242123]/10 px-5 py-5 md:hidden"><div className="flex flex-col gap-4 text-sm uppercase tracking-[0.17em]"><a href="#colecao" onClick={() => setMenuOpen(false)}>Coleção</a><a href="#essencia" onClick={() => setMenuOpen(false)}>Nossa essência</a><a href="#atendimento" onClick={() => setMenuOpen(false)}>Atendimento</a></div></div>}
      </header>

      <section id="inicio" className="mx-auto max-w-[1440px] px-5 pb-8 pt-6 md:px-10 md:pb-12 md:pt-10 lg:px-16">
        <div className="relative overflow-hidden bg-[#ded2c8]">
          <video className="h-[70vh] min-h-[500px] w-full object-cover object-center md:h-[82vh] md:min-h-[620px]" autoPlay muted loop playsInline poster={coverPoster} aria-label="Vídeo editorial da coleção Flor de Menina">
            <source src={activeHeroVideo} type="video/mp4" />
            Seu navegador não suporta vídeo incorporado.
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#242123]/10 via-transparent via-[55%] to-[#f7f1eb]" />
          <div className="absolute inset-x-5 bottom-[13%] text-center text-[#f6dfe1] md:inset-x-10 md:bottom-[15%]"><p className="mb-4 text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#f6dfe1]/85 md:text-[0.68rem]">Flor de Menina · Coleção 01</p><h1 className="mx-auto max-w-4xl font-display text-[3.45rem] leading-[0.9] tracking-[-0.07em] drop-shadow-[0_2px_8px_rgba(0,0,0,.45)] md:text-[6.5rem]">{heroHeadline}</h1><p className="mx-auto mt-6 max-w-md text-[0.9rem] leading-6 text-[#f6dfe1]/90 drop-shadow-[0_2px_8px_rgba(0,0,0,.38)] md:text-base">Uma curadoria feita para acompanhar o seu ritmo, celebrar sua presença e florescer junto com você.</p><a href="#colecao" className="group mt-7 inline-flex items-center gap-3 border-b border-[#f6dfe1]/80 pb-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] drop-shadow-[0_2px_6px_rgba(0,0,0,.35)]">Ver a coleção <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" size={16} strokeWidth={1.5} /></a></div>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[#f6dfe1]/80 md:bottom-8 md:left-10 md:right-10"><p className="max-w-[190px] text-[0.6rem] uppercase leading-5 tracking-[0.18em]">Descubra o gesto de vestir com intenção</p><span className="text-[0.6rem] font-bold uppercase tracking-[0.15em]">Vídeo editorial</span></div>
        </div>
        
      </section>

      <section id="colecao" className="border-t border-[#242123]/10 bg-[#efe5dd] px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="eyebrow mb-4">Peças para você florescer</p><h2 className="font-display text-5xl leading-none tracking-[-0.06em] md:text-7xl">Escolhas que <em>contam</em><br className="hidden md:block" /> uma história.</h2></div><p className="max-w-xs text-sm leading-6 text-[#242123]/60">Modelagens, cores e detalhes para criar combinações que têm a sua assinatura.</p></div>
          <div className="mb-9 flex gap-5 overflow-x-auto border-b border-[#242123]/15 pb-4">{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 text-[0.68rem] font-bold uppercase tracking-[0.16em] transition-colors ${activeCategory === category ? "text-[#c98287]" : "text-[#242123]/45 hover:text-[#242123]"}`}>{category}</button>)}</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:gap-x-8 md:gap-y-12">{visiblePieces.map((piece) => <article key={piece.name} className="group"><div className="relative aspect-[0.78] overflow-hidden bg-[#d8cec6]"><img src={piece.image} alt={piece.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /><span className="absolute left-2 top-2 bg-[#f7f1eb] px-2 py-1 text-[0.5rem] font-bold uppercase tracking-[0.14em] sm:left-4 sm:top-4 sm:px-3">{piece.tag}</span><button onClick={() => { setOrder((current) => current.includes(piece.name) ? current : [...current, piece.name]); setCartOpen(true); }} className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[#f7f1eb] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-4 sm:right-4 sm:h-11 sm:w-11" aria-label={`Adicionar ${piece.name} ao pedido`}><ShoppingBag size={15} strokeWidth={1.5} /></button></div><div className="flex items-start justify-between gap-2 pt-3 sm:pt-4"><div><h3 className="font-display text-[1.35rem] leading-none tracking-[-0.03em] sm:text-2xl">{piece.name}</h3><p className="mt-1 text-[0.63rem] leading-4 text-[#242123]/55 sm:text-xs">{piece.detail}</p></div><p className="whitespace-nowrap pt-1 text-[0.68rem] font-bold sm:text-sm">{piece.price}</p></div></article>)}</div>
        </div>
      </section>

      <section id="essencia" className="relative bg-[#242123] px-5 py-20 text-[#f7f1eb] md:px-10 md:py-28 lg:px-16"><Sparkles className="absolute right-[12%] top-16 text-[#d89a9e]" size={22} strokeWidth={1} /><div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center"><p className="eyebrow text-[#d89a9e]">Nossa essência</p><div><blockquote className="font-display max-w-4xl text-5xl leading-[0.98] tracking-[-0.055em] md:text-7xl">“A roupa muda o dia quando ela encontra quem você é.”</blockquote><div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"><p className="max-w-sm text-sm leading-6 text-white/55">A Flor de Menina nasceu para transformar o vestir em um momento de presença: escolher, combinar, sair e deixar o mundo perceber a sua luz.</p><a href="#atendimento" className="group inline-flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#d89a9e]">Conheça a marca <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={16} strokeWidth={1.5} /></a></div></div></div></section>

      {order.length > 0 && <section className="border-t border-[#242123]/10 bg-[#ead5d0] px-5 py-10 md:px-10 lg:px-16"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 md:flex-row md:items-center"><div><p className="eyebrow">Seu pedido</p><p className="mt-2 text-sm text-[#242123]/65">{order.join(" · ")}</p></div><a href={storeInfo.data?.whatsapp ? `https://wa.me/${storeInfo.data.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`${storeInfo.data.defaultMessage ?? "Olá! Gostaria de fazer um pedido:"}\n${order.join("\n")}`)}` : "#atendimento"} target={storeInfo.data?.whatsapp ? "_blank" : undefined} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#242123] px-5 py-3 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white">Continuar atendimento <ArrowUpRight size={15} /></a></div></section>}

      <section id="atendimento" className="bg-[#f7f1eb] px-5 py-16 md:px-10 md:py-24 lg:px-16"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-10 md:flex-row md:items-end"><div><p className="eyebrow mb-4">Vamos conversar?</p><h2 className="font-display max-w-xl text-5xl leading-[0.95] tracking-[-0.06em] md:text-7xl">Sua próxima peça começa <em>aqui.</em></h2></div><div className="max-w-xs"><p className="mb-5 text-sm leading-6 text-[#242123]/60">Escolha sua peça e fale com a gente. Será um prazer montar seu pedido.</p><a href={storeInfo.data?.whatsapp ? `https://wa.me/${storeInfo.data.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(storeInfo.data.defaultMessage ?? "Olá! Gostaria de fazer um pedido:")}` : "#pedido"} target={storeInfo.data?.whatsapp ? "_blank" : undefined} rel="noreferrer" className="inline-flex items-center gap-3 rounded-full bg-[#c98287] px-6 py-4 text-[0.68rem] font-bold uppercase tracking-[0.17em] text-white transition hover:bg-[#ad6d73]">Falar no WhatsApp <ArrowUpRight size={16} strokeWidth={1.5} /></a></div></div></section>

      <footer id="pedido" className="border-t border-[#242123]/10 px-5 py-8 md:px-10 lg:px-16"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 text-xs text-[#242123]/55 md:flex-row md:items-center"><div className="flex items-center gap-3"><img src={activeLogo} alt="Flor de Menina" className="h-9 w-9 object-contain" /><span>© 2026 Flor de Menina</span></div><div className="flex items-center gap-6"><a href="#inicio" className="hover:text-[#c98287]">Voltar ao topo <ChevronDown className="ml-1 inline rotate-180" size={14} /></a><a href="#instagram" aria-label="Instagram"><Instagram size={16} strokeWidth={1.5} /></a></div></div></footer>
    {storeInfo.data?.whatsapp && <a href={`https://wa.me/${storeInfo.data.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(storeInfo.data.defaultMessage ?? "Olá! Gostaria de fazer um pedido:")}`} target="_blank" rel="noreferrer" aria-label="Falar pelo WhatsApp" className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,.3)] transition hover:scale-105"><span className="text-xl font-bold">✆</span></a>}
    </main>
  );
}
