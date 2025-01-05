export const useAnchorStore = defineStore("anchorStore", () => {
  const _anchor = ref();

  function setAnchor(anchor: string) {
    _anchor.value = anchor;
  }

  return { anchor: _anchor, setAnchor };
});
