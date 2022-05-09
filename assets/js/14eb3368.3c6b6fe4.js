"use strict";(self.webpackChunkmaestrodocs=self.webpackChunkmaestrodocs||[]).push([[817],{6487:function(e,t,n){n.d(t,{Z:function(){return f}});var a=n(7462),r=n(7294),i=n(8425),l=n(8596),c=n(5281),s={breadcrumbsContainer:"breadcrumbsContainer_Xlws",breadcrumbHomeIcon:"breadcrumbHomeIcon_kU5B"},o=n(6010),m=n(9960),d=n(4996),u=n(5999);function v(e){return r.createElement("svg",(0,a.Z)({viewBox:"0 0 24 24"},e),r.createElement("path",{d:"M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z",fill:"currentColor"}))}function b(e){var t=e.children,n=e.href,a="breadcrumbs__link";return e.isLast?r.createElement("span",{className:a,itemProp:"name"},t):n?r.createElement(m.Z,{className:a,href:n,itemProp:"item"},r.createElement("span",{itemProp:"name"},t)):r.createElement("span",{className:a},t)}function h(e){var t=e.children,n=e.active,i=e.index,l=e.addMicrodata;return r.createElement("li",(0,a.Z)({},l&&{itemScope:!0,itemProp:"itemListElement",itemType:"https://schema.org/ListItem"},{className:(0,o.Z)("breadcrumbs__item",{"breadcrumbs__item--active":n})}),t,r.createElement("meta",{itemProp:"position",content:String(i+1)}))}function g(){var e=(0,d.Z)("/");return r.createElement("li",{className:"breadcrumbs__item"},r.createElement(m.Z,{"aria-label":(0,u.I)({id:"theme.docs.breadcrumbs.home",message:"Home page",description:"The ARIA label for the home page in the breadcrumbs"}),className:(0,o.Z)("breadcrumbs__link",s.breadcrumbsItemLink),href:e},r.createElement(v,{className:s.breadcrumbHomeIcon})))}function f(){var e=(0,i.s1)(),t=(0,l.Ns)();return e?r.createElement("nav",{className:(0,o.Z)(c.k.docs.docBreadcrumbs,s.breadcrumbsContainer),"aria-label":(0,u.I)({id:"theme.docs.breadcrumbs.navAriaLabel",message:"Breadcrumbs",description:"The ARIA label for the breadcrumbs"})},r.createElement("ul",{className:"breadcrumbs",itemScope:!0,itemType:"https://schema.org/BreadcrumbList"},t&&r.createElement(g,null),e.map((function(t,n){var a=n===e.length-1;return r.createElement(h,{key:n,active:a,index:n,addMicrodata:!!t.href},r.createElement(b,{href:t.href,isLast:a},t.label))})))):null}},8507:function(e,t,n){n.r(t),n.d(t,{default:function(){return C}});var a=n(7294),r=n(1944),i=n(8425),l=n(6010),c=n(9960),s="cardContainer_woeA",o="cardTitle_pNjP",m="cardDescription_qC_k",d=n(3919),u=n(5999);function v(e){var t=e.href,n=e.children;return a.createElement(c.Z,{href:t,className:(0,l.Z)("card padding--lg",s)},n)}function b(e){var t=e.href,n=e.icon,r=e.title,i=e.description;return a.createElement(v,{href:t},a.createElement("h2",{className:(0,l.Z)("text--truncate",o),title:r},n," ",r),i&&a.createElement("p",{className:(0,l.Z)("text--truncate",m),title:i},i))}function h(e){var t=e.item,n=(0,i.Wl)(t);return n?a.createElement(b,{href:n,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:(0,u.I)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t.items.length})}):null}function g(e){var t,n=e.item,r=(0,d.Z)(n.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",l=(0,i.xz)(null!=(t=n.docId)?t:void 0);return a.createElement(b,{href:n.href,icon:r,title:n.label,description:null==l?void 0:l.description})}function f(e){var t=e.item;switch(t.type){case"link":return a.createElement(g,{item:t});case"category":return a.createElement(h,{item:t});default:throw new Error("unknown item type "+JSON.stringify(t))}}function p(e){var t=e.items,n=e.className;return a.createElement("section",{className:(0,l.Z)("row",n)},function(e){return e.filter((function(e){return"category"!==e.type||!!(0,i.Wl)(e)}))}(t).map((function(e,t){return a.createElement("article",{key:t,className:"col col--6 margin-bottom--lg"},a.createElement(f,{key:t,item:e}))})))}var E=n(5214),Z=n(4474),N=n(7597),k=n(6487),L=n(9649),_=n(4996),y="generatedIndexPage_vzzw",T="list_HAaG",w="title_qBh7";function x(e){var t=e.categoryGeneratedIndex;return a.createElement(r.d,{title:t.title,description:t.description,keywords:t.keywords,image:(0,_.Z)(t.image)})}function I(e){var t=e.categoryGeneratedIndex,n=(0,i.jA)();return a.createElement(a.Fragment,null,a.createElement(r.d,{title:t.title,description:t.description,keywords:t.keywords,image:(0,_.Z)(t.image)}),a.createElement("div",{className:y},a.createElement(Z.Z,null),a.createElement(k.Z,null),a.createElement(N.Z,null),a.createElement("header",null,a.createElement(L.Z,{as:"h1",className:w},t.title),t.description&&a.createElement("p",null,t.description)),a.createElement("article",{className:"margin-top--lg"},a.createElement(p,{items:n.items,className:T})),a.createElement("footer",{className:"margin-top--lg"},a.createElement(E.Z,{previous:t.navigation.previous,next:t.navigation.next}))))}function C(e){return a.createElement(a.Fragment,null,a.createElement(x,e),a.createElement(I,e))}},5214:function(e,t,n){n.d(t,{Z:function(){return o}});var a=n(7462),r=n(7294),i=n(5999),l=n(6010),c=n(9960);function s(e){var t=e.permalink,n=e.title,a=e.subLabel,i=e.isNext;return r.createElement(c.Z,{className:(0,l.Z)("pagination-nav__link",i?"pagination-nav__link--next":"pagination-nav__link--prev"),to:t},a&&r.createElement("div",{className:"pagination-nav__sublabel"},a),r.createElement("div",{className:"pagination-nav__label"},n))}function o(e){var t=e.previous,n=e.next;return r.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,i.I)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages navigation",description:"The ARIA label for the docs pagination"})},t&&r.createElement(s,(0,a.Z)({},t,{subLabel:r.createElement(i.Z,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc"},"Previous")})),n&&r.createElement(s,(0,a.Z)({},n,{subLabel:r.createElement(i.Z,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc"},"Next"),isNext:!0})))}},7597:function(e,t,n){n.d(t,{Z:function(){return s}});var a=n(7294),r=n(5999),i=n(4477),l=n(5281),c=n(6010);function s(e){var t=e.className,n=(0,i.E)();return n.badge?a.createElement("span",{className:(0,c.Z)(t,l.k.docs.docVersionBadge,"badge badge--secondary")},a.createElement(r.Z,{id:"theme.docs.versionBadge.label",values:{versionLabel:n.label}},"Version: {versionLabel}")):null}},4474:function(e,t,n){n.d(t,{Z:function(){return g}});var a=n(7294),r=n(2263),i=n(9960),l=n(5999),c=n(5551),s=n(373),o=n(5281),m=n(4477),d=n(6010);var u={unreleased:function(e){var t=e.siteTitle,n=e.versionMetadata;return a.createElement(l.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:a.createElement("b",null,n.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){var t=e.siteTitle,n=e.versionMetadata;return a.createElement(l.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:a.createElement("b",null,n.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function v(e){var t=u[e.versionMetadata.banner];return a.createElement(t,e)}function b(e){var t=e.versionLabel,n=e.to,r=e.onClick;return a.createElement(l.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:a.createElement("b",null,a.createElement(i.Z,{to:n,onClick:r},a.createElement(l.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function h(e){var t,n=e.className,i=e.versionMetadata,l=(0,r.Z)().siteConfig.title,m=(0,c.gA)({failfast:!0}).pluginId,u=(0,s.J)(m).savePreferredVersionName,h=(0,c.Jo)(m),g=h.latestDocSuggestion,f=h.latestVersionSuggestion,p=null!=g?g:(t=f).docs.find((function(e){return e.id===t.mainDocId}));return a.createElement("div",{className:(0,d.Z)(n,o.k.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},a.createElement("div",null,a.createElement(v,{siteTitle:l,versionMetadata:i})),a.createElement("div",{className:"margin-top--md"},a.createElement(b,{versionLabel:f.label,to:p.path,onClick:function(){return u(f.name)}})))}function g(e){var t=e.className,n=(0,m.E)();return n.banner?a.createElement(h,{className:t,versionMetadata:n}):null}},9649:function(e,t,n){n.d(t,{Z:function(){return u}});var a=n(7462),r=n(3366),i=n(7294),l=n(6010),c=n(5999),s=n(6668),o="anchorWithStickyNavbar_mojV",m="anchorWithHideOnScrollNavbar_R0VQ",d=["as","id"];function u(e){var t=e.as,n=e.id,u=(0,r.Z)(e,d),v=(0,s.L)().navbar.hideOnScroll;return"h1"!==t&&n?i.createElement(t,(0,a.Z)({},u,{className:(0,l.Z)("anchor",v?m:o),id:n}),u.children,i.createElement("a",{className:"hash-link",href:"#"+n,title:(0,c.I)({id:"theme.common.headingLinkTitle",message:"Direct link to heading",description:"Title for link to heading"})},"\u200b")):i.createElement(t,(0,a.Z)({},u,{id:void 0}))}}}]);