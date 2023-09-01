import{_ as r,o as t,c as n,a as e,b as o}from"./app-54db78a6.js";const s={},l=e("p",null,[o("a filter containing properties "),e("em",null,"where"),o(", "),e("em",null,"fields"),o(", "),e("em",null,"order"),o(", "),e("em",null,"skip"),o(", and "),e("em",null,"limit")],-1),c=e("pre",null,[e("code",null,`- parameter name: filter
- required: false
- parameter type: query
- data type: object

The filter, when expressed in terms of URL-encoded JSON object, takes the form

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
`)],-1),a=[l,c];function i(m,d){return t(),n("div",null,a)}const u=r(s,[["render",i],["__file","filterQueryParam.html.vue"]]);export{u as default};
