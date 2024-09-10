import { defineComponent, onMounted, h } from "vue";

export function withLoading<T>(WrappedComponent: any) {
  return defineComponent({
    name: "WithLoading",
    setup(props, { attrs, slots }) {
      return () => h(WrappedComponent);
    }
  });
}
