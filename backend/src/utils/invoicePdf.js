import PDFDocument from "pdfkit";

export const generateInvoicePdf = (order) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    /* ================= HEADER ================= */
    doc
      .rect(0, 0, doc.page.width, 90)
      .fill("#1F2937"); // dark premium slate

    // Company name
    doc
      .fillColor("#FBBF24") // gold
      .fontSize(26)
      .font("Helvetica-Bold")
      .text("GiftWallah365", 40, 28);

    doc
      .fillColor("white")
      .fontSize(12)
      .font("Helvetica")
      .text("Premium Gifting Experience", 42, 60);

    doc.moveDown(4);
    doc.fillColor("#111827");

    /* ================= ORDER META ================= */
    doc
      .fontSize(11)
      .text(`Invoice ID: ${order._id}`);
    doc.text(
      `Order Date: ${new Date(order.createdAt).toLocaleDateString()}`
    );
    doc.text(`Payment Status: PAID`);
    doc.moveDown(1.5);

    /* ================= ADDRESS CARD ================= */
    const addressTop = doc.y;

    doc
      .roundedRect(40, addressTop, 520, 100, 12)
      .fill("#F9FAFB");

    doc
      .fillColor("#111827")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Billing Address", 55, addressTop + 12);

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#374151")
      .text(
        `${order.address.fullName}
${order.address.addressLine}
${order.address.city}, ${order.address.state} - ${order.address.pincode}
Phone: ${order.address.phone}`,
        55,
        addressTop + 36
      );

    doc.moveDown(6);

    /* ================= ITEMS HEADER ================= */
    doc
      .fontSize(15)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("Order Items");

    doc.moveDown(0.5);

    // Table header line
    doc
      .strokeColor("#E5E7EB")
      .lineWidth(1)
      .moveTo(40, doc.y)
      .lineTo(560, doc.y)
      .stroke();

    doc.moveDown(0.8);

    /* ================= ITEMS ================= */
    order.items.forEach((item) => {
      const rowTop = doc.y;

      doc
        .roundedRect(40, rowTop, 520, 46, 10)
        .fill("#FFFFFF")
        .stroke("#E5E7EB");

      doc
        .fillColor("#111827")
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(item.product.title, 55, rowTop + 15, {
          width: 260,
        });

      doc
        .font("Helvetica")
        .fillColor("#374151")
        .text(`Qty: ${item.quantity}`, 350, rowTop + 15);

      doc
        .font("Helvetica-Bold")
        .fillColor("#111827")
        .text(
          `₹${item.price * item.quantity}`,
          460,
          rowTop + 15
        );

      doc.moveDown(3);
    });

    /* ================= TOTAL SUMMARY ================= */
    doc.moveDown(1);

    const totalTop = doc.y;

    doc
      .roundedRect(320, totalTop, 240, 60, 14)
      .fill("#1F2937");

    doc
      .fillColor("#D1D5DB")
      .fontSize(11)
      .font("Helvetica")
      .text("Total Amount", 340, totalTop + 14);

    doc
      .fillColor("#FBBF24")
      .fontSize(18)
      .font("Helvetica-Bold")
      .text(`₹${order.totalAmount}`, 340, totalTop + 32);

    /* ================= FOOTER ================= */
    doc.moveDown(5);

    doc
      .strokeColor("#E5E7EB")
      .lineWidth(1)
      .moveTo(40, doc.y)
      .lineTo(560, doc.y)
      .stroke();

    doc.moveDown(1);

    doc
      .fontSize(10)
      .fillColor("#6B7280")
      .text(
        "Thank you for shopping with GiftWallah365.\nFor support: support@giftwallah365.com",
        {
          align: "center",
        }
      );

    doc.end();
  });
};
