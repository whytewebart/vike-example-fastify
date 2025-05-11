import { ParseOptions } from 'css-tree';
import * as csstree from "css-tree";

export { isValidCSSProperty, parseObjectToStyle }

// VALIDATE CSS PROPERTIES
// Check if the property is a valid CSS property
function isValidCSSProperty(property: string) {
    try {
        const opts: ParseOptions = {
            context: 'declaration',
            onParseError(error) {
                console.error('Parse error:', error);
            },
        };
        // Parse the CSS property using css-tree
        const ast = csstree.parse(`${property}: initial`, opts);
        return ast.type === "Declaration" && ast.property === property;
    } catch (error) {
        return false;
    }
}

// Convert an object to a CSS string
function parseObjectToStyle(styleObject: Record<string, any>) {
    let cssString = '';
    const validStyles: Record<string, any> = {};
    // Iterate through the object and convert each property to CSS format
    for (const property in styleObject) {
        if (
            Object.hasOwnProperty.call(styleObject, property)
            && isValidCSSProperty(property)
        ) {
            // const cssPropertyName = property.replace(/([A-Z])/g, '-$1').toLowerCase();
            const cssValue = styleObject[property];
            // Add the property to the CSS string
            cssString += `${property}: ${cssValue}; `;
            validStyles[property] = cssValue;
        }
    }
    // Return the CSS string without leading/trailing whitespace
    return {
        string: cssString.trim(),
        style: validStyles
    };
}