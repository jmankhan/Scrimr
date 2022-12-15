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

export const getRandomElement = (arr) => {
  return arr[Math.floor(Math.random()*arr.length)];
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

export const getCookie = (name) => {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
  }
  else
  {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
      end = dc.length;
      }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
}
export * from "./constants";
