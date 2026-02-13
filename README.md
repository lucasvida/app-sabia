# Sabiá – Assistente Pedagógico Inteligente

Assistente pedagógico inteligente em português para professores. Planeje aulas, corrija atividades e inspire seus alunos com tecnologia pensada para o Brasil.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ecf8e?style=flat-square&logo=supabase)

---

## Sobre o projeto

O **Sabiá** é um assistente inteligente brasileiro voltado para quem educa. O objetivo é devolver ao professor tempo e clareza: planejamento de aulas, geração de quizzes, ideias para atividades e um chat com IA integrado, tudo em uma interface simples e em português.

### Principais funcionalidades

- **Login para professores** – Autenticação com Supabase (email e senha).
- **Dashboard** – Acesso rápido a turmas, planejamento, quizzes, histórico e chat.
- **Chat com IA** – Conversa com o assistente via API (webhook n8n).
- **Planejamento de aulas** – Criação de planos de aula com apoio da IA.
- **Quizzes** – Geração de avaliações e exercícios rápidos.
- **Turmas** – Gestão de turmas, alunos e materiais.
- **Histórico** – Acesso a conversas e materiais anteriores.
- **Tema claro/escuro** – Suporte a modo escuro com persistência no `localStorage`.
- **Páginas institucionais** – Home, Sobre e Contato.

### Tecnologias

| Stack        | Tecnologia                          |
|-------------|--------------------------------------|
| Framework   | Next.js 16 (App Router)              |
| UI          | React 19, TypeScript 5               |
| Estilos     | Tailwind CSS 4                       |
| Auth        | Supabase (SSR + cookies)             |
| Chat/IA     | API Route → webhook n8n              |
| Fonte       | Lexend (Google Fonts)                |
| Ícones      | Material Icons (Round, Outlined)     |

---

## Pré-requisitos

- **Node.js** 18+ (recomendado 20+)
- **pnpm** (ou npm/yarn)
- Conta no [Supabase](https://supabase.com) para autenticação

---

## Instalação

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/seu-usuario/app-sabia.git
cd app-sabia
pnpm install
```

### 2. Variáveis de ambiente

Copie o arquivo de exemplo e preencha com os dados do seu projeto Supabase:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
# Supabase – Project Settings > API (ou Connect > Framework: Next.js)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co

# Chave pública (anon ou publishable)
# Nome antigo:
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key

# Ou nome novo (publishable):
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_...
```

A aplicação aceita tanto `NEXT_PUBLIC_SUPABASE_ANON_KEY` quanto `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (ver `lib/supabase/env.ts`).

### 3. Rodar em desenvolvimento

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### 4. Build e produção

```bash
pnpm build
pnpm start
```

---

## Estrutura do projeto

```
app-sabia/
├── app/
│   ├── api/chat/          # POST /api/chat – envia mensagem ao webhook n8n
│   ├── aulas/             # Página de aulas
│   ├── chat/              # Página do chat com o assistente
│   ├── contato/           # Página de contato
│   ├── dashboard/         # Área do professor (protegida)
│   │   ├── atividades/
│   │   ├── configuracoes/
│   │   ├── conteudos/
│   │   ├── historico/
│   │   ├── planejamento/
│   │   ├── quizzes/
│   │   └── turmas/
│   ├── login/             # Página de login
│   ├── sobre/             # Sobre o projeto
│   ├── layout.tsx         # Layout raiz (Lexend, tema, metadata)
│   ├── page.tsx           # Home (hero + footer)
│   └── globals.css        # Tailwind + tema (primary, dark mode)
├── components/
│   ├── chat/              # ChatMain, ChatSidebar
│   ├── dashboard/         # Layout, Sidebar, TopBar, ChatCTA
│   ├── home/              # Header, Hero, LoginCard, Footer
│   ├── layout/            # Header compartilhado
│   └── theme/             # ThemeProvider, ThemeSelector, ClientLayout
├── lib/
│   ├── auth-messages.ts   # Mensagens de erro de autenticação
│   └── supabase/          # client, server, env (URL e chave)
├── middleware.ts          # Proteção /dashboard + refresh de sessão Supabase
├── next.config.ts         # remotePatterns (Google, Unsplash)
└── public/                # logo, favicon, imagens
```

---

## Autenticação e rotas protegidas

- **Públicas:** `/`, `/login`, `/sobre`, `/contato`, `/aulas`, `/chat` (acesso ao chat pode ser restrito conforme sua regra).
- **Protegidas:** todas as rotas em `/dashboard/*`. Sem sessão Supabase válida, o usuário é redirecionado para `/`.
- O middleware usa `@supabase/ssr` para ler/atualizar a sessão via cookies em toda requisição.

---

## API de Chat

- **Endpoint:** `POST /api/chat`
- **Body:** `{ "message": "texto da mensagem" }`
- **Resposta:** `{ "response": "resposta do assistente" }`
- A rota obtém o usuário logado via Supabase e envia `message` + `user_session_id` para um webhook n8n configurado no código. O webhook é definido em `app/api/chat/route.ts` (`WEBHOOK_URL`).

Para usar outro backend de IA, altere a `WEBHOOK_URL` ou a lógica dentro de `app/api/chat/route.ts`.

---

## Scripts disponíveis

| Comando       | Descrição                    |
|---------------|------------------------------|
| `pnpm dev`    | Servidor de desenvolvimento  |
| `pnpm build`  | Build de produção            |
| `pnpm start`  | Inicia o app em produção     |
| `pnpm lint`   | Executa o ESLint             |

---

## Tema e acessibilidade

- Cores principais: `primary` (#13ec5b) e `primary-dark` (#0eb545), definidas em `app/globals.css` com `@theme`.
- Modo escuro controlado pela classe `dark` no `<html>`; a preferência do sistema é usada apenas como fallback quando não há valor salvo no `localStorage` (chave `sabia-theme`).
- Fonte: Lexend (variação `--font-lexend`).

---

## Licença

Projeto privado. Uso conforme definido pelos mantenedores.

---

## Contato

Para dúvidas ou sugestões sobre o Sabiá, utilize a página de [Contato](/contato) no próprio app ou abra uma issue no repositório.
