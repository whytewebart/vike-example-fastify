import { onMounted, onUnmounted } from 'vue'

interface ShortcutOptions {
  shift?: boolean
  ctrl?: boolean
  alt?: boolean
  meta?: boolean
  preventDefault?: boolean
  ignoreInputs?: boolean
}

const keyAliases: Record<string, string> = {
  esc: 'Escape',
  escape: 'Escape',

  enter: 'Enter',
  return: 'Enter',

  space: ' ',
  spacebar: ' ',

  tab: 'Tab',

  backspace: 'Backspace',
  delete: 'Delete',
  del: 'Delete',

  insert: 'Insert',
  ins: 'Insert',

  home: 'Home',
  end: 'End',

  pgup: 'PageUp',
  pageup: 'PageUp',

  pgdn: 'PageDown',
  pagedown: 'PageDown',

  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  arrowup: 'ArrowUp',
  arrowdown: 'ArrowDown',
  arrowleft: 'ArrowLeft',
  arrowright: 'ArrowRight',
}

function normalizeKey(key: string) {
  const normalized = key.trim().toLowerCase()

  return keyAliases[normalized] ?? normalized
}

export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: ShortcutOptions = {}
) {
  const {
    shift = false,
    ctrl = false,
    alt = false,
    meta = false,
    preventDefault = false,
    ignoreInputs = true,
  } = options

  // Normalize the key once when the composable is created.
  const normalizedKey = normalizeKey(key)

  const handleKeydown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null

    // Don't trigger shortcuts while typing.
    if (
      ignoreInputs &&
      target &&
      (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      )
    ) {
      return
    }

    // Normalize ONLY the key that was actually pressed.
    const pressedKey = normalizeKey(event.key)

    const keyMatches = pressedKey === normalizedKey

    if (!keyMatches) {
      return
    }

    const modifiersMatch =
      event.shiftKey === shift &&
      event.ctrlKey === ctrl &&
      event.altKey === alt &&
      event.metaKey === meta

    if (!modifiersMatch) {
      return
    }

    // We only get here when THIS shortcut matches.
    if (preventDefault) {
      event.preventDefault()
    }

    callback(event)
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
