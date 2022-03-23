export {};

exports.handler = async (event:any) => {
  JSON.stringify(event, null, 2);
};
