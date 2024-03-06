import React from 'react';

/**
 * This hook is taken from formik, it allows retaining formik context.
 * For details see: ttps://github.com/jaredpalmer/formik/pull/1566
 * Formik adopted pattern from here: https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
 */
export const useEventCallback = (fn: Function) => {
  var ref = React.useRef(fn); // we copy a ref to the callback scoped to the current state/props on each render

  React.useLayoutEffect(function () {
    ref.current = fn;
  });

  return React.useCallback(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return ref.current.apply(void 0, args);
  }, []);
};
