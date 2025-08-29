import { nanoid } from "nanoid";


const invoice_01: ComponentDefinition = {
    type: 'simple-invoice',
    name: 'Template',
    category: 'Simple Invoice',
    icon: '📄',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true,
        canBeDeleted: false
    },

    properties: [
        // business name
        {
            name: 'businessName',
            type: 'text',
            defaultValue: 'Business Name'
        },
        {
            name: 'address',
            type: 'rich-text',
            defaultValue: `Main street, Number 06/B,\nSouth Mountain, YK<br>`
        },
        {
            name: 'phoneNumber',
            type: 'tel',
            defaultValue: '+62 123 456 789'
        },
        {
            name: 'dueDate',
            type: 'date',
            defaultValue: new Date().toISOString().split('T')[0]
        },
        {
            name: 'to',
            type: {
                type: 'object',
                shape: [
                    {
                        name: 'name',
                        type: 'text',
                        defaultValue: 'Wagino Subianto'
                    },
                    {
                        name: 'address',
                        type: 'rich-text',
                        defaultValue: `Main street,\nNumber 06/B,\nSouth Mountain, YK`
                    },
                ]
            },
            defaultValue: {
                name: 'Wagino Subianto',
                address: `Main street,\nNumber 06/B,\nSouth Mountain, YK`
            }
        },
        {
            name: 'currency',
            type: 'currency',
            defaultValue: ''
        },
        {
            name: 'lineItems',
            type: {
                type: 'array',
                itemType: {
                    type: 'object',
                    shape: [
                        {
                            name: 'title',
                            type: 'text',
                            defaultValue: 'Item Title'
                        },
                        {
                            name: 'description',
                            type: 'rich-text',
                            defaultValue: 'Item Description'
                        },
                        { name: 'qty', type: 'number', defaultValue: 1 },
                        { name: 'price', type: 'number', defaultValue: 100 },
                    ]
                }
            },
            defaultValue: [],
            description: 'Invoice table rows'
        },
        {
            name: 'chargesSummary',
            type: {
                type: 'array',
                itemType: {
                    type: 'object',
                    shape: [
                        {
                            name: 'title',
                            type: "text",
                            defaultValue: 'Discount'
                        },
                        {
                            name: 'value',
                            type: 'number',
                            defaultValue: 5
                        },
                        {
                            name: 'applyAs',
                            type: 'select',
                            options: [
                                'flat',
                                'percentage'
                            ],
                            defaultValue: 'percentage'
                        }
                    ]
                }
            },
            defaultValue: [
                {
                    id: nanoid(),
                    title: 'Tax VAT',
                    value: 15,
                    applyAs: 'percentage'
                }
            ]
        },
        {
            name: 'note',
            type: 'rich-text',
            defaultValue: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`
        },
        {
            name: 'emailAddress',
            type: 'text',
            defaultValue: 'company@mail.me'
        },
        {
            name: 'phone',
            type: 'text',
            defaultValue: '+628 123 456 789'
        },
        {
            name: 'paymentInfo',
            type: 'rich-text',
            defaultValue: 'Account Name\nBank Name\nBank Details'
        },
        {
            name: 'terms',
            type: 'rich-text',
            defaultValue: `Lorem ipsum dolor sit amet...`
        }
    ],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'typography-editor',
            'layout-editor',
            'background-editor',
            'spacing-editor',
        ],
        defaultStyles: {},
        css(properties) {
            return /*css*/ `
                :host, :root {
                    --brand:#3F51B5;
                    --text-dark:#000000;
                    --text-muted:#555555;
                    --border:#dddddd;
                    --bg-light:#f9f9f9;
                    font-family: Arial, sans-serif;
                    font-size: 10pt; /* 72DPI scaling */
                }
                
                .invoice{
                    width:535px;
                    height:760px;
                    margin:0 auto;
                    padding:20px;
                    box-sizing:border-box;
                }
                header{
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    margin-bottom:20px;
                }
                .logo{
                    font-size:14pt;
                    font-weight:bold;
                    color:var(--brand);
                }
                .company-address{
                    font-size:8pt;
                    color:var(--text-muted);
                    margin-top:4px;
                    line-height:1.4;
                }
                .address {
                    white-space: pre;
                }
                .invoice-title{
                    text-align:right;
                }
                .invoice-title h1{
                    font-size:14pt;
                    color:var(--brand);
                    margin:0;
                }
                .invoice-title p{
                    margin:0;
                    font-size:8pt;
                    color:var(--text-muted);
                }
                .bill-section{
                    display:flex;
                    justify-content:space-between;
                    margin-bottom:10px;
                    font-size:8pt;
                }
                .bill-to strong{
                    color:var(--text-dark);
                }
                table{
                    width:100%;
                    border-collapse:collapse;
                    font-size:8pt;
                    margin-bottom:10px;
                }
                thead th{
                    background:var(--brand);
                    color:white;
                    padding:6px;
                    text-align:left;
                }
                td,th{
                    border:1px solid var(--border);
                    padding:6px;
                }
                td.amount, th.amount{
                    text-align:right;
                }
                tfoot td{
                    border:none;
                    text-align:right;
                    padding:4px 0;
                }
                .total-due{
                    background:var(--brand);
                    color:white;
                    text-align:right;
                    padding:6px;
                    font-weight:bold;
                    font-size:9pt;
                }
                .notes{
                    font-size:7pt;
                    margin-top:6px;
                    color:var(--text-muted);
                }
                .footer{
                    border-top:1px solid var(--border);
                    display:flex;
                    justify-content:space-between;
                    margin-top:8px;
                    padding-top:4px;
                    font-size:7pt;
                }
                .footer div{
                    width:32%;
                }
            `;
        },
    },

    renderTemplate: (properties) => /*html*/ `
        <div class="invoice">
            <header>
                <div>
                    <div class="logo" data-text="@expr[properties.businessName]@end"></div>
                    <div class="company-address">
                        <p>Office Address</p>
                        <p class="address" data-text="@expr[properties.address]@end"></p>
                        <p class="phone" data-text="@expr[properties.phoneNumber]@end"></p>
                    </div>
                </div>
                <div class="invoice-title">
                    <h1>INVOICE</h1>
                    <p data-text="@expr[new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(properties.dueDate))]@end"></p>
                </div>
            </header>

            <div class="bill-section">
                <div class="bill-to">
                    <strong>To:</strong>
                    <p data-text="@expr[properties.to.name]@end"></p>
                    <p class="address" data-text="@expr[properties.to.address]@end"></p>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Items Description</th>
                        <th class="amount">Unit Price</th>
                        <th class="amount">Qnt</th>
                        <th class="amount">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr data-each="@expr[properties.lineItems]@end" data-key="entry">
                        <td>
                            <p data-text="@expr[entry.title]@end"></p>
                            <p style="color:var(--text-muted); max-width:300px" data-text="@expr[entry.description]@end"></p></td>
                        <td class="amount" data-text="@expr[fmtCurrency(entry.price, properties.currency)]@end"></td>
                        <td class="amount" data-text="@expr[entry.qty]@end"></td>
                        <td class="amount" data-text="@expr[fmtCurrency((entry.price * entry.qty), properties.currency)]@end"></td>
                    </tr>
                </tbody>
            </table>

            <table>
                <tfoot>
                    <tr>
                        <td colspan="3">SUBTOTAL :</td>
                        <td class="amount" data-text="@expr[fmtCurrency(properties.lineItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0), properties.currency)]@end"></td>
                    </tr>
                    <tr data-each="@expr[properties.chargesSummary]@end" data-key="charge">
                        <td colspan="3">
                            <span data-text="@expr[charge.title]@end"></span>
                            <span data-if="@expr[charge.applyAs == 'percentage']@end" data-text="@expr[charge.value + '%']@end"></span>:
                        </td>
                        <td class="amount" data-text="@expr[
                                charge.applyAs == 'flat' ? fmtCurrency(charge.value, properties.currency) : charge.applyAs == 'percentage' ? fmtCurrency(properties.lineItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0) * (charge.value / 100), properties.currency) : '']@end"></td>
                    </tr>
                </tfoot>
            </table>
            <div class="total-due">TOTAL DUE : <span data-text="@expr[
                            fmtCurrency(
    properties.lineItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0) +
    properties.chargesSummary.reduce((sum, item) => {
        const subtotal = properties.lineItems.reduce((s, i) => s + (Number(i.price) * Number(i.qty)), 0);
        return sum + (item.applyAs === 'flat' ? Number(item.value) : subtotal * (Number(item.value) / 100));
    }, 0)
    , properties.currency)

                                ]@end"></span></div>

            <div class="notes">
                <strong>Note:</strong> <span data-text="@expr[properties.note]@end"></span>
            </div>

            <div class="footer">
                <div>
                    <strong>Questions?</strong>
                    <p>Email us : <span data-text="@expr[properties.emailAddress]@end"></span></p>
                    <p>Call us : <span data-text="@expr[properties.phone]@end"></span></p>
                </div>
                <div>
                    <strong>Payment Info:</strong>
                    <p style="white-space:pre" data-text="@expr[properties.paymentInfo]@end"></p>
                </div>
                <div>
                    <strong>Terms & Conditions:</strong>
                    <p style="white-space:pre" data-text="@expr[properties.terms]@end"></p>
                </div>
            </div>
        </div>
    `
};

const invoice_02: ComponentDefinition = {
    type: 'pastel-template',
    name: 'Pastels Template',
    category: 'Templates',
    icon: '📄',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true,
        canBeDeleted: false,
        childrenLocked: true,
        allowSubElementRoot: true
    },

    properties: [
        {
            name: 'businessName',
            type: 'text',
            defaultValue: 'Company Name'
        },
        {
            name: 'useLogo',
            type: 'boolean',
            defaultValue: true
        },
        {
            name: 'currency',
            type: 'currency',
            defaultValue: ''
        },
        {
            name: 'invoiceInfo',
            type: {
                type: 'object',
                shape: [
                    {
                        name: 'header',
                        type: 'text',
                        defaultValue: 'Invoice'
                    },
                    {
                        name: 'hideHeader',
                        type: 'boolean',
                        defaultValue: false
                    },
                    {
                        name: 'dateInformation',
                        type: 'date',
                        defaultValue: new Date().toDateString()
                    },
                    {
                        name: 'invoiceNumber',
                        type: 'text',
                        defaultValue: nanoid()
                    }
                ]
            },
            defaultValue: {
                header: 'Invoice',
                dateInformation: new Date().toISOString().split('T')[0],
                invoiceNumber: '24-003-NG1'
            }
        },
        {
            name: 'lineItems',
            type: {
                type: 'array',
                itemType: {
                    type: 'object',
                    shape: [
                        {
                            name: 'title',
                            type: 'text',
                            defaultValue: 'Item Title'
                        },
                        {
                            name: 'description',
                            type: 'rich-text',
                            defaultValue: 'Item Description'
                        },
                        { name: 'qty', type: 'number', defaultValue: 1 },
                        { name: 'price', type: 'number', defaultValue: 100 },
                    ]
                }
            },
            defaultValue: [],
            description: 'Invoice table rows'
        },
        {
            name: 'tax',
            type: 'number',
            defaultValue: '7.5'
        },
        {
            name: 'from',
            type: {
                type: 'object',
                shape: [
                    {
                        name: 'name',
                        type: 'text',
                        defaultValue: ''
                    },
                    {
                        name: 'position',
                        type: 'text',
                        defaultValue: ''
                    },
                    {
                        name: 'phoneNumber',
                        type: 'tel',
                        defaultValue: ''
                    },
                    {
                        name: 'email',
                        type: 'text',
                        defaultValue: ''
                    }
                ]
            },
            defaultValue: {
                name: 'Laurice Therlautt',
                position: 'Commercial Manager',
                phoneNumber: '+1 (925) 650-7226',
                email: 'MarianoCampos@nowhere.com'
            }
        },
        {
            name: 'to',
            type: {
                type: 'object',
                shape: [
                    {
                        name: 'name',
                        type: 'text',
                        defaultValue: ''
                    },
                    {
                        name: 'info',
                        type: 'rich-text',
                        defaultValue: ``
                    }
                ]
            },
            defaultValue: {
                name: 'Traci Treadway',
                info: '388 West Ironwood Highway,\nTrenton, NJ, 54233'
            }
        },
        {
            name: 'thankYouMessage',
            type: 'text',
            defaultValue: 'Thank you for your business'
        },
        {
            name: 'address',
            type: 'rich-text',
            defaultValue: '3721 West Meadowview Circle, Lincoln, NE, 69285'
        },
        {
            name: 'terms',
            type: 'rich-text',
            defaultValue: `Amet eum vero dolore velit fuga nulla deleniti porro. Soluta nobis, porro a accusantium officia maiores eius, voluptatum ipsa ipsum quae deserunt!`
        },
        {
            name: 'pattern',
            type: {
                type: 'array',
                itemType: 'color',
                max: 5,
                arrayType: 'fixed'
            },
            defaultValue: [
                {
                    id: 'cell-one',
                    value: '#C4C4C6'
                },
                {
                    id: 'cell-two',
                    value: '#C19DA1'
                },
                {
                    id: 'cell-three',
                    value: '#BE777B'
                },
                {
                    id: 'cell-four',
                    value: '#A65A5E'
                },
                {
                    id: 'cell-five',
                    value: '#AC383B'
                },
            ]
        }
    ],

    subElements: [
        {
            key: 'brandlogo',
            selector: '#brand-logo',
            name: 'Business Logo',
            hidden: true,
            capabilities: {
                isContainer: 'strict',
                canBeDeleted: false,
                childrenLocked: true,
                canAcceptStyles: false,
                canHaveChildren: false
            }
        },
        {
            key: 'sendersignature',
            selector: '#signature',
            name: 'Signature',
            hidden: true,
            capabilities: {
                isContainer: 'strict',
                canBeDeleted: false,
                childrenLocked: true,
                canAcceptStyles: false,
                canHaveChildren: false
            }
        },
        {
            key: 'businessName',
            selector: '.business-name',
            name: 'Business Name',
        },
        {
            key: 'footerContents',
            selector: 'footer',
            name: 'Footer'
        }
    ],

    defaultChildren: [
        {
            name: 'Business Logo',
            type: 'image',
            selector: '#brand-logo',
            properties: [
                {
                    name: 'src',
                    defaultValue: 'https://cdn.prod.website-files.com/6365d860c7b7a7191055eb8a/66eeb030e508f6bded1fc406_AlphaWave.svg',
                    type: 'url'
                }
            ],
            expressions: [
                {
                    attribute: 'data-if',
                    expr: 'properties.useLogo'
                }
            ]
        },
        {
            name: 'Signature',
            type: 'signature',
            selector: '#signature',
            properties: [
                {
                    name: 'type',
                    defaultValue: 'Laurice Therlautt',
                    type: 'text'
                },
                {
                    name:'capture',
                    defaultValue: '',
                    type: 'image'
                }
            ]
        }
    ],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'typography-editor',
            'layout-editor',
            'background-editor',
            'spacing-editor',
        ],
        allowHost: [
            'width',
            'height'
        ],
        defaultStyles: {
            'height': '100%',
            'width': '100%'
        },
        css(properties) {
            return /*css*/ `
                [styles=host] {
                    font-family: 'Franklin Gothic Book';
                    font-size: 10px;
                    background-color: #f9fafb;
                    display: grid;
                    grid-template-columns: 50px 1fr;
                    height: 100%;
                    width: 100%;
                }

                table.line-items {
                    border-collapse: collapse;
                    margin-top: 24px;
                    font-size: 10px;
                }

                table.line-items > thead > tr > th {
                    padding-right: 48px;
                    text-align: left;
                    font-size: 12px;
                    border-bottom: 2px solid;
                }

                table.line-items > thead > tr > th span {
                    margin-top: 10px;
                    margin-bottom: 10px;
                    display: inline-block;
                }

                table.line-items > thead > tr > th:first-child {
                    border-bottom: none;
                }

                table.line-items > thead > tr > th:nth-child(2) {
                    width: 50%
                }

                table.line-items > thead > tr > th:last-child {
                    padding-right: 0;
                }

                table.line-items > tbody tr td {
                    border-bottom: 2px solid;
                    padding: 12px 0;
                    text-align: left;
                }

                table.line-items > tbody tr td:first-child {
                    border: none;
                    font-size: 12px;
                    vertical-align: top;
                    font-weight: 800;
                }

                table.line-items > tbody tr td:nth-child(2) {
                    padding-right: 24px;
                }

                table.line-items > tbody tr td:nth-child(2) p:first-child {
                    color: #AC383b;
                    color: ${properties.pattern[3].value};
                    font-size: 12px;
                    font-weight: 800;
                }

                table.line-items > tbody tr td:nth-child(2) p:last-child {
                    color: #4b5563;
                    margin-top: 4px;
                    font-weight: 600;
                }

                table.summary {
                    width: 100%;
                    margin-top: 24px;
                }

                table.summary thead {
                    width: 100%;
                }

                table.summary thead tr th {
                    font-family: 'Franklin Gothic Book', 'Arial Narrow', Arial, sans-serif;
                    font-weight: bold;
                    font-size: 12px;
                    color: #AC383b;
                    color: ${properties.pattern[3].value};
                    padding-bottom: 5px;
                    text-align: left;
                }

                table.summary thead tr th:nth-child(1),
                table.summary thead tr th:nth-child(2) {
                    width: 20%;
                    padding-left: 10px;
                }

                table.summary thead tr th:last-child {
                    width: 60%;
                    text-align: right;
                    font-size: 12px;
                }

                table.summary tbody {
                    background-color: #AC383b;
                    background-color: ${properties.pattern[4].value};
                }

                table.summary tbody td {
                    padding: 2px 10px;
                    color: aliceblue;
                    font-weight: 500;
                }

                table.summary tbody td:last-child {
                    text-align: right;
                    font-size: 24px;
                    font-weight: 800;
                }

                .pattern {
                    display: grid;
                    grid-template-rows: 1.4fr 2fr 1.5fr 1fr 2.8fr;
                }

                .pattern div > div {
                    width: 100%;
                    height: 100%;
                }

                [section=row-2] {
                    margin: 0 35px;
                    margin-top: 48px;
                    display: grid;
                    align-items: flex-end;
                    grid-template-rows: auto auto auto 1fr;
                }

                [section=row-2] header {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                }

                [section=row-2] header .invoice-info {
                    display: grid;
                    justify-items: end;
                }

                [section=row-2] header .invoice-info > div {
                    width: calc(100% - 10px);
                    overflow-x: clip;
                }

                [section=row-2] header .invoice-info .invoice-label {
                    font-size: 30px;
                    letter-spacing: 10px;
                    text-transform: uppercase;
                    color: #AC383b;
                    color: ${properties.pattern[3].value};
                    text-decoration-line: underline;
                    text-underline-offset: 15px;
                }

                [section=row-2] header .invoice-info > div > div {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                    column-gap: 20px;
                }

                [section=row-2] header .invoice-info b {
                    white-space: nowrap;
                }

                footer {
                    width: 100%;
                    margin-top: 24px;
                    padding-bottom: 20px;
                }

                footer > div:first-child {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 2px solid;
                    padding-bottom: 20px;
                }

                footer .thank-you-message {
                    font-weight: bold;
                    font-size: 14px;
                }

                footer .terms {
                    margin-top: 12px;
                    max-width: 240px;
                }

                footer .terms > p:first-child,
                footer .address > p:first-child,
                footer .contact > p:first-child {
                    font-weight: bold;
                    font-size: 12px;
                }

                footer .terms > p:last-child,
                footer .address > p:last-child,
                footer .contact > p:last-child {
                    margin-top: 5px;
                    color: #6b7280;
                    --un-font-weight: var(--fontWeight-semibold);
                    font-weight: 600;
                }

                footer .address {
                    max-width: 120px;
                }

                footer .contact {
                    display: grid;
                    align-items: flex-end;
                    grid-template-rows: auto 1fr;
                }

                footer .contact div {
                    color: #6b7280;
                }

                footer .contacts {
                    display: flex;
                    column-gap: 15px;
                    margin-top: 12px;
                }

                footer .signature {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                footer .signature h2 {
                    font-size: 12px;
                }

                footer .signature > b {
                    color: #6b7280;
                }

            `;
        },
    },

    renderTemplate: (properties) => /*html*/ `
        <div styles="host">
        <div class="pattern">
            <div data-each="@expr[properties.pattern]@end" data-key="singlePattern">
                <div data-attr="style" attr-style="@expr['background-color:' + singlePattern.value]@end"></div>
            </div>
        </div>
        <div section="row-2">
            <header>
                <div class="" id="brand-name">
                    <div id="brand-logo" data-if="@expr[properties.useLogo]@end"></div>
                    <h1 class="business-name" data-if="@expr[!properties.useLogo]@end" data-text="@expr[properties.businessName]@end"></h1>
                </div>

                <div class="invoice-info">
                    <div>
                        <p class="invoice-label" data-text="@expr[properties.invoiceInfo.header]@end" data-if="@expr[!properties.invoiceInfo.hideHeader]@end"></p>
                        <div>
                            <div>
                                <b>Date Information</b>
                                <p data-text="@expr[properties.invoiceInfo.dateInformation]@end"></p>
                            </div>
                            <div>
                                <b>Invoice Number</b>
                                <p data-text="@expr[properties.invoiceInfo.invoiceNumber]@end"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div>
                <b style="font-size: 12px;" data-text="@expr[properties.to.name]@end"></b>
                <p style="white-space: pre-line; font-size: 10px; margin-top: 5px;" data-text="@expr[properties.to.info]@end"></p>
            </div>

            <table class="line-items">
                <thead>
                    <tr>
                        <th><span>NO</span></th>
                        <th><span>Item Description</span></th>
                        <th><span>Price</span></th>
                        <th><span>Qty.</span></th>
                        <th><span>Total</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr data-each="@expr[properties.lineItems]@end" data-key="entry">
                        <td data-text="@expr[String(entryindex+1).padStart(2, '0')]@end"></td>
                        <td>
                            <p data-text="@expr[entry.title]@end"></p>
                            <p data-text="@expr[entry.description]@end"></p>
                        </td>
                        <td data-text="@expr[fmtCurrency(entry.price, properties.currency)]@end"></td>
                        <td data-text="@expr[entry.qty]@end"></td>
                        <td data-text="@expr[fmtCurrency((entry.price * entry.qty), properties.currency)]@end"></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td colspan="4">
                            <table class="summary">
                                <thead>
                                    <tr>
                                        <th>Subtotal</th>
                                        <th>Tax</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td data-text="@expr[fmtCurrency(properties.lineItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0), properties.currency )]@end"></td>
                                        <td data-text="@expr[properties.tax + '%']@end"></td>
                                        <td data-text="@expr[fmtCurrency((properties.lineItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0) * (properties.tax / 100)) + properties.lineItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0), properties.currency)]@end"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <footer>
                <div>
                    <div>
                        <h2 class="thank-you-message" data-text="@expr[properties.thankYouMessage]@end"></h2>
                        <div class="terms">
                            <p>Terms & Condition</p>
                            <p data-text="@expr[properties.terms]@end"></p>
                        </div>
                    </div>
                    <div class="signature">
                        <h2><b data-text="@expr[properties.from.position]@end"></b></h2>
                        <div id="signature"></div>
                        <b data-text="@expr[properties.from.name]@end"></b>
                    </div>
                </div>

                <div class="contacts">
                    <div class="address">
                        <p>Address</p>
                        <p data-text="@expr[properties.address]@end"></p>
                    </div>
                    <div class="contact">
                        <p>Contact</p>
                        <div>
                            <p><b>Contact:</b> <span data-text="@expr[properties.from.phoneNumber]@end"></span></p>
                            <p><b>Email:</b> <span data-text="@expr[properties.from.email]@end"></span></p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>

    </div>
    `
};

const invoice_03: ComponentDefinition = {
    type: 'redline-template',
    name: 'Redline Template',
    category: 'Templates',
    icon: '📄',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true,
        canBeDeleted: false,
        childrenLocked: true,
        allowSubElementRoot: true
    },

    properties: [
        {
            name: 'businessName',
            type: 'text',
            defaultValue: 'Redline'
        },
        {
            name: 'tagline',
            type: 'text',
            defaultValue: 'Creative Agency'
        },
        {
            name: 'invoiceInformation',
            type: {
                type: 'object',
                shape: [
                    {
                        name: 'invoiceNumber',
                        type: 'text',
                        defaultValue: '1234456'
                    },
                    {
                        name: 'date',
                        type: 'date',
                        defaultValue: ''
                    },
                    {
                        name: 'dueDate',
                        type: 'date',
                        defaultValue: ''
                    },
                ]
            },
            defaultValue: {
                invoiceNumber: '1234456',
                date: new Date().toISOString().split('T')[0],
                dueDate: new Date().toISOString().split('T')[0],
            }
        },
        {
            name: 'to',
            type: {
                type: 'object',
                shape: [
                    {
                        name: 'name',
                        type: 'text',
                        defaultValue: ''
                    },
                    {
                        name: 'phoneNumber',
                        type: 'tel',
                        defaultValue: ''
                    },
                    {
                        name: 'email',
                        type: 'text',
                        defaultValue: ''
                    },
                    {
                        name: 'address',
                        type: 'rich-text',
                        defaultValue: ''
                    },
                ]
            },
            defaultValue: {
                name: 'Elizabeth Wotton',
                phoneNumber: '+1 (925) 650-7226',
                email: 'MarianoCampos@nowhere.com',
                address: '1539 Waterview Circle, Suite 7679,\nPierre, South Dakota, 54997',
            }
        },
        {
            name: 'lineItems',
            type: {
                type: 'array',
                itemType: {
                    type: 'object',
                    shape: [
                        {
                            name: 'title',
                            type: 'text',
                            defaultValue: 'UI Design'
                        },
                        {
                            name: 'description',
                            type: 'rich-text',
                            defaultValue: 'Designing user friendly interface for better user experience'
                        },
                        { name: 'hours', type: 'number', defaultValue: 20 },
                        { name: 'rate', type: 'number', defaultValue: 40 },
                    ]
                }
            },
            defaultValue: [],
            description: 'Invoice table rows'
        },
        {
            name: 'currency',
            type: 'currency',
            defaultValue: ''
        },
        {
            name: 'paymentMethod',
            type: {
                type: 'object',
                shape: [
                    {
                        name: 'bankName',
                        type: 'text',
                        defaultValue: 'SALSA BANK'
                    },
                    {
                        name: 'accountName',
                        type: 'text',
                        defaultValue: 'Redline Agency'
                    },
                    {
                        name: 'accountNumber',
                        type: 'text',
                        defaultValue: '123-456-789'
                    }
                ]
            },
            defaultValue: {}
        },
        {
            name: 'terms',
            type: 'rich-text',
            defaultValue: `Payment is due within 30 days of the invoice date unless otherwise agreed upon in writing. Late payments will incur a late fee of 1.5% per month on the outstanding balance`
        }
    ],

    subElements: [
        {
            key: 'businessName',
            selector: '.business-name',
            name: 'Business Name',
        },
        {
            key: 'businessTagline',
            selector: '.tagline',
            name: 'Tagline',
        }
    ],

    defaultChildren: [],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'typography-editor',
            'layout-editor',
            'background-editor',
            'spacing-editor',
        ],
        allowHost: [
            'width',
            'height'
        ],
        defaultStyles: {
            'height': '100%',
            'width': '100%'
        },
        css(properties) {
            return /*css*/ `
                [styles=host] {
                    padding: 30px;
                    background-color: #FDFFEA;
                    color: #dc2626;

                    display: grid;
                    grid-template-rows: auto auto auto auto auto 1fr;
                    font-size: 12px
                }

                h1,h2,h3 {
                    font-family: Helvetica, sans-serif
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .business-name {
                    font-size: 1.875rem;
                    font-weight: bold;
                    text-transform:uppercase;
                    margin: 0;
                    color: #dc2626;
                }

                .header p {
                    font-weight: bold;
                    /* font-size: 0.875rem; */
                }

                .invoice-title {
                    font-family: Impact, sans-serif;
                    font-size: 85px;
                    line-height: 85px;
                }

                .invoice-info {
                    margin-top: 30px;
                    padding-top: 1rem;
                    padding-bottom: 1rem;
                    font-weight: 500;
                    letter-spacing: -0.015em;
                    /* font-size: 0.875rem; */

                    display: flex;
                    justify-content: space-between;
                    border-top: 1px solid #dc2626;
                    border-bottom: 1px solid #dc2626;
                }

                .invoice-info .left {
                    display: grid;
                    align-content: space-between;
                }

                .invoice-info .right {
                    text-align: right;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .contact-info p:last-child {
                    white-space: pre;
                }

                .invoice-table-header {
                    display: grid;
                    grid-template-columns: 5fr 2fr 2fr 2fr;
                    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
                    /* column-gap: 1.25rem; */
                    text-transform: uppercase;
                    /* font-size: 1.125rem; */
                    font-size: 14px;
                    font-weight: 900;
                    letter-spacing: -0.015em;
                    text-align: center;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid #dc2626;
                }

                .invoice-table-header p:first-child {
                    text-align: left;
                    padding: 0;
                }

                .invoice-row {
                    display: grid;
                    grid-template-columns: 5fr 2fr 2fr 2fr;
                    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
                    /* column-gap: 1.25rem; */
                    /* font-size: 0.875rem; */
                    text-align: center;
                    padding-top: 0.75rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #dc2626;
                }

                .invoice-row > *, .invoice-table-header > * {
                    &:first-child {
                        grid-column-start: 1;
                        grid-column-end: 8;
                    }

                    &:nth-child(2) {
                        grid-column-start: 8;
                        grid-column-end: 10;
                    }
                    
                    &:nth-child(3) {
                        grid-column-start: 11;
                        grid-column-end: 13;
                    }

                    &:last-child {
                        grid-column-start: 14;
                        grid-column-end: 16;
                    }
                }

                .invoice-row .description {
                    text-align: left;
                    padding: 0;
                }

                .description p:first-child {
                    font-weight: bold;
                    font-size: 15px;
                }

                .description p:last-child {
                    font-weight: normal;
                    margin-top: 0.3rem;
                    letter-spacing: -0.015em;
                    line-height: 1rem;
                    /* font-size: 0.875rem; */
                }

                .total-row {
                    display: grid;
                    grid-template-columns: 5fr 2fr 2fr 2fr;
                    column-gap: 1.25rem;
                    font-size: 0.875rem;
                    text-align: center;
                    padding: 0.5rem 0;
                    letter-spacing: -0.015em;
                    /* border-bottom: 1px solid #dc2626; */
                }

                .total-row p:nth-child(1) {
                    grid-column: 3 / span 1;
                    white-space: nowrap;
                }

                .total-row p:nth-child(2) {
                    grid-column: 4 / span 1;
                    font-weight: 400;
                }

                footer {
                    display: grid;
                    align-items: end;
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    column-gap: 1rem;
                }

                .payment-method h3,
                .terms h3 {
                    font-weight: bold;
                    letter-spacing: -0.015em;
                    font-size: 1.125rem;
                }

                .payment-method .details {
                    margin-top: 0.75rem;
                    letter-spacing: -0.015em;
                    line-height: 1.25rem;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    column-gap: 0.75rem;
                }

                .terms {
                    text-align: right;
                    display: grid;
                    justify-content: space-between;
                }

                .terms p {
                    font-size: 11px;
                    line-height: 1rem;
                }
            `;
        },
    },

    renderTemplate: (properties) => /*html*/ `
        <div styles="host">
            <div class="header">
                <div>
                    <h1 class="business-name" data-text="@expr[properties.businessName]@end"></h1>
                    <p class="tagline" data-text="@expr[properties.tagline]@end"></p>
                </div>
                <h2 class="invoice-title">INVOICE</h2>
            </div>

            <div class="invoice-info">
                <div class="left">
                    <p><b>Invoice</b> #<span data-text="@expr[properties.invoiceInformation.invoiceNumber]@end"></span></p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                        <path fill="currentColor" fill-rule="evenodd"
                            d="M13.47 5.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06l4.72-4.72H4a.75.75 0 0 1 0-1.5h14.19l-4.72-4.72a.75.75 0 0 1 0-1.06"
                            clip-rule="evenodd" />
                    </svg>
                </div>

                <div>
                    <p></p><b data-text="@expr[properties.to.name]@end"></b></p>
                    <div class="contact-info">
                        <p data-text="@expr[properties.to.phoneNumber]@end"></p>
                        <p data-text="@expr[properties.to.email]@end"></p>
                        <p data-text="@expr[properties.to.address]@end"></p>
                    </div>
                </div>

                <div class="right">
                    <div>
                        <p><b>Invoice Date</b></p>
                        <p data-text="@expr[new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(properties.invoiceInformation.date))]@end"></p>
                    </div>
                    <div>
                        <p><b>Invoice Due</b></p>
                        <p data-text="@expr[new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(properties.invoiceInformation.dueDate))]@end"></p>
                    </div>
                </div>
            </div>

            <div class="invoice-table-header">
                <p>description</p>
                <p>hours</p>
                <p>rate</p>
                <p>total</p>
            </div>

            <div>
                <div class="invoice-row" data-each="@expr[properties.lineItems]@end" data-key="entry">
                    <div class="description">
                        <p data-text="@expr[entry.title]@end"></p>
                        <p data-text="@expr[entry.description]@end"></p>
                    </div>
                    <p data-text="@expr[entry.hours]@end"></p>
                    <p data-text="@expr[fmtCurrency(entry.rate, properties.currency)]@end"></p>
                    <p data-text="@expr[fmtCurrency(entry.hours * entry.rate, properties.currency)]@end"></p>
                </div>
            </div>

            <div class="total-row">
                <p><b>Total Amount</b></p>
                <p data-text="@expr[fmtCurrency(properties.lineItems.reduce((sum, item) => sum + (Number(item.hours) * Number(item.rate)), 0), properties.currency)]@end"></p>
            </div>

            <footer>
                <div class="footer-grid">
                    <div class="payment-method">
                        <h3>Payment Method</h3>
                        <div class="details">
                            <div>
                                <p>Bank Name</p>
                                <p>Account Name</p>
                                <p>Account Number</p>
                            </div>
                            <div>
                                <p data-text="@expr[properties.paymentMethod.bankName]@end"></p>
                                <p data-text="@expr[properties.paymentMethod.accountName]@end"></p>
                                <p data-text="@expr[properties.paymentMethod.accountNumber]@end"></p>
                            </div>
                        </div>
                    </div>

                    <div class="terms">
                        <h3>Terms & Conditions</h3>
                        <p data-text="@expr[properties.terms]@end"></p>
                    </div>
                </div>
            </footer>
        </div>
    `
};

export default {
    invoice_01,
    invoice_02,
    invoice_03
}