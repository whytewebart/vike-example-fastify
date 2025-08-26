import { getCurrentInstance } from 'vue';
import jsPDF from 'jspdf';

export { useInvoice }

const useInvoice = () => {
    const toast = useToast();
    const isVue = !!getCurrentInstance();

    const download = async () => {
        // @ts-ignore
        const { default: html2pdf } = await import("html-to-pdf-js");

        const template = document.querySelector<HTMLElement>("#document-to-print");
        if (!template) {
            toast.add({
                summary: "Invoice Unavailable",
                detail: 'Invoice template not found! Refresh and try again',
                severity: "error"
            });
            return;
        }

        const opt = {
            // Standard papers
            jsPDF: {
                unit: "px",
                format: [
                    // 595,
                    // 842
                    535,
                    760
                ],
                orientation: "portrait",
                // hotfixes: ["px_scaling"],
                // precision: 100
            },
            html2canvas: {
                // width: 595,
                // height: 842,
                width: 535,
                height: 760,
                scale: 10,
                // letterRendering: true,
                // dpi: 192,
            },
            // image: {
            //     type: 'jpeg',
            //     quality: 0.98
            // }
        }

        // var doc = new jsPDF();

        // doc.html(template, {
        //     callback: function (doc) {
        //         doc.save();
        //     }
        // });

        // ----------------------------------------------------------------
        html2pdf().set(opt).from(template)
            .set({ filename: `Invoice - ${new Date().toDateString()}` }).save();
    };

    return { download };
};
