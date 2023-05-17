export namespace CalendarTransform {
  export function toCalendar(dom: Document): string[] {
    const dates: string[] = [];
    dom.querySelectorAll("a[href^='https']").forEach(ele => {
      const date = ele.getAttribute("href").match(/\d+\/\d+\/\d+/g)[0];
      dates.push(date);
    });
    return dates;
  }
}
