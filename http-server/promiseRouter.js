'use strict';

module.exports = function promiseRouter(app){
  // TODO move the nextCalled logic to "use" and refactor "route" to use "use"

  // function promisify(pattern, ...middleware){
  //   const handler = middleware.pop();
  //   const X = (req, res, next) => {
  //     let nextCalled = false;
  //     const next = (...args) => { nextCalled = true; _next(...args); };
  //     new Promise((resolve) => {
  //       const { context, params, query, body } = req;
  //       resolve(handler({ ...context, params, query, body, req, res }));
  //     })
  //   }
  // }

  function use(pattern, ...middleware){
    const handler = middleware.pop();
    if (!handler) throw new Error(`router handler missing for: use ${pattern}`);
    app.use(pattern, ...middleware, (req, res, next) => {
      new Promise((resolve) => {
        const { context, params, query, body } = req;
        resolve(handler({ ...context, params, query, body, req, res }));
      }).then(
        () => { next(); },
        error => {
          if (!res.headersSent) {
            if (error.status){ res.status(error.status); }
            res.renderError(error);
          }
        }
      );
    });
  };

  function route(method, pattern, ...middleware){
    const handler = middleware.pop();
    if (!handler) throw new Error(`router handler missing for: ${method} ${pattern}`);
    app[method.toLowerCase()](pattern, ...middleware, (req, res, _next) => {
      let nextCalled = false;
      const next = (...args) => { nextCalled = true; _next(...args); };
      new Promise((resolve) => {
        const { context, params, query, body } = req;
        resolve(handler({ ...context, params, query, body, req, res, next }));
      }).then(
      // Promise.resolve(handler({ ...req.context, req, res, next })).then(
        result => {
          if (nextCalled) return;
          req.context.logger.debug('completed successfully', {headersSent: res.headersSent});
          if (!res.headersSent) res.renderSuccess(result);
        },
        error => {
          if (nextCalled) return;
          req.context.logger.debug('failed with error', error, {headersSent: res.headersSent});
          if (!res.headersSent) {
            if (error.status){ res.status(error.status); }
            res.renderError(error);
          }
        }
      );
    });
  };

  const get = (...args) => route('get', ...args);
  const pos = (...args) => route('post', ...args);
  return {app, use, route, get, pos};
};
