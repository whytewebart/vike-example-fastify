import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'
import { IndexedDBWrapper } from '../component/utils/state';
import Compressor from 'compressorjs';
import { nanoid } from "nanoid"
import type clm from "country-locale-map"
import parsePhoneNumber, { getCountryCallingCode } from 'libphonenumber-js';

export interface EditorInput {
    type: PropertyType; // Type of the input (text, number, select, etc.)
    label: string;
    selectOptions: string[];
    checked: boolean;
    defaultValue?: any;
    componentId?: string;
    description?: string; // Description for the input
    helptext?: string; // Help text for the input
    repeater?: string; // Whether the input is a repeater
    entries: any[];
    entryId: string;
    nested: 'deep' | boolean; // Whether the input array is nested
    _cache_load?: 'clm'
}

export class EditorInput extends MinzeElement {
    DB_VERSION = 1;
    DB_NAME = 'quickinvoice'
    CLM:typeof clm | null = null

    attrs?: Attrs = [
        "type",
        "label",
        ["select-options", []],
        ['checked', false],
        ["default-value", ""],
        "component-id",
        "repeater",
        ["description", false],
        ["helptext", false],
        "entry-id",
        ["nested", false],
        
    ];

    reactive?: Reactive = [["entries", []], '_cache_load']
    static observedAttributes = ['checked', 'default-value']
    get splitLabel() {
        if (typeof this.label !== 'string') return '';
        return this.label.replace(/([a-z])([A-Z])/g, '$1 $2')
    }

    loadCLM = async () => {
        const clm = (await import('country-locale-map')).default;
        this.CLM = clm;
        this._cache_load = 'clm';
    }

    protected session = new IndexedDBWrapper<DB.Session>(this.DB_NAME, 'session', this.DB_VERSION)

