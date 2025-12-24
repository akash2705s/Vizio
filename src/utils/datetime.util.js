// Date-time related utilities
const getCurrentTimestamp = () => Math.ceil(Date.now() / 1000);

export const dateFormat = (d) => {
  if (!d) {
    return '';
  }

  const date = new Date(d);

  // Get the day, month, and year
  const day = date.getUTCDate();
  const monthIndex = date.getUTCMonth();
  const year = date.getUTCFullYear();

  // Array of Romanian month names
  const monthsRO = [
    'ianuarie',
    'februarie',
    'martie',
    'aprilie',
    'mai',
    'iunie',
    'iulie',
    'august',
    'septembrie',
    'octombrie',
    'noiembrie',
    'decembrie',
  ];

  // Format the date
  const formattedDate = `${day} ${monthsRO[monthIndex]} ${year}`;
  return formattedDate;
  // const dateFormatter = new Intl.DateTimeFormat('ro-RO', {
  //   dateStyle: 'long',
  // });
  // return dateFormatter.format(new Date(d));
};

export const timeFormat = (seconds, formatType = 'full') => {
  let secs = seconds;

  if (!secs && secs <= 0) {
    return '';
  }

  let hours = null;
  if (secs / 3600 > 0) {
    hours = Math.floor(secs / 3600);
    secs -= hours * 3600;
  } else {
    hours = null;
  }

  let mins = null;
  if (secs / 60 > 0) {
    mins = Math.floor(secs / 60);
    secs -= mins * 60;
  } else {
    mins = null;
  }

  secs = Math.floor(secs);

  if (formatType === 'minutes') {
    const minsString = mins >= 10 ? String(mins) : `0${String(mins)}`;
    const remainderString = secs >= 10 ? String(secs) : `0${String(secs)}`;

    return `${minsString}:${remainderString}`;
  }

  let result = '';
  if (hours > 0) {
    result += `${String(hours)}h `;
  }
  if (mins > 0) {
    result += `${String(mins)}m `;
  }
  if (secs > 0) {
    result += `${String(secs)}s`;
  }
  return result;
};

export default getCurrentTimestamp;
