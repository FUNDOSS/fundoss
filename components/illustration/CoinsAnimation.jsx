import React, { useState, useEffect } from 'react';

const Shape = ({
  color, id, transform, x, dur, height, type,
}) => (
  <g id={id} fill={color}>
    <g transform={transform}>
      {type === 'coin' ? (
        <>
          <path d="M45 39C61 28 71 15 67 9c-3-5-19 0-36 11C15 31 5 44 9 50c4 5 20 0 36-11z" />
          <path d="M77 11c5 8-6 24-26 38C32 62 12 67 7 59" stroke="#9451EB" strokeWidth="3.1" strokeMiterlimit="10" fill="none" />
          <path d="M48 43C67 30 78 13 73 6c-5-8-25-3-44 10S-2 46 3 54c5 7 25 2 45-11z" stroke="#9451EB" strokeWidth="3.1" strokeMiterlimit="10" fill="none" />
          <path d="M73 6l8 10c5 8-7 25-26 38S16 72 11 64L3 54" stroke="#9451EB" strokeWidth="3.1" strokeMiterlimit="10" fill="none" />
          <path d="M51 26l-2 4-6 4 1 2-2 1-1-1-8 4h-4l4-3h3l4-2-3-4-10 5-2-1c-1-1 0-2 1-4l7-6-1-1 3-2 1 1 7-4h5l-5 4h-3l-3 1 2 4 10-4h3l-1 2zm-19 6l4-2-2-4-4 4-1 2h3zm14-2l1-3h-2l-5 2 3 4 3-3z" fill="#110F4C" />
        </>
      ) : null}
      {type === 'shape1' ? (
        <>
          <path d="M0 19C0 10 1 8 6 0c7 5 10 6 19 6 0 8-1 11-6 19-7-5-10-6-19-6z" fill={color} />
        </>
      ) : null}
      {type === 'shape2' ? (
        <>
          <path d="M0 19C0 10 1 8 6 0c7 5 10 6 19 6 0 8-1 11-6 19-7-5-10-6-19-6z" stroke={color} fill="none" />
        </>
      ) : null}
    </g>
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="translate"
      from={`${x} ${height}`}
      to={`${x} ${0 - 100}`}
      dur={`${dur}s`}
      begin={`-${rnd(dur)}s`}
      repeatCount="indefinite"
    />
  </g>
);

const shapeColors = ['#FFDB5E', '#02E2AC'];
const rnd = (max) => Math.floor(Math.random() * max);
const shapes = [];
const generate = (width, height, num) => {
  const cnt = num;
  for (let i = 0; i < cnt; i += 1) {
    const col = shapeColors[rnd(shapeColors.length)];
    const r = rnd(10);
    let shape = 'coin';
    const x = rnd(width - 60) + 30;
    if (r > 3) shape = 'shape1';
    if (r > 7) shape = 'shape2'; 
    shapes.push(<Shape
      type={shape}
      id={`s${i}`}
      color={col} 
      x={x}
      height={height}
      dur={Math.round((-i + cnt + 30) / 3)}
      transform={`scale(${(30 + (i*5)) / (( cnt) + 100)}) 
      rotate(${rnd(380)})`}
    />);
  }
  return shapes;
};

const CoinsAnimation = ({
  width, height, style = {}, num, flip, className,
}) => {
  const [tags, setTags] = useState([]);
  useEffect(() => {
    setTags(generate(width, height, Math.floor(num / 2)));
  }, []);
  return (
    <div suppressHydrationWarning style={style} className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`}>
        {tags.map((s) => s) }
      </svg>
    </div>
  ); 
};

export default CoinsAnimation;
