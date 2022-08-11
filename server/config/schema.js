'use strict';

const yup = require('yup');

const METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

module.exports = yup
  .object({
    exclude: yup
      .object({
        methods: yup.array(
          yup
            .string()
            .oneOf(METHODS)
            .uppercase()
        ),
        models: yup.array(yup.string()),
        plugins: yup.lazy(plugins =>
          Array.isArray(plugins)
            ? yup.array(yup.string())
            : yup.object({
                [yup.string()]: yup.object({
                  actions: yup.lazy(actions =>
                    Array.isArray(actions) ? yup.array(yup.string()) : yup.string().matches(/\*/)
                  ),
                }),
              })
        ),
      })
      .noUnknown(),
  })
  .noUnknown();
