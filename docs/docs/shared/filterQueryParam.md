a filter containing properties _where_, _fields_, _order_, _skip_, and _limit_

    - parameter name: filter
    - required: false
    - parameter type: query
    - data type: object

    The filter can be expressed as either

      1. URL-encoded stringified JSON object (see example below); or
      2. in the format supported by [qs](https://github.com/ljharb/qs), for example `?filter[where][created][$gte]="2023-01-01"&filter[where][created][$lt]="2024-01-01"`

    Regardless, the filter will have to be parsed into a JSON object conforming to

    ```json
    {
        "where": {...},
        "fields": ...,
        "order": ...,
        "skip": ...,
        "limit": ...,
    }
    ```

    All properties are optional. The syntax for each property is documented, respectively
    - for *where* , see MongoDB [Query Documents](https://www.mongodb.com/docs/manual/tutorial/query-documents/)
    - for *fields* , see Mongoose [select](https://mongoosejs.com/docs/api/query.html#Query.prototype.select())
    - for *order*, see Mongoose [sort](https://mongoosejs.com/docs/api/query.html#Query.prototype.sort())
    - for *skip*, see MongoDB [cursor.skip](https://www.mongodb.com/docs/manual/reference/method/cursor.skip/)
    - for *limit*, see MongoDB [cursor.limit](https://www.mongodb.com/docs/manual/reference/method/cursor.limit/)
