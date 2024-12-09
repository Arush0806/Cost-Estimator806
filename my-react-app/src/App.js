import React from 'react';
import CostEstimator from './CostEstimator'; // Import the CostEstimator component
import './App.css'; // Retain existing CSS styles if needed

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Cost Estimator Portal</h1>
        <p>
          Enter the area and budget to get a detailed construction cost estimate.
        </p>
      </header>
      <main>
        <CostEstimator /> {/* Include your cost estimator component */}
      </main>
    </div>
  );
}

export default App;

