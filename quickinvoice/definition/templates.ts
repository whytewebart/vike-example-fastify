

const invoice_01: ComponentDefinition = {
    type: 'template01',
    name: 'Template',
    category: 'Templates',
    icon: '📄',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true,
        canBeDeleted: false
    },

    properties: [],

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
                    <div class="logo">Business Name.</div>
                    <div class="company-address">
                    Office Address<br>
                    Main street, Number 06/B,<br>
                    South Mountain, YK<br>
                    (+62) 123 456 7890
                    </div>
                </div>
                <div class="invoice-title">
                    <h1>INVOICE</h1>
                    <p>December 26, 2020</p>
                </div>
            </header>

            <div class="bill-section">
                <div class="bill-to">
                    <strong>To:</strong><br>
                    Wagino Subianto<br>
                    Main street, Your Loc.<br>
                    Number 06/B
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
                    <tr>
                        <td>Items Name<br><span style="color:var(--text-muted)">Lorem ipsum dolor sit amet...</span></td>
                        <td class="amount">$20.00</td>
                        <td class="amount">1</td>
                        <td class="amount">$20.00</td>
                    </tr>
                    <tr>
                        <td>Items Name<br><span style="color:var(--text-muted)">Lorem ipsum dolor sit amet...</span></td>
                        <td class="amount">$50.00</td>
                        <td class="amount">1</td>
                        <td class="amount">$50.00</td>
                    </tr>
                    <tr>
                        <td>Items Name<br><span style="color:var(--text-muted)">Lorem ipsum dolor sit amet...</span></td>
                        <td class="amount">$30.00</td>
                        <td class="amount">1</td>
                        <td class="amount">$30.00</td>
                    </tr>
                    <tr>
                        <td>Items Name<br><span style="color:var(--text-muted)">Lorem ipsum dolor sit amet...</span></td>
                        <td class="amount">$60.00</td>
                        <td class="amount">1</td>
                        <td class="amount">$60.00</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <tfoot>
                    <tr>
                        <td colspan="3">SUBTOTAL :</td>
                        <td class="amount">$160.00</td>
                    </tr>
                    <tr>
                        <td colspan="3">Tax VAT 15% :</td>
                        <td class="amount">$22.00</td>
                    </tr>
                    <tr>
                        <td colspan="3">DISCOUNT 5% :</td>
                        <td class="amount">$12.00</td>
                    </tr>
                </tfoot>
            </table>
            <div class="total-due">TOTAL DUE : $182.00</div>

            <div class="notes">
                <strong>Note:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>

            <div class="footer">
                <div>
                    <strong>Questions?</strong><br>
                    Email us : company@mail.me<br>
                    Call us : +628 123 456 789
                </div>
                <div>
                    <strong>Payment Info:</strong><br>
                    Account Name<br>
                    Bank Name<br>
                    Bank Details
                </div>
                <div>
                    <strong>Terms & Conditions:</strong><br>
                    Lorem ipsum dolor sit amet...
                </div>
            </div>
        </div>
    `
};

export default {
    invoice_01
}