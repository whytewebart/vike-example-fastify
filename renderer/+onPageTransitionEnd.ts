// https://vike.dev/onPageTransitionEnd
export { onPageTransitionEnd }

import type { OnPageTransitionEndAsync } from 'vike/types'

const onPageTransitionEnd: OnPageTransitionEndAsync = async (): ReturnType<OnPageTransitionEndAsync> => {
  console.log('Page transition end')
  const bus = useEventBus<string>("spinner");
  const busMenu = useEventBus<string>("mobile-menu");

  bus.emit("stop-spinner")
  busMenu.emit("close")
}
