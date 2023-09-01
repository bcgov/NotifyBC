a _where_ query parameter with value conforming to MongoDB [Query Documents](https://www.mongodb.com/docs/manual/tutorial/query-documents/)

    - parameter name: where
    - required: false
    - parameter type: query
    - data type: object

    The value can be expressed as either

      1. URL-encoded stringified JSON object (see example below); or
      2. in the format supported by [qs](https://github.com/ljharb/qs), for example `?where[created][$gte]="2023-01-01"&where[created][$lt]="2024-01-01"`
