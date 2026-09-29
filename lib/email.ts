import { Resend } from "resend";

interface OrderItemSummary {
  name: string;
  quantity: number;
  price: number;
  variant?: string | null;
}

export interface SendOrderEmailsParams {
  orderNumber: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  deliveryType: "DELIVERY" | "PICKUP";
  deliveryAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    pincode?: string;
  } | null;
  items: OrderItemSummary[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "RAZORPAY" | "PAY_ON_DELIVERY";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderDate?: string;
  customerNotes?: string | null;
}

export function getFromEmail(): string {
  const envFrom = process.env.RESEND_FROM_EMAIL?.trim();
  if (envFrom && envFrom.length > 0) {
    return envFrom;
  }
  return "onboarding@resend.dev";
}

export function getAdminNotifyEmail(): string {
  return (
    process.env.ADMIN_NOTIFY_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    "admin@example.com"
  );
}

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (
    !apiKey ||
    apiKey.startsWith("re_your_") ||
    apiKey === "your_resend_api_key" ||
    apiKey === "re_placeholder"
  ) {
    return null;
  }
  try {
    return new Resend(apiKey);
  } catch (err) {
    console.warn("[Email Init] Could not instantiate Resend client:", err);
    return null;
  }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Generate formatted HTML for customer confirmation email
 */
