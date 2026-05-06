import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async ({ command }) => {
  const rawPort = process.env.PORT;
  const defaultPort = 5173;

  // #region agent log (bd9638)
  console.log("[bd9638][H1] vite.config.ts loaded", {
    command,
    hasPORT: Boolean(process.env.PORT),
    hasBASE_PATH: Boolean(process.env.BASE_PATH),
    nodeEnv: process.env.NODE_ENV ?? null,
  });
  // #endregion agent log (bd9638)

  let port = defaultPort;
  if (rawPort) {
    const parsed = Number(rawPort);
    if (!Number.isNaN(parsed) && parsed > 0) {
      port = parsed;
    } else if (command !== "build") {
      // #region agent log (bd9638)
      console.log("[bd9638][H2] invalid PORT (non-build)", { rawPort, parsed });
      // #endregion agent log (bd9638)
      throw new Error(`Invalid PORT value: "${rawPort}"`);
    }
  }

  const basePath = process.env.BASE_PATH ?? "/";

  // #region agent log (bd9638)
  console.log("[bd9638][H3] computed settings", { port, basePath });
  // #endregion agent log (bd9638)

  return {
    base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  };
});
