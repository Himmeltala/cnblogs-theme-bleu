export namespace MarkListTransform {
  export function toMarkList(dom: Document): BleuMark[] {
    const data: BleuMark[] = [];
    const eles = dom.getElementById("MyTag1_dtTagList").getElementsByTagName("td");

    for (let i = 0; i < eles.length; i++) {
      const eleA = eles[i].getElementsByTagName("a")[0];
      data.push({
        count: parseInt(eles[i].getAttribute("data-use-count")),
        href: eleA.getAttribute("href"),
        text: eleA.innerText
      });
    }

    return data;
  }
}
