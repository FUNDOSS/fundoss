import React from 'react';


const style = {
  padding:'3px 0 3px 5px',
}

const display = (data) => {
  if (Array.isArray(data)) {
    return data.map((item, index) => (
    <div style={style} key={index}>[{index}]{display(item)}</div>
    )); 
  } 
  if (data instanceof Object) {
    return Object.keys(data).map((key) => (
    <div style={style} key={key}>
      <small>{key}</small>:{display(data[key])}
      </div>
      )); 
  } 
  return data;
};

const Dump = ({ data }) => (
  <div>
    {display(data)}
  </div>
);

export default Dump;
