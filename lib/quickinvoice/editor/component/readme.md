
---

## Main Files

### index.ts
- Exports the `EditorComponent` class, which extends the editor canvas base and implements the logic for rendering, updating, and managing editor components.
- Handles component instantiation, property validation, drag-and-drop, event listeners, and sub-element configuration.
- Integrates with templating and state management utilities.

### utils/definition.ts
- Contains definitions for all available components (card, button, dropzone, heading, paragraph, divider).
- Each definition includes properties, styles, capabilities, sub-elements, and render templates.

### utils/state.ts
- Provides an `IndexedDBWrapper` class for persistent storage of component state and session data.
- Supports CRUD operations and index-based queries.

### utils/templating.ts
- Implements a lightweight templating engine for data binding and directive evaluation in component templates.
- Supports directives like `data-text`, `data-html`, `data-class`, `data-show`, `data-if`, and `data-each`.

### tests/properties.ts
- Example/test for component property reactivity and event handling using Minze.

---

## Key Concepts

- **Component Definitions:**  
  Components are described by a schema (see `utils/definition.ts`) that includes type, properties, styles, capabilities, and sub-elements.

- **Templating:**  
  Components use a custom templating utility for dynamic rendering and data binding.

- **State Management:**  
  Component state is persisted using IndexedDB, allowing for session management and recovery.

- **Drag-and-Drop:**  
  The editor supports drag-and-drop for arranging components within containers, with validation for nesting and capabilities.

- **Sub-elements:**  
  Components can define sub-elements (e.g., header, body, footer) with their own styles and capabilities.

---

## Extending Components

To add a new component:
1. Define its schema in `utils/definition.ts`.
2. Implement any custom logic or rendering in `index.ts` if needed.
3. Register the component for use in the editor.

---

## Related Types

- `ComponentDefinition`, `ComponentProperty`, `SubElement` (see `utils/definition.ts` and referenced types in the renderer/types directory).

---

For more details, see the inline documentation in each