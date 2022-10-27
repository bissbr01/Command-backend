const RouteErrors = {
  OPERATION_FAILED: {
    key: 'OPERATION_FAILED',
    message: 'Unable to perform operation',
    status: 400,
  },
  IMPROPER_FORMAT: {
    key: 'IMPROPER_FORMAT',
    message: 'Your request is improperly formatted',
    status: 400,
  },
  NO_USER: {
    key: 'NO_USER',
    message: 'This user is not in the system, so they cannot be added.',
    status: 400,
  },
  INVALID_CREDENTIALS: {
    key: 'INVALID_CREDENTIALS',
    message: 'Invalid username or password',
    status: 401,
  },
  ACCOUNT_DISABLED: {
    key: 'ACCOUNT_DISABLED',
    message: 'account disabled, please contact admin',
    status: 401,
  },
  UNAUTHORIZED: {
    key: 'UNAUTHORIZED',
    message: 'You must be authenticated to perform this action.',
    status: 403,
  },
  SESSION_EXPIRED: {
    key: 'SESSION_EXPIRED',
    message: 'Your session has expired',
    status: 403,
  },
  INSUFFICIENT_PERMISSION: {
    key: 'INSUFFICIENT_PERMISSION',
    message: 'You do not have permission to perform this action',
    status: 403,
  },
  NOT_FOUND: { key: 'NOT_FOUND', message: 'Resource not found', status: 404 },
  COLLEAGUE_DOESNT_EXIST: {
    key: 'COLLEAGUE_DOESNT_EXIST',
    message:
      'This colleague has not yet created an account.  Please ask them to create an account first.',
    status: 400,
  },
}

const errorHandler = (err, req, res, next) => {
  // catch errors thrown in route handlers
  if (err.message in RouteErrors) {
    const e = RouteErrors[err.message]
    res.status(e.status).json({ error: e.message })
  }

  // catch other errors thrown by Sequelize
  res.status(400).json(err)

  next(err)
}

module.exports = { errorHandler, RouteErrors }
