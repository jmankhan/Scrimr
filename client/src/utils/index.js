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
