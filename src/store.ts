export const useKatalogStore = defineStore("katalogStore", () => {
  let katalog = ref();

  function setKatalog(data: any) {
    katalog.value = data;
  }

  return { katalog, setKatalog };
});

export const useAnchorStore = defineStore("anchorStore", () => {
  let _anchor = ref();

  function setAnchor(anchor: string) {
    _anchor.value = anchor;
  }

  return { anchor: _anchor, setAnchor };
});
