import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingContacts } from "@/components/site/FloatingContacts";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn’t load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex gap-2 justify-center">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-foreground px-4 py-2 text-sm text-background"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border px-4 py-2 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bloom Public School — Where Curiosity Blossoms" },
      { name: "description", content: "Bloom Public School is a modern, future-ready Pakistani school nurturing confident, curious learners through excellent academics, sports and culture." },
      { property: "og:title", content: "Bloom Public School — Where Curiosity Blossoms" },
      { property: "og:description", content: "Bloom Public School is a modern, future-ready Pakistani school nurturing confident, curious learners through excellent academics, sports and culture." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Bloom Public School — Where Curiosity Blossoms" },
      { name: "twitter:description", content: "Bloom Public School is a modern, future-ready Pakistani school nurturing confident, curious learners through excellent academics, sports and culture." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e9f24e8e-d4b1-4b7a-b2cf-0fabc17881a6/id-preview-368d86a0--568d843b-ddda-45fd-b3de-93762f923bb9.lovable.app-1778446856439.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e9f24e8e-d4b1-4b7a-b2cf-0fabc17881a6/id-preview-368d86a0--568d843b-ddda-45fd-b3de-93762f923bb9.lovable.app-1778446856439.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <Outlet />
        </main>
        <Footer />
        <FloatingContacts />
      </div>
    </QueryClientProvider>
  );
}
