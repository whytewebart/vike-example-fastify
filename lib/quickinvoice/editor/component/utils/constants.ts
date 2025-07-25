// constants.ts

/**
 * HTML attributes used by the EditorComponent and its ecosystem.
 * Using 'as const' provides stricter typing.
 */
export const ATTRS = {
  SUB_ELEMENTS: 'sub-elements',
  PROPERTIES: 'properties',
  STYLES: 'styles',
  TYPE: 'type',
  CAPABILITIES: 'capabilities',
  STATE: 'state',
  DROPZONE: 'dropzone',
  DROPZONE_ID: 'data-dropzone-id',
  STRETCH_DROPZONE: 'stretch-dropzone',
} as const;

//******************************************************************************

/**
 * Component lifecycle states for the 'state' attribute.
 */
export const STATES = {
  LOADED: 'loaded',
  READY: 'ready',
  INDEX_CHANGED: 'indexchanged',
} as const;

//******************************************************************************

/**
 * Action types for validation and event handling (e.g., drag-and-drop).
 */
export const ACTIONS = {
  MOVE: 'move',
  DROP: 'drop',
  DELETE: 'delete',
} as const;

//******************************************************************************

/**
 * Special keys used for styling and property management.
 */
export const KEYS = {
  HOST: 'host',
  DEFAULT_DROPZONE: 'default',
} as const;

//******************************************************************************

/**
 * Event names for cross-component communication via Minze.listen/dispatch.
 * Includes factory functions for creating dynamic event names.
 */
export const EVENTS = {
  // Canvas-level events
  CANVAS_DRAG_START: 'canvas:component:dragstart',
  CANVAS_DRAGGING: 'canvas:component:dragging',
  CANVAS_SELECTED: 'canvas:component:selected',

  // Global events
  COMPONENTS_REORDER: 'components:reorder',
  CONTAINER_RESIZE_DRAGOVER: 'container:resize:dragover',

  // Dynamic event factory functions for specific components/elements
  forComponent: (id: string) => ({
    STATE_LOAD: `component:${id}:state:load`,
    STYLES_UPDATE: `component:${id}:styles`,
    RERENDER: `component:${id}:rerender`,
    PROPERTIES_UPDATE: `component:${id}:properties`,
  }),
  forContainer: (id: string) => ({
    RESIZE_DRAGOVER: `container:resize:dragover:${id}`,
  }),
  forEditorInput: (componentId: string, propertyName: string) => ({
    RERENDER: `editor-input:${componentId}-${propertyName}:rerender`,
  }),
} as const;

//******************************************************************************

/**
 * Frequently used CSS selectors to avoid string repetition.
 */
export const SELECTORS = {
  HANDLE: '#handle',
  DRAGGING_COMPONENT: '.component.dragging',
  DEFAULT_DROPZONE: `[${ATTRS.DROPZONE}=""]`,
  ANY_DROPZONE_ID: `[${ATTRS.DROPZONE_ID}]`,
  STRETCHED_DROPZONE: `[${ATTRS.STRETCH_DROPZONE}="stretch"]`,
} as const;