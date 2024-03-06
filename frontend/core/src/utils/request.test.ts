import { getFlaskEnvironmentVariable } from '@plentyag/core/src/utils/get-flask-environment-variable';
import axios from 'axios';
import MockAdapater from 'axios-mock-adapter';

import { trackXhrEvent } from '../analytics';

import { axiosRequest } from './request';

jest.mock('@plentyag/core/src/utils/get-flask-environment-variable');
const mockGetFlaskEnvironmentVariable = getFlaskEnvironmentVariable as jest.Mock;
mockGetFlaskEnvironmentVariable.mockReturnValue('SPROUT-COOKIE');

jest.mock('../analytics');
const mockTrackXhrEvent = trackXhrEvent as jest.Mock;

const mockPostData = { foo: 'bar ' };

describe('axiosRequest', () => {
  it('contains xsrf parameters passed to axios.', async () => {
    var mock = new MockAdapater(axios);

    mock.onPost('/test').reply(200);

    const result = await axiosRequest({ url: '/test', method: 'POST', data: mockPostData });

    expect(result.status).toBe(200);

    expect(mock.history.post.length).toBe(1);
    const post = mock.history.post[0];
    expect(post.xsrfCookieName).toBe('SPROUT-COOKIE');
    expect(post.xsrfHeaderName).toBe('X-CSRFToken');
  });

  it('retries one time if CSRF check fails', async () => {
    var mock = new MockAdapater(axios);

    const url = '/test';
    mock
      .onPost(url)
      .replyOnce(401, { message: { error: 'CSRF check failed, regenerating token' } }) // failed csrf 1st time
      .onPost(url)
      .replyOnce(200); // success on retry.

    const result = await axiosRequest({ url, method: 'POST', data: mockPostData });

    expect(result.status).toBe(200);

    expect(mock.history.post.length).toBe(2);
    const failedPost = mock.history.post[0];
    expect(failedPost.url).toBe(url);
    const successPost = mock.history.post[1];
    expect(successPost.url).toBe(url);
  });

  it('does not retry more than once - even if backend continues to fail', async () => {
    var mock = new MockAdapater(axios);

    const url = '/test';
    // simulate backend continuing to throw 401 with error msg.
    mock.onPost(url).reply(401, { message: { error: 'CSRF check failed, regenerating token' } });

    try {
      await axiosRequest({ url, method: 'POST', data: mockPostData });
    } catch (err) {
      expect(err.response.status).toBe(401);
    }

    // only calls two times since retry should only call once.
    expect(mock.history.post.length).toBe(2);

    expect.assertions(2);
  });

  it('does not retry if backend responds with 401 and no error message', async () => {
    var mock = new MockAdapater(axios);

    const url = '/test';
    // 401 reply does not contain error message so should not cause retry.
    mock.onPost(url).reply(401);

    try {
      await axiosRequest({ url, method: 'POST', data: mockPostData });
    } catch (err) {
      expect(err.response.status).toBe(401);
    }

    expect(mock.history.post.length).toBe(1);

    expect.assertions(2);
  });

  it('calls trackXhrEvent with GET method and url', async () => {
    var mock = new MockAdapater(axios);

    const url = '/test';
    mock.onGet(url).reply(200);

    await axiosRequest({ url });

    expect(mockTrackXhrEvent).toHaveBeenLastCalledWith('GET', url);
  });

  it('calls trackXhrEvent with POST method and url', async () => {
    var mock = new MockAdapater(axios);

    const url = '/test';
    mock.onPost(url).reply(200);

    await axiosRequest({ url, method: 'POST' });

    expect(mockTrackXhrEvent).toHaveBeenLastCalledWith('POST', url);
  });
});
