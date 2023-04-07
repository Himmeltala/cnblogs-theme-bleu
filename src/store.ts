export const useCatalogStore = defineStore("catalogStore", () => {
  let _catalog = ref();

  function setCatalog(catalog: any) {
    _catalog.value = catalog;
  }

  return { catalog: _catalog, setCatalog };
});

export const useAnchorStore = defineStore("anchorStore", () => {
  let _anchor = ref();

  function setAnchor(anchor: string) {
    _anchor.value = anchor;
  }

  return { anchor: _anchor, setAnchor };
});

export const useBaseAuthorData = defineStore("baseAuthorData", () => {
  const _authorData = ref();

  function setBaseAuthorData(data: any) {
    _authorData.value = data;
  }

  return { authorData: _authorData, setBaseAuthorData };
});