    html = () => {
        // LABEL COMPONENT
        const label = /*html*/`
            <label
                for="${this.label}-input"
                class="text-base text-gray-700 capitalize mb-1"
                font="space-mono semibold"
                ${this.getAttribute('hide-label') ? 'hidden' : ''}
            >
                ${this.splitLabel}
            </label>
        `;
        // WRAPPER COMPONENT
        const type_is_object = typeof this.type !== 'string' && this.type.type === 'object';
        const wrapper = (template: string, hideLabel: boolean = false) => /*html*/`
            <div class="flex flex-col-reverse">
                ${
                    this.getAttribute('save-btn') == 'hide' ? '' :
                    type_is_object && !this.repeater ?
                    /*html*/`
                        <div class="grid sticky bottom-3 z-1 my-3 mx-4 peer">
                            <button id="save-entries" class="px-4 py-1.5 font-space-mono bg-white text-blue-600 text-base transition-colors w-full rounded-none capitalize" border="1 dashed gray" hover="text-white bg-blue-700">
                                Save ${this.label}
                            </button>
                        </div>
                    ` : ''
                }

                <div
                    class="space-y-1 ${type_is_object ? 'bg-gray-50/30' : ''} ${typeof this.type !== 'object' ? 'py-2 px-4' : ''}"
                    border="${type_is_object ? 'y-1 gray dashed' : ''}"
                    
                    flex="~ col"
                    peer-has-hover="bg-stone-50 border-y-2 border-blue-600"
                >
                    ${!hideLabel ?
                        /*html*/`
                            ${label}
                            ${this.description ?
                                `<p
                                    class="text-base mt--1.2! mb-2! leading-tight text-gray-600 font-sans"
                                >${this.description}</p>` : ''
                            }
                            <div class="relative">${template}</div>
                        ` : `${template}`
                    }
                    ${this.helptext ? `<p class="text-sm text-gray-500 font-sans">${this.helptext}</p>` : ''}
                </div>
            </div>
        `;
        // FALLBACK INPUT
        const fallback = /*html*/`
            <input
                type="${this.type}"
                value="${this.defaultValue}"
                id="${this.label}-input"
                class="px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 w-full ${this.type === 'color' ? 'p-0! h-8 b-0!' : ''}"
            />
        `
        // IMAGE INPUT
        const image = /*html*/`
            <label for="${this.label}-image">
                <img src="${this.defaultValue}" class="w-full h-32 object-contain rounded-none bg-slate-50 border border-gray-300 b-b-0" />
            </label>

            <input
                type="file"
                accept="image/*"
                id="${this.label}-image"
                class="px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 w-full"
            />
        `
        // SELECT INPUT
        const select = /*html*/`
            <select
                name="${this.label}"
                id="${this.label}-select"
                class="w-full px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-gray-200 font-urbanist appearance-none w-full capitalize"
            >
                <option value="" disabled selected>Select ${this.label}</option>
                ${
                    this.selectOptions.map(opt => /*html*/`
                        <option value="${opt}" class="uppercase" ${opt === this.defaultValue ? 'selected' : ''}>${opt}</option>
                    `).join('')
                }
            </select>
            <span class="i-solar-alt-arrow-down-outline ml-1 absolute top-2.2 right-4 text-slate-700 text-xl z-1"></span>
        `

        // CURRENCY INPUT
        const currency = /*html*/`
            <select
                name="${this.label}"
                id="${this.label}-select"
                class="w-full px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-gray-200 font-urbanist appearance-none w-full capitalize"
            >
                ${
                    this.CLM?.getAllCountries()
                        .map(
                            (country) => {
                                const payload = {
                                    currency: country.currency,
                                    code: country.alpha2,
                                    language: country?.languages ?
                                    country.languages[0] : 'en'
                                };

                                return /*html*/`
                                    <option
                                        value='${JSON.stringify(payload)}'
                                        ${country.alpha2 === this.defaultValue?.code ? 'selected' : ''}
                                    >${country.name} - ${country.currency}</option>
                                `
                            }
                        ).join('')
                }
            </select>
            <span span class="i-solar-alt-arrow-down-outline ml-1 absolute top-2.2 right-4 text-slate-700 text-xl z-1" ></span>
        `

        // CURRENCY FORMAT
        const currency_format = /*html*/`
            <div
                class="flex shadow-smp font-sans"
                focus-within="outline-none ring-2 ring-gray-200 ring-offset-2"
            >
                <div relative>
                    <select
                        class="block rounded-l- border border-r-0 border-gray-200 bg-gray-50 text-gray-700 text-sm px-2 py-2 focus:outline-none appearance-none w-25"
                        name="currencyFormat"
                    >
                        ${
                            this.CLM?.getAllCountries()
                                .map(
                                    (country) => {
                                        const payload = {
                                            currency: country.currency,
                                            code: country.alpha2,
                                            language: country?.languages ? country.languages[0] : 'en'
                                        };

                                        return /*html*/`
                                            <option
                                                value='${JSON.stringify(payload)}'
                                                ${country.alpha2 === this.defaultValue?.code ? 'selected' : ''}>${country.name} - ${country.currency}
                                            </option>`
                                    }
                                ).join('')
                            }
                    </select>

                    <span class="i-solar-alt-arrow-down-outline ml-1 absolute top-2.2 right-2 text-slate-700 text-xl z-1"></span>
                </div>
                <input
                    type="number"
                    name="currency_format"
                    id="currency_format"
                    class="px-3 py-2 border border-gray-300 text-sm text-gray-800 w-full outline-none"
                    placeholder="123-456-7890"
                    value="${this.defaultValue?.value}"
                >
            </div>
        `

        // CHECKBOX INPUT
        const svgIcon = /*html*/`
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
        `
        const checkbox = /*html*/`
            <div class="inline-flex items-center space-x-2">
                <label class="relative flex items-center cursor-pointer">
                    <input
                    type="checkbox"
                    id="check"
                    ${this.checked ? 'checked' : ''}
                    class="peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-primary-800 checked:border-primary-800 transition-all shadow-sm hover:shadow focus:ring focus:ring-primary-500"
                    />
                    <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        ${svgIcon}
                    </span>
                </label>
                <label for="check" class="text-base font-semibold text-gray-700 capitalize font-space-mono">${this.splitLabel}</label>
            </div>
        `
        // PHONE NUMBER
        const phone = /*html*/`
            <div
                class="flex rounded-md- shadow-smp font-sans"
                focus-within="outline-none ring-2 ring-gray-200 ring-offset-2"
            >
                <div relative>
                    <select
                        class="block rounded-l- border border-r-0 border-gray-200 bg-gray-50 text-gray-700 text-sm px-2 py-2 focus:outline-none appearance-none min-w-25"
                        name="countryCode"
                    >
                        <option disabled selected>Select Country</option>
                        ${
                            this.CLM?.getAllCountries()
                            .map((country) => {
                                try {
                                    var code = getCountryCallingCode(country.alpha2 as any);
                                    return /*html*/`
                                        <option value='${country.alpha2}'> ${country.alpha2} +${code}</option>
                                    `
                                } catch (error) {
                                    return null
                                }
                            }).filter(d => d !== null).join('')
                        }
                    </select>

                    <span class="i-solar-alt-arrow-down-outline ml-1 absolute top-2.2 right-2 text-slate-700 text-xl z-1"></span>
                </div>
                <input
                    type="tel"
                    name="phone"
                    id="phone"
                    class="px-3 py-2 border border-gray-300 rounded-r- text-sm text-gray-800 w-full outline-none"
                    placeholder="123-456-7890"
                    value='${this.defaultValue}'
                >
            </div>
        `
        // TEXTAREA INPUT
        const textarea = /*html*/`
            <textarea
                name="${this.label}"
                id="${this.label}-textarea"
                rows="5"
                class="px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 resize-y font-urbanist w-full"
            >${this.defaultValue}</textarea>
        `

        var localType: any = this.type;
        // ${ localType?.itemType?.type ? '' : i === 0 ? 'repeater' : ''}
        const array = /*html*/`
            <div class="overflow-y-clip">
                <!-- HEADER -->
                <div
                    class="py-3 px-4 bg-white ${this.nested && this.nested === 'deep' ? '' : this.nested ? 'top-42px! z-2' : 'z-3 shadow'} sticky top-0"
                    flex="~ items-start ${this.nested ? 'gap-x-3' : 'justify-between'}"
                    border="${this.repeater ? '' : 'y-1'} gray-200"
                >
                    <label for="${this.label}-array" class="text-base font-semibold text-gray-700 capitalize font-space-mono">${this.splitLabel} Repeater</label>

                    

                    <button id="add-entry" class="disabled:bg-gray-300 flex rounded hover:bg-gray-100 disabled:opacity-50" ${localType?.max && this.entries.length >= localType.max ? 'disabled' : ''}>
                        <span class="i-solar-pen-new-square-outline text-2xl"></span>
                        <!-- <span class="font-space-mono font-bold whitespace-nowrap">[Create Entry]</span> -->
                    </button>
    
                    ${this.nested ? `<div class="h-6 b-l-3 b-b-3 w-4 absolute left-4 top-12 z-10 b-gray-8"></div>` : ''}
                    
                </div>
                
                <div class="grid relative ${this.nested ? 'pl-6 -space-y-2 overflow-y-clip' : ''}">
                    ${Array.from(this.entries)?.map((entry, i) => /*html*/`
                        <details class="group">
                            <summary
                             class="px-4 ${this.nested ? '' : 'py-1 bg-gray-50/30'} transition-all"
                             flex="~ items-center justify-between"
                             hover="cursor-pointer bg-gray-50"
                             group-open="${this.nested ? '' : 'bg-gray-50 b-b-1'} sticky top-42px z-1"
                             group-not-open="rounded-2xl ${this.nested ? '' : 'b-1'} b-t-0"
                            >
                                <p class="font-space-mono font-semibold">
                                    <span class="i-solar-alt-arrow-right-bold text-xl mr-1 group-open:i-solar-alt-arrow-down-bold!"></span>
                                    0${i + 1}. <span class="ml-1 ${this.componentId ? '' : 'hidden'}">Entry</span>
                                </p>
    
                                <div flex="~ items-center row-reverse">
                                    ${localType.arrayType && localType.arrayType === 'fixed' ? '' : /*html*/`
                                            <button
                                                id="remove-entry"
                                                ${entry.id ? `data-entry-id="${entry.id}"` : ''} data-entry-index="${i}"
                                                class="flex p-2 rounded transition-all" hover="bg-red-100" focus="bg-gray-100"
                                            >
                                                <span
                                                ${entry.id ? `data-entry-id="${entry.id}"` : ''} data-entry-index="${i}"
                                                class="i-solar-trash-bin-minimalistic-outline text-xl text-red-600"></span>
                                            </button>
                                        `
            }
                                    
                                    ${this.componentId ? `

                                        <button id="save-entry" data-save-entry-id="${entry.id}" class="flex p-2 rounded transition font-space-mono" hover="font-bold underline underline-offset-2">
                                            Update
                                        </button>
                                        
                                        ` : ''
            }
                                </div>
                            </summary>
                            <div class="relative ${this.nested ? 'ml-5.7 pl-1' : ''}">
                                <editor-input
                                    ${typeof localType?.itemType === 'string' ? 'hide-label="true"' : ''}
                                    label="${this.label}"
                                    type='${JSON.stringify(localType?.itemType || this.type)}'
                                    component-id="${this.componentId}"
                                    repeater="${i === 0 ? 'label' : ''}"
                                    default-value='${!localType?.itemType?.type ? (entry?.value || entry) : JSON.stringify(entry)}'
                                    ${entry.id ? `entry-id="${entry.id}"` : ''}
                                    data-entry-index="${i}"
                                    ${this.getAttribute('save-btn') ? `save-btn="${this.getAttribute('save-btn')}"` : ''}
                                    ${this.getAttribute('nested') && !this.componentId ? 'nested="deep"' : ''}
                                ></editor-input>
    
                                ${this.nested ? /*html*/`
                                    <div class="absolute top-0 left-0 b-l-3 h-full b-gray-8"></div>
                                ` : ''}
                            </div>
    
                            <div class="${typeof localType?.itemType === 'string' ? 'pb-1' : 'py-2'} ${this.nested ? '' : 'b-b-1'}"><div>
                        </details>
                        
                    `).join('')}
                </div>
            </div>


        `

        const stringify = (payload: any) => {
            if (typeof payload === 'object' || Array.isArray(payload)) {
                return JSON.stringify(payload)
            }

            return payload
        }

        const object = /*html*/`
            <div class="flex flex-col ${this.repeater ? 'bg-gray-50' : 'py-2 px-4'}">
                ${!this.repeater ? /*html*/`
                        <label for="${this.label}-object" class="text-base font-semibold text-gray-700 capitalize font-space-mono">${this.splitLabel}</label>
                ` : ''
            }
            </div>
            
            <div class="grid -mt-2">
                ${localType?.shape?.map((opt: ObjectField, i: number) => /*html*/`
                    <editor-input
                        label="${opt.name}"
                        type='${JSON.stringify(opt.type)}'
                        select-options='${JSON.stringify(opt.options) || []}'
                        ${opt.type === 'boolean' &&
                    this.defaultValue[opt.name] === true ? 'checked="true"' : ''
                }
                        default-value='${stringify(this.defaultValue[opt.name] || opt.defaultValue)}'
                        save-btn="hide"
                        ${this.getAttribute('nested') === 'deep' ? `nested="deep"` : localType?.type ? `nested="true"` : ''}
                        ${this.repeater && this.repeater === 'label' ? `repeater="${i === 0 ? 'label' : ''}"` : this.repeater ? 'repeater' : ''}
                        ${opt.singularLabel ? `singular-label="${opt.singularLabel}"` : ''}
                    ></editor-input>
                `).join('')}
            </div>
        `

        switch (localType.type) {
            case "array":
                return array;
            case "object":
                return wrapper(object, true);
        }

        switch (this.type) {
            case "boolean":
                return wrapper(checkbox, true);
            case "select":
                return wrapper(select);
            case "rich-text":
                return wrapper(textarea);
            case "image":
                return wrapper(image);
            case "tel":
                return wrapper(phone);
            case "currency":
                return wrapper(currency)
            case "currency-format":
                return wrapper(currency_format)
            default:
                return wrapper(fallback);
        }
    }

