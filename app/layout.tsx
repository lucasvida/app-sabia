import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { ClientLayout } from "@/components/theme/ClientLayout";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sabiá - Login para Professores",
  description:
    "Assistente Pedagógico Inteligente. Planeje aulas, corrija atividades e inspire seus alunos.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  var key = 'sabia-theme';
  var stored = localStorage.getItem(key);
  var resolved = stored === 'dark' ? 'dark' : stored === 'light' ? 'light' : null;
  if (resolved === 'dark') document.documentElement.classList.add('dark');
  else if (resolved === 'light') document.documentElement.classList.remove('dark');
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
})();
`,
          }}
        />
      </head>
      <body
        className={`${lexend.variable} font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
