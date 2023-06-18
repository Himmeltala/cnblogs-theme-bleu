export const useAnchorStore = defineStore("anchorStore", () => {
  let _anchor = ref();

  function setAnchor(anchor: string) {
    _anchor.value = anchor;
  }

  return { anchor: _anchor, setAnchor };
});
