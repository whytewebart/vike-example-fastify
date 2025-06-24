// components/index.ts
// eventListeners?: EventListeners = [
//     ...this.componentListeners,
//     ...this.canvasListeners,
//     ...this.baseEventListeners,
//     [this, 'dragover', (e: DragEvent) => {
//         // Stop the event from reaching root-canvas
//         e.stopPropagation();
//         const canvas = this.dropzone.methods.canvas(e);
//         if (!canvas) return;

//         if (e.dataTransfer?.types.includes('text/plain')) {
//             e.preventDefault();
//             this.dropzone.methods.dragover(canvas, e.clientY)
//         }
//     }],
//     [this, 'dragleave', (e: DragEvent) => {
//         // Stop the event from reaching root-canvas
//         e.stopPropagation();
//         const canvas = this.dropzone.methods.canvas(e);
//         if (canvas) this.dropzone.methods.resetDropHighilght(canvas)
//     }],
//     [this, 'drop', (e: DragEvent) => {
//         const canvas = this.dropzone.methods.canvas(e);
//         if (!canvas) return;

//         e.stopPropagation();

//         this.dropzone.methods.resetDropHighilght(canvas)
//         this.dropzone.methods.drop(canvas, e)
//     }]
// ]