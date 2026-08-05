import { createFileRoute, Outlet } from "@tanstack/react-router";
import dahuaCss from "@/styles/dahua.css?url";

export const Route = createFileRoute("/education")({
  head: () => ({
    links: [{ rel: "stylesheet", href: dahuaCss }],
  }),
  component: () => <Outlet />,
});
