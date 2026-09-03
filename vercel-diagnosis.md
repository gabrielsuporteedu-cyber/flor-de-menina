# Diagnóstico do deploy

- URL verificada: https://flordemenina-sand.vercel.app/
- Resultado: a Vercel exibe o bundle do servidor/arquivos TypeScript como texto, sem renderizar a vitrine React.
- Repositório verificado: https://github.com/gabrielsuporteedu-cyber/flor-de-menina/tree/main
- Branch: main.
- Último commit observado: 39316a4, “Track GitHub export completion”.
- O repositório contém VERCEL_DEPLOY.md, mas a listagem pública observada não contém vercel.json.
- Causa provável: a configuração vercel.json criada localmente não foi publicada no GitHub; a Vercel está usando uma configuração/saída incorreta.
- Correção local preparada: buildCommand `pnpm build`, outputDirectory `dist/public`, installCommand `pnpm install --frozen-lockfile`, framework `vite` e rewrite SPA para `/index.html`.
