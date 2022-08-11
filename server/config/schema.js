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
        plugins: yup.array(yup.string()),
      })
      .noUnknown(),
  })
  .noUnknown();
