export type Result<T, E> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: E;
    };

export type ApiError = {
  code: string;
  message: string;
};

export type ApiResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: ApiError;
    };

export class ValidationError extends Error {
  readonly fields: string[];

  constructor(message: string, fields: string[]) {
    super(message);
    this.name = "ValidationError";
    this.fields = fields;
  }
}

export class NetworkError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "NetworkError";
    this.statusCode = statusCode;
  }
}

export class SchemaError extends Error {
  readonly issues: string;

  constructor(message: string, issues: string) {
    super(message);
    this.name = "SchemaError";
    this.issues = issues;
  }
}