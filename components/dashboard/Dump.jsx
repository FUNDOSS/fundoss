import React from 'react';

const display = (data) => {
  if (Array.isArray(data)) {
    return data.map((item, index) => (<div key={index}>{index} : {display(item)}</div>)); 
  } 
  if (data instanceof Object) {
    return Object.keys(data).map((key) => (<div key={key}>{key} : {display(data[key])}</div>)); 
  } 
  return data;
};

const Dump = ({ data }) => (
  <div>
    {display(data)}
  </div>
);

export default Dump;
