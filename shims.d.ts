import type { AttributifyAttributes } from "unocss/preset-attributify";

declare module "@vue/runtime-dom" {
// declare module "vue" {
  interface HTMLAttributes extends AttributifyAttributes {
    [key: string]: any
  }
}
