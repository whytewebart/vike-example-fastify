import { MinzeElement } from "minze";

type DirectiveMap = Record<string, (el: HTMLElement, val: any) => void>;

const directiveMap: DirectiveMap = {
  'data-text': (el, val) => el.textContent = val,
  'data-html': (el, val) => el.innerHTML = val,
  'data-class': (el, val) => el.className = val,
  'data-show': (el, val) => el.style.display = val ? '' : 'none',
  'data-if': (el, val) => {
    el.style.display = val ? '' : 'none';
  }
};

function evaluate(expression: string, context: Record<string, any>) {
  try {
    return new Function(...Object.keys(context), `return ${expression}`)(...Object.values(context));
  } catch (e) {
    console.warn('Eval error:', expression, e);
    return null;
  }
}

function evaluateSyntax(
  ctx: Record<string, any> = {},
  parent?: MinzeElement | HTMLElement,
  type: 'minze' | 'clone' = 'minze'
) {
  // INITIALIZE CONTEXT
  const context = ctx;
  const query = type == 'clone' ? 'querySelectorAll' : 'selectAll'
  // @ts-ignore QUERY ELEMENTS
  const elements = parent?.[query]
    ('[data-each], [data-text], [data-html], [data-class], [data-show], [data-if], [data-bind]');

  elements?.forEach((el_: any) => {
    // SELECT ELEMENT
    const el = el_ as HTMLElement;
    for (const attr of el.getAttributeNames()) {
      // FILTER OUT INVALID ATTRIBUTES
      if (!attributes.includes(attr)) {
        // CHECK IF ATTRIBUTE MATCHES
        // Events: data-on:click="{someFunc}"
        if (attr.startsWith('data-on:')) {
          const raw = el.getAttribute(attr);
          const expr = raw?.match(/\{(.+?)\}/)?.[1];
          if (!expr) continue;

          const eventName = attr.split(':')[1];
          el.onclick = () => evaluate(expr, context);
        }

        // Dynamic attributes: data-attr-href="{link}"
        if (attr.startsWith('data-attr-')) {
          const raw = el.getAttribute(attr);
          const expr = raw?.match(/\{(.+?)\}/)?.[1];
          if (!expr) continue;
          
          const isLoop = el.closest('[data-key]')
          const validKey = context[isLoop?.getAttribute('data-key')!]

          if(isLoop && !validKey)
            continue;

          const val = evaluate(expr, context);
          const attrName = attr.split('-')[2];
          el.setAttribute(attrName, val);
        }
        continue;
      };
      // FILTER OUT INVALID EXPRESSION
      const raw = el.getAttribute(attr);
      const expr = raw?.match(/\{(.+?)\}/)?.[1];
      if (!expr) continue;

      const isLoop = el.closest('[data-key]')
      // CHECK IF ATTR IS NOT "data-each"
      if (attr !== 'data-each' && directiveMap[attr]) {
        // CHECK IF TYPE IS CLONE
        const validKey = context[isLoop?.getAttribute('data-key')!]
        if (type === 'clone' && isLoop && !!validKey) {
          directiveMap[attr](el, evaluate(expr, context))
        }

        else if (type === 'minze' && !isLoop) {
          directiveMap[attr](el, evaluate(expr, context))
        }
      }

      if (attr === 'data-each') {
        const val = evaluate(expr, context);

        const array = Array.isArray(val) ? val : [];
        const key = el.getAttribute('data-key') || 'index';
        const parent = el.parentElement;

        // HIDE ELEMENT
        el.style.display = 'none';
        el.style.height = '0';
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';

        // REMOVE EXISTING SIMILAR ELEMENTS
        parent?.querySelectorAll(`[data-key=${key}]:not([data-each])`)
          .forEach(clone => clone.remove());

        parent?.removeChild(el); // prevent infinite loop
        array.forEach((item, index) => {
          const clone = el.cloneNode(true) as HTMLElement;
          const tempCtx = { ...context, [key]: item, [key + "index"]: index };

          clone.setAttribute('style', '')
          parent?.appendChild(clone);
          evaluateSyntax(tempCtx, clone, 'clone');
          // REMOVE DATASET ATTRIBUTES
          attributes.forEach(attr => clone.removeAttribute(attr));
        });

        // ADD THE ORIGINAL TEMPLATE
        parent?.appendChild(el);
        break;
      }
    }
  });
}

const attributes = [
  'data-text',
  'data-html',
  'data-class',
  'data-show',
  'data-if',
  // 'data-on:click',
  // 'data-key',
  // 'data-attr:*',
  'data-each'
]

export default {
  attributes,
  directiveMap,
  evaluate,
  evaluateSyntax
}