(self.webpackChunkmaestrodocs=self.webpackChunkmaestrodocs||[]).push([[918],{3905:function(e,t,n){"use strict";n.d(t,{Zo:function(){return u},kt:function(){return p}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),s=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=s(e.components);return a.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),d=s(n),p=r,v=d["".concat(i,".").concat(p)]||d[p]||m[p]||l;return n?a.createElement(v,o(o({ref:t},u),{},{components:n})):a.createElement(v,o({ref:t},u))}));function p(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=d;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c.mdxType="string"==typeof e?e:r,o[1]=c;for(var s=2;s<l;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7684:function(e,t,n){"use strict";n.d(t,{Z:function(){return h}});var a=n(7462),r=n(7294),l=n(6010),o=n(8425),c=n(8596),i=n(5281),s=n(9960),u=n(4996),m=n(5999);function d(e){return r.createElement("svg",(0,a.Z)({viewBox:"0 0 24 24"},e),r.createElement("path",{d:"M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z",fill:"currentColor"}))}var p={breadcrumbsContainer:"breadcrumbsContainer_Z_bl",breadcrumbHomeIcon:"breadcrumbHomeIcon_OVgt"};function v(e){var t=e.children,n=e.href,a="breadcrumbs__link";return e.isLast?r.createElement("span",{className:a,itemProp:"name"},t):n?r.createElement(s.Z,{className:a,href:n,itemProp:"item"},r.createElement("span",{itemProp:"name"},t)):r.createElement("span",{className:a},t)}function f(e){var t=e.children,n=e.active,o=e.index,c=e.addMicrodata;return r.createElement("li",(0,a.Z)({},c&&{itemScope:!0,itemProp:"itemListElement",itemType:"https://schema.org/ListItem"},{className:(0,l.Z)("breadcrumbs__item",{"breadcrumbs__item--active":n})}),t,r.createElement("meta",{itemProp:"position",content:String(o+1)}))}function g(){var e=(0,u.Z)("/");return r.createElement("li",{className:"breadcrumbs__item"},r.createElement(s.Z,{"aria-label":(0,m.I)({id:"theme.docs.breadcrumbs.home",message:"Home page",description:"The ARIA label for the home page in the breadcrumbs"}),className:(0,l.Z)("breadcrumbs__link",p.breadcrumbsItemLink),href:e},r.createElement(d,{className:p.breadcrumbHomeIcon})))}function h(){var e=(0,o.s1)(),t=(0,c.Ns)();return e?r.createElement("nav",{className:(0,l.Z)(i.k.docs.docBreadcrumbs,p.breadcrumbsContainer),"aria-label":(0,m.I)({id:"theme.docs.breadcrumbs.navAriaLabel",message:"Breadcrumbs",description:"The ARIA label for the breadcrumbs"})},r.createElement("ul",{className:"breadcrumbs",itemScope:!0,itemType:"https://schema.org/BreadcrumbList"},t&&r.createElement(g,null),e.map((function(t,n){var a=n===e.length-1;return r.createElement(f,{key:n,active:a,index:n,addMicrodata:!!t.href},r.createElement(v,{href:t.href,isLast:a},t.label))})))):null}},7588:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return dt}});var a=n(7294),r=n(6010),l=n(1944),o=n(7524),c=n(5281),i=n(4966),s=n(3120),u=n(4364),m=n(5999);function d(e){var t=e.lastUpdatedAt,n=e.formattedLastUpdatedAt;return a.createElement(m.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:a.createElement("b",null,a.createElement("time",{dateTime:new Date(1e3*t).toISOString()},n))}}," on {date}")}function p(e){var t=e.lastUpdatedBy;return a.createElement(m.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:a.createElement("b",null,t)}}," by {user}")}function v(e){var t=e.lastUpdatedAt,n=e.formattedLastUpdatedAt,r=e.lastUpdatedBy;return a.createElement("span",{className:c.k.common.lastUpdated},a.createElement(m.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t&&n?a.createElement(d,{lastUpdatedAt:t,formattedLastUpdatedAt:n}):"",byUser:r?a.createElement(p,{lastUpdatedBy:r}):""}},"Last updated{atDate}{byUser}"),!1)}var f=n(7462),g=n(3366),h="iconEdit_eYIM",b=["className"];function E(e){var t=e.className,n=(0,g.Z)(e,b);return a.createElement("svg",(0,f.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,r.Z)(h,t),"aria-hidden":"true"},n),a.createElement("g",null,a.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))}function y(e){var t=e.editUrl;return a.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:c.k.common.editThisPage},a.createElement(E,null),a.createElement(m.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}var k=n(9960),N="tag_zVej",L="tagRegular_sFm0",Z="tagWithCount_h2kH";function C(e){var t=e.permalink,n=e.label,l=e.count;return a.createElement(k.Z,{href:t,className:(0,r.Z)(N,l?Z:L)},n,l&&a.createElement("span",null,l))}var _="tags_jXut",T="tag_QGVx";function w(e){var t=e.tags;return a.createElement(a.Fragment,null,a.createElement("b",null,a.createElement(m.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),a.createElement("ul",{className:(0,r.Z)(_,"padding--none","margin-left--sm")},t.map((function(e){var t=e.label,n=e.permalink;return a.createElement("li",{key:n,className:T},a.createElement(C,{label:t,permalink:n}))}))))}var x="lastUpdated_vbeJ";function B(e){return a.createElement("div",{className:(0,r.Z)(c.k.docs.docFooterTagsRow,"row margin-bottom--sm")},a.createElement("div",{className:"col"},a.createElement(w,e)))}function O(e){var t=e.editUrl,n=e.lastUpdatedAt,l=e.lastUpdatedBy,o=e.formattedLastUpdatedAt;return a.createElement("div",{className:(0,r.Z)(c.k.docs.docFooterEditMetaRow,"row")},a.createElement("div",{className:"col"},t&&a.createElement(y,{editUrl:t})),a.createElement("div",{className:(0,r.Z)("col",x)},(n||l)&&a.createElement(v,{lastUpdatedAt:n,formattedLastUpdatedAt:o,lastUpdatedBy:l})))}function j(e){var t=e.content.metadata,n=t.editUrl,l=t.lastUpdatedAt,o=t.formattedLastUpdatedAt,i=t.lastUpdatedBy,s=t.tags,u=s.length>0,m=!!(n||l||i);return u||m?a.createElement("footer",{className:(0,r.Z)(c.k.docs.docFooter,"docusaurus-mt-lg")},u&&a.createElement(B,{tags:s}),m&&a.createElement(O,{editUrl:n,lastUpdatedAt:l,lastUpdatedBy:i,formattedLastUpdatedAt:o})):null}var A=n(6668),H=["parentIndex"];function S(e){var t=e.map((function(e){return Object.assign({},e,{parentIndex:-1,children:[]})})),n=Array(7).fill(-1);t.forEach((function(e,t){var a=n.slice(2,e.level);e.parentIndex=Math.max.apply(Math,a),n[e.level]=t}));var a=[];return t.forEach((function(e){var n=e.parentIndex,r=(0,g.Z)(e,H);n>=0?t[n].children.push(r):a.push(r)})),a}function I(e){var t=e.toc,n=e.minHeadingLevel,a=e.maxHeadingLevel;return t.flatMap((function(e){var t=I({toc:e.children,minHeadingLevel:n,maxHeadingLevel:a});return function(e){return e.level>=n&&e.level<=a}(e)?[Object.assign({},e,{children:t})]:t}))}function P(e){var t=e.getBoundingClientRect();return t.top===t.bottom?P(e.parentNode):t}function U(e,t){var n,a,r=t.anchorTopOffset,l=e.find((function(e){return P(e).top>=r}));return l?function(e){return e.top>0&&e.bottom<window.innerHeight/2}(P(l))?l:null!=(a=e[e.indexOf(l)-1])?a:null:null!=(n=e[e.length-1])?n:null}function M(){var e=(0,a.useRef)(0),t=(0,A.L)().navbar.hideOnScroll;return(0,a.useEffect)((function(){e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}function V(e){var t=(0,a.useRef)(void 0),n=M();(0,a.useEffect)((function(){if(!e)return function(){};var a=e.linkClassName,r=e.linkActiveClassName,l=e.minHeadingLevel,o=e.maxHeadingLevel;function c(){var e=function(e){return Array.from(document.getElementsByClassName(e))}(a),c=function(e){for(var t=e.minHeadingLevel,n=e.maxHeadingLevel,a=[],r=t;r<=n;r+=1)a.push("h"+r+".anchor");return Array.from(document.querySelectorAll(a.join()))}({minHeadingLevel:l,maxHeadingLevel:o}),i=U(c,{anchorTopOffset:n.current}),s=e.find((function(e){return i&&i.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)}));e.forEach((function(e){!function(e,n){n?(t.current&&t.current!==e&&t.current.classList.remove(r),e.classList.add(r),t.current=e):e.classList.remove(r)}(e,e===s)}))}return document.addEventListener("scroll",c),document.addEventListener("resize",c),c(),function(){document.removeEventListener("scroll",c),document.removeEventListener("resize",c)}}),[e,n])}function D(e){var t=e.toc,n=e.className,r=e.linkClassName,l=e.isChild;return t.length?a.createElement("ul",{className:l?void 0:n},t.map((function(e){return a.createElement("li",{key:e.id},a.createElement("a",{href:"#"+e.id,className:null!=r?r:void 0,dangerouslySetInnerHTML:{__html:e.value}}),a.createElement(D,{isChild:!0,toc:e.children,className:n,linkClassName:r}))}))):null}var R=a.memo(D),z=["toc","className","linkClassName","linkActiveClassName","minHeadingLevel","maxHeadingLevel"];function W(e){var t=e.toc,n=e.className,r=void 0===n?"table-of-contents table-of-contents__left-border":n,l=e.linkClassName,o=void 0===l?"table-of-contents__link":l,c=e.linkActiveClassName,i=void 0===c?void 0:c,s=e.minHeadingLevel,u=e.maxHeadingLevel,m=(0,g.Z)(e,z),d=(0,A.L)(),p=null!=s?s:d.tableOfContents.minHeadingLevel,v=null!=u?u:d.tableOfContents.maxHeadingLevel,h=function(e){var t=e.toc,n=e.minHeadingLevel,r=e.maxHeadingLevel;return(0,a.useMemo)((function(){return I({toc:S(t),minHeadingLevel:n,maxHeadingLevel:r})}),[t,n,r])}({toc:t,minHeadingLevel:p,maxHeadingLevel:v});return V((0,a.useMemo)((function(){if(o&&i)return{linkClassName:o,linkActiveClassName:i,minHeadingLevel:p,maxHeadingLevel:v}}),[o,i,p,v])),a.createElement(R,(0,f.Z)({toc:h,className:r,linkClassName:o},m))}var F="tableOfContents_bqdL",q=["className"];function G(e){var t=e.className,n=(0,g.Z)(e,q);return a.createElement("div",{className:(0,r.Z)(F,"thin-scrollbar",t)},a.createElement(W,(0,f.Z)({},n,{linkClassName:"table-of-contents__link toc-highlight",linkActiveClassName:"table-of-contents__link--active"})))}var J=n(6043),Y="tocCollapsibleButton_TO0P",$="tocCollapsibleButtonExpanded_MG3E",X=["collapsed"];function K(e){var t=e.collapsed,n=(0,g.Z)(e,X);return a.createElement("button",(0,f.Z)({type:"button"},n,{className:(0,r.Z)("clean-btn",Y,!t&&$,n.className)}),a.createElement(m.Z,{id:"theme.TOCCollapsible.toggleButtonLabel",description:"The label used by the button on the collapsible TOC component"},"On this page"))}var Q="tocCollapsible_ETCw",ee="tocCollapsibleContent_vkbj",te="tocCollapsibleExpanded_sAul";function ne(e){var t=e.toc,n=e.className,l=e.minHeadingLevel,o=e.maxHeadingLevel,c=(0,J.u)({initialState:!0}),i=c.collapsed,s=c.toggleCollapsed;return a.createElement("div",{className:(0,r.Z)(Q,!i&&te,n)},a.createElement(K,{collapsed:i,onClick:s}),a.createElement(J.z,{lazy:!0,className:ee,collapsed:i},a.createElement(W,{toc:t,minHeadingLevel:l,maxHeadingLevel:o})))}var ae=n(2503),re=n(7684),le=n(3905),oe=n(5742),ce=["mdxType","originalType"];var ie=n(2389),se=n(2949);function ue(){var e=(0,A.L)().prism,t=(0,se.I)().colorMode,n=e.theme,a=e.darkTheme||n;return"dark"===t?a:n}var me=n(6528),de=n(7594),pe=n.n(de),ve=(0,me.Z)(/title=(["'])(.*?)\1/,{quote:1,title:2}),fe=(0,me.Z)(/\{([\d,-]+)\}/,{range:1}),ge={js:{start:"\\/\\/",end:""},jsBlock:{start:"\\/\\*",end:"\\*\\/"},jsx:{start:"\\{\\s*\\/\\*",end:"\\*\\/\\s*\\}"},bash:{start:"#",end:""},html:{start:"\x3c!--",end:"--\x3e"}};function he(e,t){var n=e.map((function(e){var n=ge[e],a=n.start,r=n.end;return"(?:"+a+"\\s*("+t.flatMap((function(e){var t,n;return[e.line,null==(t=e.block)?void 0:t.start,null==(n=e.block)?void 0:n.end].filter(Boolean)})).join("|")+")\\s*"+r+")"})).join("|");return new RegExp("^\\s*(?:"+n+")\\s*$")}function be(e,t){var n=e.replace(/\n$/,""),a=t.language,r=t.magicComments,l=t.metastring;if(l&&fe.test(l)){var o=l.match(fe).groups.range;if(0===r.length)throw new Error("A highlight range has been given in code block's metastring (``` "+l+"), but no magic comment config is available. Docusaurus applies the first magic comment entry's className for metastring ranges.");var c=r[0].className,i=pe()(o).filter((function(e){return e>0})).map((function(e){return[e-1,[c]]}));return{lineClassNames:Object.fromEntries(i),code:n}}if(void 0===a)return{lineClassNames:{},code:n};for(var s=function(e,t){switch(e){case"js":case"javascript":case"ts":case"typescript":return he(["js","jsBlock"],t);case"jsx":case"tsx":return he(["js","jsBlock","jsx"],t);case"html":return he(["js","jsBlock","html"],t);case"python":case"py":case"bash":return he(["bash"],t);case"markdown":case"md":return he(["html","jsx","bash"],t);default:return he(Object.keys(ge),t)}}(a,r),u=n.split("\n"),m=Object.fromEntries(r.map((function(e){return[e.className,{start:0,range:""}]}))),d=Object.fromEntries(r.filter((function(e){return e.line})).map((function(e){var t=e.className;return[e.line,t]}))),p=Object.fromEntries(r.filter((function(e){return e.block})).map((function(e){var t=e.className;return[e.block.start,t]}))),v=Object.fromEntries(r.filter((function(e){return e.block})).map((function(e){var t=e.className;return[e.block.end,t]}))),f=0;f<u.length;){var g=u[f].match(s);if(g){var h=g.slice(1).find((function(e){return void 0!==e}));d[h]?m[d[h]].range+=f+",":p[h]?m[p[h]].start=f:v[h]&&(m[v[h]].range+=m[v[h]].start+"-"+(f-1)+","),u.splice(f,1)}else f+=1}n=u.join("\n");var b={};return Object.entries(m).forEach((function(e){var t=e[0],n=e[1].range;pe()(n).forEach((function(e){null!=b[e]||(b[e]=[]),b[e].push(t)}))})),{lineClassNames:b,code:n}}var Ee="codeBlockContainer_Ckt0",ye=["as"];function ke(e){var t=e.as,n=(0,g.Z)(e,ye),l=function(e){var t={color:"--prism-color",backgroundColor:"--prism-background-color"},n={};return Object.entries(e.plain).forEach((function(e){var a=e[0],r=e[1],l=t[a];l&&"string"==typeof r&&(n[l]=r)})),n}(ue());return a.createElement(t,(0,f.Z)({},n,{style:l,className:(0,r.Z)(n.className,Ee,c.k.common.codeBlock)}))}var Ne={codeBlockContent:"codeBlockContent_biex",codeBlockTitle:"codeBlockTitle_Ktv7",codeBlock:"codeBlock_bY9V",codeBlockStandalone:"codeBlockStandalone_MEMb",codeBlockLines:"codeBlockLines_e6Vv",codeBlockLinesWithNumbering:"codeBlockLinesWithNumbering_o6Pm",buttonGroup:"buttonGroup__atx"};function Le(e){var t=e.children,n=e.className;return a.createElement(ke,{as:"pre",tabIndex:0,className:(0,r.Z)(Ne.codeBlockStandalone,"thin-scrollbar",n)},a.createElement("code",{className:Ne.codeBlockLines},t))}var Ze={plain:{backgroundColor:"#2a2734",color:"#9a86fd"},styles:[{types:["comment","prolog","doctype","cdata","punctuation"],style:{color:"#6c6783"}},{types:["namespace"],style:{opacity:.7}},{types:["tag","operator","number"],style:{color:"#e09142"}},{types:["property","function"],style:{color:"#9a86fd"}},{types:["tag-id","selector","atrule-id"],style:{color:"#eeebff"}},{types:["attr-name"],style:{color:"#c4b9fe"}},{types:["boolean","string","entity","url","attr-value","keyword","control","directive","unit","statement","regex","atrule","placeholder","variable"],style:{color:"#ffcc99"}},{types:["deleted"],style:{textDecorationLine:"line-through"}},{types:["inserted"],style:{textDecorationLine:"underline"}},{types:["italic"],style:{fontStyle:"italic"}},{types:["important","bold"],style:{fontWeight:"bold"}},{types:["important"],style:{color:"#c4b9fe"}}]},Ce={Prism:n(7410).Z,theme:Ze};function _e(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Te(){return Te=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},Te.apply(this,arguments)}var we=/\r\n|\r|\n/,xe=function(e){0===e.length?e.push({types:["plain"],content:"\n",empty:!0}):1===e.length&&""===e[0].content&&(e[0].content="\n",e[0].empty=!0)},Be=function(e,t){var n=e.length;return n>0&&e[n-1]===t?e:e.concat(t)},Oe=function(e,t){var n=e.plain,a=Object.create(null),r=e.styles.reduce((function(e,n){var a=n.languages,r=n.style;return a&&!a.includes(t)||n.types.forEach((function(t){var n=Te({},e[t],r);e[t]=n})),e}),a);return r.root=n,r.plain=Te({},n,{backgroundColor:null}),r};function je(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&-1===t.indexOf(a)&&(n[a]=e[a]);return n}var Ae=function(e){function t(){for(var t=this,n=[],a=arguments.length;a--;)n[a]=arguments[a];e.apply(this,n),_e(this,"getThemeDict",(function(e){if(void 0!==t.themeDict&&e.theme===t.prevTheme&&e.language===t.prevLanguage)return t.themeDict;t.prevTheme=e.theme,t.prevLanguage=e.language;var n=e.theme?Oe(e.theme,e.language):void 0;return t.themeDict=n})),_e(this,"getLineProps",(function(e){var n=e.key,a=e.className,r=e.style,l=Te({},je(e,["key","className","style","line"]),{className:"token-line",style:void 0,key:void 0}),o=t.getThemeDict(t.props);return void 0!==o&&(l.style=o.plain),void 0!==r&&(l.style=void 0!==l.style?Te({},l.style,r):r),void 0!==n&&(l.key=n),a&&(l.className+=" "+a),l})),_e(this,"getStyleForToken",(function(e){var n=e.types,a=e.empty,r=n.length,l=t.getThemeDict(t.props);if(void 0!==l){if(1===r&&"plain"===n[0])return a?{display:"inline-block"}:void 0;if(1===r&&!a)return l[n[0]];var o=a?{display:"inline-block"}:{},c=n.map((function(e){return l[e]}));return Object.assign.apply(Object,[o].concat(c))}})),_e(this,"getTokenProps",(function(e){var n=e.key,a=e.className,r=e.style,l=e.token,o=Te({},je(e,["key","className","style","token"]),{className:"token "+l.types.join(" "),children:l.content,style:t.getStyleForToken(l),key:void 0});return void 0!==r&&(o.style=void 0!==o.style?Te({},o.style,r):r),void 0!==n&&(o.key=n),a&&(o.className+=" "+a),o})),_e(this,"tokenize",(function(e,t,n,a){var r={code:t,grammar:n,language:a,tokens:[]};e.hooks.run("before-tokenize",r);var l=r.tokens=e.tokenize(r.code,r.grammar,r.language);return e.hooks.run("after-tokenize",r),l}))}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.render=function(){var e=this.props,t=e.Prism,n=e.language,a=e.code,r=e.children,l=this.getThemeDict(this.props),o=t.languages[n];return r({tokens:function(e){for(var t=[[]],n=[e],a=[0],r=[e.length],l=0,o=0,c=[],i=[c];o>-1;){for(;(l=a[o]++)<r[o];){var s=void 0,u=t[o],m=n[o][l];if("string"==typeof m?(u=o>0?u:["plain"],s=m):(u=Be(u,m.type),m.alias&&(u=Be(u,m.alias)),s=m.content),"string"==typeof s){var d=s.split(we),p=d.length;c.push({types:u,content:d[0]});for(var v=1;v<p;v++)xe(c),i.push(c=[]),c.push({types:u,content:d[v]})}else o++,t.push(u),n.push(s),a.push(0),r.push(s.length)}o--,t.pop(),n.pop(),a.pop(),r.pop()}return xe(c),i}(void 0!==o?this.tokenize(t,a,o,n):[a]),className:"prism-code language-"+n,style:void 0!==l?l.root:{},getLineProps:this.getLineProps,getTokenProps:this.getTokenProps})},t}(a.Component),He=Ae,Se="codeLine_lJS_",Ie="codeLineNumber_Tfdd",Pe="codeLineContent_feaV";function Ue(e){var t=e.line,n=e.classNames,l=e.showLineNumbers,o=e.getLineProps,c=e.getTokenProps;1===t.length&&"\n"===t[0].content&&(t[0].content="");var i=o({line:t,className:(0,r.Z)(n,l&&Se)}),s=t.map((function(e,t){return a.createElement("span",(0,f.Z)({key:t},c({token:e,key:t})))}));return a.createElement("span",i,l?a.createElement(a.Fragment,null,a.createElement("span",{className:Ie}),a.createElement("span",{className:Pe},s)):a.createElement(a.Fragment,null,s,a.createElement("br",null)))}var Me={copyButtonCopied:"copyButtonCopied_obH4",copyButtonIcons:"copyButtonIcons_eSgA",copyButtonIcon:"copyButtonIcon_y97N",copyButtonSuccessIcon:"copyButtonSuccessIcon_LjdS"};function Ve(e){var t=e.code,n=e.className,l=(0,a.useState)(!1),o=l[0],c=l[1],i=(0,a.useRef)(void 0),s=(0,a.useCallback)((function(){!function(e,t){var n=(void 0===t?{}:t).target,a=void 0===n?document.body:n,r=document.createElement("textarea"),l=document.activeElement;r.value=e,r.setAttribute("readonly",""),r.style.contain="strict",r.style.position="absolute",r.style.left="-9999px",r.style.fontSize="12pt";var o=document.getSelection(),c=!1;o.rangeCount>0&&(c=o.getRangeAt(0)),a.append(r),r.select(),r.selectionStart=0,r.selectionEnd=e.length;var i=!1;try{i=document.execCommand("copy")}catch(s){}r.remove(),c&&(o.removeAllRanges(),o.addRange(c)),l&&l.focus()}(t),c(!0),i.current=window.setTimeout((function(){c(!1)}),1e3)}),[t]);return(0,a.useEffect)((function(){return function(){return window.clearTimeout(i.current)}}),[]),a.createElement("button",{type:"button","aria-label":o?(0,m.I)({id:"theme.CodeBlock.copied",message:"Copied",description:"The copied button label on code blocks"}):(0,m.I)({id:"theme.CodeBlock.copyButtonAriaLabel",message:"Copy code to clipboard",description:"The ARIA label for copy code blocks button"}),title:(0,m.I)({id:"theme.CodeBlock.copy",message:"Copy",description:"The copy button label on code blocks"}),className:(0,r.Z)("clean-btn",n,Me.copyButton,o&&Me.copyButtonCopied),onClick:s},a.createElement("span",{className:Me.copyButtonIcons,"aria-hidden":"true"},a.createElement("svg",{className:Me.copyButtonIcon,viewBox:"0 0 24 24"},a.createElement("path",{d:"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"})),a.createElement("svg",{className:Me.copyButtonSuccessIcon,viewBox:"0 0 24 24"},a.createElement("path",{d:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}))))}var De="wordWrapButtonIcon_Bwma",Re="wordWrapButtonEnabled_EoeP";function ze(e){var t=e.className,n=e.onClick,l=e.isEnabled,o=(0,m.I)({id:"theme.CodeBlock.wordWrapToggle",message:"Toggle word wrap",description:"The title attribute for toggle word wrapping button of code block lines"});return a.createElement("button",{type:"button",onClick:n,className:(0,r.Z)("clean-btn",t,l&&Re),"aria-label":o,title:o},a.createElement("svg",{className:De,viewBox:"0 0 24 24","aria-hidden":"true"},a.createElement("path",{fill:"currentColor",d:"M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3l3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"})))}function We(e){var t,n,l,o,c,i,s,u,m,d,p,v=e.children,g=e.className,h=void 0===g?"":g,b=e.metastring,E=e.title,y=e.showLineNumbers,k=e.language,N=(0,A.L)().prism,L=N.defaultLanguage,Z=N.magicComments,C=null!=(t=null!=k?k:null==(n=h.split(" ").find((function(e){return e.startsWith("language-")})))?void 0:n.replace(/language-/,""))?t:L,_=ue(),T=(l=(0,a.useState)(!1),o=l[0],c=l[1],i=(0,a.useState)(!1),s=i[0],u=i[1],m=(0,a.useRef)(null),d=(0,a.useCallback)((function(){var e=m.current.querySelector("code");o?e.removeAttribute("style"):e.style.whiteSpace="pre-wrap",c((function(e){return!e}))}),[m,o]),p=(0,a.useCallback)((function(){var e=m.current,t=e.scrollWidth>e.clientWidth||m.current.querySelector("code").hasAttribute("style");u(t)}),[m]),(0,a.useEffect)((function(){p()}),[o,p]),(0,a.useEffect)((function(){return window.addEventListener("resize",p,{passive:!0}),function(){window.removeEventListener("resize",p)}}),[p]),{codeBlockRef:m,isEnabled:o,isCodeScrollable:s,toggle:d}),w=function(e){var t,n;return null!=(t=null==e||null==(n=e.match(ve))?void 0:n.groups.title)?t:""}(b)||E,x=be(v,{metastring:b,language:C,magicComments:Z}),B=x.lineClassNames,O=x.code,j=null!=y?y:function(e){return Boolean(null==e?void 0:e.includes("showLineNumbers"))}(b);return a.createElement(ke,{as:"div",className:(0,r.Z)(h,C&&!h.includes("language-"+C)&&"language-"+C)},w&&a.createElement("div",{className:Ne.codeBlockTitle},w),a.createElement("div",{className:Ne.codeBlockContent},a.createElement(He,(0,f.Z)({},Ce,{theme:_,code:O,language:null!=C?C:"text"}),(function(e){var t=e.className,n=e.tokens,l=e.getLineProps,o=e.getTokenProps;return a.createElement("pre",{tabIndex:0,ref:T.codeBlockRef,className:(0,r.Z)(t,Ne.codeBlock,"thin-scrollbar")},a.createElement("code",{className:(0,r.Z)(Ne.codeBlockLines,j&&Ne.codeBlockLinesWithNumbering)},n.map((function(e,t){return a.createElement(Ue,{key:t,line:e,getLineProps:l,getTokenProps:o,classNames:B[t],showLineNumbers:j})}))))})),a.createElement("div",{className:Ne.buttonGroup},(T.isEnabled||T.isCodeScrollable)&&a.createElement(ze,{className:Ne.codeButton,onClick:function(){return T.toggle()},isEnabled:T.isEnabled}),a.createElement(Ve,{className:Ne.codeButton,code:O}))))}var Fe=["children"];function qe(e){var t=e.children,n=(0,g.Z)(e,Fe),r=(0,ie.Z)(),l=function(e){return a.Children.toArray(e).some((function(e){return(0,a.isValidElement)(e)}))?e:Array.isArray(e)?e.join(""):e}(t),o="string"==typeof l?We:Le;return a.createElement(o,(0,f.Z)({key:String(r)},n),l)}var Ge="details_lb9f",Je="isBrowser_bmU9",Ye="collapsibleContent_i85q",$e=["summary","children"];function Xe(e){return!!e&&("SUMMARY"===e.tagName||Xe(e.parentElement))}function Ke(e,t){return!!e&&(e===t||Ke(e.parentElement,t))}function Qe(e){var t=e.summary,n=e.children,l=(0,g.Z)(e,$e),o=(0,ie.Z)(),c=(0,a.useRef)(null),i=(0,J.u)({initialState:!l.open}),s=i.collapsed,u=i.setCollapsed,m=(0,a.useState)(l.open),d=m[0],p=m[1];return a.createElement("details",(0,f.Z)({},l,{ref:c,open:d,"data-collapsed":s,className:(0,r.Z)(Ge,o&&Je,l.className),onMouseDown:function(e){Xe(e.target)&&e.detail>1&&e.preventDefault()},onClick:function(e){e.stopPropagation();var t=e.target;Xe(t)&&Ke(t,c.current)&&(e.preventDefault(),s?(u(!1),p(!0)):u(!0))}}),null!=t?t:a.createElement("summary",null,"Details"),a.createElement(J.z,{lazy:!1,collapsed:s,disableSSRStyle:!0,onCollapseTransitionEnd:function(e){u(e),p(!e)}},a.createElement("div",{className:Ye},n)))}var et="details_b_Ee";function tt(e){var t=Object.assign({},e);return a.createElement(Qe,(0,f.Z)({},t,{className:(0,r.Z)("alert alert--info",et,t.className)}))}function nt(e){return a.createElement(ae.Z,e)}var at="containsTaskList_mC6p";var rt="img_ev3q";var lt={head:function(e){var t=a.Children.map(e.children,(function(e){return a.isValidElement(e)?function(e){var t;if(null!=(t=e.props)&&t.mdxType&&e.props.originalType){var n=e.props,r=(n.mdxType,n.originalType,(0,g.Z)(n,ce));return a.createElement(e.props.originalType,r)}return e}(e):e}));return a.createElement(oe.Z,e,t)},code:function(e){var t=["a","b","big","i","span","em","strong","sup","sub","small"];return a.Children.toArray(e.children).every((function(e){return"string"==typeof e&&!e.includes("\n")||(0,a.isValidElement)(e)&&t.includes(e.props.mdxType)}))?a.createElement("code",e):a.createElement(qe,e)},a:function(e){return a.createElement(k.Z,e)},pre:function(e){var t;return a.createElement(qe,(0,a.isValidElement)(e.children)&&"code"===(null==(t=e.children.props)?void 0:t.originalType)?e.children.props:Object.assign({},e))},details:function(e){var t=a.Children.toArray(e.children),n=t.find((function(e){var t;return a.isValidElement(e)&&"summary"===(null==(t=e.props)?void 0:t.mdxType)})),r=a.createElement(a.Fragment,null,t.filter((function(e){return e!==n})));return a.createElement(tt,(0,f.Z)({},e,{summary:n}),r)},ul:function(e){return a.createElement("ul",(0,f.Z)({},e,{className:(t=e.className,(0,r.Z)(t,(null==t?void 0:t.includes("contains-task-list"))&&at))}));var t},img:function(e){return a.createElement("img",(0,f.Z)({loading:"lazy"},e,{className:(t=e.className,(0,r.Z)(t,rt))}));var t},h1:function(e){return a.createElement(nt,(0,f.Z)({as:"h1"},e))},h2:function(e){return a.createElement(nt,(0,f.Z)({as:"h2"},e))},h3:function(e){return a.createElement(nt,(0,f.Z)({as:"h3"},e))},h4:function(e){return a.createElement(nt,(0,f.Z)({as:"h4"},e))},h5:function(e){return a.createElement(nt,(0,f.Z)({as:"h5"},e))},h6:function(e){return a.createElement(nt,(0,f.Z)({as:"h6"},e))}};function ot(e){var t=e.children;return a.createElement(le.Zo,{components:lt},t)}var ct="docItemContainer_Adtb",it="docItemCol_GujU",st="tocMobile_aoJ5";function ut(e){var t,n=e.content,r=n.metadata,o=n.frontMatter,c=n.assets,i=o.keywords,s=r.description,u=r.title,m=null!=(t=c.image)?t:o.image;return a.createElement(l.d,{title:u,description:s,keywords:i,image:m})}function mt(e){var t=e.content,n=t.metadata,l=t.frontMatter,m=l.hide_title,d=l.hide_table_of_contents,p=l.toc_min_heading_level,v=l.toc_max_heading_level,f=n.title,g=!m&&void 0===t.contentTitle,h=(0,o.i)(),b=!d&&t.toc&&t.toc.length>0,E=b&&("desktop"===h||"ssr"===h);return a.createElement("div",{className:"row"},a.createElement("div",{className:(0,r.Z)("col",!d&&it)},a.createElement(s.Z,null),a.createElement("div",{className:ct},a.createElement("article",null,a.createElement(re.Z,null),a.createElement(u.Z,null),b&&a.createElement(ne,{toc:t.toc,minHeadingLevel:p,maxHeadingLevel:v,className:(0,r.Z)(c.k.docs.docTocMobile,st)}),a.createElement("div",{className:(0,r.Z)(c.k.docs.docMarkdown,"markdown")},g&&a.createElement("header",null,a.createElement(ae.Z,{as:"h1"},f)),a.createElement(ot,null,a.createElement(t,null))),a.createElement(j,e)),a.createElement(i.Z,{previous:n.previous,next:n.next}))),E&&a.createElement("div",{className:"col col--3"},a.createElement(G,{toc:t.toc,minHeadingLevel:p,maxHeadingLevel:v,className:c.k.docs.docTocDesktop})))}function dt(e){var t="docs-doc-id-"+e.content.metadata.unversionedId;return a.createElement(l.FG,{className:t},a.createElement(ut,e),a.createElement(mt,e))}},4966:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});var a=n(7462),r=n(7294),l=n(5999),o=n(6010),c=n(9960);function i(e){var t=e.permalink,n=e.title,a=e.subLabel,l=e.isNext;return r.createElement(c.Z,{className:(0,o.Z)("pagination-nav__link",l?"pagination-nav__link--next":"pagination-nav__link--prev"),to:t},a&&r.createElement("div",{className:"pagination-nav__sublabel"},a),r.createElement("div",{className:"pagination-nav__label"},n))}function s(e){var t=e.previous,n=e.next;return r.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,l.I)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages navigation",description:"The ARIA label for the docs pagination"})},t&&r.createElement(i,(0,a.Z)({},t,{subLabel:r.createElement(l.Z,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc"},"Previous")})),n&&r.createElement(i,(0,a.Z)({},n,{subLabel:r.createElement(l.Z,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc"},"Next"),isNext:!0})))}},4364:function(e,t,n){"use strict";n.d(t,{Z:function(){return i}});var a=n(7294),r=n(6010),l=n(5999),o=n(4477),c=n(5281);function i(e){var t=e.className,n=(0,o.E)();return n.badge?a.createElement("span",{className:(0,r.Z)(t,c.k.docs.docVersionBadge,"badge badge--secondary")},a.createElement(l.Z,{id:"theme.docs.versionBadge.label",values:{versionLabel:n.label}},"Version: {versionLabel}")):null}},3120:function(e,t,n){"use strict";n.d(t,{Z:function(){return g}});var a=n(7294),r=n(6010),l=n(2263),o=n(9960),c=n(5999),i=n(143),s=n(373),u=n(5281),m=n(4477);var d={unreleased:function(e){var t=e.siteTitle,n=e.versionMetadata;return a.createElement(c.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:a.createElement("b",null,n.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){var t=e.siteTitle,n=e.versionMetadata;return a.createElement(c.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:a.createElement("b",null,n.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function p(e){var t=d[e.versionMetadata.banner];return a.createElement(t,e)}function v(e){var t=e.versionLabel,n=e.to,r=e.onClick;return a.createElement(c.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:a.createElement("b",null,a.createElement(o.Z,{to:n,onClick:r},a.createElement(c.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function f(e){var t,n=e.className,o=e.versionMetadata,c=(0,l.Z)().siteConfig.title,m=(0,i.gA)({failfast:!0}).pluginId,d=(0,s.J)(m).savePreferredVersionName,f=(0,i.Jo)(m),g=f.latestDocSuggestion,h=f.latestVersionSuggestion,b=null!=g?g:(t=h).docs.find((function(e){return e.id===t.mainDocId}));return a.createElement("div",{className:(0,r.Z)(n,u.k.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},a.createElement("div",null,a.createElement(p,{siteTitle:c,versionMetadata:o})),a.createElement("div",{className:"margin-top--md"},a.createElement(v,{versionLabel:h.label,to:b.path,onClick:function(){return d(h.name)}})))}function g(e){var t=e.className,n=(0,m.E)();return n.banner?a.createElement(f,{className:t,versionMetadata:n}):null}},2503:function(e,t,n){"use strict";n.d(t,{Z:function(){return d}});var a=n(7462),r=n(3366),l=n(7294),o=n(6010),c=n(5999),i=n(6668),s="anchorWithStickyNavbar_LWe7",u="anchorWithHideOnScrollNavbar_WYt5",m=["as","id"];function d(e){var t=e.as,n=e.id,d=(0,r.Z)(e,m),p=(0,i.L)().navbar.hideOnScroll;return"h1"!==t&&n?l.createElement(t,(0,a.Z)({},d,{className:(0,o.Z)("anchor",p?u:s),id:n}),d.children,l.createElement("a",{className:"hash-link",href:"#"+n,title:(0,c.I)({id:"theme.common.headingLinkTitle",message:"Direct link to heading",description:"Title for link to heading"})},"\u200b")):l.createElement(t,(0,a.Z)({},d,{id:void 0}))}},7594:function(e,t){function n(e){let t,n=[];for(let a of e.split(",").map((e=>e.trim())))if(/^-?\d+$/.test(a))n.push(parseInt(a,10));else if(t=a.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/)){let[e,a,r,l]=t;if(a&&l){a=parseInt(a),l=parseInt(l);const e=a<l?1:-1;"-"!==r&&".."!==r&&"\u2025"!==r||(l+=e);for(let t=a;t!==l;t+=e)n.push(t)}}return n}t.default=n,e.exports=n}}]);