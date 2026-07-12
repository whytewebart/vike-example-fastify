/**
 * Breakout Grid — UnoCSS Preset
 * ================================================================
 * Implements a "breakout" layout: a centered content column with one
 * or more progressively wider columns ("breakouts") that content can
 * span into — e.g. a "wide" image that's bigger than the text column,
 * or a "full" element that bleeds to the edge of the viewport.
 *
 * The layout is a single CSS Grid whose columns are named, so any
 * descendant can jump to a named breakout with a simple utility like
 * `grid-col-[wide]` (exposed here as `bk-col-wide`), relying on CSS
 * Grid's implicit named-line shorthand (`grid-column: wide` resolves
 * to the span from line `wide-start` to line `wide-end`).
 *
 * Track layout, from edge to edge (n breakout levels, widest first):
 *
 *   [root-start] gutter [level-1-start] band ... [level-n-start] band
 *     [content-start] content [content-end]
 *   band [level-n-end] ... band [level-1-end] gutter [root-end]
 *
 * Each band's width is exactly half the gap between its own level's
 * max-width and the next (narrower) level's max-width — so the two
 * bands flanking a level together add up to that gap, keeping the
 * whole thing centered. The narrowest level instead measures itself
 * against the content column directly, since nothing sits between them.
 *
 * Usage (see `breakoutFn.defineGrid` at the bottom for the helper
 * that stitches the utility classes below together):
 *
 *   breakoutFn.defineGrid({
 *     content: 720,
 *     containers: [
 *       { name: "wide", value: 1200 },
 *       { name: "full", value: 1600 },
 *     ],
 *   })
 */

export { breakoutGrid, breakoutFn };

import { Preset } from "unocss";

