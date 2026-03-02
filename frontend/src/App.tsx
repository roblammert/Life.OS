import { BrowserRouter } from "react-router-dom";
import { LifeOsProvider } from "./app/life-os-provider";
import { LayoutShell } from "./app/layout-shell";

export default function App() {
  return (
    <LifeOsProvider>
      <BrowserRouter>
        <LayoutShell />
      </BrowserRouter>
    </LifeOsProvider>
  );
}
