import{_ as n,c as e,a as t,o as a}from"./app-BiOVGXUL.js";const o={};function s(r,i){return a(),e("div",null,i[0]||(i[0]=[t("pre",null,[t("code",null,`  <div class="description">a string conforming to jmespath <a href="http://jmespath.org/specification.html#filter-expressions">filter expressions syntax</a> after the question mark (?). The filter is matched against the <i><a href="../api-subscription#data">data</a></i> field of the subscription. Examples of filter
    <ul>
      <li>simple <br/>
        <i>province == 'BC'</i>
      </li>
      <li>calling jmespath's <a href="http://jmespath.org/specification.html#built-in-functions">built-in functions</a> <br/>
        <i>contains(province,'B')</i>
      </li>
      <li>calling <a href="../config-notification/#broadcast-push-notification-custom-filter-functions">custom filter functions</a><br/>
        <i>contains_ci(province,'b')</i>
      </li>
      <li>compound <br/>
        <i>(contains(province,'BC') || contains_ci(province,'b')) && city == 'Victoria' </i>
      </li>
    </ul>
    All of above filters will match data object <i>{"province": "BC", "city": "Victoria"}</i>
  </div>
`)],-1)]))}const l=n(o,[["render",s],["__file","jmespathFilter.html.vue"]]),p=JSON.parse('{"path":"/docs/shared/jmespathFilter.html","title":"","lang":"en-US","frontmatter":{},"headers":[],"git":{},"filePathRelative":"docs/shared/jmespathFilter.md"}');export{l as comp,p as data};
