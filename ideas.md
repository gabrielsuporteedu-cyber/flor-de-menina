# Flor de Menina — Direção Visual

## Abordagens consideradas

### Abordagem 1 — Editorial Blush
Uma vitrine de moda feminina com atmosfera de editorial de revista: blush suave, preto profundo, dourado discreto, serifas expressivas e composição assimétrica. A sensação é de uma boutique autoral, delicada sem parecer infantil.

**Probability:** 0.04

### Abordagem 2 — Jardim Solar
Uma linguagem mais leve e orgânica, com creme, verde sálvia e pequenos detalhes florais desenhados à mão. A experiência seria calorosa, artesanal e próxima.

**Probability:** 0.07

### Abordagem 3 — Noir de Atelier
Uma direção mais dramática, com fundo escuro, tipografia de alto contraste, fotografias emolduradas e detalhes metálicos. A sensação seria de uma marca de moda noturna e sofisticada.

**Probability:** 0.03

## Abordagem escolhida — Editorial Blush

### Design Movement
Editorial de moda contemporâneo com referências de revistas independentes, vitrines de boutique e still life de campanha. O site deve parecer uma seleção curada, não um catálogo genérico.

### Core Principles
1. **Delicadeza com estrutura:** rosa blush e creme entram como atmosfera, enquanto o preto cria presença e legibilidade.
2. **Composição de revista:** assimetria controlada, grandes áreas de respiro e títulos que conduzem o olhar.
3. **Produto como protagonista:** imagens amplas, recortes generosos e textos curtos que deixam a peça respirar.
4. **Acolhimento sem excesso:** a linguagem é próxima e aspiracional, evitando infantilização e clichês de e-commerce.

### Color Philosophy
O blush funciona como um gesto de cuidado e feminilidade contemporânea; o preto ancora a marca em confiança e sofisticação; o dourado aparece somente como pontuação, lembrando o detalhe de uma joia. O creme serve de tela quente para que fotos e produtos ganhem prioridade.

### Layout Paradigm
A página alterna blocos editoriais desalinhados, colunas de largura variável e uma faixa de manifesto que atravessa a tela. O hero terá uma composição dividida entre narrativa e mídia, em vez de um banner centralizado convencional.

### Signature Elements
- Selo circular “feito para florescer” orbitando a área de destaque.
- Linhas finas e marcadores de coleção inspirados em etiquetas de ateliê.
- Pequenos traços florais abstratos, usados como pontuação e não como estampa dominante.

### Interaction Philosophy
Cada interação deve parecer uma aproximação cuidadosa: links sublinham suavemente, cards revelam informações com deslocamento curto e botões têm resposta tátil. Nada deve piscar ou competir com as peças.

### Animation
Entradas em fade com deslocamento vertical de 18–24px, escalonadas em 50ms entre elementos. Imagens de produto podem ampliar levemente no hover, sempre dentro do recorte. O selo circular terá rotação muito lenta apenas em telas grandes; respeitar `prefers-reduced-motion`.

### Typography System
- **Display:** Cormorant Garamond, pesos 500–600, para títulos grandes e frases de campanha.
- **Body/UI:** DM Sans, pesos 400–700, para navegação, descrição, preços e CTAs.
- Hierarquia: títulos de hero entre 4.5rem e 7rem em desktop, 3.5rem em mobile; labels em caixa alta com espaçamento generoso; corpo confortável em 1rem–1.1rem.

### Brand Essence
Uma vitrine de moda feminina para lojistas que querem apresentar suas peças com encanto editorial e vender com proximidade pelo WhatsApp.

**Personalidade:** delicada, autoral, acolhedora.

### Brand Voice
Headlines soam como pequenos convites para imaginar uma ocasião, nunca como slogans genéricos. CTAs são claros e calorosos; microcopy orienta sem pressionar.

Exemplo 1: “Peças para os dias que merecem um pouco mais de você.”

Exemplo 2: “Escolha sua peça e fale com a gente.”

### Wordmark & Logo
O símbolo será uma flor abstrata de quatro pétalas, desenhada com linhas contínuas e uma pequena estrela no centro, sugerindo crescimento e cuidado. O nome “Flor de Menina” será composto em serifada elegante com uma intervenção manuscrita sutil no termo “Menina”, evitando um logotipo tipográfico genérico.

### Signature Brand Color
**Rosa pétala queimado — `#C98287`**. É mais maduro que um rosa pastel e mais acolhedor que um vermelho; funciona como assinatura em botões, selos e pequenos detalhes de navegação.

## Diretrizes por arquivo

- `client/src/pages/Home.tsx`: composição editorial, hero dividido, copy aspiracional e interações suaves.
- `client/src/index.css`: tokens creme/blush/preto/dourado, tipografia Cormorant + DM Sans, textura discreta e animações acessíveis.
- `client/index.html`: idioma pt-BR, título da marca e carregamento das fontes da identidade.
- `client/src/App.tsx`: manter tema claro e estrutura pública simples, sem rotas administrativas falsas nesta primeira entrega.