    css = () => /*css*/`
        @unocss-placeholder;
    `

    parseType = (typeAttr: string): PropertyType | string => {
        try {
            return JSON.parse(typeAttr);
        } catch {
            return typeAttr; // fallback for primitives like 'text', 'number', etc.
        }
    };

    validateType = (val: string) => {
        if (val === 'true') {
            return true;
        }

        if (val === 'false') {
            return false;
        }

        return this.parseType(val)
    }

    parseEditorInput = (el: HTMLElement, labelOverride?: string): any => {
        // const label = labelOverride || el.getAttribute('label')!.toLowerCase();
        const label = labelOverride || el.getAttribute('label')!;
        const typeAttr = el.getAttribute('type');
        if (!typeAttr) return { [label]: this.validateType(el.getAttribute('default-value') || '') };

        const type = this.parseType(typeAttr);

        // ✅ Primitive type
        if (typeof type === 'string') {
            return { [label]: this.validateType(el.getAttribute('default-value') || '') };
        }

        // ✅ Object type
        if (type.type === 'object') {
            const obj: Record<string, any> = {};
            for (const field of type.shape) {
                const input = el.shadowRoot?.querySelector<HTMLElement>(`editor-input[label="${field.name}"]`);
                if (input) {
                    const parsed = this.parseEditorInput(input, field.name.toLowerCase());
                    Object.assign(obj, parsed);
                }
            }
            return { [label]: obj };
        }

        // ✅ Array type
        if (type.type === 'array') {
            const nestedInputs = el.shadowRoot?.querySelectorAll<HTMLElement>('editor-input');

            const values: any[] = [];

            nestedInputs?.forEach(input => {
                const parsed = this.parseEditorInput(input);
                console.log(parsed, Object.values(parsed))
                values.push(Object.values(parsed)[0]); // Get value without duplicating label
            });

            return { [label]: values };
        }

        return { [label]: this.validateType(el.getAttribute('default-value') || '') };
    };

