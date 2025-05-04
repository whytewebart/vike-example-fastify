// https://vike.dev/onPageTransitionStart
export { onPageTransitionStart }

import type { OnPageTransitionStartAsync } from 'vike/types'

const onPageTransitionStart: OnPageTransitionStartAsync = async (): ReturnType<OnPageTransitionStartAsync> => {
  console.log('Page transition start')
  const bus = useEventBus<string>("spinner");
  const busMenu = useEventBus<string>("mobile-menu");

  bus.emit("start-spinner")
  busMenu.emit("close")
}
