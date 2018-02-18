/// <reference types="mithril" />
import * as m from 'mithril';
export interface Attrs {
    /** Minimum value */
    min: number;
    /** Maximum value */
    max: number;
    /** Optional name of hidden input. If none supplied, no hidden input will be rendered. */
    name?: string;
    /** Current value (defaults to min) */
    value?: number;
    /** Step size (default 1). 0 means fractions as small as possible. */
    step?: number;
    /** Orientation: horizontal or vertical (default horizontal.) */
    orientation?: 'horizontal' | 'vertical';
    /** Optional CSS class to add to containing element */
    class?: string;
    /** Optional disabled flag (default false) */
    disabled?: boolean;
    /** Optional id attribute */
    id?: string;
    /** Optional value for aria-labelledby attribute */
    ariaLabelledby?: string;
    /** Callback triggered when value changed */
    onchange?(value: number): false | any;
    /** Callback triggered while dragging */
    ondrag?(value: number): false | any;
}
/** Given an input value, quantize it to the step size */
export declare function quantize(val: number, min: number, max: number, step: number): number;
/** Range Component */
declare const mithrilRange: m.FactoryComponent<Attrs>;
export default mithrilRange;
