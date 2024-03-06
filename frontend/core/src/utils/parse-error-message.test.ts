import { DEFAULT_ERROR_MESSSAGE, parseErrorMessage } from './parse-error-message';

const message = 'error-message';

describe('parseErrorMessage', () => {
  it('returns an error message', () => {
    expect(
      parseErrorMessage({
        response: { data: { message: { error: { error: message } } } },
      })
    ).toBe(message);

    expect(
      parseErrorMessage({
        data: { message: { error: { error: message } } },
      })
    ).toBe(message);

    expect(
      parseErrorMessage({
        data: { message: { error: { details: message, message: 'error1' } } },
      })
    ).toBe(`Error: error1

Details: ${message}`);

    expect(
      parseErrorMessage({
        data: { message: { error: message } },
      })
    ).toBe(message);

    expect(
      parseErrorMessage({
        data: { error: { message } },
      })
    ).toBe(message);

    expect(
      parseErrorMessage({
        data: { error: { message } },
      })
    ).toBe(message);

    expect(
      parseErrorMessage({
        error: message,
      })
    ).toBe(message);

    expect(parseErrorMessage(Error(message))).toBe(message);

    expect(
      parseErrorMessage({
        data: { code500: message },
      })
    ).toBe(JSON.stringify({ code500: message }));

    expect(
      parseErrorMessage({
        code500: message,
      })
    ).toBe(JSON.stringify({ code500: message }));

    expect(parseErrorMessage('string error message')).toBe('string error message');
  });

  it('returns an error message', () => {
    const error = { message: { error: { message: 'not-helpful-message' } } };

    expect(parseErrorMessage({ data: error })).toBe('{"message":{"error":{"message":"not-helpful-message"}}}');
  });

  it('returns default message if data is string (assuming unparsable HTML)', () => {
    const error = '<!DOCTYPE html><html><body>Some HTML</body></html>';
    const error2 = '<!DOCTYPE html><html class="no-js" lang="en"><body>Some HTML</body></html>';

    expect(parseErrorMessage({ data: error })).toBe(DEFAULT_ERROR_MESSSAGE);
    expect(parseErrorMessage({ data: error2 })).toBe(DEFAULT_ERROR_MESSSAGE);
  });
});
