import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { defineConfig, loadEnv } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import UnoCSS from "unocss/vite";

export default defineConfig(({ mode }) => {
  const { VITE_BLOG_APP } = loadEnv(mode, "./");
  return {
    plugins: [
      vue(),
      vueJsx(),
      UnoCSS({
        configFile: "./uno.config.ts"
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/ // .vue
        ],
        imports: [
          "vue",
          "pinia",
          "vue-router",
          "@vueuse/core",
          {
            "@/constants/index": ["Consts"]
          },
          {
            "@/requests/index": ["Requests"]
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
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: "Icon"
          })
        ],
        vueTemplate: true,
        dts: "./auto-imports.d.ts"
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            enabledCollections: ["ep"]
          })
        ],
        dirs: ["./src/views/**", "./src/components/**", "./src/fragments/**"]
      }),
      Icons({
        autoInstall: true
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
            @use "@/scss/mixins";
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
          entryFileNames: "[name]-bleu.js",
          chunkFileNames: "[name]-bleu.js",
          assetFileNames: "[name]-bleu.[ext]"
        }
      }
    }
  };
});
