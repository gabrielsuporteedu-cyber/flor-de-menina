import { trpc } from "@/lib/trpc";
import { ArrowDown, ArrowUp, Star, Trash2 } from "lucide-react";

export default function ProductGallery({ productId }: { productId: number }) {
  const utils = trpc.useUtils();
  const images = trpc.admin.products.images.list.useQuery({ productId });
  const setPrimary = trpc.admin.products.images.setPrimary.useMutation({ onSuccess: () => utils.admin.products.images.list.invalidate({ productId }) });
  const remove = trpc.admin.products.images.remove.useMutation({ onSuccess: () => utils.admin.products.images.list.invalidate({ productId }) });
  const reorder = trpc.admin.products.images.reorder.useMutation({ onSuccess: () => utils.admin.products.images.list.invalidate({ productId }) });

  if (images.isLoading) return <p className="mt-3 text-xs text-[#242123]/45">Carregando fotos…</p>;
  if (!images.data?.length) return <p className="mt-3 text-xs text-[#242123]/45">Nenhuma foto enviada ainda.</p>;
  return <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{images.data.map((image, index) => <div key={image.id} className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[#d8cec6]"><img src={image.url} alt="Foto do produto" className="h-full w-full object-cover" /><button type="button" onClick={() => setPrimary.mutate({ id: image.id, productId })} className={`absolute left-1 top-1 rounded-full p-1 ${image.isPrimary ? "bg-[#c98287] text-white" : "bg-white/85 text-[#242123]/55"}`} aria-label="Definir como foto principal"><Star size={11} fill={image.isPrimary ? "currentColor" : "none"} /></button><button type="button" onClick={() => remove.mutate({ id: image.id, productId })} className="absolute bottom-1 right-1 rounded-full bg-white/85 p-1 text-[#c34f59]" aria-label="Remover foto"><Trash2 size={11} /></button><div className="absolute bottom-1 left-1 flex gap-0.5"><button type="button" disabled={index === 0} onClick={() => reorder.mutate({ id: image.id, productId, direction: "up" })} className="rounded-full bg-white/85 p-1 disabled:opacity-30" aria-label="Mover foto para cima"><ArrowUp size={9} /></button><button type="button" disabled={index === images.data.length - 1} onClick={() => reorder.mutate({ id: image.id, productId, direction: "down" })} className="rounded-full bg-white/85 p-1 disabled:opacity-30" aria-label="Mover foto para baixo"><ArrowDown size={9} /></button></div></div>)}</div>;
}
