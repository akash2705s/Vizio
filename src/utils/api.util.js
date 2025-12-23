import lang from '../assets/locale/default.json';
// API call
const doAPICall = async (
  uri,
  method,
  body = null,
  auth = null,
  deviceId = null,
  params = null
) => {
  const requestHeaders = new Headers();
  if (auth) {
    requestHeaders.append('Authorization', `Bearer ${auth}`);
  }
  if (deviceId) {
    requestHeaders.append('x-cb-deviceid', deviceId);
  }
  if (body) {
    // requestHeaders.append('Accept', 'application/json');
    requestHeaders.append('Content-Type', 'application/json');
  }

  const requestOptions = {
    method,
    redirect: 'follow',
    headers: requestHeaders,
    mode: 'cors',
  };
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  let url = `${process.env.REACT_APP_API_BASE_URL}${uri}`;
  if (params) {
    const q = [];
    Object.keys(params).forEach((k) => {
      q.push(`${k}=${encodeURIComponent(params[k])}`);
    });
    url += `?${q.join('&')}`;
  }

  const response = await fetch(url, requestOptions);

  if (response.ok) {
    if (response.status !== 204) {
      const data = await response.json();
      if ('error' in data && !data.data) {
        /* eslint-disable no-throw-literal */
        throw {
          message: data?.error?.code || lang.message.something_went_wrong,
          code: 400,
          status: 400,
        };
      }

      return data;
    }

    return { data: null };
  }

  if (response.status === 400) {
    try {
      const data = await response.json();

      /* eslint-disable no-throw-literal */
      throw {
        message: data.error || lang.message.something_went_wrong,
        code: response.status,
        status: response.status,
      };
    } catch (e) {
      /* eslint-disable no-throw-literal */
      throw {
        message: lang.message.something_went_wrong,
        code: response.status,
        status: response.status,
      };
    }
  }

  /* eslint-disable no-throw-literal */
  throw {
    message: response.error || lang.message.something_went_wrong,
    code: response.status,
    status: response.status,
  };
};

export default doAPICall;
