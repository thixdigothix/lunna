# 📸 Guia Definitivo: Como Adicionar Mais Fotos no Site no Futuro

Este documento foi criado e salvo para garantir que você possa adicionar novas fotos e memórias ao site no futuro **sem nenhum erro de build ou deploy (seja na Vercel ou Vite)**.

Existem **dois métodos** disponíveis e funcionando perfeitamente:

---

## 🌟 Método 1: Pasta `public/` (Mais Prático e Rápido)

Este é o jeito mais fácil, especialmente se você for fazer alterações rápidas ou pelo painel administrativo do site (`Ctrl + Shift + L`).

### Passo a Passo:
1. Coloque o arquivo de imagem diretamente dentro da pasta `/public/` do seu projeto.  
   *Exemplo:* `/public/foto_viagem.jpg`
2. No painel administrativo do site (ou diretamente no código), escreva apenas o caminho com a barra inicial:
   ```text
   /foto_viagem.jpg
   ```
3. Pronto! O servidor e a Vercel vão reconhecer a foto automaticamente sem precisar de nenhum import no código TypeScript.

---

## 🚀 Método 2: Pasta `/src/assets/images/` (Via Código / Imports)

Se você preferir organizar os arquivos junto com os componentes na pasta `src`, utilize este método.

### Passo a Passo:
1. Coloque o arquivo de imagem na pasta:  
   `/src/assets/images/`
2. **⚠️ REGRA DE OURO DOS NOMES:**  
   Certifique-se de que o nome do arquivo no computador/pasta é **exatamente idêntico** ao nome que você colocará no código.  
   *O erro anterior aconteceu porque os arquivos na pasta estavam com o sufixo `-1.jpg` (ex: `foto2_santos-1.jpg`), enquanto o código procurava por `foto2_santos.jpg`.*  
   *Se a foto se chama `minha_foto.jpg`, deixe sem espaços ou caracteres especiais.*
3. Abra o arquivo `/src/defaultData.ts` e adicione o import no topo:
   ```ts
   import novaFoto from './assets/images/minha_foto.jpg';
   ```
4. Adicione a variável na lista `photos`:
   ```ts
   photos: [
     foto1Acai,
     foto2Santos,
     foto3Cabeca,
     foto4Natureza,
     novaFoto  // <-- Sua nova foto aqui!
   ],
   ```
5. Adicione a legenda na lista `photoCaptions`:
   ```ts
   photoCaptions: [
     "Legenda 1...",
     "Legenda 2...",
     "Legenda 3...",
     "Legenda 4...",
     "Uma nova memória incrível que criamos juntos!" // <-- Legenda da nova foto
   ],
   ```

---

## 🛠️ Como o sistema resolve as imagens por trás dos panos?
O projeto conta com um resolvedor inteligente em `/src/imageResolver.ts`. Ele utiliza `import.meta.glob` para ler e empacotar automaticamente as imagens de `src/assets/images/` no Vite e também fazer o fallback para caminhos da pasta `public/`. Por isso, desde que o **nome do arquivo seja idêntico ao referenciado**, tudo funcionará com perfeição!

---

## ⚡ Correção Importante para o Vercel (`vercel.json`)
Anteriormente, as imagens não carregavam na Vercel porque o arquivo `vercel.json` estava redirecionando **todas** as requisições (incluindo `.jpg` e `.png`) para o `index.html`. 
O arquivo `vercel.json` foi atualizado com uma regra especial que protege todos os arquivos de imagem e assets estáticos:
```json
{
  "rewrites": [
    {
      "source": "/((?!api/|assets/|.*\\..*$).*)",
      "destination": "/index.html"
    }
  ]
}
```
Com essa correção no `vercel.json`, qualquer foto colocada na pasta `public/` ou em `src/assets/images/` funcionará tanto no Google AI Studio quanto na Vercel sem nenhum redirecionamento incorreto!
