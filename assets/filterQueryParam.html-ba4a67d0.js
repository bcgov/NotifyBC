import{_ as r,o as t,c as n,a as e,b as o}from"./app-4c760ee5.js";const s={},l=e("p",null,[o("a filter containing properties "),e("em",null,"where"),o(", "),e("em",null,"fields"),o(", "),e("em",null,"order"),o(", "),e("em",null,"skip"),o(", and "),e("em",null,"limit")],-1),a=e("pre",null,[e("code",null,`- parameter name: filter
- required: false
- parameter type: query
- data type: object

The filter can be expressed as either

  1. URL-encoded stringified JSON object (see example below); or
  2. in the format supported by [qs](https://github.com/ljharb/qs), for example \`?filter[where][created][$gte]="2023-01-01"&filter[where][created][$lt]="2024-01-01"\`

Regardless, the filter will have to be parsed into a JSON object conforming to

\`\`\`json
{
    "where": {...},
    "fields": ...,
    "order": ...,
    "skip": ...,
    "limit": ...,
}
\`\`\`

All properties are optional. The syntax for each property is documented, respectively
- for *where* , see MongoDB [Query Documents](https://www.mongodb.com/docs/manual/tutorial/query-documents/)
- for *fields* , see Mongoose [select](https://mongoosejs.com/docs/api/query.html#Query.prototype.select())
- for *order*, see Mongoose [sort](https://mongoosejs.com/docs/api/query.html#Query.prototype.sort())
- for *skip*, see MongoDB [cursor.skip](https://www.mongodb.com/docs/manual/reference/method/cursor.skip/)
- for *limit*, see MongoDB [cursor.limit](https://www.mongodb.com/docs/manual/reference/method/cursor.limit/)
`)],-1),i=[l,a];function c(m,d){return t(),n("div",null,i)}const u=r(s,[["render",c],["__file","filterQueryParam.html.vue"]]);export{u as default};
