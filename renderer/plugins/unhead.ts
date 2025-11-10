import { transformHtmlTemplate } from "unhead/server";
import { PageContext } from "vike/types";

const parse = (unheadInput: Vike.meta, pageContext: PageContext) => {
  const unheadToParse = unheadInput

  if (typeof unheadToParse === "function")
    return unheadToParse(pageContext);
  if (!unheadToParse) return {};

  if (Array.isArray(unheadToParse)) {
    const values = [];

    for (const iterator of unheadToParse) {
      var result = <Vike.meta>parse(iterator, pageContext);
      values.push(result);
    }

    return values.reverse()
  }
  return unheadToParse;
}

export const useUnhead = (pageContext: PageContext) => {
  const payload = pageContext.config.unhead || pageContext.data?.unhead;
  const head = pageContext.unhead;

  const entries = parse(payload, pageContext);
  Array.isArray(entries) ? entries.forEach((d) => head.push(d)) : head.push(entries);

  const render = async (template: string) => {
    const html = await transformHtmlTemplate(head, template)
    return html
  };

  return {
    head,
    render
  }
}