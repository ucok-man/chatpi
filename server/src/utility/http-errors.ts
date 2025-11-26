import { StatusCodes, getReasonPhrase } from "http-status-codes";

export class HttpError extends Error {
  public statusText: string;

  constructor(
    public msg: string | Record<string, any> | Record<string, any>[],
    public statusCode: StatusCodes,
    public internal?: any
  ) {
    const statusText = getReasonPhrase(statusCode);

    // Set the actual error message
    super(typeof msg === "string" ? msg : statusText);

    // Set class name explicitly (optional)
    this.name = "HttpError";

    // Capture cleaner stack
    (Error as any).captureStackTrace?.(this, HttpError);

    this.statusText = statusText;
  }

  toResponse() {
    return {
      error: this.statusText,
      message: this.msg,
    };
  }
}

export class ErrInternalServer extends HttpError {
  constructor(error: any) {
    super(
      "Sorry we encountered problem in our server",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
}

export class ErrNotFound extends HttpError {
  constructor() {
    super("The requested resource cannot be found", StatusCodes.NOT_FOUND);
  }
}

export class ErrBadRequest extends HttpError {
  constructor(msg: string) {
    super(msg, StatusCodes.BAD_REQUEST);
  }
}

export class ErrUnprocessableEntity extends HttpError {
  constructor(msg: string | Record<string, any> | Record<string, any>[]) {
    super(msg, StatusCodes.UNPROCESSABLE_ENTITY);
  }

  static construct(msg: { path: string; message: string }[]) {
    return new ErrUnprocessableEntity(msg);
  }
}
