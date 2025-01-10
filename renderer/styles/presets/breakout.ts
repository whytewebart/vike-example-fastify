export { breakoutGrid };

import { Preset } from "unocss";

const rules: Preset["rules"] = [
  [
    /^bk-content-(boundary|bleed|[0-9]+)$/,
    ([, d]) => {
      var cnt = d;

      if (!Number(d)) {
        cnt = `var(--boundary${d === "bleed" ? "-bleed" : ""})`;
      } else {
        cnt = d + "px";
      }

      return {
        "--cnt": `${cnt}`,
        "--content": `min(${cnt}, 100% - var(--gap) * 2)`,
        "--content-max-width": `${cnt}`,
      };
    },
    {
      autocomplete: "bk-content-(boundary|bleed)",
    },
  ],

  [
    // /^bk-grid-([a-z]+)-(\d+)$/,
    /^bk-values-([a-z]+)-(.+)$/,
    ([, m, t]) => {
      const obj: Record<any, any> = {};
      var d = t.replace(/[\]}[{]/g, "").replaceAll("_", " ");

      obj[`--${m}`] = `minmax(0, calc((${d}${
        Number(d) ? "px" : ""
      } - var(--content-max-width)) / 2))`;
      return obj;
    },
  ],
  [
    /^bk-setup-\[([^\[\]]*)\]\s*\[([^\[\]]*)\]$/,
    ([, d, c]) => {
      const columns = d.split(",");
      const columnStart = columns.map(
        (column) => `[${column}-start] var(--${column})`
      );
      const columnEnd = columns
        .reverse()
        .map((column) => `var(--${column}) [${column}-end]`);

      const result = [
        columnStart.join(" "),
        "[content-start] var(--content) [content-end]",
        columnEnd.join(" "),
      ].join(" ");

      // --- root
      const rootStart = "[root-start] var(--root)";
      const rootEnd = "var(--root) [root-end]";

      const firstResult = {
        "--gap": "1.25em",
        // "--gap": "2em",
        "--root": "minmax(var(--gap), 1fr)",
        display: "grid",
        "align-content": "flex-start",
        "grid-template-columns": rootStart + " " + result + " " + rootEnd,
      };
      // -----
      // ------------
      const values = c.split(",");

      const variables: Record<any, any> = {};
      columns.forEach((column, i) => {
        const na = `--${column}`;
        const calc = `calc(
                    (${values[i]}px - var(--content-max-width)) / 2
                  )`;
        // variables[na] = `minmax(0, ${values[i]}px)`
        variables[na] = `minmax(0, ${calc})`;
      });
      // ------
      return { ...variables, ...firstResult };
    },
  ],
  [
    /^bk-container-inherit/,
    ([, d]) => {
      const content = "[content-start] var(--content) [content-end]"
      const rootStart = "[root-start] var(--root)";
      const rootEnd = "var(--root) [root-end]";

      const firstResult = {
        "--gap": "1.25em",
        "--root": "minmax(var(--gap), 1fr)",
        display: "grid",
        "align-content": "flex-start",
        "grid-template-columns": rootStart + " " + content + " " + rootEnd,
      };
      // ------
      return { ...firstResult };
    },
  ],
  [
    /^bk-container-\[([^\[\]]*)\]$/,
    ([, d]) => {
      const columns = d.split(",");
      const columnStart = columns.map(
        (column) => `[${column}-start] var(--${column})`
      );
      const columnEnd = columns
        .reverse()
        .map((column) => `var(--${column}) [${column}-end]`);

      const result = [
        columnStart.join(" "),
        "[content-start] var(--content) [content-end]",
        columnEnd.join(" "),
      ].join(" ");

      // --- root
      const rootStart = "[root-start] var(--root)";
      const rootEnd = "var(--root) [root-end]";

      const firstResult = {
        "--gap": "1.25em",
        // "--gap": "2em",
        "--root": "minmax(var(--gap), 1fr)",
        display: "grid",
        "align-content": "flex-start",
        "grid-template-columns": rootStart + " " + result + " " + rootEnd,
      };
      // ------
      return { ...firstResult };
    },
  ],
];

const shortcuts: Preset["shortcuts"] = [
  [/^bk-col-([a-z]+)$/, ([, c]) => `grid-col-[${c}]`],
  {
    "bk-inherit": "bk-container-inherit [&_>_*]:bk-col-content",
  }
];

const breakoutGrid: Preset = {
  name: "breakout-grid",
  rules,
  shortcuts,
};
