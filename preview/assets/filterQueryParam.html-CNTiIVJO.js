import{_ as t,c as n,a as e,f as r,o as s}from"./app-C1IcqOjR.js";const l={};function a(i,o){return s(),n("div",null,o[0]||(o[0]=[e("p",null,[r("a filter containing properties "),e("em",null,"where"),r(", "),e("em",null,"fields"),r(", "),e("em",null,"order"),r(", "),e("em",null,"skip"),r(", and "),e("em",null,"limit")],-1),e("pre",null,[e("code",null,`- parameter name: filter
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
`)],-1)]))}const c=t(l,[["render",a],["__file","filterQueryParam.html.vue"]]),d=JSON.parse('{"path":"/docs/shared/filterQueryParam.html","title":"","lang":"en-US","frontmatter":{},"headers":[],"git":{},"filePathRelative":"docs/shared/filterQueryParam.md"}');export{c as comp,d as data};