    saveEntries = async () => {
        // const el = event.target as HTMLElement;
        // const entryId = el.dataset.saveEntryId;
        // var key = entryId ? `editor-input[entry-id=${entryId}]` : 'editor-input';

        const entryElements = this.selectAll('editor-input') || [];
        const entries: Record<string, any> = {};

        if (this.entryId)
            entries.id = this.entryId;

        entryElements.forEach((el: any) => {
            const parsed = this.parseEditorInput(el);
            Object.assign(entries, parsed);
        });

        if (typeof this.type !== 'object') {
            entries.value = this.getAttribute('default-value')
        }

        // console.log("🧠 Final structured data:", this.label, this.type, entries);
        if (this.componentId) {
            this.dispatch(`component:${this.componentId}:properties`, {
                data: {
                    [this.label]: entries
                }
            });
        }
    }

    fmtCurrency(value: any, payload?: {
        currency: string;
        code: string;
        language: string;
    }) {
        // CHECK IF VALUE IS NUMBER
        if (!(/^-?\d+(\.\d+)?$/.test(value))) return value;
        value = Number(value);

        const locale = `${payload?.language}-${payload?.code}`

        // FORMAT VALUE
        const formatter = new Intl.NumberFormat(payload ? locale : 'en-US', {
            style: 'currency',
            currency: payload ? payload.currency : 'USD',
            currencyDisplay: 'symbol'
        });
        // FORMAT VALUE
        value = formatter.format(value);
        return value
    }
    