function renderCustomerEmailHtml(order: SendOrderEmailsParams): string {
  const isPickup = order.deliveryType === "PICKUP";
  const confirmationUrl = `${siteUrl}/order/${encodeURIComponent(order.orderNumber)}/confirmation`;
  const isPaid = order.paymentStatus === "PAID";

  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #ECE2D2; color: #2B2420; font-size: 14px;">
          <strong>${item.name}</strong>
          ${item.variant ? `<br><span style="font-size: 12px; color: #78716C;">Variant: ${item.variant}</span>` : ""}
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #ECE2D2; color: #78716C; font-size: 14px; text-align: center;">
          × ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #ECE2D2; color: #2B2420; font-size: 14px; text-align: right; font-weight: 600;">
          ₹${(item.price * item.quantity).toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Order Confirmation - The Crochet Diaryy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FBF6EF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2B2420;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FBF6EF; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #ECE2D2; box-shadow: 0 4px 16px rgba(43, 36, 32, 0.04); max-width: 600px; width: 100%;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #FAF1EA; padding: 32px 30px; text-align: center; border-bottom: 2px dashed #E5D5C5;">
              <span style="display: block; color: #D98E73; font-size: 20px; font-style: italic; font-weight: 600; margin-bottom: 4px;">
                Handcrafted with Love
              </span>
              <h1 style="margin: 0; color: #2B2420; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                The Crochet Diaryy
              </h1>
              <p style="margin: 6px 0 0 0; color: #4A5D45; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Artisan Studio
              </p>
            </td>
          </tr>

          <!-- Main Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <h2 style="margin: 0 0 12px 0; color: #2B2420; font-size: 20px; font-weight: 700;">
                Thank you for your order, ${order.customerName}! 🧶
              </h2>
              <p style="margin: 0; color: #57534E; font-size: 14px; line-height: 1.6;">
                Nitika has received your order and is getting ready to craft your pieces. Every stitch is handmade with patience, care, and attention to detail.
              </p>
            </td>
          </tr>

          <!-- Order Highlight Card -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF6EF; border: 1px solid #ECE2D2; border-radius: 14px; padding: 18px;">
                <tr>
                  <td width="50%" style="vertical-align: top;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #78716C; font-weight: 700; display: block; margin-bottom: 4px;">Order Number</span>
                    <strong style="font-size: 16px; color: #D98E73; font-family: monospace;">${order.orderNumber}</strong>
                  </td>
                  <td width="50%" style="vertical-align: top; text-align: right;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #78716C; font-weight: 700; display: block; margin-bottom: 4px;">Payment</span>
                    <span style="display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 12px; font-weight: 700; ${isPaid ? "background-color: #EBF2EA; color: #3B4D36;" : "background-color: #FEF3C7; color: #92400E;"}">
                      ${isPaid ? "PAID (Online)" : "Pay on Handover (Cash/UPI)"}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Items Table -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <h3 style="margin: 0 0 12px 0; color: #2B2420; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                Your Handmade Items
              </h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                  <tr style="border-bottom: 2px solid #ECE2D2;">
                    <th align="left" style="padding-bottom: 8px; font-size: 12px; color: #78716C; font-weight: 600;">Item</th>
                    <th align="center" style="padding-bottom: 8px; font-size: 12px; color: #78716C; font-weight: 600;">Qty</th>
                    <th align="right" style="padding-bottom: 8px; font-size: 12px; color: #78716C; font-weight: 600;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 14px;">
                <tr>
                  <td align="right" style="padding: 4px 0; font-size: 13px; color: #78716C;">Subtotal:</td>
                  <td width="100" align="right" style="padding: 4px 0; font-size: 13px; color: #2B2420; font-weight: 600;">₹${order.subtotal.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td align="right" style="padding: 4px 0; font-size: 13px; color: #78716C;">
                    ${isPickup ? "Studio Pickup:" : "Doorstep Delivery:"}
                  </td>
                  <td width="100" align="right" style="padding: 4px 0; font-size: 13px; color: #2B2420; font-weight: 600;">
                    ${order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
                  </td>
                </tr>
                <tr style="border-top: 1px solid #ECE2D2;">
                  <td align="right" style="padding: 10px 0 0 0; font-size: 16px; color: #2B2420; font-weight: 800;">Total:</td>
                  <td width="100" align="right" style="padding: 10px 0 0 0; font-size: 16px; color: #D98E73; font-weight: 800;">₹${order.total.toLocaleString("en-IN")}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fulfillment Details -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF6EF; border: 1px solid #ECE2D2; border-radius: 14px; padding: 18px;">
                <tr>
                  <td>
                    <h4 style="margin: 0 0 6px 0; color: #2B2420; font-size: 13px; font-weight: 700; text-transform: uppercase;">
                      ${isPickup ? "📍 Studio Pickup Location" : "🚚 Local Delivery Address"}
                    </h4>
                    ${
                      isPickup
                        ? `<p style="margin: 0; font-size: 13px; color: #57534E; line-height: 1.5;">
                            Nitika Tanted&apos;s Home Studio<br>
                            Station Road Area (Studio Pickup)<br>
                            <span style="font-size: 12px; color: #78716C;">(We will WhatsApp you as soon as your items are ready for pickup)</span>
                          </p>`
                        : `<p style="margin: 0; font-size: 13px; color: #57534E; line-height: 1.5;">
                            ${order.deliveryAddress?.line1 || ""}${order.deliveryAddress?.line2 ? `, ${order.deliveryAddress.line2}` : ""}<br>
                            ${order.deliveryAddress?.city || "Local Delivery"}${order.deliveryAddress?.pincode ? ` - ${order.deliveryAddress.pincode}` : ""}<br>
                            Phone: ${order.customerPhone}
                          </p>`
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Live Tracking CTA -->
          <tr>
            <td style="padding: 0 30px 32px 30px; text-align: center;">
              <a href="${confirmationUrl}" style="display: inline-block; background-color: #D98E73; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-size: 14px; font-weight: 700; letter-spacing: 0.3px;">
                Track Order Progress Online
              </a>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #78716C;">
                You can track your order status in real time anytime without logging in.
              </p>
            </td>
          </tr>

          <!-- Footer & WhatsApp -->
          <tr>
            <td style="background-color: #2B2420; padding: 24px 30px; text-align: center; color: #FAF6EF;">
              <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600;">
                Have questions or special requests?
              </p>
              <a href="https://wa.me/919770124355?text=Hi%20Nitika,%20I%20have%20a%20question%20regarding%20my%20order%20${encodeURIComponent(order.orderNumber)}" style="display: inline-block; color: #E8B4B8; text-decoration: underline; font-size: 13px; font-weight: 600;">
                Chat directly with Nitika on WhatsApp (+91 97701 24355)
              </a>
              <p style="margin: 16px 0 0 0; font-size: 11px; color: #A8A29E;">
                Instagram: @the_crochetdiaryy • Handcrafted with Love
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generate formatted HTML for admin notification email to Nitika
 */
function renderAdminEmailHtml(order: SendOrderEmailsParams): string {
  const isPickup = order.deliveryType === "PICKUP";
  const cleanPhone = (order.customerPhone || "").replace(/\D/g, "");
  const waLink = cleanPhone
    ? `https://wa.me/${cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone}?text=Hi%20${encodeURIComponent(order.customerName)},%20this%20is%20Nitika%20from%20The%20Crochet%20Diaryy%20regarding%20your%20order%20${order.orderNumber}!`
    : null;

  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #ECE2D2; color: #2B2420; font-size: 14px;">
          <strong>${item.name}</strong>
          ${item.variant ? `<br><span style="font-size: 12px; color: #78716C;">Variant: ${item.variant}</span>` : ""}
        </td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #ECE2D2; color: #78716C; font-size: 14px; text-align: center;">
          × ${item.quantity}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #ECE2D2; color: #2B2420; font-size: 14px; text-align: right; font-weight: 600;">
          ₹${(item.price * item.quantity).toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Order Alert - The Crochet Diaryy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF6EF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2B2420;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF6EF; padding: 25px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 18px; overflow: hidden; border: 1px solid #ECE2D2; box-shadow: 0 4px 16px rgba(43, 36, 32, 0.05); max-width: 600px; width: 100%;">
          
          <!-- Banner -->
          <tr>
            <td style="background-color: #FAF1EA; padding: 26px 28px; border-bottom: 2px dashed #E5D5C5;">
              <span style="display: block; color: #D98E73; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
                🧶 Founder Order Alert
              </span>
              <h1 style="margin: 0; color: #2B2420; font-size: 24px; font-weight: 800;">
                New Order Received! #${order.orderNumber}
              </h1>
              <p style="margin: 6px 0 0 0; color: #4A5D45; font-size: 14px; font-weight: 600;">
                Hi Nitika, a new customer has placed an order. Time to start stitching!
              </p>
            </td>
          </tr>

          <!-- Customer Details Box -->
          <tr>
            <td style="padding: 24px 28px 16px 28px;">
              <h3 style="margin: 0 0 12px 0; color: #78716C; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                Customer & Contact Details
              </h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF6EF; border: 1px solid #ECE2D2; border-radius: 12px; padding: 16px;">
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #57534E;">
                    <strong>Name:</strong> <span style="color: #2B2420; font-weight: 700;">${order.customerName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #57534E;">
                    <strong>Email:</strong> ${
                      order.customerEmail
                        ? `<a href="mailto:${order.customerEmail}" style="color: #D98E73; font-weight: 600; text-decoration: none;">${order.customerEmail}</a>`
                        : `<span style="color: #78716C; font-style: italic;">Not provided (Guest / WhatsApp order)</span>`
                    }
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #57534E;">
                    <strong>Phone:</strong> <a href="tel:${order.customerPhone}" style="color: #2B2420; font-weight: 600; text-decoration: none;">${order.customerPhone || "N/A"}</a>
                    ${
                      waLink
                        ? ` &nbsp;•&nbsp; <a href="${waLink}" style="color: #25D366; font-weight: 700; text-decoration: none;">💬 Chat on WhatsApp</a>`
                        : ""
                    }
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #57534E;">
                    <strong>Fulfillment:</strong> <span style="font-weight: 600;">${isPickup ? "📍 Studio Pickup at Workshop" : "🚚 Doorstep Delivery"}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #57534E;">
                    <strong>Payment:</strong> <span style="font-weight: 600;">${order.paymentMethod === "PAY_ON_DELIVERY" ? "Pay on Handover (Cash/UPI)" : "Online Payment"} (${order.paymentStatus})</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address (if local delivery) -->
          ${
            !isPickup && order.deliveryAddress
              ? `<tr>
                  <td style="padding: 0 28px 16px 28px;">
                    <h3 style="margin: 0 0 8px 0; color: #78716C; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                      Drop-off Delivery Address
                    </h3>
                    <div style="background-color: #FBF6EF; border: 1px solid #ECE2D2; border-radius: 12px; padding: 14px; font-size: 13px; color: #57534E; line-height: 1.5;">
                      ${order.deliveryAddress.line1 || ""}${order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ""}<br>
                      ${order.deliveryAddress.city || "Local Delivery"}${order.deliveryAddress.pincode ? ` - <strong>${order.deliveryAddress.pincode}</strong>` : ""}
                    </div>
                  </td>
                </tr>`
              : ""
          }

          <!-- Customer Notes / Customizations -->
          ${
            order.customerNotes
              ? `<tr>
                  <td style="padding: 0 28px 16px 28px;">
                    <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 12px; padding: 14px; font-size: 13px; color: #92400E;">
                      <strong>Special Customer Note / Custom Request:</strong><br>
                      "${order.customerNotes}"
                    </div>
                  </td>
                </tr>`
              : ""
          }

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 28px 20px 28px;">
              <h3 style="margin: 0 0 10px 0; color: #78716C; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                Items to Make / Prepare
              </h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                  <tr style="border-bottom: 2px solid #ECE2D2;">
                    <th align="left" style="padding-bottom: 8px; font-size: 12px; color: #78716C; font-weight: 600;">Product</th>
                    <th align="center" style="padding-bottom: 8px; font-size: 12px; color: #78716C; font-weight: 600;">Qty</th>
                    <th align="right" style="padding-bottom: 8px; font-size: 12px; color: #78716C; font-weight: 600;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 14px;">
                <tr>
                  <td align="right" style="padding: 4px 0; font-size: 13px; color: #78716C;">Subtotal:</td>
                  <td width="100" align="right" style="padding: 4px 0; font-size: 13px; color: #2B2420; font-weight: 600;">₹${order.subtotal.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td align="right" style="padding: 4px 0; font-size: 13px; color: #78716C;">Delivery Fee:</td>
                  <td width="100" align="right" style="padding: 4px 0; font-size: 13px; color: #2B2420; font-weight: 600;">
                    ${order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
                  </td>
                </tr>
                <tr style="border-top: 1px solid #ECE2D2;">
                  <td align="right" style="padding: 10px 0 0 0; font-size: 16px; color: #2B2420; font-weight: 800;">Total:</td>
                  <td width="100" align="right" style="padding: 10px 0 0 0; font-size: 16px; color: #D98E73; font-weight: 800;">₹${order.total.toLocaleString("en-IN")}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Buttons -->
          <tr>
            <td style="padding: 0 28px 28px 28px; text-align: center;">
              <div style="display: inline-block;">
                <a href="${siteUrl}/admin/orders" style="display: inline-block; background-color: #4A5D45; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 700; margin: 4px;">
                  Open Admin Dashboard
                </a>
                ${
                  waLink
                    ? `<a href="${waLink}" style="display: inline-block; background-color: #25D366; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 700; margin: 4px;">
                        WhatsApp Customer
                      </a>`
                    : ""
                }
              </div>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: #78716C;">
                Remember to update status to "Making" when you start stitching, and "Ready" when done!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #2B2420; padding: 18px 28px; text-align: center; color: #FAF6EF; font-size: 12px;">
              The Crochet Diaryy • Handcrafted with Love
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Send order confirmation emails to customer and admin via Resend
 * Highly resilient:
 * 1. Sender configurable via RESEND_FROM_EMAIL (default onboarding@resend.dev)
 * 2. Admin recipient configurable via ADMIN_NOTIFY_EMAIL
 * 3. Catches all errors (missing key, 403 unverified domain, timeout) and logs them without crashing order placement
 * 4. Sends admin alert on every order, customer confirmation only if email provided
 */
export async function sendOrderConfirmationEmails(order: SendOrderEmailsParams): Promise<{
  customerSent: boolean;
  adminSent: boolean;
}> {
  let customerSent = false;
  let adminSent = false;

  const fromEmail = getFromEmail();
  const adminEmail = getAdminNotifyEmail();
  const resend = getResendClient();

  if (!resend) {
    console.log(
      `[Email Service] RESEND_API_KEY is not configured or is a mock key. Simulated emails for Order #${order.orderNumber}:`
    );
    console.log(
      ` - Admin Alert target: ${adminEmail || "(no admin alert email configured)"}`
    );
    console.log(
      ` - Customer Confirmation target: ${order.customerEmail || "(no customer email provided)"}`
    );
    return { customerSent: false, adminSent: false };
  }

  // 1. Send admin alert on EVERY new order (if admin email is configured)
  if (adminEmail) {
    try {
      const sendPromise = resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `🧶 [New Order to Craft] #${order.orderNumber} - ₹${order.total} by ${order.customerName}`,
        html: renderAdminEmailHtml(order),
      });

      const result = await Promise.race([
        sendPromise,
        new Promise<{ data: null; error: { message: string } }>((_, reject) =>
          setTimeout(() => reject(new Error("Admin email request timed out after 5s")), 5000)
        ),
      ]);

      if (result && "error" in result && result.error) {
        console.warn(`[Resend Error - Admin Alert #${order.orderNumber}]:`, result.error);
      } else {
        adminSent = true;
        console.log(`[Resend Success] Admin alert sent to ${adminEmail} for Order #${order.orderNumber}`);
      }
    } catch (adminError: unknown) {
      const msg = adminError instanceof Error ? adminError.message : String(adminError);
      console.warn(`[Resend Warning - Admin Alert #${order.orderNumber}]:`, msg);
    }
  } else {
    console.warn(`[Email Service] ADMIN_NOTIFY_EMAIL is not set. Skipped admin alert for Order #${order.orderNumber}.`);
  }

  // 2. Send customer confirmation ONLY IF customer gave an email
  const customerEmail = order.customerEmail?.trim();
  const hasValidCustomerEmail = Boolean(customerEmail && customerEmail.includes("@"));

  if (hasValidCustomerEmail && customerEmail) {
    try {
      const sendPromise = resend.emails.send({
        from: fromEmail,
        to: customerEmail,
        subject: `Order Confirmed! Your handcrafted crochet pieces (${order.orderNumber}) 🧶`,
        html: renderCustomerEmailHtml(order),
      });

      const result = await Promise.race([
        sendPromise,
        new Promise<{ data: null; error: { message: string } }>((_, reject) =>
          setTimeout(() => reject(new Error("Customer email request timed out after 5s")), 5000)
        ),
      ]);

      if (result && "error" in result && result.error) {
        console.warn(`[Resend Error - Customer Confirmation #${order.orderNumber} to ${customerEmail}]:`, result.error);
      } else {
        customerSent = true;
        console.log(`[Resend Success] Customer confirmation sent to ${customerEmail} for Order #${order.orderNumber}`);
      }
    } catch (custError: unknown) {
      const msg = custError instanceof Error ? custError.message : String(custError);
      console.warn(`[Resend Warning - Customer Confirmation #${order.orderNumber} to ${customerEmail}]:`, msg);
    }
  } else {
    console.log(
      `[Email Service] Order #${order.orderNumber}: No customer email provided. Skipped customer confirmation email.`
    );
  }

  return { customerSent, adminSent };
}
