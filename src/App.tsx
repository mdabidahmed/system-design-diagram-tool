import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/app/ThemeProvider";
import { router } from "@/router/routes";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
