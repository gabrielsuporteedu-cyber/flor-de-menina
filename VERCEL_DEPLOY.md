# Deploy via GitHub e Vercel

## Diagnóstico atual

O projeto agora é uma aplicação full-stack com React, Express, tRPC, autenticação, banco MySQL/TiDB e armazenamento. O build atual é executado por `pnpm build` e gera o frontend em `dist/public` e o servidor em `dist/index.js`.

A importação do repositório pela Vercel pode ser feita a partir da raiz do projeto, mas o deploy **não deve ser considerado pronto apenas com as configurações padrão**. O servidor atual inicia um processo Express persistente com `server/_core/index.ts`, enquanto a Vercel precisa de funções serverless ou de um servidor Node compatível com o plano escolhido. O tRPC, o OAuth, os uploads e o banco também precisam ser apontados para serviços externos compatíveis.

A hospedagem integrada do Manus continua sendo o caminho recomendado para esta versão, pois já fornece o runtime do servidor, as variáveis de autenticação, o banco e o armazenamento usados pelo painel.

## Se a publicação na Vercel for mantida

1. Exporte o projeto para um repositório GitHub e importe a raiz do repositório na Vercel.
2. Use `pnpm build` como comando de build. Não altere o diretório raiz para `client`, pois o backend e o schema ficam na raiz.
3. Antes de publicar, adapte `server/_core/index.ts` para uma função serverless em `api/` ou migre o backend para um serviço Node persistente. Não aponte a Vercel somente para `dist/public`, pois isso removeria o painel, o tRPC, o login e os uploads.
4. Configure na Vercel as variáveis `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `OWNER_OPEN_ID`, `OWNER_NAME`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL` e `VITE_FRONTEND_FORGE_API_KEY` usando os valores do ambiente de produção.
5. Atualize as URLs de callback OAuth para o domínio final da Vercel e confirme que o banco e o armazenamento aceitam conexões do ambiente externo.

## Acesso administrativo

O painel fica em `/admin`. O primeiro acesso deve ser feito pelo login Manus para que a proprietária possa criar a senha própria em Configurações. Depois disso, o login por e-mail e senha pode ser usado normalmente; a alteração da senha fica disponível na mesma seção.
