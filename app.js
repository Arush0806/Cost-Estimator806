const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Cost breakdown percentages
const COST_BREAKDOWN = {
    civil: 90.15, // Total civil work percentage
    centringShuttering: 43.15,
    reinforcementSteel: 19.19,
    rccWork: 14.35,
};

// Cost rates per sq. ft. for different budgets
const COST_RATES = {
    economical: 1000,
    moderate: 1500,
    luxurious: 2500,
};

// Material and labor formulas
const MATERIAL_FORMULAS = {
    bricks: (A) => ({ formula: "(2.26 * A + 66.8) * 100", result: (2.26 * A + 66.8) * 100 }),
    cement: (A) => ({ formula: "0.153 * A + 0.57", result: 0.153 * A + 0.57 }),
    steel: (A) => ({ formula: "21.3 * A - 314", result: 21.3 * A - 314 }),
    sand: (A) => ({ formula: "0.47 * A - 7", result: 0.47 * A - 7 }),
    coarseAggregate20mm: (A) => ({ formula: "0.176 * A - 0.21", result: 0.176 * A - 0.21 }),
    coarseAggregate40mm: (A) => ({ formula: "0.145 * A + 1.5", result: 0.145 * A + 1.5 }),
    lime: (A) => ({ formula: "0.145 * A - 0.37", result: 0.145 * A - 0.37 }),
    timber: (A) => ({ formula: "0.019 * A + 0.23", result: 0.019 * A + 0.23 }),
    primer: (A) => ({ formula: "0.068 * A", result: 0.068 * A }),
    paint: (A) => ({ formula: "0.108 * A + 0.27", result: 0.108 * A + 0.27 }),
};

const LABOR_FORMULAS = {
    mason: (A) => ({ formula: "1.335 * A + 28", result: 1.335 * A + 28 }),
    carpenter: (A) => ({ formula: "1.184 * A - 9", result: 1.184 * A - 9 }),
    painter: (A) => ({ formula: "0.089 * A", result: 0.089 * A }),
    mazdoor: (A) => ({ formula: "4.769 * A + 32", result: 4.769 * A + 32 }),
};

/**
 * Calculate material quantities with formulas.
 * @param {number} area - The total area in sq. ft.
 * @returns {object} - Quantities of materials and calculations.
 */
function calculateMaterialQuantities(area) {
    const materials = {};
    for (const [key, formula] of Object.entries(MATERIAL_FORMULAS)) {
        materials[key] = formula(area);
    }
    return materials;
}

/**
 * Calculate labor quantities with formulas.
 * @param {number} area - The total area in sq. ft.
 * @returns {object} - Quantities of labor (in days) and calculations.
 */
function calculateLaborQuantities(area) {
    const labor = {};
    for (const [key, formula] of Object.entries(LABOR_FORMULAS)) {
        labor[key] = formula(area);
    }
    return labor;
}

/**
 * Calculate detailed cost breakdown.
 * @param {number} totalCost - The total construction cost.
 * @returns {object} - Detailed cost components.
 */
function calculateBreakdown(totalCost) {
    const civilWork = (totalCost * COST_BREAKDOWN.civil) / 100;

    return {
        centringShuttering: (civilWork * COST_BREAKDOWN.centringShuttering) / 100,
        reinforcementSteel: (civilWork * COST_BREAKDOWN.reinforcementSteel) / 100,
        rccWork: (civilWork * COST_BREAKDOWN.rccWork) / 100,
        otherWork: totalCost - civilWork, // Non-civil costs
        civilWork, // Total civil work cost
    };
}

// Endpoint: Cost Estimation
app.get('/estimate', (req, res) => {
    const area = parseFloat(req.query.area) || 1000; // Default area
    const budget = req.query.budget || 'economical'; // Default budget

    if (!COST_RATES[budget]) {
        return res.status(400).send({ message: 'Invalid budget category' });
    }

    const totalCost = area * COST_RATES[budget];
    const breakdown = calculateBreakdown(totalCost);
    const materialQuantities = calculateMaterialQuantities(area);
    const laborQuantities = calculateLaborQuantities(area);

    res.json({
        success: true,
        budget,
        area,
        totalCost,
        breakdown,
        materials: materialQuantities,
        labor: laborQuantities,
    });
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
