import React from 'react';

export function StudyDetails() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Details and Study: Productivity Impact Analysis
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Mathematical Model</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-mono">Y = a*LN(x) + b</p>
            <p className="mt-2">Where:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>a</strong> = Rise at any given point (theoretical max)</li>
              <li><strong>b</strong> = Run at any given EPT</li>
              <li><strong>x</strong> = EPT value</li>
              <li><strong>Y</strong> = Maximum transactions/minute</li>
            </ul>
          </div>
        </section>

        <section>
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Research Question</h4>
          <p className="text-gray-700">
            Given EPT = x, what is the maximum transactions/minute of a human working in a business 
            system, with the distractive cascade abound?
          </p>
        </section>

        <section>
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Components</h4>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Logarithmic function of work:</strong>
              <p className="mt-1 text-gray-600">
                Represents the natural decay of productivity as system response time increases
              </p>
            </li>
            <li>
              <strong>Theoretical max work at a given EPT:</strong>
              <p className="mt-1 text-gray-600">
                The maximum possible transactions per minute achievable under ideal conditions
              </p>
            </li>
            <li>
              <strong>EPT adjusted for minutes:</strong>
              <p className="mt-1 text-gray-600">
                System response time normalized to per-minute calculations
              </p>
            </li>
          </ul>
        </section>

        <section>
          <h5 className="text-lg font-semibold text-gray-800 mb-3">Key Insights</h5>
          <ol className="list-decimal pl-6 space-y-3 text-gray-700">
            <li>
              The relationship between EPT and productivity follows a logarithmic decay curve
            </li>
            <li>
              Each role has a theoretical maximum transaction rate based on task complexity
            </li>
            <li>
              System response time acts as a multiplier on the base productivity rate
            </li>
            <li>
              The impact of increased EPT compounds over time, leading to significant 
              productivity losses
            </li>
          </ol>
        </section>

        <section className="border-t pt-6">
          <h5 className="text-lg font-semibold text-gray-800 mb-3">Practical Applications</h5>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700">
              This model enables organizations to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Quantify the impact of system performance on productivity</li>
              <li>Set evidence-based performance targets for system optimization</li>
              <li>Calculate the ROI of performance improvements</li>
              <li>Make data-driven decisions about system architecture and design</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}