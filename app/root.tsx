import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { useOptionalUser } from "./utils";
import { PageWrapper } from "./components";

import '@fortawesome/fontawesome-svg-core/styles.css';
import faStylesheetUrl from '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from "@fortawesome/fontawesome-svg-core";
// Prevent fontawesome from dynamically adding its css since we are going to include it manually
config.autoAddCss = false;

export const links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fascinate&family=Poppins:wght@100;400;700&display=swap' },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: 'stylesheet', href: faStylesheetUrl }
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Salon Clients",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  const user = useOptionalUser();
  return (
    <html lang="en" className="h-full bg-background">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        {user ? (
          <PageWrapper>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </PageWrapper>
        ) : (
          <>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </>
        )}
      </body>
    </html>
  );
}
