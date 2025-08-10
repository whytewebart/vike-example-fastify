interface FieldConfig {
    prop: string
    type: 'text' | 'number' | 'color' | 'select' | 'unit'
    label: string
    value: string
    description?: string
    class?: string
    group?: string;
    options?: string[]
}