import{_ as r,c as n,a as e,e as t,o as s}from"./app-53AjmZjw.js";const a={};function l(i,o){return s(),n("div",null,[...o[0]||(o[0]=[e("p",null,[t("a filter containing properties "),e("em",null,"where"),t(", "),e("em",null,"fields"),t(", "),e("em",null,"order"),t(", "),e("em",null,"skip"),t(", and "),e("em",null,"limit")],-1),e("pre",null,[e("code",null,`- parameter name: filter
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
`)],-1)])])}const m=r(a,[["render",l]]),d=JSON.parse('{"path":"/docs/shared/filterQueryParam.html","title":"","lang":"en-US","frontmatter":{},"git":{"contributors":[{"name":"f-w","username":"f-w","email":"fred.wen@gov.bc.ca","commits":1,"url":"https://github.com/f-w"}],"changelog":[{"hash":"bb2b015a24c5ad4be9a7cfd6d5e779b1ae6f5d62","time":1775261805000,"email":"fred.wen@gov.bc.ca","author":"f-w","message":"updated state after sending non broadcast push notifications"}]},"filePathRelative":"docs/shared/filterQueryParam.md"}');export{m as comp,d as data};
