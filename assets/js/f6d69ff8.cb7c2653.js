"use strict";(self.webpackChunkmaestrodocs=self.webpackChunkmaestrodocs||[]).push([[463],{3905:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return m}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,s=e.originalType,l=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),d=c(r),m=o,f=d["".concat(l,".").concat(m)]||d[m]||p[m]||s;return r?n.createElement(f,i(i({ref:t},u),{},{components:r})):n.createElement(f,i({ref:t},u))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var s=r.length,i=new Array(s);i[0]=d;var a={};for(var l in t)hasOwnProperty.call(t,l)&&(a[l]=t[l]);a.originalType=e,a.mdxType="string"==typeof e?e:o,i[1]=a;for(var c=2;c<s;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},2264:function(e,t,r){r.r(t),r.d(t,{assets:function(){return u},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return a},metadata:function(){return c},toc:function(){return p}});var n=r(7462),o=r(3366),s=(r(7294),r(3905)),i=["components"],a={sidebar_position:1},l="Introduction",c={unversionedId:"intro",id:"intro",title:"Introduction",description:"Let's discover maestro in less than 5 minutes.",source:"@site/../docs/intro.md",sourceDirName:".",slug:"/intro",permalink:"/maestro/docs/intro",draft:!1,editUrl:"https://github.com/Farfetch/maestro/tree/master/docs/../docs/intro.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Getting Started",permalink:"/maestro/docs/category/getting-started"}},u={},p=[{value:"Real-time metrics",id:"real-time-metrics",level:2},{value:"Hits vs Errors",id:"hits-vs-errors",level:3},{value:"Response time",id:"response-time",level:3},{value:"Response Codes",id:"response-codes",level:3},{value:"Summary Table",id:"summary-table",level:3},{value:"Endpoints",id:"endpoints",level:3}],d={toc:p};function m(e){var t=e.components,a=(0,o.Z)(e,i);return(0,s.kt)("wrapper",(0,n.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"introduction"},"Introduction"),(0,s.kt)("p",null,"Let's discover ",(0,s.kt)("strong",{parentName:"p"},"maestro in less than 5 minutes"),"."),(0,s.kt)("p",null,"Maestro provides you with an easy way of managing your performance tests, collaborating with the team, and analyzing results. The tool is intended to be a ",(0,s.kt)("strong",{parentName:"p"},"source of truth for your platform performance"),"."),(0,s.kt)("h2",{id:"real-time-metrics"},"Real-time metrics"),(0,s.kt)("p",null,"In-house JMeter integration makes it possible to monitor the execution of your tests since they started."),(0,s.kt)("h3",{id:"hits-vs-errors"},"Hits vs Errors"),(0,s.kt)("p",null,"The core chart is used to understand general test behavior is the relation between Requests per second and count of errors. If you see that two lines have the same number it means that all your requests failing."),(0,s.kt)("p",null,(0,s.kt)("img",{alt:"hits_vs_errors",src:r(5234).Z,width:"2356",height:"1660"})),(0,s.kt)("h3",{id:"response-time"},"Response time"),(0,s.kt)("p",null,"Using Response time percentiles gives you a quick overview of platform performance based on all endpoints. Maestro uses an average label percentile to generate a graph over all requests that were made. It could be misleading in some cases to analyze the platform performance but this is a really good graph to understand if the test execution goes as expected."),(0,s.kt)("p",null,(0,s.kt)("img",{alt:"response_time",src:r(4022).Z,width:"2356",height:"1282"})),(0,s.kt)("h3",{id:"response-codes"},"Response Codes"),(0,s.kt)("p",null,"There are some cases where could have been redirects or just endpoint validation issues that affect performance. Response codes graph is good visualization once you see the performance degradation or just slow response time in general."),(0,s.kt)("p",null,(0,s.kt)("img",{alt:"response_codes",src:r(6468).Z,width:"2356",height:"1258"})),(0,s.kt)("h3",{id:"summary-table"},"Summary Table"),(0,s.kt)("p",null,"In most cases, the Overview tab is enough to use during test execution. Using a Summary table is helpful to analyze all requests performance and compare them with previous Runs. The table also will bring you closer to the problem and help to do improvements specifically in some endpoints."),(0,s.kt)("p",null,(0,s.kt)("img",{alt:"summary",src:r(7397).Z,width:"2393",height:"789"})),(0,s.kt)("h3",{id:"endpoints"},"Endpoints"),(0,s.kt)("p",null,"Graph representation of endpoints by adding time as axis x is helpful to compare two endpoints over time and see if their performance depends on each other."),(0,s.kt)("p",null,(0,s.kt)("img",{alt:"endpoints",src:r(6507).Z,width:"2400",height:"1780"})))}m.isMDXComponent=!0},6507:function(e,t,r){t.Z=r.p+"assets/images/endpoints-0b45cad481a9d8bfc4b7e5fa44864a49.webp"},5234:function(e,t,r){t.Z=r.p+"assets/images/hits_vs_errors-ca8b17c703119c21c4ef71dfed2c6fe1.webp"},6468:function(e,t,r){t.Z=r.p+"assets/images/response_codes-1c360666afe0285bebfe626e89babd46.webp"},4022:function(e,t,r){t.Z=r.p+"assets/images/response_time-8f16425aba3fbfdc6e2a728ae54dc72c.webp"},7397:function(e,t,r){t.Z=r.p+"assets/images/summary-558559e5df3d7843322076725fbcfa56.webp"}}]);