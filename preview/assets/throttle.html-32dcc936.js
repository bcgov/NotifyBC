import{_ as r,r as i,o as s,c as l,a as t,b as e,d as n}from"./app-73097456.js";const a={},c={href:"https://github.com/SGrondin/bottleneck",target:"_blank",rel:"noopener noreferrer"},d={href:"https://github.com/luin/ioredis",target:"_blank",rel:"noopener noreferrer"},_=t("em",null,"NotifyBC",-1),h=t("em",null,"jobExpiration",-1),f=t("em",null,"expiration",-1),u={href:"https://github.com/bcgov/NotifyBC/blob/main/src/config.ts",target:"_blank",rel:"noopener noreferrer"},m=t("p",null,[e("When "),t("em",null,"NotifyBC"),e(" is deployed to Kubernetes using Helm, by default throttle, if enabled, uses Redis Sentinel therefore rate limit applies to whole cluster.")],-1);function p(b,g){const o=i("ExternalLinkIcon");return s(),l("div",null,[t("p",null,[e("Throttle is implemented using "),t("a",c,[e("Bottleneck"),n(o)]),e(" and "),t("a",d,[e("ioredis"),n(o)]),e(". See their documentations for more configurations. The only deviation made by "),_,e(" is using "),h,e(" to denote Bottleneck "),f,e(" job option with a default value of 2min as defined in "),t("a",u,[e("config.ts"),n(o)]),e(".")]),m])}const x=r(a,[["render",p],["__file","throttle.html.vue"]]);export{x as default};
