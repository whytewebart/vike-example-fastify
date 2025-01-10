import { createHead, UseHeadInput } from "unhead";
import { renderSSRHead } from "@unhead/ssr";
import { PageContext } from "vike/types";

class useUnhead {
  pageContext: PageContext;
  unhead?: Vike.Config["unhead"];
  head = createHead({ plugins: [] });
  parsed: UseHeadInput<any>;

  constructor(pageContext: PageContext) {
    this.pageContext = pageContext;
    this.unhead =
      this.pageContext.config.unhead || this.pageContext.data?.unhead;

      // this is parsed unhead from the pageContext.config
    this.parsed = this.parse();
    const parsed_data = this.parse(this.pageContext.data?.unhead);
    this.head.push({
      // ...pageContext.config.unhead,
      ...this.parsed,
      ...parsed_data
    });
  }

  parse(unheadInput?: typeof this.unhead) {
    const unheadToParse = unheadInput ?? this.unhead;

    if (typeof unheadToParse === "function")
      return unheadToParse(this.pageContext);
    if (!unheadToParse) return {};

    if (Array.isArray(unheadToParse)) {
      const values = [];

      for (const iterator of unheadToParse) {
        var result = this.parse(iterator);
        values.push(result);
      }

      values.reverse().forEach((d) => this.head.push(d));
      return {};
    }
    return unheadToParse;
  }

  async server() {
    const HeadTags = await renderSSRHead(this.head);
    return HeadTags;
  }

  client() {}
}

const unHeadPlugin = () => {
  return {
    name: "unhead",
    setup: (pageContext: PageContext) => {
      return new useUnhead(pageContext);
    },
  };
};

export default unHeadPlugin;