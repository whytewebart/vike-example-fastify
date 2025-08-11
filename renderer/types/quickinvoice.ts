// Basic types
type UUID = string;
type CSSProperty = string;
type HTMLAttribute = string;

// Component capability flags
interface ComponentCapabilities {
  canHaveChildren?: boolean | number; // true/false or max children count
  childrenLocked?: boolean; // If children can be reordered/deleted
  canBeDeleted?: boolean;
  canBeDuplicated?: boolean;
  canAcceptStyles?: boolean;
  isContainer?: boolean;
  enableHandle?: boolean
}

interface ComponentOverride {
  definition?: boolean; // If true, the component's definition is overridden by attrDefinition
}

// Style configuration
interface StyleSettings {
  allowedProperties?: ComponentStyleType[]; // Specific allowed CSS properties
  inheritable?: boolean; // Whether styles inherit to children
  defaultStyles?: Record<CSSProperty, string>;
  css?: (properties: Record<string, any>) => string;
}

// Property types
type PrimitiveType =
  | 'text'
  | 'number'
  | 'color'
  | 'select'
  | 'boolean'
  | 'image'
  | 'url'
  | 'tel'
  // | 'email'
  // | 'date'
  // | 'time'
  // | 'datetime'
  | 'currency'
  | 'currency-format'
  | 'rich-text';

type ComponentStyleType = 'dimension-editor' | 'spacing-editor' | 'layout-editor' | 'typography-editor' | 'background-editor' | 'stack-editor';

type PropertyType =
  | PrimitiveType
  | { type: 'array'; itemType: PropertyType }
  | { type: 'object'; shape: ObjectField[] };

interface ObjectField {
  name: string;
  type: PropertyType;
  defaultValue: any;
  required?: boolean;
  options?: string[]; // For select type
  editable?: boolean;
  group?: string;
  helptext?: string; // Help text for the property
  description?: string; // Description for the property
  singularLabel?: string; // Singular label for the property
}

interface ComponentProperty extends ObjectField { }

// Sub-element definition
interface SubElement {
  key: string;
  selector: string; // CSS selector to find the element
  name: string;
  allowedStyles?: CSSProperty[];
  editableProperties?: ComponentProperty[];
  locked?: boolean;
  hidden?: boolean;
  capabilities?: ComponentCapabilities;
}

// Component definition
interface ComponentDefinition {
  type: string; // Unique component type identifier
  name: string;
  category?: string;
  icon?: string;
  capabilities?: ComponentCapabilities;
  styleSettings?: StyleSettings;
  properties?: ComponentProperty[];
  subElements?: SubElement[];
  // defaultChildren?: ComponentDefinition[] | string[]; // Default child components
  defaultChildren?: ComponentDefinition[]; // Default child components
  acceptsChildrenTypes?: string[] | 'all'; // Which component types can be children
  renderTemplate?: (properties: Record<string, any>) => string; // HTML template
  // mockTemplate?: string; // HTML template
  script?: string; // Component-specific JS
  selector?: string; // SELECTOR TO APPEND COMPONENT
  override?: ComponentOverride;
}

// Component instance
interface ComponentInstance {
  id: UUID;
  type: string;
  parentId?: UUID;
  childrenIds: UUID[];
  properties: Record<string, any>;
  styles: Record<string, string>;
  customAttributes?: Record<HTMLAttribute, string>;
  subElements?: Record<string, {
    styles?: Record<string, string>;
    properties?: Record<string, any>;
  }>;
  meta: {
    locked?: boolean;
    visible?: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

// Component library
interface ComponentLibrary {
  definitions: Record<string, ComponentDefinition>;
  instances: Record<UUID, ComponentInstance>;
  rootInstanceIds: UUID[];
}

// Editor state
interface EditorState {
  selectedComponentId: UUID | null;
  hoveredComponentId: UUID | null;
  clipboard: {
    components: ComponentInstance[];
    cut: boolean;
  };
  viewMode: 'desktop' | 'tablet' | 'mobile' | 'preview';
  history: {
    past: ComponentLibrary[];
    future: ComponentLibrary[];
  };
}

declare namespace DB {
  interface Session {
    type: string,
    id: string,
    properties: Record<string, any>,
    dropzone: string,
    dropzones: Record<string, string>,
    key: string,
    index: number,
    order: number,
    sessionId: string,
    subElements?: Record<string, {
      styles?: Record<string, string>;
      properties?: Record<string, any>;
    }>,
    styles?: Record<string, any>,
    label?: string
  }

  interface Space {
    id: string,
    properties?: Record<string, any>,
    lastSession: "true" | "false"
  }
}