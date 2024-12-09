const express = require('express');
const cors = require('cors'); // Import CORS middleware
const app = express();

// Middleware
app.use(express.json()); // To parse JSON requests
app.use(cors()); // Enable CORS for all requests

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Cost Estimator API!');
});

// Example API data route
app.get('/api/data', (req, res) => {
    res.json({
        message: 'This is your cost data!',
        data: [
            { id: 1, name: 'Item A', cost: 100 },
            { id: 2, name: 'Item B', cost: 200 },
            { id: 3, name: 'Item C', cost: 300 }
        ]
    });
});

// Add item route
app.post('/api/add-item', (req, res) => {
    const { name, cost } = req.body;
    if (!name || !cost) {
        return res.status(400).json({ error: 'Name and cost are required' });
    }
    res.json({ message: 'Item added successfully', item: { name, cost } });
});

// Cost estimation route
app.get('/estimate', (req, res) => {
    console.log('Received query parameters:', req.query); // Log the raw query parameters

    const area = parseFloat(req.query.area) || 1000; // Default area
    const budget = req.query.budget?.trim().toLowerCase() || 'economical'; // Default budget

    console.log('Parsed area:', area);
    console.log('Parsed budget:', budget);

    // Cost rates for different budgets
    const COST_RATES = {
        economical: 1000,
        moderate: 1500,
        luxurious: 2500,
    };

    // Validate the budget category
    if (!COST_RATES[budget]) {
        return res.status(400).json({
            message: `Invalid budget category. Valid categories are: ${Object.keys(COST_RATES).join(', ')}`
        });
    }

    // Calculate total cost and breakdown
    const totalCost = area * COST_RATES[budget];
    const breakdown = {
        civilWork: totalCost * 0.6,
        material: totalCost * 0.3,
        labor: totalCost * 0.1,
    };

    res.json({
        success: true,
        budget,
        area,
        totalCost,
        breakdown,
    });
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




