'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Inventory',
  tagline: 'Multi-warehouse inventory management with AI demand forecasting, purchase orders, and real-time stock movements.',
  accent: '#059669',
  productUrl: '/inventory',
  workerUrl: 'https://echo-inventory.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Inventory is a comprehensive multi-warehouse inventory management platform with 70+ API endpoints and 15 D1 tables. Track stock levels across unlimited warehouse locations, manage the complete purchase order lifecycle from draft to partial receiving, execute inter-warehouse transfers, conduct stocktakes with automatic variance detection, and maintain a complete audit trail of every stock movement — all with sub-millisecond query performance on Cloudflare\'s edge infrastructure.',
    'The stock movement engine records every inventory transaction — receipts, sales, adjustments, transfers, and write-offs — as immutable audit trail events. Current stock levels for any SKU at any warehouse are derived from these movements via a running balance, ensuring a complete chain of custody for every unit. Movements cannot be deleted; corrections are made via counter-movements, preserving the full history.',
    'AI-powered demand forecasting (Engine Runtime) analyzes 90 days of movement history per SKU and generates daily demand predictions with confidence intervals, reorder recommendations, and safety stock calculations. Barcode and SKU lookup endpoints enable mobile warehouse operations — scan a barcode to instantly retrieve stock levels, recent movements, pending orders, and supplier lead times. Supplier management tracks vendor contacts, lead times, pricing tiers, and historical delivery performance.',
  ],

  gettingStarted: [
    { step: 1, title: 'Set Up Warehouses', desc: 'Navigate to /inventory and create your warehouse locations. Each warehouse needs a name, code (short identifier used in reports and transfers), address, and optional timezone. You can create unlimited warehouses — distribution centers, retail locations, consignment sites, and virtual storage zones are all supported.' },
    { step: 2, title: 'Add Products & SKUs', desc: 'Create your product catalog with names, SKUs, barcodes (UPC, EAN, or custom), categories, and unit of measure. Set reorder points and reorder quantities per product-warehouse combination. Products support variants (color/size/configuration), each with their own SKU and independent stock tracking.' },
    { step: 3, title: 'Set Opening Stock', desc: 'Use a stocktake or direct adjustment to set opening stock balances. Navigate to Adjustments > Opening Balance, select the warehouse, and enter current quantities per SKU. This creates the initial stock movement records that establish your baseline inventory position.' },
    { step: 4, title: 'Create Suppliers & Purchase Orders', desc: 'Add suppliers with contact details, payment terms, and default lead time. Create a purchase order for any supplier — add line items with product, quantity, and unit cost. Submit the PO to send it to the supplier and lock line item quantities. Receive against the PO when goods arrive — partial receiving is fully supported.' },
    { step: 5, title: 'Start Tracking Movements', desc: 'Use the API, barcode scanner endpoints, or the web interface to log sales, adjustments, transfers, and write-offs. Every movement updates stock levels in real time and appears in the audit trail. Set up low-stock alerts and review AI demand forecasts to automate reorder decisions.' },
  ],

  features: [
    { title: 'Multi-Warehouse Stock Tracking', desc: 'Maintain independent stock levels for each product at each warehouse location. Query stock at a specific warehouse, across all warehouses, or aggregated to a virtual "total on hand" view. Warehouse-level stock alerts fire independently so a low-stock alert at Warehouse A doesn\'t mask adequate stock at Warehouse B.' },
    { title: 'Purchase Order Lifecycle', desc: 'Full PO lifecycle management: Draft (build the order), Submitted (sent to supplier), Partially Received (some lines received), Fully Received (all lines complete), and Cancelled. Each state transition is logged with user and timestamp. Draft POs can be edited freely; submitted POs are locked for line items but allow quantity adjustments via amendment workflow.' },
    { title: 'Partial Receiving', desc: 'Receive purchase orders line by line or in partial quantities. Each receipt event specifies which PO, which line items, and how many units were physically received and inspected. Partial receipts create immediate stock movement records for the received quantities — you don\'t have to wait for full PO completion to update inventory. The PO status auto-updates to Partially Received or Fully Received based on cumulative receipts.' },
    { title: 'Inter-Warehouse Transfers', desc: 'Transfer stock between warehouses with a two-step transfer workflow: create a transfer request (deducts from source, creates in-transit record), then confirm receipt at the destination (moves from in-transit to destination stock). In-transit stock is tracked separately so you always know how much is physically at each location vs. en route.' },
    { title: 'Stocktaking with Variance Detection', desc: 'Conduct full or cycle stocktakes from the Stocktake module. Create a stocktake session for a warehouse, assign it to a counter, and record physical counts per SKU. The variance report automatically computes expected qty (from movement history) vs. counted qty, flags discrepancies above your configured variance threshold, and generates the adjustment records needed to reconcile book and physical counts.' },
    { title: 'Supplier Management', desc: 'Maintain a full supplier database with company details, contact persons, payment terms, default currency, lead time in days, and delivery performance history. Track on-time delivery rate, average lead time variance, and quality rejection rate per supplier. Supplier scorecards help you identify which vendors consistently underperform before it becomes a stockout crisis.' },
    { title: 'Barcode & SKU Lookup', desc: 'The /api/lookup endpoint accepts a barcode (UPC, EAN, QR) or SKU and returns the product details, stock levels at all warehouses, recent movement history (last 30 days), pending purchase order quantities, and the AI-generated reorder recommendation. Designed for warehouse mobile apps — single API call, all data needed for a picking or receiving decision.' },
    { title: 'Stock Movements Audit Trail', desc: 'Every inventory change is recorded as an immutable movement record with: movement type (receipt, sale, adjustment, transfer_out, transfer_in, write_off, return, opening), warehouse, product, SKU, quantity delta, running balance after the movement, reference document (PO number, order ID, transfer ID), and user ID. Movements are append-only — corrections require counter-movements.' },
    { title: 'AI Demand Forecasting', desc: 'Engine Runtime analyzes 90 days of outbound movement history per SKU-warehouse combination to generate demand forecasts. The forecast returns daily predicted demand for the next 30 days, a reorder point recommendation (safety stock + average lead time demand), reorder quantity recommendation (economic order quantity calculation), and a confidence score based on demand pattern regularity.' },
    { title: 'Low-Stock Alerts', desc: 'Configure reorder point thresholds per product per warehouse. When stock falls to or below the reorder point, an alert fires via webhook, email, or both. Alerts include the current stock level, reorder point, average daily demand, and a link to create a purchase order with pre-filled line items. Alert rules support cooldown periods to prevent alert spam during rapid stock fluctuations.' },
    { title: 'Inventory Valuation', desc: 'Track inventory value using FIFO (First In, First Out), LIFO (Last In, First Out), or Weighted Average Cost methods — configurable per product category. The valuation report shows total inventory value by warehouse and by product, cost-of-goods-sold for any date range, and gross margin by SKU when sales price data is provided.' },
    { title: 'Serialized & Lot Tracking', desc: 'Enable serial number tracking for high-value items — every unit gets a unique serial number tied to its movement history from receipt to sale. Lot tracking groups units by production batch or expiry date, enabling FEFO (First Expired, First Out) picking logic and targeted product recalls. Serial and lot lookups trace any unit to its origin PO and current location.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/products', desc: 'List all products with SKU, barcode, category, unit_of_measure, and aggregate stock levels across all warehouses. Supports filtering by category, low-stock status, and search by name or SKU.', auth: true },
    { method: 'POST', path: '/api/products', desc: 'Create a product with name, sku, barcode, category, unit_of_measure, reorder_point, reorder_qty, and optional cost and pricing data. SKU must be unique. Returns created product with ID.', auth: true },
    { method: 'GET', path: '/api/stock/:warehouse_id', desc: 'Get current stock levels for all products at a specific warehouse. Returns product ID, SKU, quantity_on_hand, quantity_reserved, quantity_available, and reorder_point status flag.', auth: true },
    { method: 'POST', path: '/api/movements', desc: 'Record a stock movement. Body includes movement_type, warehouse_id, product_id, quantity (positive or negative delta), reference, and optional notes. Validates against negative stock depending on warehouse settings.', auth: true },
    { method: 'POST', path: '/api/purchase-orders', desc: 'Create a purchase order with supplier_id, expected_delivery_date, and a line_items array of {product_id, quantity, unit_cost}. Returns PO with auto-assigned PO number in format PO-YYYY-NNNN.', auth: true },
    { method: 'POST', path: '/api/purchase-orders/:id/receive', desc: 'Record a receipt against a PO. Body is an array of {line_item_id, received_qty, warehouse_id}. Creates stock movement records for received quantities and updates PO line item receipt totals and PO status.', auth: true },
    { method: 'POST', path: '/api/transfers', desc: 'Create an inter-warehouse transfer. Specify source_warehouse_id, destination_warehouse_id, and items array. Deducts from source immediately and creates in_transit records. Returns transfer ID for confirmation.', auth: true },
    { method: 'POST', path: '/api/transfers/:id/confirm', desc: 'Confirm receipt of a transfer at the destination warehouse. Converts in_transit quantities to on_hand at destination. Creates movement records for both the out and in events.', auth: true },
    { method: 'GET', path: '/api/lookup', desc: 'Barcode and SKU lookup endpoint. Accepts barcode or sku query param. Returns product details, all-warehouse stock summary, last 30 movement events, pending PO quantities, and AI reorder recommendation.', auth: true },
    { method: 'GET', path: '/api/movements', desc: 'Query the stock movement audit trail with filters for warehouse, product, movement_type, date range, reference, and user. Supports pagination. Returns chronological movement log with running balances.', auth: true },
    { method: 'POST', path: '/api/stocktakes', desc: 'Create a stocktake session for a warehouse. Specify warehouse_id and optional scope (full or cycle with product_ids list). Returns stocktake session ID for recording counts.', auth: true },
    { method: 'POST', path: '/api/ai/forecast', desc: 'Request AI demand forecast for a product-warehouse pair. Analyzes 90-day movement history and returns 30-day daily demand predictions, reorder point recommendation, reorder quantity, and confidence score.', auth: true },
    { method: 'GET', path: '/api/reports/valuation', desc: 'Returns inventory valuation report with total value by warehouse and by product using the configured costing method (FIFO, LIFO, or weighted average). Accepts as_of_date for point-in-time valuation.', auth: true },
  ],

  userGuide: [
    {
      id: 'stock-movements',
      title: 'Stock Movements & Audit Trail',
      content: [
        'Every inventory change flows through the stock movement engine. Movement types and when they\'re used: receipt — goods received from a supplier against a PO; sale — units allocated to a customer order; adjustment — manual corrections for discovered discrepancies; transfer_out and transfer_in — inter-warehouse movements; write_off — units damaged, expired, or lost; return — units returned from a customer; opening — initial balance at warehouse setup.',
        'Movements are strictly append-only. If you receive 100 units but later discover only 98 were actually received, create an adjustment movement of -2 against the same warehouse and product. The audit trail shows both the original receipt of 100 and the correction of -2, giving auditors a complete picture of every inventory event. This immutable history is critical for GAAP compliance and shrinkage investigation.',
        'The Movement Audit Log is searchable and filterable by any combination of warehouse, product, movement type, date range, and reference document. Export the full audit log to CSV for import into accounting software. The reference field links each movement to its source document — PO number for receipts, order number for sales — enabling full reconciliation between inventory records and financial records.',
      ],
    },
    {
      id: 'purchase-orders',
      title: 'Purchase Orders',
      content: [
        'Create purchase orders from Procurement > New PO. Select a supplier (their default lead time and payment terms auto-populate), set the expected delivery date, and add line items by searching the product catalog. Each line item specifies the product, quantity ordered, and agreed unit cost. The PO total is calculated as you add lines.',
        'Submit the PO to lock the line items and send a PDF copy to the supplier via email. Submitted POs show in the supplier\'s portal if supplier portal access is enabled. From submission, the PO moves through three receiving states: Open (nothing received), Partially Received (some lines or quantities received), and Fully Received (all quantities received on all lines).',
        'Record receipts against a PO from the PO detail view > Receive Goods. Select the line items being received in this delivery, enter the quantities physically received and inspected, and choose the destination warehouse. Partial delivery is the norm in practice — record what arrived today, and the remaining undelivered quantities stay as open PO commitments visible in the Procurement dashboard.',
      ],
    },
    {
      id: 'stocktaking',
      title: 'Stocktaking & Variance',
      content: [
        'Run a full stocktake to count every SKU at a warehouse, or a cycle count to count a rotating subset of SKUs daily (high-value or high-velocity items more frequently). Create a stocktake session from Stocktake > New Session. For cycle counts, define which products are in scope.',
        'The stocktake worksheet lists every product with its system-expected quantity (derived from movement history). Counters record the physical count quantity per SKU. The worksheet is designed for use on mobile devices with the barcode scanner — scan a barcode to jump to the correct product row and enter the physical count. Multi-counter stocktakes assign different product ranges to different counters and merge counts in the reconciliation step.',
        'After all counts are entered, review the variance report: products where counted quantity differs from expected quantity by more than your variance threshold are flagged. Review each variance — investigate shrinkage causes, receiving errors, or system entry mistakes — and approve or reject each variance. Approved variances generate adjustment movements that reconcile book inventory to physical inventory.',
      ],
    },
    {
      id: 'demand-forecasting',
      title: 'AI Demand Forecasting',
      content: [
        'The demand forecast engine analyzes outbound stock movements (sales, transfers out, write-offs) for the past 90 days per SKU-warehouse combination. It computes daily demand averages, applies trend and seasonality decomposition, and generates a 30-day forward forecast with a daily prediction and 80% confidence interval band.',
        'The forecast is used to calculate two key reorder metrics. Reorder Point: the stock level at which you should place a new order so that inventory does not run out during the supplier\'s lead time, accounting for safety stock (calculated as Z × standard deviation of demand × square root of lead time). Reorder Quantity: the economic order quantity that minimizes the sum of ordering costs and holding costs given your order cost, holding cost percentage, and annual demand estimate.',
        'Access forecasts from any product\'s detail page or via the /api/ai/forecast endpoint. The forecast dashboard shows all products sorted by days-of-supply remaining (current stock / average daily demand). Products with fewer than 14 days of supply at the forecast demand rate are highlighted in amber; fewer than 7 days in red. Use the Reorder Report to bulk-create purchase orders for all flagged products in a single workflow.',
      ],
    },
    {
      id: 'serial-lot-tracking',
      title: 'Serialized & Lot Tracking',
      content: [
        'Enable serial tracking for a product in Product Settings > Tracking Mode. Once enabled, every receipt requires a serial number entry per unit — you cannot receive 10 units of a serialized product without entering 10 serial numbers. Serial numbers are validated for uniqueness within the product and warehouse scope.',
        'Lot tracking is enabled similarly but groups multiple units under a single lot number (production batch, expiry date batch, or delivery batch). Enter the lot number and expiry date when receiving. The system tracks quantity available per lot and enforces FEFO picking (earliest expiry lot is depleted first) when FEFO mode is enabled for the product category.',
        'The serial/lot lookup view lets you trace any serial number or lot from first receipt to current location. Enter the identifier and see: which PO it arrived on, which warehouse it\'s currently in, if it\'s been transferred (with full transfer chain), if it\'s been sold (with order reference), or if it\'s been written off. This complete chain of custody is essential for regulated industries and product recall scenarios.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Demand Forecasting (90-Day History)', desc: 'Analyzes 90 days of outbound movement history per SKU-warehouse pair using time-series decomposition to separate trend, seasonality, and residual components. Generates 30-day forward daily demand predictions with 80% confidence intervals. Accuracy metrics (MAPE, RMSE) are reported alongside each forecast so you can trust — or recalibrate — the model\'s predictions for each product.' },
    { capability: 'Reorder Point & EOQ Calculation', desc: 'Computes safety stock using demand variability and supplier lead time from movement history. Calculates economic order quantity (EOQ) from your configured order cost and holding cost percentage. Outputs specific reorder point and reorder quantity recommendations per SKU-warehouse pair, updated each time the forecast job runs.' },
    { capability: 'Anomaly Detection in Movements', desc: 'Identifies statistically unusual stock movements: quantities significantly above or below historical norms, movements at unusual times (e.g., sales recorded outside business hours), and patterns suggesting data entry errors (identical duplicate movements, round-number adjustments indicating manual corrections). Flags are shown in the audit trail and in a dedicated Anomalies review queue.' },
    { capability: 'Supplier Performance Scoring', desc: 'Automatically tracks and scores supplier delivery performance: on-time delivery rate, average days early/late vs. promised date, quantity accuracy (received vs. ordered), and quality rejection rate from return movements linked to received POs. Generates a composite supplier score and trend chart used to inform procurement decisions and contract negotiations.' },
    { capability: 'Shrinkage Analysis', desc: 'Analyzes write-off and adjustment movements to identify shrinkage patterns: products with above-average shrinkage rates, warehouse locations with unexplained losses, and time-of-day patterns in adjustment events. Shrinkage reports segregate known losses (damaged, expired) from unknown losses (potential theft, system errors) to focus investigation efforts.' },
    { capability: 'Stockout Prediction', desc: 'Runs nightly across all active product-warehouse combinations to identify SKUs at risk of stockout within the next 14 days based on current stock, average daily demand, and any pending purchase order receipts. Results are pushed to the Reorder Dashboard as a prioritized list — each item shows days-to-stockout, recommended order quantity, and the best supplier to order from based on lead time and performance score.' },
  ],

  troubleshooting: [
    { issue: 'Stock level showing negative', solution: 'Negative stock occurs when outbound movements exceed recorded receipts. This typically happens from missing receipt records rather than actual negative inventory. Run the Stock Movement Audit for the affected SKU-warehouse to find where the imbalance started — look for sales or adjustment movements without corresponding receipts. Create a corrective receipt movement with the correct quantity to restore the balance. If negative stock is operationally impossible for your workflows, enable the "Prevent Negative Stock" warehouse setting, which blocks movement submissions that would drive any SKU below zero.' },
    { issue: 'Purchase order stuck in Partially Received status', solution: 'A PO remains Partially Received until all line items have received_qty equal to ordered_qty. View the PO detail to see which line items have open quantities. If a partial delivery is final (supplier cannot deliver remaining units), use the PO Actions > Close with Variances option to mark undelivered quantities as cancelled and advance the PO to Closed status. This creates no stock movements — it only clears the open commitment.' },
    { issue: 'Demand forecast returning "insufficient data" for a product', solution: 'The forecast engine requires a minimum of 30 days of outbound movement history with at least 10 movement events to generate a meaningful prediction. Products that are new, rarely sold, or recently added to a warehouse will not have sufficient history. For products below the threshold, the forecast endpoint returns a simple moving average of available data with a low_confidence flag. Seasonal products may also require at least one full seasonal cycle (365 days) for accurate seasonality modeling.' },
    { issue: 'Barcode lookup returning 404', solution: 'Verify the barcode is registered in the product catalog — search for the product by name or SKU and check the barcode field. Barcode lookups are exact match on the stored barcode value. Common issues: leading zeros stripped during import (EAN-13 codes must have all 13 digits), spaces or hyphens in the stored value vs. the scanned value, or UPC-A vs. UPC-E format differences. Use the /api/products?barcode=SCAN query to test exact matching.' },
  ],

  faq: [
    { q: 'How many warehouses can I manage?', a: 'There is no limit on warehouse count. Echo Inventory is designed for organizations with dozens of locations — distribution centers, retail stores, consignment warehouses, and virtual storage zones can all be tracked. Each warehouse operates independently for stock levels, alerts, and purchase order receiving while sharing the same product catalog.' },
    { q: 'Can I connect Echo Inventory to my ecommerce platform?', a: 'Yes. Use the stock movement API to push sales from Shopify, WooCommerce, or any platform via webhook. When an order ships, post a sale movement to deduct from the fulfillment warehouse. The /api/lookup endpoint is optimized for fulfillment workflows — scan a barcode to confirm available stock before picking. Pre-built connector workers are available for Shopify and WooCommerce in the Echo Marketplace.' },
    { q: 'How does partial receiving work for purchase orders?', a: 'When goods arrive, navigate to the PO detail and click "Receive Goods." Select only the line items physically present in this delivery and enter the quantity received for each. The system creates stock movements for the received quantities immediately, updates each line item\'s received_qty, and sets the PO status to Partially Received if any quantities remain outstanding. Repeat the receiving step for each subsequent delivery until all lines are fully received.' },
    { q: 'What is the difference between stocktake and cycle count?', a: 'A full stocktake counts every SKU in a warehouse on the same day — disruptive but comprehensive. A cycle count is a continuous program that counts a rotating subset of SKUs each day, completing a full warehouse count over weeks or months without shutting down operations. Cycle count scope is typically driven by ABC analysis: A items (high value/velocity) counted monthly, B items quarterly, C items annually.' },
    { q: 'How accurate is the AI demand forecast?', a: 'Forecast accuracy depends on demand pattern regularity. Products with stable, regular demand typically achieve 85-92% accuracy (measured by MAPE — Mean Absolute Percentage Error). Highly volatile or seasonal products have lower accuracy until at least 90-180 days of history is available. The forecast API returns a confidence_score (0-100) and MAPE estimate with each prediction so you know how much to trust each SKU\'s forecast. Manual override is always available — set a manual_demand_override on any product to bypass the AI prediction.' },
    { q: 'Is the stock movement audit trail tamper-proof?', a: 'Movements are stored as append-only records with database-level constraints preventing updates or deletes. Each movement record includes the creating user ID, timestamp, and a sequential movement ID that makes gaps detectable. For regulated industries requiring certified audit trails, the movement log can be exported and cryptographically hashed at regular intervals with hashes stored in a separate immutable log for integrity verification.' },
  ],
}

export default function EchoInventoryDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/inventory' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
