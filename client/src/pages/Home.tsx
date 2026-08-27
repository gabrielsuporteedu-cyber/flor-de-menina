/* Editorial Blush: página editorial assimétrica, delicada e autoral; imagens respiram e a interface conduz com acolhimento. */
import { useState } from "react";
import { ArrowUpRight, ChevronDown, Instagram, Menu, Play, ShoppingBag, Sparkles, X } from "lucide-react";

const heroImage = "/manus-storage/flor-de-menina-hero_1656e55b.jpg";
const collectionOne = "/manus-storage/flor-de-menina-collection-1_9460d829.jpg";
const collectionTwo = "/manus-storage/flor-de-menina-collection-2_fdfd9cdc.jpg";
const logo = "/manus-storage/flor-de-menina-logo_ccbe2696.png";

const categories = ["Novidades", "Vestidos", "Blusas", "Conjuntos", "Acessórios"];
const pieces = [
  { name: "Vestido Aurora", detail: "Seda acetinada · Rosé", price: "R$ 289,90", image: heroImage, tag: "Destaque" },
  { name: "Blusa Íris", detail: "Linho leve · Natural", price: "R$ 159,90", image: collectionOne, tag: "Novo" },
  { name: "Saia Amélia", detail: "Viscose fluida · Creme", price: "R$ 219,90", image: collectionTwo, tag: "Essencial" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Novidades");

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f1eb] text-[#242123]">
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
            <a href="#pedido" className="hidden items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] md:flex">
              <ShoppingBag size={16} strokeWidth={1.5} /> Meu pedido <span className="rounded-full bg-[#c98287] px-2 py-0.5 text-[0.6rem] text-white">0</span>
            </a>
            <button className="rounded-full border border-[#242123]/15 p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        {menuOpen && <div className="border-t border-[#242123]/10 px-5 py-5 md:hidden"><div className="flex flex-col gap-4 text-sm uppercase tracking-[0.17em]"><a href="#colecao" onClick={() => setMenuOpen(false)}>Coleção</a><a href="#essencia" onClick={() => setMenuOpen(false)}>Nossa essência</a><a href="#atendimento" onClick={() => setMenuOpen(false)}>Atendimento</a></div></div>}
      </header>

      <section id="inicio" className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20 lg:px-16">
        <div className="grid items-end gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div className="relative z-10 pb-3 lg:pb-14">
            <p className="eyebrow mb-5"><span className="mr-2 inline-block h-px w-8 bg-[#c98287] align-middle" /> Coleção 01 · 2026</p>
            <h1 className="font-display max-w-xl text-[4.1rem] leading-[0.88] tracking-[-0.07em] md:text-[6.2rem] lg:text-[7.2rem]">Peças para os dias que <em>merecem</em> mais.</h1>
            <p className="mt-8 max-w-sm text-[0.96rem] leading-7 text-[#242123]/65">Uma curadoria feita para acompanhar o seu ritmo, celebrar sua presença e florescer junto com você.</p>
            <a href="#colecao" className="group mt-9 inline-flex items-center gap-3 border-b border-[#242123] pb-2 text-[0.7rem] font-bold uppercase tracking-[0.2em]">Ver a coleção <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" size={16} strokeWidth={1.5} /></a>
          </div>
          <div className="relative min-h-[520px] overflow-hidden bg-[#ded2c8] md:min-h-[650px] lg:min-h-[700px]">
            <img src={heroImage} alt="Modelo usando vestido rosé em uma atmosfera clara e delicada" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#242123]/25 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white md:bottom-10 md:left-10 md:right-10"><p className="max-w-[180px] text-[0.68rem] uppercase leading-5 tracking-[0.18em]">Descubra o gesto de vestir com intenção</p><span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/70 backdrop-blur-sm"><Play size={16} fill="currentColor" strokeWidth={1} /></span></div>
            <div className="seal absolute right-[-42px] top-[-38px] hidden h-36 w-36 items-center justify-center rounded-full border border-white/75 text-center text-[0.55rem] uppercase tracking-[0.18em] text-white md:flex">feito para<br />florescer<br /><span className="text-base">✦</span></div>
          </div>
        </div>
      </section>

      <section id="colecao" className="border-t border-[#242123]/10 bg-[#efe5dd] px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="eyebrow mb-4">Curadoria Flor de Menina</p><h2 className="font-display text-5xl leading-none tracking-[-0.06em] md:text-7xl">Escolhas que <em>contam</em><br className="hidden md:block" /> uma história.</h2></div><p className="max-w-xs text-sm leading-6 text-[#242123]/60">Texturas, volumes e detalhes para criar combinações que têm a sua assinatura.</p></div>
          <div className="mb-9 flex gap-5 overflow-x-auto border-b border-[#242123]/15 pb-4">{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 text-[0.68rem] font-bold uppercase tracking-[0.16em] transition-colors ${activeCategory === category ? "text-[#c98287]" : "text-[#242123]/45 hover:text-[#242123]"}`}>{category}</button>)}</div>
          <div className="grid gap-6 md:grid-cols-3">{pieces.map((piece, index) => <article key={piece.name} className={`group ${index === 1 ? "md:mt-14" : ""}`}><div className="relative aspect-[0.82] overflow-hidden bg-[#d8cec6]"><img src={piece.image} alt={piece.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /><span className="absolute left-4 top-4 bg-[#f7f1eb] px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.14em]">{piece.tag}</span><button className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-[#f7f1eb] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100" aria-label={`Adicionar ${piece.name} ao pedido`}><ShoppingBag size={16} strokeWidth={1.5} /></button></div><div className="flex items-start justify-between gap-3 pt-4"><div><h3 className="font-display text-2xl tracking-[-0.03em]">{piece.name}</h3><p className="mt-1 text-xs text-[#242123]/55">{piece.detail}</p></div><p className="pt-1 text-sm font-bold">{piece.price}</p></div></article>)}</div>
        </div>
      </section>

      <section id="essencia" className="relative bg-[#242123] px-5 py-20 text-[#f7f1eb] md:px-10 md:py-28 lg:px-16"><Sparkles className="absolute right-[12%] top-16 text-[#d89a9e]" size={22} strokeWidth={1} /><div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center"><p className="eyebrow text-[#d89a9e]">Nossa essência</p><div><blockquote className="font-display max-w-4xl text-5xl leading-[0.98] tracking-[-0.055em] md:text-7xl">“A roupa muda o dia quando ela encontra quem você é.”</blockquote><div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"><p className="max-w-sm text-sm leading-6 text-white/55">A Flor de Menina nasceu para transformar o vestir em um momento de presença: escolher, combinar, sair e deixar o mundo perceber a sua luz.</p><a href="#atendimento" className="group inline-flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#d89a9e]">Conheça a marca <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={16} strokeWidth={1.5} /></a></div></div></div></section>

      <section id="atendimento" className="bg-[#f7f1eb] px-5 py-16 md:px-10 md:py-24 lg:px-16"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-10 md:flex-row md:items-end"><div><p className="eyebrow mb-4">Vamos conversar?</p><h2 className="font-display max-w-xl text-5xl leading-[0.95] tracking-[-0.06em] md:text-7xl">Sua próxima peça começa <em>aqui.</em></h2></div><div className="max-w-xs"><p className="mb-5 text-sm leading-6 text-[#242123]/60">Escolha sua peça e fale com a gente. Será um prazer montar seu pedido.</p><a href="#pedido" className="inline-flex items-center gap-3 rounded-full bg-[#c98287] px-6 py-4 text-[0.68rem] font-bold uppercase tracking-[0.17em] text-white transition hover:bg-[#ad6d73]">Falar no WhatsApp <ArrowUpRight size={16} strokeWidth={1.5} /></a></div></div></section>

      <footer id="pedido" className="border-t border-[#242123]/10 px-5 py-8 md:px-10 lg:px-16"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 text-xs text-[#242123]/55 md:flex-row md:items-center"><div className="flex items-center gap-3"><img src={logo} alt="" className="h-7 w-7 object-contain" /><span>© 2026 Flor de Menina</span></div><div className="flex items-center gap-6"><a href="#inicio" className="hover:text-[#c98287]">Voltar ao topo <ChevronDown className="ml-1 inline rotate-180" size={14} /></a><a href="#instagram" aria-label="Instagram"><Instagram size={16} strokeWidth={1.5} /></a></div></div></footer>
    </main>
  );
}
