import { Minze } from 'minze'
const modules = import.meta.glob([
    '../../lib/**/!(*.spec|*.test|*.stories).@(ts|js)',
    '!../../lib/**/tests/*.@(ts|js)',
    '!../../lib/**/stories/*.@(ts|js)',
    '!../../lib/**/atoms/*.@(ts|js)',
])
const defineAll = Minze.defineAll

export { modules as default, modules, defineAll }
