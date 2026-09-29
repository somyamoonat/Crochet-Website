# 🧶 The Crochet Diaryy — Pre-Launch Manual QA Checklist

This checklist verifies the complete end-to-end functionality of **The Crochet Diaryy** before handing off the live site to founder **Nitika Tanted**.

---

## 📋 Test Scenario 1: The Full Happy Path (Online Payment via Razorpay)

| Step | Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :---: |
| **1. Browse** | Open `/shop` on mobile and desktop. Filter by category (e.g. *Amigurumi*) and toggle "Ready to Ship". | Grid filters instantly. Loading skeleton appears briefly during category transitions. | [ ] |
| **2. Product Detail** | Click a product card (e.g. *Strawberry Bunny Plushie*). Swap thumbnail images in gallery. Select a color/size variant. | Main image updates smoothly. Price delta and stock badge update based on chosen variant. Care instructions accordion expands. | [ ] |
| **3. Add to Basket** | Set quantity to `1` and click **"Add to Cart"**. | Slide-over cart drawer opens automatically from right. Item count badge increments on header basket icon. Subtotal calculates correctly. | [ ] |
| **4. Guest Checkout** | Click **"Proceed to Checkout"** (`/checkout`). Fill in: Name, 10-digit Phone, Email. Select **"Home Delivery within Ratlam"**. Enter Ratlam street address. | Flat delivery fee of **₹49** applies if subtotal < ₹799; **₹0** if subtotal ≥ ₹799. Zod inline validations highlight missing fields. | [ ] |
| **5. Razorpay Payment** | Choose **"Online Payment (Razorpay)"** &rarr; click **"Proceed to Payment"**. | Razorpay checkout modal opens. Enter Test Card: `4111 1111 1111 1111`, any future expiry, CVV `123`, and any OTP. | [ ] |
| **6. Confirmation Page** | Payment succeeds and redirects to `/order/[orderNumber]/confirmation`. | Page displays **Order Confirmed**, payment status **PAID**, breakdown of items, and customer details. Resend emails dispatched to customer and admin. | [ ] |
| **7. Admin Dashboard** | In a private window, go to `/admin` & log in as admin (`admin@thecrochetdiaryy.com`). Navigate to `/admin/orders`. | New order appears at the top with badge `CONFIRMED` and payment `PAID`. Clicking order opens full details and allows adding notes. | [ ] |
| **8. Status Update** | Admin updates status: `CONFIRMED` &rarr; `MAKING` &rarr; `READY` &rarr; `OUT_FOR_DELIVERY` &rarr; `DELIVERED`. | Status changes immediately in database. | [ ] |
| **9. Customer Tracking** | Refresh the customer confirmation page or open `/account/orders/[orderNumber]`. | Visual timeline step indicator advances to match the new status set by the admin. | [ ] |

---

## 📋 Test Scenario 2: Pay on Delivery / Studio Self-Pickup Flow

| Step | Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :---: |
| **1. Self-Pickup Choice** | At checkout, toggle delivery method to **"Self Pickup from Ratlam Studio"**. | Delivery address input fields collapse. Delivery fee becomes **₹0 (Free)**. | [ ] |
| **2. Pay on Delivery** | Select payment method **"Pay on Delivery / Pickup (Cash or UPI)"** and submit. | No Razorpay modal opens. Order is created directly with `paymentMethod: PAY_ON_DELIVERY`, `paymentStatus: PENDING`, and `status: CONFIRMED`. | [ ] |
| **3. Confirmation Notice** | Check confirmation page. | Shows "Payment: Due upon Pickup/Delivery" with cash or QR code instructions. | [ ] |

---

## 📋 Test Scenario 3: Made-to-Order Lead Time Calculation

| Step | Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :---: |
| **1. Made-to-Order Item** | Add a Made-to-Order piece (e.g. *Daisy Granny Square Tote*, 7-day lead time) to cart. | Cart displays amber badge: *"Made fresh for you • ships in 7 days"*. | [ ] |
| **2. Mixed Cart** | Add a Ready-to-Ship item (e.g. *Daisy Keychain*) to the same cart. | Checkout banner displays: *"Combined estimated dispatch in 7 days (based on longest handmade piece)"*. | [ ] |
| **3. Estimated Date** | Check confirmation page. | Shows calculated ready date (Order Date + 7 business days). | [ ] |

---

## 📋 Test Scenario 4: Low-Stock & Out-of-Stock Behavior

| Step | Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :---: |
| **1. Low Stock Badge** | Find a product with `stockQty` between 1 and 3. | Product card and detail page display amber badge: *"Only X left in stock!"*. | [ ] |
| **2. Out of Stock** | In admin (`/admin/products`), set a product's stock to `0`. | Button changes to disabled **"Out of Stock"** with gray badge. Item cannot be added to basket. | [ ] |
| **3. Admin Alert** | Open `/admin` dashboard overview. | The product appears immediately in the **"Low Stock Alerts"** card. | [ ] |

---

## 📋 Test Scenario 5: WhatsApp Direct CTAs & Mobile UX

| Step | Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :---: |
| **1. Floating Button** | Tap floating WhatsApp icon on bottom right of screen. | Opens `wa.me/919770124355` with greeting message. | [ ] |
| **2. Mobile Nav Drawer** | On viewport < 768px, tap header hamburger icon. | Slide-over drawer smoothly reveals links to Shop, Our Story, FAQ, Policies, Contact, and WhatsApp button. | [ ] |
| **3. Custom Inquiry** | On custom product without price, click **"Enquire on WhatsApp"**. | Opens WhatsApp with pre-filled message citing the product name. | [ ] |
| **4. Contact Form** | Submit form at `/contact` with valid details. | Shows green success message; email simulated or sent via Resend. | [ ] |
