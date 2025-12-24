// Video list sorting related functionalities
const sortVideosList = (data, sort) => {
  if (sort === 'sort-popular') {
    const tempData = [...data];
    tempData.sort((a, b) => Number(b.viewsCount) - Number(a.viewsCount));
    return tempData;
  }

  if (sort === 'sort-asc') {
    const tempData = [...data];
    tempData.sort((a, b) => {
      const aDate = new Date(a.launchTime).getTime();
      const bDate = new Date(b.launchTime).getTime();
      return aDate - bDate;
    });

    return tempData;
  }

  if (sort === 'sort-desc') {
    const tempData = [...data];
    tempData.sort((a, b) => {
      const aDate = new Date(a.launchTime).getTime();
      const bDate = new Date(b.launchTime).getTime();
      return bDate - aDate;
    });

    return tempData;
  }

  if (sort === 'sort-az') {
    const tempData = [...data];
    tempData.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

    return tempData;
  }

  return data;
};

export default sortVideosList;
