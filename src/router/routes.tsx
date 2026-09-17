import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/templates/AppShell";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Pulls in React Flow — code-split so it's only fetched once, not blocking
// the initial shell render.
const DesignerPage = lazy(() =>
  import("@/pages/DesignerPage").then((m) => ({ default: m.DesignerPage })),
);

export const router = createBrowserRouter(
  [
    {
      element: <AppShell />,
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={null}>
              <DesignerPage />
            </Suspense>
          ),
        },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ],
  // Must match vite.config.ts's `base` — GitHub Pages serves this app from
  // /system-design-diagram-tool/, not the domain root.
  { basename: import.meta.env.BASE_URL },
);
