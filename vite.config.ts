import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import UnoCSS from "unocss/vite";

export default defineConfig(({ mode }) => {
  const { VITE_BLOG_APP } = loadEnv(mode, "./");

  return {
    plugins: [
      vue(),
      UnoCSS({
        configFile: "./uno.config.ts"
      }),
      AutoImport({
        imports: [
          "vue",
          "pinia",
          "vue-router",
          "@vueuse/core",
          {
            "@/requests/index": ["Requests"]
          },
          {
            "@/constants/index": ["Consts"]
          },
          {
            "@/utils/index": ["Utils"]
          },
          {
            "@/hooks/index": ["Hooks"]
          },
          {
            from: "vue-router",
            imports: ["Router"],
            type: true
          },
          {
            from: "vue",
            imports: ["PropType"],
            type: true
          },
          {
            from: "@vueuse/core",
            imports: ["RemovableRef"],
            type: true
          }
        ],
        vueTemplate: true,
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        dirs: ["./src/**"],
        resolvers: [ElementPlusResolver()]
      })
    ],
    resolve: {
      alias: {
        "@": "/src"
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:math";
          `
        }
      }
    },
    server: {
      proxy: {
        "/api": {
          target: `https://www.cnblogs.com/${VITE_BLOG_APP}`,
          changeOrigin: true,
          rewrite: (path: any) => path.replace(/^\/api/, "")
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks() {
            return "components";
          },
          entryFileNames: `[name]-bleu.js`,
          chunkFileNames: `[name]-bleu.js`,
          assetFileNames: `[name]-bleu.[ext]`
        }
      }
    }
  };
});
