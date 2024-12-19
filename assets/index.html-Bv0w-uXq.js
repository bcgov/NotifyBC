import{_ as o,c as s,a as r,f as i,b as n,e as a,o as d,r as l}from"./app-BLYWhP50.js";const c={};function m(p,e){const t=l("Mermaid");return d(),s("div",null,[e[0]||(e[0]=r("h1",{id:"disaster-recovery",tabindex:"-1"},[r("a",{class:"header-anchor",href:"#disaster-recovery"},[r("span",null,"Disaster Recovery")])],-1)),e[1]||(e[1]=r("p",null,[r("em",null,"NotifyBC"),i(" consists of three runtime components with dependencies")],-1)),n(t,{id:"mermaid-6",code:"eJxLy8kvT85ILCpRCHHhUgACRw3HAE+F4tSistQiTQVdXTsFJw3f/Lz0fBcnTYgCsKCzRlBqSmaxJhcAZTkRWQ=="}),e[2]||(e[2]=a("<p>Each runtime component is horizontally scalable to form a high-availability cluster. Such HA cluster is resilient to the failure of individual node.</p><p>Under disastrous circumstances, however, entire HA cluster may fail. Recovery should be performed in this order</p><ol><li>MongoDB</li><li>Redis</li><li>API server</li></ol><p>Notes</p><ul><li>MongoDB holds persistent data. When recovering MongoDB, data needs to be recovered. If data is corrupted, restore from backup.</li><li>If MongoDB is the only failed component, after recovery, the other two components don&#39;t need to be restarted.</li><li>Redis doesn&#39;t hold persistent data. When recovering Redis, data doesn&#39;t need to be recovered.</li><li>After recovering Redis, API server needs to be restarted.</li></ul>",5))])}const h=o(c,[["render",m],["__file","index.html.vue"]]),v=JSON.parse('{"path":"/docs/disaster-recovery/","title":"Disaster Recovery","lang":"en-US","frontmatter":{"permalink":"/docs/disaster-recovery/"},"headers":[],"git":{},"filePathRelative":"docs/miscellaneous/disaster-recovery.md"}');export{h as comp,v as data};