    async beforeRender() {
        if(typeof this.type === 'string' && ['currency', 'currency-format', 'tel'].includes(this.type)) {
            await this.loadCLM();
        }
    }

    async onReady() {
        this.title = this.label;

        if (typeof this.defaultValue === 'boolean' && this.type !== 'boolean') {
            this.setAttribute('default-value', '• This is placeholder')
        }

        if (typeof this.type === 'object') {

            if (this.getAttribute('status') === 'ready')
                return;

            if (this.type.type === 'array' && this.componentId) {
                await this.session.open();
                const response = await this.session.get(this.componentId!);
                this.entries = response?.properties[this.label] || [];

                Minze.listen(
                    `editor-input:${this.componentId}-${this.label}:rerender`,
                    async () => {
                        // console.log('rerendering....', entry)
                        const entry = await this.session.get(this.componentId!)
                        this.entries = entry?.properties[this.label] || [];

                        this.rerender()
                    }
                );

                this.setAttribute('status', 'ready');

                this.rerender();
            }

            else if (this.type.type === 'array') {
                this.entries = Array.from(this.defaultValue || []);
                this.setAttribute('status', 'ready');

                this.rerender()
            }
        };

        if (this.componentId && this.entryId) {
            Minze.listen(
                `editor-input:save-entry-${this.entryId}-input`,
                this.saveEntries
            );
        }

    }

