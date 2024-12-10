import React, { useState } from 'react';
import axios from 'axios';

function CostEstimator() {
    const [data, setData] = useState(null);
    const [area, setArea] = useState(1000);
    const [budget, setBudget] = useState('economical');
    const backendUrl = 'https://cost-estimator806.onrender.com'; 

    const fetchEstimate = () => {
        axios
            .get(`${backendUrl}/estimate?area=${area}&budget=${budget}`)
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching estimate:', error));
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
                    <p><strong>Total Cost:</strong> {data.totalCost}</p>
                    <h3>Breakdown:</h3>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Civil Work</td>
                                <td>{data.breakdown.civilWork}</td>
                            </tr>
                            <tr>
                                <td>Material</td>
                                <td>{data.breakdown.material}</td>
                            </tr>
                            <tr>
                                <td>Labor</td>
                                <td>{data.breakdown.labor}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CostEstimator;

