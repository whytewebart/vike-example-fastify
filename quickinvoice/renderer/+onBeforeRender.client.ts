export { onBeforeRender }
 
import { defineAll, modules } from '@/renderer/plugins/minze'
import type { PageContextServer } from 'vike/types'
 
async function onBeforeRender(pageContext: PageContextServer) {
  defineAll(modules)
}