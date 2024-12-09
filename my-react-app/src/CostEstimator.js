import React, { useState } from 'react';
import axios from 'axios';

function CostEstimator() {
    const [data, setData] = useState(null);
    const [area, setArea] = useState(1000);
    const [budget, setBudget] = useState('economical');

    const fetchEstimate = () => {
        axios
            .get(`http://localhost:3000/estimate?area=${area}&budget=${budget}`)
            .then(response => setData(response.data))
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h1>Cost Estimator</h1>
            <div>
                <label>
                    Area (sq. ft.):
                    <input
                        type="number"
                        value={area}
                        onChange={e => setArea(e.target.value)}
                    />
                </label>
                <label>
                    Budget:
                    <select value={budget} onChange={e => setBudget(e.target.value)}>
                        <option value="economical">Economical</option>
                        <option value="moderate">Moderate</option>
                        <option value="luxurious">Luxurious</option>
                    </select>
                </label>
                <button onClick={fetchEstimate}>Get Estimate</button>
            </div>
            {data && (
                <div>
                    <h2>Results</h2>
                    <p>Total Cost: {data.totalCost}</p>
                    <h3>Breakdown:</h3>
                    <pre>{JSON.stringify(data.breakdown, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default CostEstimator;
