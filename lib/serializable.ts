export default (data: any) => {
  if (!data) return {};
  return JSON.parse(JSON.stringify(data));
};