    eventListeners?: EventListeners = [
        [
            "input:not([type=file]), textarea, select:not([name=countryCode]):not([name=currencyFormat])",
            "input",
            (e: InputEvent) => {
                const input = e.target as HTMLInputElement;
                var value: string | boolean | Object = this.type == 'boolean' ? input?.checked : input?.value || '';

                var countryCode;
                if (this.type === 'tel') {
                    // get select
                    const select = <HTMLSelectElement>this.select('select[name=countryCode]')!;
                    countryCode = select.value;
                    // @ts-ignore
                    const phoneNumber = parsePhoneNumber(value, countryCode);
                    if (phoneNumber) {
                        value = phoneNumber.formatInternational()
                    }
                }

                if (this.type === 'currency-format') {
                    const select = <HTMLSelectElement>this.select('select[name=currencyFormat]')!;
                    value = {
                        value,
                        formatted: this.fmtCurrency(value, JSON.parse(select.value)),
                        currencyCode: select.value
                    }
                }

                if (this.type === 'currency') {
                    value = JSON.parse(value)
                }

                if (this.componentId && !this.repeater) {
                    this.dispatch(`component:${this.componentId}:properties`, {
                        data: {
                            [this.label]: value
                        }
                    });
                }

                this.setAttribute('default-value',
                    typeof value === 'object' ? JSON.stringify(value) : value.toString()
                );
            }
        ],
        [
            "input[type=file]",
            "input",
            (e) => {
                const input = e.target as HTMLInputElement;
                const file = input.files?.[0];

                if (!file) return;

                new Compressor(file, {
                    quality: 0.6,

                    // The compression process is asynchronous,
                    // which means you have to access the `result` in the `success` hook function.
                    success: (result) => {
                        // CONVERT TO BASE64
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64data = reader.result;
                            if (this.componentId && !this.repeater) {
                                this.dispatch(`component:${this.componentId}:properties`, {
                                    data: {
                                        [this.label]: base64data
                                    }
                                });
                            }
                            // @ts-ignore
                            this.setAttribute('default-value', base64data);
                        }
                        reader.readAsDataURL(result);
                    },
                    error(err) {
                        console.log(err.message);
                    },
                });
            }
        ],

        [
            'select[name=countryCode]', 'input', (e: InputEvent) => {
                const select = e.target as HTMLInputElement;
                const input = this.select('input[name=phone]') as HTMLInputElement;

                const countryCode = <any>select.value
                var value = input.value;

                const phoneNumber = parsePhoneNumber(value, countryCode);
                if (phoneNumber) {
                    value = phoneNumber.formatInternational()
                }

                if (this.componentId && !this.repeater) {
                    this.dispatch(`component:${this.componentId}:properties`, {
                        data: {
                            [this.label]: value
                        }
                    });
                }

                this.setAttribute('default-value', value.toString());
            }
        ],

