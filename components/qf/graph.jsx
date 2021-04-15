import React, { useState } from 'react';
import { formatAmountForDisplay } from '../../utils/currency';

function Graph({
  plot, averageDonation, averageMatch, width = 800, height = 600, minimal = false,
}) {
  const plotGraph = () => {
    const data = [];
    for (let i = 0; i < width; i += 5) data.push({ x: i, y: Math.round(plot(i)) });
    return data.reduce((path, { x, y }) => `${path} L${x + 10} ${height - y - 10}`, `M 10 ${height - 10}`);
  };
  const [coord, setCoord] = useState({ x: 20, y: 20 });
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
        setCoord({ x: c.x > width - 100 ? width - 100 : c.x, y: c.y });
      }}
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
          <path d={`M 10 ${(height - 10) - averageMatch} H ${width - 10}`} stroke="#E76127" />
          <text x="20" y="40" style={{ fontSize: '12px' }}>
            match $
          </text>
          <text x={width - 200} y={height - 20} style={{ fontSize: '12px' }}>
            donation $
          </text>
          <text x={(20 + averageDonation)} y="70" style={{ fill: '#20c997', fontSize: '12px' }}>
            average donation ${averageDonation}
          </text>
          <text x={width - 200} y={height - averageMatch - 20} style={{ fill: '#E76127', fontSize: '12px' }}>
            average match ${Math.round(averageMatch * 100) / 100}
          </text>
        </>
      ) : null}
      <path d={plotGraph()} strokeWidth="2" strokeLinecap="round" className="stroke-primary-faded" fill="transparent" />
      <text x={20 + coord.x} y={(height / 2) - 13} style={{ fontSize: '10px' }}>
        donation
      </text>
      <text className="text-fat" x={20 + coord.x} y={(height / 2)} style={{ fontSize: '14px' }}>
        {formatAmountForDisplay(Math.round(coord.x))} 
      </text>
      <text x={20 + coord.x} y={(height / 2) + 15} style={{ fontSize: '9px' }}>
        = match
      </text>
      <text className="match success" x={20 + coord.x} y={(height / 2) + 30} style={{ fontSize: '16px' }}>
        {formatAmountForDisplay(plot(Math.round(coord.x)))}
      </text>
      <path d={`M ${10 + coord.x} 10 V ${height - 10}`} className="stroke-secondary" />
      
    </svg>
  );
}
 
export default Graph;
