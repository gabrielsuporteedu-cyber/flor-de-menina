# Diagnóstico do deploy

- URL verificada: https://flordemenina-sand.vercel.app/
- Resultado: a Vercel exibe o bundle do servidor/arquivos TypeScript como texto, sem renderizar a vitrine React.
- Repositório verificado: https://github.com/gabrielsuporteedu-cyber/flor-de-menina/tree/main
- Branch: main.
- Último commit observado: 39316a4, “Track GitHub export completion”.
- O repositório contém VERCEL_DEPLOY.md, mas a listagem pública observada não contém vercel.json.
- Causa provável: a configuração vercel.json criada localmente não foi publicada no GitHub; a Vercel está usando uma configuração/saída incorreta.
- Correção local preparada: buildCommand `pnpm build`, outputDirectory `dist/public`, installCommand `pnpm install --frozen-lockfile`, framework `vite` e rewrite SPA para `/index.html`.

## Verificação posterior

- Em 03/09/2026, a URL pública `https://github.com/gabrielsuporteedu-cyber/flor-de-menina/blob/main/vercel.json` retornou 404.
- A listagem da branch `main` também não mostrou `vercel.json`.
- Portanto, a configuração local ainda não foi sincronizada com o GitHub; a Vercel não pode aplicar essa correção até receber o arquivo e executar um novo deploy.

## Nova verificação

- A branch `main` continua sem `vercel.json`; o caminho `/blob/main/vercel.json` retorna 404.
- A sessão técnica continua exibindo “Sign in”, portanto a autenticação do navegador pessoal não foi compartilhada com ela.
- O problema permanece no envio do arquivo ao repositório, não no conteúdo local da configuração.

## Confirmação de correção

- O arquivo `vercel.json` agora está presente na branch `main` do repositório GitHub.
- A URL `https://flordemenina-sand.vercel.app/` passou a exibir o título “Flor de Menina — Vista o que floresce em você”, a navegação, o hero e a coleção.
- O código-fonte TypeScript deixou de aparecer como conteúdo da página.
- A correção de build e saída publicada foi efetivamente aplicada na Vercel.

## Verificação visual do vídeo e responsividade

Após apontar o hero para `/flor-de-menina-capa.mp4`, o preview local carregou o vídeo com a headline sobreposta, degradê inferior, sombra no texto e fallback visual. A composição foi verificada em 1280×720 e 375×812; no celular, o menu e o botão do pedido permanecem acessíveis e o hero se ajusta sem overflow.

## Verificação visual do carrinho

O carrinho foi validado no preview em 1280×720 e 375×812 usando a seleção `Top Nude`: abre como painel lateral, exibe o item, oferece remoção individual, mostra o total de R$ 89,00 e mantém o botão de continuidade para WhatsApp acessível. No celular, o painel ocupa a largura disponível sem cortar o conteúdo.

## Verificação visual da coleção e conteúdo

A página completa foi conferida em 375×812 e 1280×720. A coleção mantém duas colunas em ambos os tamanhos, os cinco produtos aparecem com os nomes e valores esperados, e o botão de adicionar ao pedido fica visível no celular e aparece por hover no desktop. As seções de essência, atendimento, chamada para WhatsApp e área da loja também permanecem presentes.

## Inspeção interativa do preview

Com `Top Nude` e `Vestido Azul Floral` selecionados, o preview exibiu ambos no carrinho, os botões de remoção, o contador 2, o botão de continuidade e o total calculado de R$ 288,00. A inspeção do DOM confirmou que o vídeo usa `/flor-de-menina-capa.mp4`, está em reprodução, silencioso, em loop e com autoplay; também confirmou os botões de filtros, adicionar ao pedido, navegação, atendimento, WhatsApp e área da loja.
