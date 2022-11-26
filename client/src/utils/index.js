export const chunkMembers = (array, chunkSize, propertyName = "members") => {
  return array.reduce((result, value, index) => {
    const chunkIdx = Math.floor(index / chunkSize);
    if (!result[chunkIdx]) {
      result[chunkIdx] = { id: chunkIdx, [propertyName]: [] };
    }
    result[chunkIdx][propertyName].push(value);
    return result;
  }, []);
};

export const handleError = (err) => {
  if (!err) {
    return 'Critical error';
  }

  if (err.validation) {
    return { code: err.validation.code, fields: err.validation.fields };
  } else if (err) {
    let result = err.response?.data;
    if (!result || !result.code || !result.message) {
      result = { code: err.code, message: err.message };
    }
    return result;
  }

  return 'Unknown Error';
}
export * from "./constants";
