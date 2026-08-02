// src/routes/mal1688.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mal1688")({
  component: Mal1688Page,
});

function Mal1688Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">mal1688 商城</h1>
      <p className="text-muted-foreground">即将推出...</p>
    </div>
  );
}