const rules: Preset["rules"] = [
  [
    // bk-container-[name1,name2,...]
    // ------------------------------------------------------------
    // The core rule: builds the actual `grid-template-columns` for a
    // set of named breakout levels, plus every CSS custom property
    // the track sizes depend on.
    //
    // `names` must already be sorted widest → narrowest (this is
    // what `breakoutFn.defineGrid` does for you below). Each name is
    // expected to have its raw pixel value set separately via a
    // companion `bk-values-{name}-{value}` class.
    /^bk-container-\[([^\[\]]*)\]$/,
    ([, d]) => {
      const columns = d.split(",");
      const dv: Record<string, string> = {};

      // For a given level, build the chain of intermediate custom
      // property expressions its final track size is derived from.
      // Read bottom-up:
      //   step_04 = half of step_03                 → the actual track size
      //   step_03 = step_02 minus content width      → the raw gap, with content removed
      //   step_02 = this level's value minus step_01 → this level's value, minus whatever the next level already covers
      //   step_01 = this level's value minus content  → how far past content this level's own edge sits
      //
      // Note: `step_01` computed here for a level is stored under
      // the PREVIOUS (wider) level's name — see the loop below. A
      // level's own track size needs to know how much space the
      // level *inside* it already consumes, and `step_01` is exactly
      // that "space already consumed" figure.
      const __steps = (column: string) => {
        const __step_01 = `(var(--${column}-val) - var(--content-max-width))`;
        const __step_02 = `(var(--${column}-val) - var(--${column}-step_01))`;
        const __step_03 = `(var(--${column}-step_02) - var(--content-max-width))`;
        const __step_04 = `minmax(0, calc(var(--${column}-step_03) / 2))`;
        return { __step_01, __step_02, __step_03, __step_04 };
      };

      for (let i = 0; i < columns.length; i++) {
        const { __step_01, __step_02, __step_03, __step_04 } = __steps(columns[i]);

        // Hand this level's step_01 to the WIDER level right next to
        // it (columns[i - 1]) — that's the "space already consumed
        // by my inner neighbor" value it needs for its own step_02.
        // The widest level has no wider neighbor to feed, so there's
        // nothing to assign when i === 0 (previously this fell
        // through to a stray `--undefined-step_01` var — removed).
        if (i > 0) {
          dv[`--${columns[i - 1]}-step_01`] = __step_01;
        }

        dv[`--${columns[i]}-step_02`] = __step_02;
        dv[`--${columns[i]}-step_03`] = __step_03;
        dv[`--${columns[i]}`] = __step_04;

        // The narrowest (last) level is a special case: it sits
        // directly next to content with nothing narrower between
        // them, so its track is simply half of (its value − content
        // width) — no need for the step chain above at all.
        if (i === columns.length - 1) {
          const name = `--${columns[i]}`;
          const directGap = `(var(--${columns[i]}-val) - var(--content-max-width))`;
          dv[name] = `minmax(0, calc(${directGap} / 2))`;
        }
      }

      // Left half of the track list, gutter-inward:
      // [level-start] var(--level) ...
      const __start = columns.map(
        (column) => `[${column}-start] var(--${column})`
      );

      // Mirror it for the right half, content-outward:
      // ... var(--level) [level-end]
      // (Reversing a copy — `columns` is still read above and
      // shouldn't be mutated in place.)
      const __end = [...columns]
        .reverse()
        .map((column) => `var(--${column}) [${column}-end]`);

      const result = [
        __start.join(" "),
        "[content-start] var(--content) [content-end]",
        __end.join(" "),
      ].join(" ");

      // Outermost gutter on both edges — flexes to fill the viewport.
      const rootStart = "[root-start] var(--root)";
      const rootEnd = "var(--root) [root-end]";

      return {
        ...dv,
        "--gap": "1.25em",
        "--root": "minmax(var(--gap), 1fr)",
        display: "grid",
        "align-content": "flex-start",
        "grid-template-columns": rootStart + " " + result + " " + rootEnd,
      };
    },
  ],
  [
    // bk-values-{name}-{value}
    // ------------------------------------------------------------
    // Declares the raw max-width for one named breakout level, e.g.
    // `bk-values-wide-1200` → --wide-val: 1200px.
    // Non-numeric values (percentages, calc(), css vars, etc.) pass
    // straight through, and UnoCSS's `_` → space convention is
    // honored so arbitrary values like
    // `bk-values-wide-[calc(100%_-_2rem)]` work too.
    /^bk-values-([a-z]+)-(.+)$/,
    ([, m, t]) => {
      const obj: Record<string, string> = {};
      const d = t.replace(/[\]}[{]/g, "").replaceAll("_", " ");

      // `Number(d)` alone treats "0" as falsy and skips adding "px",
      // producing an invalid/unitless "0" instead of "0px" — check
      // numeric-ness explicitly instead.
      const isNumeric = d !== "" && !Number.isNaN(Number(d));
      obj[`--${m}-val`] = isNumeric ? `${d}px` : d;

      return obj;
    },
  ],
  [
    // bk-content-{boundary|bleed|<number>}
    // ------------------------------------------------------------
    // Sets the width of the centered content column itself.
    //   - a plain number → an explicit pixel width
    //   - "boundary"     → var(--boundary), a theme-level max-width
    //   - "bleed"        → var(--boundary-bleed), a wider theme max-width
    // `--content` is clamped with `min()` so it never overflows the
    // viewport minus the gutter gap on small screens.
    /^bk-content-(boundary|bleed|[0-9]+)$/,
    ([, d]) => {
      const isNumeric = /^[0-9]+$/.test(d);
      const cnt = isNumeric
        ? `${d}px`
        : `var(--boundary${d === "bleed" ? "-bleed" : ""})`;

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
    // bk-container--inherit  (internal)
    // ------------------------------------------------------------
    // For elements that shouldn't define their own grid, but should
    // still participate in an ancestor's breakout grid — re-declares
    // `display: grid` and inherits the parent's column tracks as-is.
    /^bk-container--inherit$/,
    () => ({
      display: "grid",
      "align-content": "inherit",
      "grid-template-columns": "inherit",
    }),
    {
      internal: true,
    },
  ],
  [
    // bk-content-i-{name|inherit}  (internal)
    // ------------------------------------------------------------
    // Used by an element that already sits inside a breakout grid
    // and wants to re-establish a narrower grid scoped to its own
    // children — e.g. an inner wrapper that should only expose the
    // "wide" breakout to ITS children, not "full" too. `inherit`
    // just re-exposes the content column with no breakout at all.
    /^bk-content-i-(inherit|[a-z]+)$/,
    ([, d]) => {
      const content = "[content-start] var(--content) [content-end]";
      const rootStart = "[root-start] var(--root)";
      const rootEnd = "var(--root) [root-end]";

      const handleStart = `[${d}-start] var(--${d})`;
      const handleEnd = `var(--${d}) [${d}-end]`;

      const result_1 = [handleStart, content, handleEnd].join(" ");
      const result = d === "inherit" ? content : result_1;

      return {
        "--gap": "1.25em",
        "--root": "minmax(var(--gap), 1fr)",
        display: "grid",
        "align-content": "flex-start",
        "grid-template-columns": rootStart + " " + result + " " + rootEnd,
      };
    },
    {
      internal: true,
    },
  ],
  // Utility to zero out the outer gutter, e.g. for edge-to-edge layouts.
  ["remove-margin", { "--gap": "0em" }],
];

const shortcuts: Preset["shortcuts"] = [
  // bk-col-{name} → jump an element to a named breakout column,
  // relying on the `{name}-start` / `{name}-end` line names above.
  [/^bk-col-([a-z]+)$/, ([, c]) => `grid-col-[${c}]!`],

  // bk-inherit-{name} → scope a narrower grid to this element's
  // children, exposing only the `{name}` breakout, and default every
  // direct child into the content column unless opted out.
  [/^bk-inherit-([a-z]+)$/, ([, c]) => `bk-content-i-${c} [&_>_*]:bk-col-content`],

  {
    // Same as `bk-inherit-{name}` but with no breakout exposed at all —
    // children just get the content column.
    "bk-inherit": "bk-content-i-inherit [&_>_*]:bk-col-content",

    // Re-participate in an ancestor grid, put this element in the
    // outermost (root) track, and default its own children back to content.
    "bk-container-inherit":
      "bk-container--inherit bk-col-root! [&_>_*]:bk-col-content",

    // Convenience max-width utilities matching the theme boundary vars,
    // for non-grid contexts.
    boundary: "max-w-[var(--boundary)]",
    "boundary-bleed": "max-w-[var(--boundary-bleed)]",
  },
];

type BreakoutGrid = {
  /** Width of the centered content column. */
  content: number | "boundary" | "bleed";
  /** Named breakout levels and their max-widths, any order — sorted internally. */
  containers: { name: string; value: number }[];
};

const breakoutFn = {
  /**
   * Builds the full class string for a breakout grid container from
   * a plain config object, so callers don't need to hand-sort levels
   * or remember the `bk-values-*` / `bk-container-[...]` naming.
   *
   * Also defaults every direct child to the content column, so you
   * only need to opt individual children INTO a breakout with
   * `bk-col-{name}`.
   */
  defineGrid: (opts: BreakoutGrid) => {
    const sorted = [...opts.containers].sort((a, b) => b.value - a.value);

    const content = `bk-content-${opts.content}`;
    const values = sorted
      .map((d) => `bk-values-${d.name}-${d.value}`)
      .join(" ");
    const container = `bk-container-[${sorted.map((d) => d.name).join(",")}]`;

    return `${container} ${values} ${content} [&_>_*]:grid-col-[content]`;
  },
};

const breakoutGrid: Preset = {
  name: "breakout-grid",
  rules,
  shortcuts,
};
