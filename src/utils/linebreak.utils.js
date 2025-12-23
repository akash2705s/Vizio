const lineBreak = (str, extra = false) => {
  const convertStr = str;
  const arr = extra && convertStr.split('\n');
  let resultStr = '';

  for (let i = 0; i < arr.length; i += 1) {
    if (extra) {
      resultStr += `${arr[i]}<br>`;
    } else {
      resultStr += `<div>${arr[i]}</div>`;
    }
  }
  return resultStr;
};

export default lineBreak;