        [
            'select[name=currencyFormat]', 'input', (e: InputEvent) => {
                const select = e.target as HTMLInputElement;
                const input = this.select('input[name=currency_format]') as HTMLInputElement;

                const currencyCode = <any>JSON.parse(select.value)
                var value: string | boolean | Object = input.value;

                value = {
                    value,
                    formatted: this.fmtCurrency(value, currencyCode),
                    currencyCode
                }

                // console.log(input.value, value)

                if (this.componentId && !this.repeater) {
                    this.dispatch(`component:${this.componentId}:properties`, {
                        data: {
                            [this.label]: value
                        }
                    });
                }

                this.setAttribute('default-value', JSON.stringify(value));
            }
        ],

        [
            "#save-entry",
            "click",
            (event: Event) => {
                const el = event.target as HTMLElement;
                const entryId = el.dataset.saveEntryId;

                // console.log(entryId)

                this.dispatch(`editor-input:save-entry-${entryId}-input`, {
                    entryId
                })
            }
        ],

        [
            "#save-entries",
            "click",
            this.saveEntries
        ],

        [
            "#add-entry",
            "click",
            () => {
                const newItem = (() => {
                    if (typeof this.type === 'object') {
                        // ENTRY MUST ALWAYS BE AN ARRAY
                        if (this.type.type === 'array') {
                            const localType = this.type.itemType;
                            // IF ITEM TYPE IS OBJECT, RETURN DEFAULT VALUES
                            if (typeof localType === 'object') {
                                if (localType.type === 'object') {
                                    const c = localType.shape.reduce((acc: any, field) => {
                                        acc[field.name] = field.defaultValue;
                                        return acc;
                                    }, {});

                                    return {
                                        ...c,
                                        id: nanoid()
                                    }
                                }

                                if (localType.type === 'array') {
                                    return [];
                                }
                            }
                            // IF ITEM TYPE IS PRIMITIVE, RETURN DEFAULT VALUE
                            switch (localType) {
                                case 'text':
                                    return {
                                        id: nanoid(),
                                        value: 'randomness'
                                    };
                                case 'number':
                                    return {
                                        id: nanoid(),
                                        value: 0
                                    };
                                case 'boolean':
                                    return {
                                        id: nanoid(),
                                        value: false
                                    };
                                default:
                                    return {
                                        id: nanoid(),
                                        value: 'random'
                                    };
                            }
                        }
                    }

                    return {
                        id: nanoid(),
                        value: 'ness'
                    }; // Default for primitive types
                })()

                // console.log(newItem)

                const updated = this.entries.map((d, i) => {
                    const el = this.select(`editor-input[data-entry-index="${i}"]`) as HTMLElement;
                    const entryId = el.getAttribute('entry-id')
                    const parsed = this.parseEditorInput(el);

                    if (d.id) {
                        Object.assign(parsed[this.label], {
                            id: d.id
                        })
                    }

                    const type = this.parseType(el.getAttribute('type')!);
                    if (typeof type === 'object') {
                        return parsed[this.label]
                    }

                    return {
                        id: entryId,
                        value: parsed[this.label]
                    }
                })

                // console.log(updated)

                this.entries = [...updated, newItem];
                this.rerender();
            }
        ],
        // DELETE ENTRY
        [
            "#remove-entry",
            "click",
            (e) => {
                const button = e.target as HTMLButtonElement;
                const entryElement = button.closest('editor-input');
                const entryId = button.dataset.entryId;

                if (entryId && this.componentId) {
                    console.log(entryId)
                    // return
                    this.dispatch(`component:${this.componentId}:properties`, {
                        data: {
                            [this.label]: {
                                id: entryId,
                            }
                        },
                        action: 'delete'
                    });
                }

                else {
                    // Filter out the entry with the index
                    const entryIndex = Number(button.dataset.entryIndex);
                    this.entries = this.entries.filter((entry, i) => {
                        if (typeof entryId !== 'undefined' && entryId !== null) {
                            return entry.id !== entryId;
                        }
                        return i !== entryIndex;
                    });

                    this.rerender();
                }

            }
        ]
    ]

}