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
                    name: 'capture',
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

const invoice_04: ComponentDefinition = {
    type: 'independent-template',
    name: 'Freelance Invoice',
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
            defaultValue: 'INDEPENDENT'
        },
        {
            name: 'tagline',
            type: 'text',
            defaultValue: 'Freelance Graphics Designer'
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
            name: 'recipient',
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
                    }
                ]
            },
            defaultValue: {
                name: 'Elizabeth Wotton',
                phoneNumber: '+1 (925) 650-7226',
                email: 'MarianoCampos@nowhere.com'
            }
        },
        {
            name: 'personal',
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
                    }
                ]
            },
            defaultValue: {
                name: 'John Doe',
                phoneNumber: '+1 (311) 555-2368',
                email: 'johndoe@example.com'
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
                            name: 'description',
                            type: 'text',
                            defaultValue: 'UI Design'
                        },
                        { name: 'price', type: 'number', defaultValue: 4500 },
                    ]
                }
            },
            defaultValue: [
                {
                    id: nanoid(),
                    description: 'Graphic Design Services',
                    price: 750
                }
            ],
            description: 'Invoice table rows'
        },
        {
            name: 'currency',
            type: 'currency',
            defaultValue: ''
        },
        {
            name: 'tax',
            type: 'number',
            defaultValue: 7.5
        },
        {
            name: 'paymentMethod',
            type: "text",
            defaultValue: "Bank Transfer"
        },
        {
            name: 'terms',
            type: 'rich-text',
            defaultValue: `Payment is due within 30 days of the invoice date unless otherwise agreed upon in writing. Late payments will incur a late fee of 1.5% per month on the outstanding balance`
        },
        {
            name: 'thankYouMessage',
            type: {
                type: 'object',
                shape: [
                    {
                        name: 'line1',
                        type: 'text',
                        defaultValue: ''
                    },
                    {
                        name: 'line2',
                        type: 'text',
                        defaultValue: ''
                    }
                ]
            },
            defaultValue: {
                line1: 'Thank you for your business!',
                line2: 'We appreciate your business and look forward to serving you again.'
            }
        }
    ],

    defaultChildren: [],

    styleSettings: {
        allowedProperties: [
            "typography-editor",
            "background-editor"
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
                    padding: 16px;
                    font-family: 'Victor Mono', monospace;
                    font-size: 11px;
                }

                [styles=host] * {
                    font-family: inherit
                }

                header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .invoice-title {
                    font-size: 1.875em; /* text-3xl */
                    font-weight: bold;
                    margin: 0;
                }

                .invoice-subtitle {
                    font-weight: bold;
                    font-size: 0.875em; /* text-sm */
                }

                .invoice-meta {
                    text-align: right;
                }

                .invoice-meta p {
                    margin: 0;
                    font-size: 0.8em;
                    /* margin-top: 2px; */
                }

                .section {
                    margin-top: 1.2em;
                    font-family: 'DM Mono', monospace;
                }

                .contact-info {
                display: flex;
                justify-content: space-between;
                }

                .ship-to {
                display: flex;
                gap: 1em;
                }

                .ship-to-title {
                font-weight: 600;
                font-size: 0.875em;
                margin-bottom: 0.5em;
                }

                table {
                width: 100%;
                margin-top: 2.2em;
                border-collapse: collapse;
                }

                th {
                text-align: left;
                font-family: 'DM Mono', monospace;
                font-weight: 500;
                font-size: 1em;
                border-bottom: 1px solid #ccc;
                padding-bottom: .3em;
                margin-bottom: .3em;
                }

                td {
                padding-top: .2em;
                padding-bottom: .2em;
                }

                td:last-child {
                text-align: right;
                }

                .summary, .terms {
                margin-top: 1.2em;
                }

                .summary h2,
                .terms h2 {
                font-size: 1.5em;
                font-weight: 900;
                margin-bottom: 0.3em;
                }

                .summary-content,
                .terms-content {
                border-top: 1px solid #ccc;
                padding-top: 1em;
                }

                .summary-row,
                .terms-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.25em;
                font-weight: 900;
                }

                .terms p {
                padding-bottom: 0.8em;
                max-width: 60%;
                margin: 0;
                }

                .thank-you {
                margin-top: 2.2em;
                text-align: center;
                }

                .thank-you p:first-child {
                font-weight: 800;
                font-size: 1.1em;
                font-family: 'DM Mono', monospace;
                }

                .thank-you p:last-child {
                font-size: 1em;
                margin-top: 0.5em;
                padding: 0 1em;
                }
            `;
        },
    },

    renderTemplate: (properties) => /*html*/ `
        <div styles="host">
            <header>
      <div>
        <h1 class="invoice-title" data-text="@expr[properties.businessName]@end"></h1>
        <p class="invoice-subtitle" data-text="@expr[properties.tagline]@end"></p>
      </div>

      <div class="invoice-meta">
        <p>Invoice #<span data-text="@expr[properties.invoiceInformation.invoiceNumber]@end"></span></p>
        <p>Date: <span data-text="@expr[new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(properties.invoiceInformation.date))]@end"></span></p>
        <p>Due: <span data-text="@expr[new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(properties.invoiceInformation.dueDate))]@end"></span></p>
      </div>
    </header>

    <div class="section contact-info">
      <div>
        <p class="font-semibold" data-text="@expr[properties.personal.name]@end"></p>
        <p data-text="@expr[properties.personal.phoneNumber]@end"></p>
        <p data-text="@expr[properties.personal.email]@end"></p>
      </div>
    </div>

    <div class="section">
      <div class="ship-to">
        <p class="ship-to-title">Addressed To:</p>
        <div class="leading-tight">
          <p class="font-semibold" data-text="@expr[properties.recipient.name]@end"></p>
          <p data-text="@expr[properties.recipient.phoneNumber]@end"></p>
          <p data-text="@expr[properties.recipient.email]@end"></p>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr data-each="@expr[properties.lineItems]@end" data-key="entry">
          <td data-text="@expr[entry.description]@end"></td>
          <td data-text="@expr[fmtCurrency(entry.price, properties.currency)]@end"></td>
        </tr>
      </tbody>
    </table>

    <div class="summary">
      <h2>Invoice Summary</h2>
      <div class="summary-content">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span data-text="@expr[fmtCurrency(properties.lineItems.reduce((acc, item) => acc + item.price, 0), properties.currency)]@end"></span>
        </div>
        <div class="summary-row">
          <span>Tax (<span data-text="@expr[properties.tax]@end"></span>%):</span>
          <span data-text="@expr[fmtCurrency(properties.lineItems.reduce((acc, item) => acc + item.price, 0) * properties.tax / 100, properties.currency)]@end"></span>
        </div>
        <div class="summary-row">
          <span>Total:</span>
          <span data-text="@expr[fmtCurrency(properties.lineItems.reduce((acc, item) => acc + item.price, 0) * (1 + properties.tax / 100), properties.currency)]@end"></span>
        </div>
      </div>
    </div>

    <div class="terms">
      <h2>Payment Terms</h2>
      <div class="terms-content">
        <p data-text="@expr[properties.terms]@end"></p>
        <div class="terms-row">
          <span>Payment Method:</span>
          <span data-text="@expr[properties.paymentMethod]@end"></span>
        </div>
        <div class="terms-row">
          <span>Payment Due By:</span>
          <span data-text="@expr[new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(properties.invoiceInformation.dueDate))]@end"></span>
        </div>
      </div>
    </div>

    <div class="thank-you">
      <p data-text="@expr[properties.thankYouMessage.line1]@end"></p>
      <p data-text="@expr[properties.thankYouMessage.line2]@end"></p>
    </div>
        </div>
    `
};

const invoice_05: ComponentDefinition = {
    type: 'corporate-template',
    name: 'Corporate Invoice',
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
            type: 'rich-text',
            defaultValue: 'Whyte WebArt\n(Creative Studio)'
        },
        {
            name: 'website',
            type: 'text',
            defaultValue: 'https://whytewebart.com',
            helptext: "Enter your web address / social media username"
        },
        {
            name: 'issuedOn',
            type: 'date',
            defaultValue: new Date().toISOString().split('T')[0]
        },
        {
            name: 'registration',
            type: {
                type: 'object',
                shape: [
                    {
                        name: 'no',
                        type: 'text',
                        defaultValue: '',
                        helptext: 'Enter your registration number'
                    },
                    {
                        name: 'showNumber',
                        type: 'boolean',
                        defaultValue: false
                    }
                ]
            },
            defaultValue: {
                no: '928301',
                showNumber: true
            }
        },
        {
            name: 'invoiceNumber',
            type: 'text',
            defaultValue: '1234569'
        },
        {
            name: 'metadata',
            type: {
                type: 'array',
                itemType: {
                    type: 'object',
                    shape: [
                        {
                            name: 'title',
                            type: 'text',
                            defaultValue: 'Help Line'
                        },
                        {
                            name: 'content',
                            type: 'rich-text',
                            defaultValue: '+1 (234) 914 672'
                        }
                    ]
                },
                max: 2
            },
            defaultValue: []
        },
        {
            name: 'recipient',
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
                        name: 'address',
                        type: 'rich-text',
                        defaultValue: ''
                    }
                ]
            },
            defaultValue: {
                name: 'Elizabeth Wotton',
                phoneNumber: '+1 (925) 650-7226',
                address: '846 North Front Ave, Montgomery, Alabama, 25109'
            }
        },
        {
            name: 'personal',
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
                name: 'John Doe',
                position: 'Director',
                phoneNumber: '+1 (311) 555-2368',
                email: 'johndoe@example.com'
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
                            name: 'description',
                            type: 'text',
                            defaultValue: 'Analytics and Reporting'
                        },
                        { name: 'unit', type: 'number', defaultValue: 1 },
                        { name: 'price', type: 'number', defaultValue: 4500 },
                        {
                            name: 'detail',
                            type: 'rich-text',
                            defaultValue: ''
                        },
                        {
                            name: 'showIcon',
                            type: 'boolean',
                            defaultValue: true
                        }
                    ]
                }
            },
            defaultValue: [
                {
                    id: nanoid(),
                    description: 'Analytics and Reporting',
                    unit: 1,
                    price: 1300,
                    detail: 'Integration of analytics tools to track website traffic, user behavior, and conversion rates.'
                }
            ],
            description: 'Invoice table rows'
        },
        {
            name: 'tableSummary',
            type: {
                type: 'array',
                itemType: {
                    type: 'object',
                    shape: [
                        {
                            name: 'title',
                            type: "text",
                            defaultValue: 'Shipping'
                        },
                        {
                            name: 'value',
                            type: 'number',
                            defaultValue: 200
                        },
                        {
                            name: 'applyAs',
                            type: 'select',
                            options: [
                                'flat',
                                'percentage'
                            ],
                            defaultValue: 'flat'
                        }
                    ]
                }
            },
            defaultValue: [
                {
                    id: nanoid(),
                    title: 'Tax',
                    value: 7.5,
                    applyAs: 'percentage'
                }
            ]
        },
        {
            name: 'currency',
            type: 'currency',
            defaultValue: ''
        },
        {
            name: 'terms',
            type: 'rich-text',
            defaultValue: `50% deposit required before project start.
