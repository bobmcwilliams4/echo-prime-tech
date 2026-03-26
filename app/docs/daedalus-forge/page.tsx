'use client'

import ProductDoc from '@/components/ProductDoc'

export default function DaedalusForgeDocsPage() {
  return (
    <ProductDoc
      name="Daedalus Forge"
      tagline="AI-powered manufacturing intelligence — production planning, quality control, predictive maintenance, and supply chain optimization."
      accent="#d97706"
      productUrl="/daedalus-forge"
      workerUrl="https://daedalus-forge.bmcii1976.workers.dev"
      version="1.0.0"
      overview={[
        'Daedalus Forge is an AI manufacturing intelligence platform that transforms production operations with predictive analytics, automated quality control, and intelligent supply chain optimization. Named after the legendary Greek craftsman, it brings AI precision to modern manufacturing.',
        'The platform monitors production lines in real-time, predicts equipment failures before they happen, optimizes material usage to reduce waste, and generates work orders based on demand forecasts. Integration with IoT sensors, ERP systems, and supplier APIs creates a unified manufacturing dashboard.',
        'From single-facility workshops to multi-plant enterprises, Daedalus Forge scales to any manufacturing operation. It supports discrete manufacturing, process manufacturing, job shop, and make-to-order production models with industry-specific optimization templates.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Configure Your Facility', desc: 'Set up your manufacturing facility profile: production lines, equipment inventory, shift schedules, and capacity specifications.' },
        { step: 2, title: 'Connect Data Sources', desc: 'Integrate IoT sensors, PLC systems, ERP software, and supplier APIs. Daedalus supports Modbus, OPC UA, MQTT, and REST API connections.' },
        { step: 3, title: 'Define Products & BOMs', desc: 'Enter your product catalog with bills of materials, routing steps, quality specs, and standard cycle times. Import from CSV or ERP export.' },
        { step: 4, title: 'Enable Monitoring', desc: 'Activate real-time production monitoring. Dashboards show OEE, throughput, defect rates, and equipment health across all lines.' },
        { step: 5, title: 'Schedule Production', desc: 'Use the AI scheduler to generate optimal production plans. Drag-and-drop Gantt charts with automatic constraint resolution and material availability checks.' },
      ]}
      features={[
        { title: 'Production Planning', desc: 'AI-optimized production scheduling considering machine capacity, material availability, labor shifts, due dates, and changeover times. Automatic re-scheduling when disruptions occur.' },
        { title: 'Quality Control', desc: 'Statistical process control (SPC) charts with automatic out-of-control detection. AI vision for defect inspection. Quality gate management with hold/release workflows.' },
        { title: 'Predictive Maintenance', desc: 'Machine learning models predict equipment failures 2-4 weeks in advance. Maintenance schedules generated automatically. Reduces unplanned downtime by 60%.' },
        { title: 'Supply Chain Optimization', desc: 'Dynamic reorder point calculation, lead time forecasting, and multi-supplier sourcing optimization. Safety stock levels adjust automatically based on demand variability.' },
        { title: 'Work Order Management', desc: 'Create, assign, and track work orders from job creation to completion. Mobile-friendly shop floor interface for operators. Real-time status updates.' },
        { title: 'Equipment Monitoring', desc: 'Real-time OEE (Overall Equipment Effectiveness) tracking. Availability, performance, and quality metrics per machine. Downtime categorization and Pareto analysis.' },
        { title: 'Defect Detection', desc: 'AI-powered visual inspection using computer vision. Detect surface defects, dimensional deviations, and assembly errors. 99.2% detection accuracy.' },
        { title: 'Cost Analysis', desc: 'Activity-based costing for every product and order. Material, labor, overhead, and scrap costs calculated in real-time. Margin analysis by product line.' },
        { title: 'Compliance Tracking', desc: 'ISO 9001, AS9100, IATF 16949 compliance templates. Audit trail for every production step. Document control with version management and approval workflows.' },
        { title: 'Capacity Planning', desc: 'Long-range capacity planning with what-if scenario modeling. Identify bottlenecks, plan capital equipment purchases, and simulate production expansion.' },
      ]}
      apiEndpoints={[
        { method: 'POST', path: '/api/work-orders', desc: 'Create a new work order with product, quantity, due date, and priority. Returns order ID and scheduled start time.', auth: true },
        { method: 'GET', path: '/api/production/status', desc: 'Get real-time production status: active orders, line utilization, defect rates, and throughput.' },
        { method: 'GET', path: '/api/equipment/:id/health', desc: 'Get equipment health score, maintenance predictions, and OEE metrics for a specific machine.', auth: true },
        { method: 'POST', path: '/api/quality/inspect', desc: 'Submit an inspection result (pass/fail) with measurements and defect codes. Triggers SPC chart updates.', auth: true },
        { method: 'GET', path: '/api/inventory/materials', desc: 'Current material inventory levels, reorder alerts, and incoming PO status.', auth: true },
        { method: 'POST', path: '/api/schedule/optimize', desc: 'Run the AI scheduler to generate an optimized production plan for a date range. Considers all constraints.', auth: true },
        { method: 'GET', path: '/api/analytics/oee', desc: 'OEE analytics: availability, performance, quality rates by line, shift, or date range.' },
        { method: 'GET', path: '/health', desc: 'Health check endpoint. Returns service status and connected sensor count.' },
      ]}
      userGuide={[
        { id: 'scheduling', title: 'Production Scheduling', content: [
          'The AI scheduler considers machine capacity, tool availability, material stock, labor shifts, and customer due dates when generating production plans. It minimizes changeover time and maximizes throughput.',
          'To schedule production, navigate to Planning > Schedule and select a date range. Click "Optimize" to generate an AI-optimized plan. The Gantt chart shows job assignments by machine with color-coded status.',
          'When disruptions occur (machine breakdown, rush order, material delay), click "Re-schedule" to generate an updated plan that preserves existing commitments while accommodating the change.',
        ]},
        { id: 'quality', title: 'Quality Management', content: [
          'Quality gates are checkpoints in the production process where inspections must pass before work continues. Configure gates per product in Product Settings > Quality > Gates.',
          'SPC charts update automatically as inspection data is recorded. Control limits are calculated statistically. When a measurement falls outside limits, the system creates a quality hold and notifies the quality manager.',
          'For AI visual inspection, mount cameras at inspection stations and configure the defect detection model. The system trains on your specific products — upload 50+ images of good parts and 20+ images of each defect type.',
        ]},
        { id: 'maintenance', title: 'Predictive Maintenance', content: [
          'Predictive maintenance requires sensor data from equipment: vibration, temperature, current draw, pressure, or cycle count. Connect sensors via the IoT gateway and map them to equipment profiles.',
          'The ML model trains on historical data to establish normal operating patterns. After 2-4 weeks of data collection, the model begins predicting failures. Predictions include estimated time to failure and recommended maintenance action.',
          'Maintenance work orders are generated automatically when prediction confidence exceeds the threshold (default 80%). Technicians receive mobile notifications with equipment location, predicted failure mode, and required parts.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'Production Optimization', desc: 'Constraint-based scheduling algorithm considers 12+ variables simultaneously. Reduces setup time by 30% and increases throughput by 15-25% compared to manual scheduling.' },
        { capability: 'Failure Prediction', desc: 'Time-series ML models analyze sensor data patterns. Predicts bearing failures, motor degradation, seal leaks, and electrical faults with 85%+ accuracy 2-4 weeks in advance.' },
        { capability: 'Defect Classification', desc: 'Computer vision classifies defects into 50+ categories with 99.2% accuracy. Supports surface defects, dimensional errors, color variations, and assembly mistakes.' },
        { capability: 'Demand Forecasting', desc: 'AI forecasts demand using historical orders, seasonal patterns, and market indicators. Forecasts drive material procurement and capacity planning decisions.' },
        { capability: 'Root Cause Analysis', desc: 'When defect rates spike, AI correlates with machine parameters, material lots, operator shifts, and environmental factors to identify the most likely root cause.' },
      ]}
      troubleshooting={[
        { issue: 'Sensor data not appearing in dashboard', solution: 'Check IoT gateway connectivity. Verify the sensor is mapped to an equipment profile in Settings > Equipment > Sensors. Test the data feed by clicking "Diagnostics" on the sensor row.' },
        { issue: 'AI scheduler produces infeasible plan', solution: 'The scheduler cannot plan when capacity is insufficient for demand within the date range. Increase available shifts, extend the planning horizon, or prioritize orders to determine which can slip.' },
        { issue: 'Predictive maintenance not generating alerts', solution: 'The ML model requires 2-4 weeks of sensor data before predictions begin. Check that sensors are transmitting continuously. Models retrain weekly — new equipment may need a full cycle.' },
      ]}
      faq={[
        { q: 'What IoT protocols are supported?', a: 'Modbus TCP/RTU, OPC UA, MQTT, HTTP/REST, and direct database connections (PostgreSQL, MySQL). Custom protocols supported via the gateway SDK on Enterprise plans.' },
        { q: 'Can it integrate with our existing ERP?', a: 'Yes. Pre-built connectors for SAP, Oracle, Microsoft Dynamics, NetSuite, and Epicor. REST API for custom ERP integration. Bi-directional sync for orders, inventory, and BOMs.' },
        { q: 'How many machines can it monitor?', a: 'Starter: 10 machines. Professional: 100 machines. Enterprise: unlimited. Each machine can have up to 50 sensors monitored simultaneously.' },
        { q: 'Is shop floor data stored securely?', a: 'All data encrypted at rest (AES-256) and in transit (TLS 1.3). Data residency options available on Enterprise. SOC 2 Type II certified. No data shared between tenants.' },
        { q: 'Does it work for job shops with custom orders?', a: 'Yes. The scheduler supports make-to-order, job shop, and engineer-to-order workflows. Each work order can have unique routing, BOM, and quality requirements.' },
      ]}
    />
  )
}
