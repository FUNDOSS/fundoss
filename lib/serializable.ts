const serializable = (data: any) => {
  if (!data) return {};
  return JSON.parse(JSON.stringify(data));
};

export default serializable;
