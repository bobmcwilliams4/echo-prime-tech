'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'EchoCAD',
  tagline: 'AI-powered computer-aided design — parametric modeling, structural analysis, and intelligent drafting.',
  accent: '#f59e0b',
  productUrl: '/echocad',
  workerUrl: 'https://echocad.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'EchoCAD is a cloud-native computer-aided design platform that brings AI intelligence to architectural drafting, structural engineering, and construction planning. Traditional CAD software requires years of training and runs on expensive desktop workstations. EchoCAD runs in your browser, generates floor plans and structural layouts from natural language descriptions, and produces construction-ready DXF/DWG files that any fabricator or contractor can use directly.',
    'The AI engine understands building codes, structural load requirements, material properties, and construction best practices. Describe what you need — "a 2,400 square foot ranch-style home with 3 bedrooms, 2 bathrooms, attached 2-car garage, and open-concept kitchen-living area" — and EchoCAD generates a complete floor plan with proper dimensions, wall thicknesses, door and window placements, electrical rough-in locations, and plumbing stack positions. Every generated design is parametric, meaning you can adjust any dimension and the rest of the layout adapts automatically.',
    'Beyond residential design, EchoCAD handles commercial spaces, oilfield facilities, warehouse layouts, and site plans. Structural analysis validates beam sizing, foundation requirements, and load paths against IBC (International Building Code) standards. Cost estimation pulls from current material pricing databases to give you a bill of materials and budget projection as you design. Real-time collaboration lets multiple team members work on the same drawing simultaneously, with full version control and change tracking.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your First Project', desc: 'Sign up at echo-ept.com/echocad and create a new project. Choose a project type — residential, commercial, industrial, or site plan — and set your units (imperial or metric), default scale, and applicable building code jurisdiction.' },
    { step: 2, title: 'Generate or Draw', desc: 'Use the AI generator to create a layout from a text description, or start with a blank canvas and draw using traditional CAD tools — lines, arcs, rectangles, dimensions, and layers. AI-generated designs are fully editable with the same tools used for manual drafting.' },
    { step: 3, title: 'Refine with Parametric Tools', desc: 'Adjust room dimensions by dragging walls or entering exact measurements. Parametric constraints keep the design valid — move a wall and doors, windows, and dimensions update automatically. Add fixtures, furniture, electrical symbols, and annotations from the component library.' },
    { step: 4, title: 'Run Analysis', desc: 'Click "Analyze" to run structural load calculations, building code compliance checks, and cost estimation. The analysis report highlights any violations — undersized headers, insufficient egress width, non-compliant stair dimensions — with specific code references and suggested fixes.' },
    { step: 5, title: 'Export & Share', desc: 'Export your design as DXF, DWG, PDF, or SVG. DXF/DWG files import directly into AutoCAD, Revit, and other industry tools. Share a view-only link with clients or contractors. Print to scale on any paper size from letter to ARCH E.' },
  ],

  features: [
    { title: 'Parametric Modeling', desc: 'Every element in EchoCAD is parametrically defined. Change a room dimension and connected walls, doors, windows, and dimensions update automatically. Constraints maintain design intent — center a door in a wall, align fixtures to a grid, or lock an offset distance. No more manually updating every related element after a change.' },
    { title: 'AI Layout Generation', desc: 'Describe your project in natural language and the AI generates a complete layout with proper dimensions, circulation paths, and code-compliant room sizes. Specify room counts, square footage targets, adjacency preferences, and style — the engine produces multiple options ranked by efficiency, code compliance, and constructability.' },
    { title: 'Structural Analysis', desc: 'Built-in structural analysis engine calculates dead loads, live loads, wind loads, and seismic forces per IBC and ASCE 7 standards. Validates beam and header sizing, foundation bearing capacity, shear wall placement, and load path continuity from roof to foundation. Results include member sizing recommendations with engineering calculations.' },
    { title: 'Cost Estimation', desc: 'Real-time cost estimation based on current material pricing databases. As you design, the running cost total updates — add a wall and see the framing lumber, drywall, insulation, and labor cost immediately. Export a detailed bill of materials with quantities, unit costs, and total cost broken down by CSI division.' },
    { title: 'Material Optimization', desc: 'AI analyzes your design to minimize material waste. Suggests optimal lumber lengths to reduce cutoff waste, recommends sheet good layouts for drywall and plywood, and identifies opportunities to use standard-dimension components instead of custom fabrication. Typical savings: 8-15% on material costs.' },
    { title: 'DXF/DWG Export', desc: 'Industry-standard export in DXF and DWG formats compatible with AutoCAD, Revit, SketchUp, and all major CAD software. Preserves layers, line weights, dimensions, text styles, and block references. PDF export generates construction-ready plan sets with title blocks, scale bars, and sheet indexing.' },
    { title: 'Real-Time Collaboration', desc: 'Multiple team members can work on the same drawing simultaneously with cursor presence indicators and live updates. Comments and markups are pinned to specific locations in the drawing. Change tracking shows who modified what, when, and provides one-click rollback to any previous version.' },
    { title: 'Version Control', desc: 'Every save creates a versioned snapshot with a timestamp and optional description. Browse the version timeline, compare any two versions with visual diff highlighting, and restore previous versions without losing current work. Branch a design to explore alternatives without affecting the main version.' },
    { title: 'Building Code Compliance', desc: 'Automated compliance checking against IBC, IRC, ADA, and local jurisdiction amendments. The checker validates egress widths, stair dimensions, ceiling heights, bathroom clearances, window emergency escape requirements, and accessibility standards. Violations are highlighted on the drawing with the specific code section referenced.' },
    { title: '3D Visualization', desc: 'One-click conversion from 2D floor plan to 3D walkthrough model. Walls extrude to the specified height, doors and windows cut openings, and roof geometry generates automatically from the building footprint. Apply materials and textures for client presentations. Export 3D models in glTF format for web viewing.' },
    { title: 'Component Library', desc: 'Extensive library of pre-built components — doors, windows, fixtures, appliances, furniture, electrical symbols, plumbing symbols, and structural members. All components are parametric with configurable dimensions. Import custom blocks from DXF files or create your own reusable components.' },
    { title: 'Site Planning', desc: 'Site plan tools for property boundaries, setback lines, easements, grading contours, parking layouts, and landscaping. Import survey data in CSV or LandXML format. Calculate impervious surface coverage, parking counts, and FAR (Floor Area Ratio) for zoning compliance verification.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/api/projects', desc: 'Create a new CAD project with type, units, scale, and building code jurisdiction. Returns a project ID for all subsequent operations.', auth: true },
    { method: 'POST', path: '/api/projects/:id/generate', desc: 'Generate an AI layout from a natural language description. Accepts parameters for room count, square footage, adjacency preferences, and style. Returns a parametric floor plan with all elements.', auth: true },
    { method: 'GET', path: '/api/projects/:id/analyze', desc: 'Run structural analysis and building code compliance check on the current design. Returns load calculations, member sizing, and any code violations with references.', auth: true },
    { method: 'GET', path: '/api/projects/:id/estimate', desc: 'Generate a cost estimate and bill of materials for the current design. Returns itemized costs by CSI division with material quantities and unit pricing.', auth: true },
    { method: 'GET', path: '/api/projects/:id/export', desc: 'Export the current design in DXF, DWG, PDF, or SVG format. Query parameters control scale, paper size, included layers, and title block configuration.', auth: true },
    { method: 'GET', path: '/api/projects/:id/versions', desc: 'List all saved versions of a project with timestamps, descriptions, and thumbnail previews. Supports pagination and date range filtering.', auth: true },
    { method: 'POST', path: '/api/projects/:id/collaborate', desc: 'Generate a collaboration session URL for real-time multi-user editing. Configure permissions (view, comment, edit) per invited user.', auth: true },
  ],

  userGuide: [
    {
      title: 'AI-Assisted Design Workflow',
      id: 'ai-design-workflow',
      content: [
        'The AI layout generator is the fastest way to start a new design. From the project dashboard, click "Generate Layout" and describe your project in plain English. Be as specific or as general as you like — the AI adapts. A minimal prompt like "3-bedroom house, 1800 sqft" produces a functional layout. A detailed prompt like "3-bedroom ranch, 2400 sqft, master suite on west side with ensuite bath and walk-in closet, open kitchen to living room, laundry room adjacent to garage, covered back porch" produces a design that closely matches your vision.',
        'The generator produces three layout options by default, ranked by overall score — a composite of space efficiency (usable area vs. total area), circulation quality (hallway length and directness), code compliance, and constructability (standard dimensions, minimal custom framing). Click any option to load it into the editor. All generated elements are fully parametric — walls, doors, windows, dimensions, and annotations are editable with the same tools you use for manual drawing.',
        'After loading a generated layout, the typical refinement workflow is: adjust room dimensions to hit exact targets, reposition doors and windows for furniture placement and views, add fixtures and appliances, run the structural analysis to validate the design, and then add annotations and dimensions for the construction document set. The AI handles the heavy lifting of initial space planning so you can focus on design refinement and client-specific requirements.',
      ],
    },
    {
      title: 'Structural Analysis & Code Compliance',
      id: 'structural-analysis',
      content: [
        'EchoCAD\'s structural analysis engine evaluates your design against the International Building Code (IBC), International Residential Code (IRC), ASCE 7 load standards, and NDS (National Design Specification) for wood construction. Click "Analyze" from the toolbar to run a full structural and code compliance check. Analysis typically completes in 5-15 seconds depending on design complexity.',
        'The structural report shows the gravity load path from roof to foundation, identifying each load-bearing wall, header, beam, and column with the calculated load it carries. Member sizing recommendations suggest the minimum lumber grade and dimension required — for example, "Header at Kitchen Opening: (2) 2x12 #2 SPF required, 1,847 lb load, L/360 deflection OK." If a member is undersized, the report flags it in red with the required minimum size.',
        'The code compliance section checks dimensional requirements — minimum room sizes, ceiling heights, hallway widths, stair geometry (rise, run, headroom), bathroom clearances, and emergency egress windows. Each violation cites the specific code section (e.g., "IRC R311.7.5.1: Maximum riser height 7-3/4 inches — current design shows 8-1/4 inches"). Click any violation to highlight the affected area on the drawing and see the suggested fix.',
      ],
    },
    {
      title: 'Exporting Construction Documents',
      id: 'exporting-documents',
      content: [
        'EchoCAD exports construction-ready document sets in industry-standard formats. DXF and DWG exports are compatible with AutoCAD 2018+, Revit, SketchUp, and all major CAD software. The export preserves all layers, line weights, text styles, dimension styles, and block references exactly as designed. Choose which layers to include — you might export architectural plans separately from structural framing or electrical layouts.',
        'PDF export generates print-ready plan sheets with configurable title blocks, scale bars, north arrows, and sheet indices. Select your paper size (Letter through ARCH E), set the print scale (1/4" = 1\'-0" is standard for residential plans), and the system automatically tiles the drawing across multiple sheets if needed. Each sheet is numbered and cross-referenced in the sheet index. Custom title block templates are supported if your firm has a standard format.',
        'For client presentations, the 3D visualization export generates a glTF model viewable in any web browser without plugins. Clients can orbit, zoom, and walk through the design on their phone or laptop. Material textures are applied automatically based on the specified construction materials — wood siding, brick veneer, asphalt shingles — giving clients a realistic preview before construction begins.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Natural Language Floor Plan Generation', desc: 'Describe a building in plain English and the AI generates a complete, dimensioned floor plan. The model understands architectural concepts — adjacency (kitchen near dining), orientation (master on quiet side), circulation (minimize hallway waste), and code requirements (egress, accessibility). Produces three ranked options per generation with efficiency and compliance scores.' },
    { capability: 'Structural Load Analysis', desc: 'Automated calculation of dead loads, live loads, snow loads, wind loads, and seismic forces per ASCE 7 standards. Traces the load path from roof through walls, headers, beams, and columns to the foundation. Recommends member sizing per NDS wood design tables and flags any undersized elements with required minimums.' },
    { capability: 'Building Code Validation', desc: 'Real-time compliance checking against IBC, IRC, ADA, and jurisdiction-specific amendments. Validates over 200 dimensional and spatial requirements including room sizes, ceiling heights, stair geometry, egress paths, bathroom clearances, and accessibility standards. Each violation links to the specific code section and suggests the minimum correction.' },
    { capability: 'Material Waste Optimization', desc: 'Analyzes the bill of materials to minimize cutoff waste and excess ordering. Optimizes lumber cutting patterns, sheet good layouts (drywall, plywood, OSB), and bulk material quantities. Suggests design modifications — like adjusting a wall length by 2 inches — that align with standard material dimensions and reduce waste by 8-15%.' },
    { capability: 'Cost Prediction', desc: 'Machine learning model trained on regional construction cost data predicts total project cost from the design alone. Accounts for material costs, labor rates by trade, equipment rental, permit fees, and a configurable contingency percentage. Updates in real time as the design changes. Accuracy within 10-15% of actual construction bids for standard residential and commercial projects.' },
    { capability: 'Intelligent Component Placement', desc: 'AI suggests optimal placement for doors, windows, electrical outlets, plumbing fixtures, and HVAC registers based on room function, furniture layout patterns, code requirements, and energy efficiency. Outlet spacing follows NEC 210.52 rules, window placement considers natural light and ventilation, and fixture placement ensures code-compliant clearances.' },
  ],

  troubleshooting: [
    { issue: 'AI-generated layout has rooms that are too small or oddly shaped', solution: 'Add more specificity to your prompt — include target square footages per room, minimum dimensions ("master bedroom at least 14x16"), and aspect ratio preferences ("no rooms narrower than 10 feet"). If the total square footage target is tight for the room count requested, the AI may compress secondary rooms. Increase the total target or reduce the room count. After generation, all rooms are parametrically editable — drag any wall to resize.' },
    { issue: 'DXF export opens with missing elements in AutoCAD', solution: 'Ensure you are exporting as DXF R2018 format (the default) for maximum compatibility. Check that all layers are set to visible before export — hidden layers are excluded by default. If text appears as boxes, the fonts used in EchoCAD may not be installed on the AutoCAD workstation. Use "Standard" text style in EchoCAD for maximum portability, or embed fonts by exporting as DWG instead of DXF.' },
    { issue: 'Structural analysis reports unrealistic loads', solution: 'Verify that the building location is set correctly — snow loads, wind speeds, and seismic design categories are location-dependent. Check that the roof type and pitch are specified (flat roofs accumulate more snow load). Ensure wall heights are correct — a typo of 18 feet instead of 8 feet dramatically changes lateral loads. Review material assignments to confirm you haven\'t accidentally specified concrete where wood framing was intended.' },
    { issue: 'Collaboration session shows stale data or conflicts', solution: 'Collaboration requires a stable internet connection — latency above 500ms can cause visual lag. If you see a conflict notification, it means two users edited the same element simultaneously. The system preserves both versions and asks you to choose which to keep. Refresh the browser if the drawing appears frozen. For large projects with many simultaneous editors, consider splitting the design into separate files by discipline (architectural, structural, electrical) to reduce contention.' },
  ],

  faq: [
    { q: 'Do I need CAD experience to use EchoCAD?', a: 'No. The AI layout generator creates complete floor plans from text descriptions, so you can produce professional designs without any drafting skill. For refinement, the editing tools use intuitive click-and-drag interactions with smart snapping. That said, EchoCAD also includes full traditional CAD tools for experienced drafters who prefer manual drawing — it accommodates both workflows.' },
    { q: 'Can I use EchoCAD drawings for permit applications?', a: 'Yes. EchoCAD exports construction-ready DXF/DWG and PDF files with proper dimensions, annotations, and title blocks that meet typical permit submission requirements. The building code compliance checker validates your design against IBC/IRC standards before you file. However, most jurisdictions require a licensed architect or engineer stamp on permit drawings — EchoCAD produces the drawings, but you will need a licensed professional to review and stamp them.' },
    { q: 'What building codes does the compliance checker support?', a: 'The checker validates against IBC 2021, IRC 2021, ADA 2010 Standards, ASCE 7-22 for structural loads, NDS 2024 for wood design, and NEC 2023 for electrical. Jurisdiction-specific amendments are available for major US cities and counties. If your jurisdiction is not listed, you can configure custom code parameters (minimum room sizes, setbacks, height limits) manually.' },
    { q: 'How accurate is the cost estimation?', a: 'Cost estimates are typically within 10-15% of actual construction bids for standard residential and commercial projects in the continental US. The model uses regional material pricing updated monthly and labor rates calibrated to local markets. Accuracy depends on design completeness — a fully detailed design with specified materials produces better estimates than a conceptual layout with generic finishes. Custom or specialty construction may see wider variance.' },
    { q: 'Can I import existing CAD files into EchoCAD?', a: 'Yes. EchoCAD imports DXF and DWG files from AutoCAD, Revit, and other CAD software. Imported geometry retains layers, line types, and text. The import process also recognizes common architectural blocks (doors, windows, fixtures) and converts them to EchoCAD parametric components where possible. Large files (over 50MB) may take a few minutes to process.' },
  ],
}

export default function EchoCadDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/echocad' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