Balance due upon completion, prior to delivery.
Invoices payable within 14 days.
Late payments may incur a 5% monthly fee.
Additional work outside scope billed separately.
Final deliverables remain property of Whyte WebArt until full payment is received.`
        },
        {
            name: 'hideTerms',
            type: 'boolean',
            defaultValue: false
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
            styleSettings: {
                defaultStyles: {
                    width: '200px',
                    height: '50px'
                }
            }
        },
        {
            name: 'QR Code',
            type: 'qrcode',
            selector: '#qr-code',
            properties: [
                {
                    name: 'size',
                    defaultValue: 100,
                    type: 'number'
                }
            ],
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
                    name: 'capture',
                    defaultValue: '',
                    type: 'image'
                }
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
                canBeDeleted: true,
                childrenLocked: true,
                canAcceptStyles: false,
                canHaveChildren: false
            }
        },
        {
            key: 'invoiceqrcode',
            selector: '#qr-code',
            name: 'QR Code',
            hidden: true,
            capabilities: {
                isContainer: 'strict',
                canBeDeleted: true,
                childrenLocked: true,
                canAcceptStyles: false,
                canHaveChildren: false
            }
        },
        {
            key: 'businessname',
            selector: '.business-name',
            name: 'Business Name',
        },
        {
            key: 'link',
            selector: '.c-7',
            name: 'Website / Social Link',
        },
        {
            key: 'table',
            selector: 'div[table] > ul[body]',
            name: 'Table',
        }
    ],

    styleSettings: {
        allowedProperties: [
            "typography-editor",
            "background-editor"
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
                    padding: 2em 1em;
                    font-family: 'Space Mono';
                    font-size: 9px;
                    display: grid; grid-template-rows: auto auto 1fr; 
                    
                    --c-indigo-600: #4f46e5;
                    --c-neutral-100: #fafafaff;
                    --c-neutral-200: #e5e5e5;
                    --c-gray-300: #d1d5db;
                }

                [styles=host] * {
                    font-family: inherit
                }

                header[main] div[left] p:has(b):not(:first-of-type) {
                    margin-top: .5em;
                }

                .c-3 { display: flex; justify-content: space-between; align-items: flex-start; }
                /* .c-4 { font-family: "DM Mono"; } */
                .c-5 { text-transform: uppercase; }
                .c-6.business-name { white-space: pre; color: var(--c-indigo-600); font-weight: 700; }
                .c-7 { padding: 0.25em 0.5em; background-color: var(--c-neutral-100); color: var(--c-indigo-600); border-radius: 0.375em; width: fit-content; }
                .c-8 { display: grid; grid-template-columns: 2.5em 1fr; column-gap: 1em; }
                .c-9 { height: .7em; border-left: 2px solid; border-bottom: 2px solid; }
                .c-10 > :not([hidden]) ~ :not([hidden]) { margin-top: -0.25em !important; }
                .c-11 {
                    text-transform: uppercase;
                    /* font-family: "DM Mono"; */
                }
                .c-12 { text-align: right; display: grid; justify-items: end; row-gap: 1.5rem; }
                /* .c-13 { width: 50px; height: 50px; background-color: var(--c-neutral-200); } */
                .c-14 { display: grid; }
                .c-15 { display: grid; grid-template-columns: auto minmax(0, 12em); }
                .c-16 { white-space: pre-wrap; }
                .c-17 { margin-top: 2.5rem; width: 100%; }
                .c-18 { display: grid; grid-template-columns: 4fr 1fr 1fr 1fr 1fr 1fr; padding-top: 0.25rem; padding-bottom: 0.25rem; }
                .c-19 { visibility: hidden; }
                .c-20 { text-align: center; }
                .c-21 { visibility: hidden; height: 0px; }
                .c-22 { background-color: white; border-radius: 1em; overflow: clip; border: 1px solid var(--c-gray-300); }
                .c-23:not(:nth-last-child(-n+2)) { border-bottom: 1px solid var(--c-gray-300); }
                .c-24 { padding-top: 0.5em; padding-bottom: 0.5em; display: grid; grid-template-columns: 4fr 1fr 1fr 1fr 1fr 1fr; }
                .c-25 { font-weight: 700; padding-left: 0.375rem; }
                .c-26 { text-align: center; color: var(--c-indigo-600); }
                .c-27 { display: none !important; }
                .c-28 {
                    background-color: var(--c-neutral-100);
                    padding: 0.5em 0.375rem;
                    border-top: 1px solid var(--c-gray-300);
                    display: grid;
                    grid-template-columns: auto 1fr;
                    column-gap: 0.5em;
                }
                .c-28 p { margin-top: .4em; }
                .c-29 { width: 2em; }
                .c-30 { display: grid; justify-items: end; margin-top: 1.8em; width: fit-content; float: right; }
                .c-30 > li > p:last-child { text-align: right; }
                .c-31 { width: 100%; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 4em; list-style-type: none; }
                .c-32 { border-top: 1px solid; width: 100%; margin: 0.2em 0; list-style-type: none; }
                .c-33 { display: grid; justify-items: end; align-items: end; align-content: end; row-gap: 1.5rem; }
                .c-34 { text-align: right; float: inline-end; display: grid; }
                .c-35 { white-space: pre-wrap; max-width: 20rem; }
                .c-36 { width: 100%; display: grid; grid-template-columns: 1fr auto; align-items: end; justify-content: space-between; align-content: end; column-gap: 3rem; }
                .c-37 { width: 100%; display: grid; grid-template-columns: auto auto auto; column-gap: 1.25rem; justify-content: flex-start; align-items: end; }
                .c-38 {
                    padding-bottom: 0.5em;
                    border-bottom: 2px solid #a3a3a3;

                    display: grid;
                    /* grid-template-columns: auto 1fr; */
                    align-items: end;
                    
                    &:has(div#signature:not(:empty)) {
                        border-bottom: none;
                        padding-bottom: 0;
                        row-gap: 1em;
                    }
                }
                /* .c-39 { width: 100px; height: 100px; background-color: var(--c-neutral-200); } */
            `;
        },
    },

    renderTemplate: (properties) => /*html*/ `
        <div styles="host">
            <header main class="c-3">
            <div left>
                <p class="c-4"><b>ISSUED ON</b></p>
                <p data-text="@expr[ new Intl.DateTimeFormat('de-DE').format(new Date(properties.issuedOn)) ]@end"></p>
                <p class="c-4 c-5"><b>Beneficiary</b></p>
                <p class="c-6 business-name" data-text="@expr[properties.businessName]@end"></p>
                <p class="c-7" data-text="@expr[properties.website]@end"></p>
                <p class="c-4 c-5"><b>Metadata</b></p>
                <div class="c-8">
                    <div class="c-9"></div>
                    <div class="c-10">
                        <p data-if="@expr[properties.registration.showNumber]@end"><b class="c-11">Reg no:</b> <span data-text="@expr[properties.registration.no]@end"></span></p>
                        <p><b class="c-11">Invoice no:</b> <span data-text="@expr[properties.invoiceNumber]@end"></span></p>

                        <p data-each="@expr[properties.metadata]@end" data-key="entry">
                            <b class="c-11" data-text="@expr[entry.title]@end"></b>
                            <span data-text="@expr[entry.content]@end"></span>
                        </p>
                    </div>
                </div>
            </div>

            <div right class="c-12">
                <div class="c-13" id="brand-logo"></div>
                <div class="c-14">
                    <p><b class="c-11">Reciepient / to</b></p>
                    <p><b class="c-11">Name:</b> <span data-text="@expr[properties.recipient.name]@end"></span></p>
                    <p><b class="c-11">Phone:</b> <span data-text="@expr[properties.recipient.phoneNumber]@end"></span></p>
                    <div class="c-15">
                        <p><b class="c-11">Address:</b></p>
                        <p class="c-16"><span data-text="@expr[properties.recipient.address]@end"></span></p>
                    </div>
                </div>
            </div>
        </header>

        <div table class="c-17">
            <header class="c-18">
                <p class="c-19"><b class="c-11">Description</b></p>
                <p class="c-20"><b class="c-11">Unit</b></p>
                <p class="c-20"><b class="c-11">Price</b></p>
                <p class="c-21"><b class="c-11">empty-block</b></p>
                <p class="c-20"><b class="c-11">SubTotal</b></p>
                <p class="c-21"><b class="c-11">empty-block</b></p>
            </header>

            <ul body class="c-22">
                <li data-each="@expr[properties.lineItems]@end" data-key="entry" class="c-23">
                    <div class="c-24">
                        <p class="c-25" data-text="@expr[entry.description]@end"></p>
                        <p class="c-26" data-text="@expr[entry.unit]@end"></p>
                        <p class="c-26" data-text="@expr[entry.price]@end"></p>
                        <span></span>
                        <p class="c-20" data-text="@expr[fmtCurrency(entry.price * entry.unit, properties.currency)]@end"></p>
                        <span></span>
                    </div>
                    <div class="c-28" data-if="@expr[entry.detail?.length > 0]@end">
                        <svg data-if="@expr[entry.showIcon]@end" class="c-29" viewBox="0 0 24.505 24.508" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g transform="translate(0 0)">
                                <path d="M0.765791 0C1.18873 0 1.53158 0.342888 1.53158 0.765863C1.53158 2.559 2.26164 3.60466 3.12749 4.22858C4.03317 4.8811 5.14305 5.10575 5.87107 5.10575L14.2335 5.10575L10.4352 1.30707C10.154 1.00531 10.1623 0.535071 10.4539 0.243417C10.7456 -0.0482364 11.2158 -0.0565324 11.5175 0.224653L16.6228 5.33041C16.9214 5.62942 16.9214 6.11381 16.6228 6.41282L11.5175 11.5186C11.3266 11.7235 11.0391 11.8078 10.7677 11.7385C10.4964 11.6692 10.2845 11.4573 10.2153 11.186C10.146 10.9146 10.2303 10.6271 10.4352 10.4362L14.2335 6.63748L5.87107 6.63748C4.898 6.63748 3.45423 6.35156 2.23305 5.47235C0.972044 4.56352 0 3.05733 0 0.765863C0 0.342888 0.342856 0 0.765791 0L0.765791 0Z" fill="#888888" fill-rule="evenodd" transform="translate(3.828 6.382)" />
                            </g>
                        </svg>
                        <p data-text="@expr[entry.detail]@end"></p>
                    </div>
                </li>
            </ul>

            <ul class="c-30">
                <li class="c-31">
                    <p><b class="c-11">SubTotal</b></p>
                    <p data-text="@expr[fmtCurrency(properties.lineItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.unit)), 0), properties.currency)]@end"></p>
                </li>
                <li class="c-31" data-each="@expr[properties.tableSummary]@end" data-key="charge">
                    <p><b class="c-11" data-text="@expr[charge.title + (charge.applyAs == 'percentage' ? (' (' + charge.value + '%)') : '')]@end"></b></p>
                    <p data-text="@expr[
                                charge.applyAs == 'flat' ? fmtCurrency(charge.value, properties.currency) : charge.applyAs == 'percentage' ? fmtCurrency(properties.lineItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.unit)), 0) * (charge.value / 100), properties.currency) : '']@end"></p>
                </li>
                <li class="c-32"></li>
                <li class="c-31">
                    <p><b class="c-11">SubTotal</b></p>
                    <p data-text="@expr[
                            fmtCurrency(
    properties.lineItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.unit)), 0) +
    properties.tableSummary.reduce((sum, item) => {
        const subtotal = properties.lineItems.reduce((s, i) => s + (Number(i.price) * Number(i.unit)), 0);
        return sum + (item.applyAs === 'flat' ? Number(item.value) : subtotal * (Number(item.value) / 100));
    }, 0)
    , properties.currency)

                                ]@end"></p>
                </li>
            </ul>
        </div>

        <div class="c-33">
            <div class="c-34" data-if="@expr[ !properties.hideTerms ]@end">
                <p><b class="c-11">Payment Terms</b></p>
                <p class="c-35" data-text="@expr[properties.terms]@end">
            </div>

            <div class="c-36">
                <div class="c-37">
                    <div>
                        <p data-text="@expr[properties.personal.name]@end"></p>
                        <p data-text="@expr[properties.personal.position]@end"></p>
                    </div>

                    <div class="c-38">
                        <p><b class="c-11">Signature</b></p>
                        <div id="signature"></div>
                    </div>

                    <div>
                        <p data-text="@expr[properties.personal.phoneNumber]@end">1</p>
                        <p data-text="@expr[properties.personal.email]@end"></p>
                    </div>
                </div>

                <div class="c-39" id="qr-code"></div>
            </div>
        </div>
        </div>
    `
};

export default {
    invoice_01,
    invoice_02,
    invoice_03,
    invoice_04,
    invoice_05
}