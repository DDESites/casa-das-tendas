# Casa das Tendas — Site Institucional

Site estático (HTML + CSS + JS puros) da **Casa das Tendas**, loja de venda de tendas
em Brasília/DF. Sem frameworks, sem build: é só abrir.

## Como rodar

```powershell
# opção 1 – servidor local (recomendado)
powershell -ExecutionPolicy Bypass -File server.ps1 -Porta 8080
# abra http://localhost:8080/

# opção 2 – abrir direto no navegador
# dê dois cliques em index.html
```

## Estrutura

```
casa-das-tendas/
├── index.html                  Home (hero, categorias, aplicações, vídeos, galeria, CTA)
├── tendas.html                 Catálogo com filtros por categoria
├── tenda-sanfonada.html        Detalhe: sanfonadas (2x2 a 6x3)
├── tenda-piramidal.html        Detalhe: piramidais (4x4 a 12x5)
├── acessorios-e-estruturas.html Detalhe: laterais, bancadas, coberturas e peças
├── aplicacoes.html             Onde usar (eventos, feiras, comércio, obras)
├── sobre.html                  A loja, localização e horários
├── contato.html                Formulário de orçamento + FAQ + mapa
├── css/style.css               Design system completo (responsivo + reduced-motion)
├── js/main.js                  Menu, filtros, lightbox, galeria, formulário, rastreamento
├── img/                        Fotos reais da loja, logo e vídeos (MP4)
│   └── og-casa-das-tendas.jpg  Imagem de compartilhamento (1200x630)
├── robots.txt / sitemap.xml    Arquivos de SEO
├── server.ps1                  Servidor local para desenvolvimento
└── README.md                   Este arquivo
```

## Identidade visual

| Token | Cor | Uso |
|---|---|---|
| `--laranja` | `#F4772B` | Cor da marca: botões, ícones, faixas |
| `--laranja-escuro` | `#D9600F` | Estados de hover e detalhes |
| `--laranja-texto` | `#A84600` | Texto laranja acessível (contraste AA) |
| `--carvao` | `#17171A` | Topo, rodapé e seções escuras |
| `--vermelho` | `#D93B2B` | Só em avisos/erros de formulário |

Tipografia: **Barlow Condensed** (títulos) + **Inter** (texto).
Decoração: picos/montanhas do logo usados como divisórias (`svg.linha-picos`,
`svg.pico-fundo`).

## Funcionalidades

- **Filtros do catálogo** (`tendas.html`) com botões `data-filtro`.
- **Galeria com lightbox** na home (teclado: `Esc`, `←`, `→`).
- **Galeria de miniaturas** nas páginas de produto (troca da imagem principal).
- **Formulário de orçamento** com validação em tempo real, mensagem de confirmação
  e geração de resumo pronto para o **WhatsApp** (`wa.me`).
- **WhatsApp flutuante** + links `tel:` e `wa.me` em todo o site.
- **Vídeos**: dois MP4 locais com autoplay pausado quando fora da tela
  (IntersectionObserver) + embed de reel do Instagram.
- **Métricas**: eventos empurrados para `window.dataLayer`
  (`whatsapp_click`, `filtro_catalogo`, `galeria_foto`, `formulario_enviado`,
  `formulario_erro`) — prontos para GTM/GA4.
- **JSON-LD**: LocalBusiness/HomeAndConstructionBusiness, Product, CollectionPage,
  ContactPage, AboutPage.

## Regras de conteúdo (importante)

- **Nunca publicar preços fixos** — sempre “Consulte um orçamento”.
- Só informações confirmadas (endereço, telefone, horários, modelos e fotos
  oficiais do Instagram `@casadastendasbsb`).
- Fotos sem rostos de pessoas.
- O formulário é estático: após o envio, ele mostra o botão
  **“Enviar pelo WhatsApp”** com o resumo preenchido.

## Publicação

- **Site no ar:** https://ddesites.github.io/casa-das-tendas/
- **Repositório:** https://github.com/DDESites/casa-das-tendas
- **Hospedagem:** GitHub Pages (branch `main`, pasta raiz) — todo `git push`
  na `main` rebuilda e republica o site automaticamente.

### Como publicar uma alteração

```powershell
git add -A
git commit -m "descrição da mudança"
git push
# o Pages sozinho recompila em ~1 minuto
```

### Quando um domínio próprio for comprado (ex.: casadastendasbsb.com.br)

1. Crie um arquivo `CNAME` na raiz contendo apenas o domínio
   (ex: `www.casadastendasbsb.com.br`) e faça push.
2. Aponte o DNS do domínio: `A` para `185.199.108.153` (e
   `.109.153`, `.110.153`, `.111.153`) ou `CNAME` para `ddesites.github.io`.
3. Substitua `https://ddesites.github.io/casa-das-tendas/` pelo domínio nos
   `.html` (canonical, og:url, og:image, JSON-LD), em `robots.txt` e
   `sitemap.xml`.
4. Envie o `sitemap.xml` no Google Search Console.

## Acessibilidade e SEO

Auditado com Lighthouse em todas as 8 páginas: **Acessibilidade 100,
Boas Práticas 100, SEO 100**.
