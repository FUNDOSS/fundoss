import * as React from "react"

function Graph({plot, averageDonation, averageMatch }) {
  const plotGraph = () => {
    const data = []
    for(let i=0; i<800; i+=5) data.push({x:i, y:Math.round(plot(i))})
    return data.reduce((path, {x, y}) => path += ' L' + (x+10) +' '+ ( 300 - y - 10 ), 'M 10 290');
  }
  return (
    <svg
      width={810}
      height={300}
      viewBox="0 0 810 300"
      xmlns="http://www.w3.org/2000/svg"
      
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
        refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
        <marker id="startarrow" markerWidth="10" markerHeight="7" 
        refX="10" refY="3.5" orient="auto">
          <polygon points="10 0, 10 7, 0 3.5" fill="black" />
        </marker>
      </defs>
      <title>{"Rectangle 5"}</title>
      <path d="M 10 10 V 290 H 790" stroke="black" fill="transparent" markerEnd="url(#arrowhead)" markerStart="url(#startarrow)" /> 
      <path d={plotGraph()} stroke="red" fill="transparent" />
      <path d={'M '+ (10 + averageDonation) + ' 10 V 290'} stroke="green" />
      <path d={'M 10 '+ (290 - averageMatch) + ' H 790'} stroke="purple" />
      <text x="20" y="40" style={{fontSize:'12px'}}>
        match $
      </text>
      <text x="600" y="280" style={{fontSize:'12px'}}>
        donation $
      </text>
      <text x={(20 + averageDonation)} y="70" style={{fill:'green',fontSize:'12px'}}>
        average donation
      </text>
      <text x="300" y={280 - averageMatch} style={{fill:'purple',fontSize:'12px'}}>
        average match
      </text>
    </svg>
  )
}
 
export default Graph
