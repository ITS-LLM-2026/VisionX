import type { DemoScenario } from '../types';

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'plastic-bottle',
    name: 'Plastic Beverage Bottle',
    tag: 'Beverage Container',
    detection: {
      id: 'det-001',
      classId: 'plastic_bottle',
      label: 'PLASTIC BOTTLE',
      confidence: 0.94,
      boundingBox: {
        x: 0.22,
        y: 0.15,
        width: 0.56,
        height: 0.70,
      },
    },
    knowledge: {
      classId: 'plastic_bottle',
      displayName: 'Clear Beverage Bottle',
      material: 'Unverified Polymer (Likely PET #1)',
      materialVerified: false,
      category: 'uncertain',
      recommendedAction: 'Empty, rinse, and verify local curbside rules',
      preparationSteps: [
        'Empty all remaining liquids completely',
        'Check local policy: many MRFs accept attached caps, some require separation',
        'Do not flatten if your regional optical sorting facility uses 3D scanners',
      ],
      environmentalContext:
        'Clean PET bottles can be mechanically recycled into food-grade rPET pellets or polyester fibers. However, commingled liquid contamination ruins dry paper sorting lines.',
      contaminationWarning:
        'Half-full bottles rupture in collection trucks, soaking paper and cardboard bundles and causing entire bales to be sent to landfill.',
      policyStatus: 'general-guidance',
      sourceUrl: 'https://arxiv.org/abs/2003.06975',
    },
    sampleQuestions: [
      {
        question: 'Should I leave the plastic cap on or throw it away?',
        answer:
          'In most modern municipal recovery facilities (MRFs), leaving the cap securely screwed on is now preferred so the small cap does not slip through sorting screens into landfill glass crushers. However, check local guidelines as older facilities still request cap removal.',
        sources: ['Association of Plastic Recyclers (APR) Design Guide', 'General MRF Standard Practices'],
      },
      {
        question: 'Why does VisionX mark this as "Unverified Polymer"?',
        answer:
          'Computer vision detects visual shape and transparency, but cannot guarantee resin chemistry (e.g., PET #1 vs PVC #3 or PLA bio-plastic) without optical spectroscopy. We label it responsibly rather than assuming universal recyclability.',
        sources: ['VisionX Deterministic Guardrails', 'TACO Taxonomy Guidelines'],
      },
    ],
  },
  {
    id: 'banana-peel',
    name: 'Banana Peel',
    tag: 'Organic Biomass',
    detection: {
      id: 'det-002',
      classId: 'banana_peel',
      label: 'BANANA PEEL',
      confidence: 0.98,
      boundingBox: {
        x: 0.25,
        y: 0.22,
        width: 0.50,
        height: 0.58,
      },
    },
    knowledge: {
      classId: 'banana_peel',
      displayName: 'Organic Fruit Waste',
      material: 'Biodegradable Plant Biomass',
      materialVerified: true,
      category: 'organic',
      recommendedAction: 'Compost bin or municipal wet-waste collection',
      preparationSteps: [
        'Peel off and discard the small plastic brand sticker (PLU sticker)',
        'Deposit into your home compost tumbler or green organics bin',
        'Never wrap in conventional plastic bags when binning',
      ],
      environmentalContext:
        'When organics rot inside compact municipal landfills, anaerobic decomposition generates potent methane (CH4). In a compost pile or industrial digester, it enriches soil and sequesters carbon.',
      contaminationWarning:
        'Tiny plastic PLU stickers do not decompose and contaminate entire batches of organic compost sold to organic farmers.',
      policyStatus: 'general-guidance',
      sourceUrl: 'https://arxiv.org/abs/2003.06975',
    },
    sampleQuestions: [
      {
        question: 'Can I put this in my backyard compost?',
        answer:
          'Yes! Banana peels decompose rapidly (usually 2 to 4 weeks in an active compost pile) and provide valuable potassium and nitrogen. Just be sure to remove the non-compostable PLU sticker first.',
        sources: ['Composting Council Best Practices'],
      },
      {
        question: 'What happens if it goes into general landfill trash?',
        answer:
          'Trapped under heavy landfill trash without oxygen, organic matter undergoes anaerobic digestion, creating methane gas which has a greenhouse effect over 25 times greater than CO2 over a 100-year timescale.',
        sources: ['EPA Municipal Solid Waste Overview'],
      },
    ],
  },
  {
    id: 'food-container',
    name: 'Takeout Food Container',
    tag: 'Soiled Packaging',
    detection: {
      id: 'det-003',
      classId: 'plastic_food_container',
      label: 'PLASTIC FOOD CONTAINER',
      confidence: 0.88,
      boundingBox: {
        x: 0.18,
        y: 0.18,
        width: 0.64,
        height: 0.62,
      },
    },
    knowledge: {
      classId: 'plastic_food_container',
      displayName: 'Hinged Takeout Clamshell',
      material: 'Polypropylene (PP #5) or Expanded Polystyrene (EPS #6)',
      materialVerified: false,
      category: 'residual',
      recommendedAction: 'Conditional: If greasy, dispose as residual waste',
      preparationSteps: [
        'Inspect bottom stamp for resin number (#5 PP vs #6 PS)',
        'Scrape out food scraps and wipe heavy oils or curries',
        'If made of black plastic or heavily saturated with grease, place into residual trash',
      ],
      environmentalContext:
        'Most black plastics cannot be identified by near-infrared (NIR) sensors at recycling plants because the carbon black pigment absorbs the light. They end up discarded at recovery facilities.',
      contaminationWarning:
        'Grease and food oils cannot be washed out during standard flake flotation and will ruin new recycled resin batches.',
      policyStatus: 'general-guidance',
      sourceUrl: 'https://arxiv.org/abs/2003.06975',
    },
    sampleQuestions: [
      {
        question: 'Why are black plastic containers rarely recycled?',
        answer:
          'Most Material Recovery Facilities (MRFs) rely on Near-Infrared (NIR) optical sorters. The black carbon dye absorbs the infrared beam, preventing the sensor from reading the plastic signature, so it gets diverted to landfill.',
        sources: ['Waste Management NIR Sorting Technical Brief'],
      },
      {
        question: 'Does a quick rinse make it recyclable?',
        answer:
          'Only if the local program accepts that resin number (often #5 PP) AND the oil is thoroughly cleaned. If greasy residue remains or it is polystyrene (#6), it belongs in the general residual waste bin.',
        sources: ['Municipal Recycling Guidelines'],
      },
    ],
  },
];
