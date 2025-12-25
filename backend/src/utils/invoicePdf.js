import PDFDocument from "pdfkit";

export const generateInvoicePdf = (order) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    /* ===== HEADER BAR ===== */
    doc
      .rect(0, 0, doc.page.width, 80)
      .fill("#4B2C5E");

    doc
      .fillColor("white")
      .fontSize(22)
      .text("GiftWallah Invoice", 40, 30);

    doc.moveDown(3);
    doc.fillColor("black");

    /* ===== ORDER INFO ===== */
    doc.fontSize(11).text(`Order ID: ${order._id}`);
    doc.text(`Order Date: ${new Date(order.createdAt).toDateString()}`);
    doc.moveDown();

    /* ===== ADDRESS CARD ===== */
    doc
      .roundedRect(40, doc.y, 520, 90, 10)
      .fill("#F5F0FA");

    doc.fillColor("black").fontSize(13).text("Billing Address", 50, doc.y + 10);

    doc.fontSize(11).text(
      `${order.address.fullName}
${order.address.addressLine}
${order.address.city}, ${order.address.state} - ${order.address.pincode}
Phone: ${order.address.phone}`,
      50,
      doc.y + 30
    );

    doc.moveDown(7);

    /* ===== ITEMS TABLE ===== */
    doc.fontSize(14).text("Order Items", { underline: true });
    doc.moveDown(0.5);

    order.items.forEach((item) => {
      doc
        .roundedRect(40, doc.y, 520, 40, 8)
        .fill("#FFFFFF")
        .stroke("#E5E7EB");

      doc
        .fillColor("black")
        .fontSize(11)
        .text(item.product.title, 50, doc.y + 12);

      doc.text(
        `Qty: ${item.quantity}`,
        360,
        doc.y + 12
      );

      doc.text(
        `₹${item.price * item.quantity}`,
        470,
        doc.y + 12
      );

      doc.moveDown(3);
    });

    /* ===== TOTAL ===== */
    doc
      .roundedRect(360, doc.y + 10, 200, 40, 10)
      .fill("#4B2C5E");

    doc
      .fillColor("white")
      .fontSize(14)
      .text(
        `Total: ₹${order.totalAmount}`,
        380,
        doc.y + 22
      );

    doc.end();
  });
};
