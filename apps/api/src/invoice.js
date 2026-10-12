import PDFDocument from 'pdfkit';

export const generateInvoice = (order, settings) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text(settings.restaurantName || 'Restaurant', { align: 'center' });
    if (settings.gstNumber) doc.fontSize(10).text(`GSTIN: ${settings.gstNumber}`, { align: 'center' });
    if (settings.fssaiNumber) doc.fontSize(10).text(`FSSAI: ${settings.fssaiNumber}`, { align: 'center' });
    doc.moveDown();

    // Order Info
    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Customer: ${order.user.name} (${order.user.phone})`);
    doc.text(`Type: ${order.type}`);
    doc.moveDown();

    // Items
    doc.text('Items:', { underline: true });
    order.items.forEach((item) => {
      doc.text(`${item.quantity}x ${item.name} - ${(item.price * item.quantity / 100).toFixed(2)}`);
    });
    doc.moveDown();

    // Totals
    doc.text(`Subtotal: ${(order.subtotal / 100).toFixed(2)}`);
    doc.text(`GST: ${(order.gst / 100).toFixed(2)}`);
    if (order.deliveryFee > 0) doc.text(`Delivery Fee: ${(order.deliveryFee / 100).toFixed(2)}`);
    if (order.packingCharge > 0) doc.text(`Packing Charge: ${(order.packingCharge / 100).toFixed(2)}`);
    if (order.discount > 0) doc.text(`Discount: -${(order.discount / 100).toFixed(2)}`);
    doc.fontSize(14).font('Helvetica-Bold').text(`Total: ${(order.total / 100).toFixed(2)}`);

    doc.end();
  });
};