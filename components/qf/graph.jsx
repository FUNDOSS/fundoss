import React, { useState } from 'react';
import { formatAmountForDisplay } from '../../utils/currency';

function Graph({
  plot, averageDonation, averageMatch, width = 800, height = 600, minimal = false, amount = 10,
}) {
  const [coord, setCoord] = useState({ x: amount || 20, y: 20 });
  const [focus, setFocus] = useState(false);
  const ySqueeze = (height - 20) / plot(width - 10);

  const plotGraph = () => {
    const data = [];
    for (let i = 2; i < width; i += 3) data.push({ x: i, y: plot(i) });
    return data.reduce((path, { x, y }) => `${path} L${x + 10} ${height - (y * ySqueeze) - 10}`, `M 12 ${(height - (plot(2) * ySqueeze)) - 10}`);
  };
  const getX = () => {
    if (!focus) return Number(amount);
    if (coord.x < 2) return 2;
    if (coord.x > width - 10) return width - 10;
    return coord.x;
  };
  //
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      onMouseMove={(e) => {
        const svg = e.currentTarget;
        const pt = svg.createSVGPoint(); 
        pt.x = e.clientX;
        pt.y = e.clientY;
        let c = pt.matrixTransform(svg.getScreenCTM().inverse());
        c = { x: c.x < 2 ? 2 : c.x, y: c.y < 2 ? 2 : c.y };
        setFocus(true);
        setCoord({ x: c.x, y: c.y });
      }}
      onMouseLeave={
        () => setFocus(false)
      }
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7" 
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 5 3.5, 0 7" fill="#6c757d" />
        </marker>
        <marker
          id="startarrow"
          markerWidth="10"
          markerHeight="7" 
          refX="5"
          refY="3.5"
          orient="auto"
        >
          <polygon points="5 0, 5 7, 0 3.5" fill="#6c757d" />
        </marker>
      </defs>
      <title>Matching Formula</title>
      {!minimal ? (
        <>
          <path d={`M 10 10 V ${height - 10} H ${width - 10}`} stroke="#6c757d" fill="transparent" markerEnd="url(#arrowhead)" markerStart="url(#startarrow)" /> 
          <path d={`M ${10 + averageDonation} 10 V ${height - 10}`} stroke="#20c997" />
          <path d={`M 10 ${(height - 10) - (averageMatch * ySqueeze)} H ${width - 10}`} stroke="#E76127" />
          <text x="20" y="40" style={{ fontSize: '12px' }}>
            match $
          </text>
          <text x={width - 200} y={height - 20} style={{ fontSize: '12px' }}>
            donation $
          </text>
          <text x={(20 + averageDonation)} y="70" style={{ fill: '#20c997', fontSize: '12px' }}>
            average donation ${averageDonation}
          </text>
          <text x={width - 200} y={height - (averageMatch * ySqueeze) - 20} style={{ fill: '#E76127', fontSize: '12px' }}>
            average match ${Math.round(averageMatch * 100) / 100}
          </text>
        </>
      ) : null}
      <path d={plotGraph()} strokeWidth="2" strokeLinecap="round" className="stroke-primary-faded" fill="transparent" />
      
 
          <text x={20 + getX()} y={(height / 2) - 13} style={{ fontSize: '10px' }}>
            donation
          </text>
          <text className="text-fat" x={20 + getX()} y={(height / 2)} style={{ fontSize: '14px' }}>
            {formatAmountForDisplay(Math.round(getX()))} 
          </text>
          <text x={20 + getX()} y={(height / 2) + 15} style={{ fontSize: '9px' }}>
            = match
          </text>
          <text className="match success" x={20 + getX()} y={(height / 2) + 30} style={{ fontSize: '16px' }}>
            {formatAmountForDisplay(plot(Math.round(getX())))}
          </text>

      <path d={`M ${10 + getX()} 10 V ${height - 10}`} className="stroke-light" />
      <circle cx={getX() + 10} cy={(height - 10) - (plot(getX()) * ySqueeze)} r="5" className="stroke-primary white" strokeWidth="3" />
    </svg>
  );
}
 
export default Graph;
