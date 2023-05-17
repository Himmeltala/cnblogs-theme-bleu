export namespace AlbumnTransform {
  export function toAlbumnItem(dom: Document) {
    return dom.getElementById("ViewPicture1_GalleryImage").getAttribute("src");
  }

  export function toAlbumn(dom: Document) {
    const data: BleuAlbumnItem[] = [];
    const eles = dom.getElementsByClassName("divPhoto");

    for (let i = 0; i < eles.length; i++) {
      data.push({
        id: eles[i]
          .getElementsByTagName("a")[0]
          .getAttribute("href")
          .match(/\/gallery\/image\/\d+/g)[0]
          .split("/")[3],
        src: eles[i].getElementsByTagName("img")[0].getAttribute("src")
      });
    }

    return {
      title: dom.getElementsByClassName("thumbTitle")[0].innerText,
      desc: dom.getElementsByClassName("thumbDescription")[0].innerText,
      data
    };
  }
}
