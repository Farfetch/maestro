"use strict";(self.webpackChunkmaestrodocs=self.webpackChunkmaestrodocs||[]).push([[166],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),u=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=u(e.components);return n.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=u(r),d=a,f=m["".concat(l,".").concat(d)]||m[d]||c[d]||o;return r?n.createElement(f,i(i({ref:t},p),{},{components:r})):n.createElement(f,i({ref:t},p))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var u=2;u<o;u++)i[u]=r[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},4124:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return u},assets:function(){return p},toc:function(){return c},default:function(){return d}});var n=r(3117),a=r(102),o=(r(7294),r(3905)),i=["components"],s={sidebar_position:1},l="Setup environment",u={unversionedId:"getting_started/setup_environment",id:"getting_started/setup_environment",title:"Setup environment",description:"Maestro is a deployable application that consists of a few services that ideally should run in the same network to have proper access.",source:"@site/../docs/getting_started/setup_environment.md",sourceDirName:"getting_started",slug:"/getting_started/setup_environment",permalink:"/maestro/docs/getting_started/setup_environment",editUrl:"https://github.com/Farfetch/maestro/tree/master/docs/../docs/getting_started/setup_environment.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Getting Started",permalink:"/maestro/docs/category/getting-started"},next:{title:"Create Test",permalink:"/maestro/docs/getting_started/create_test"}},p={},c=[{value:"Requirements",id:"requirements",level:2},{value:"Quick start",id:"quick-start",level:2},{value:"JMeter image",id:"jmeter-image",level:2}],m={toc:c};function d(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"setup-environment"},"Setup environment"),(0,o.kt)("p",null,"Maestro is a deployable application that consists of a few services that ideally should run in the same network to have proper access."),(0,o.kt)("h2",{id:"requirements"},"Requirements"),(0,o.kt)("p",null,"We do have some environment requirements that you have to check manually to make sure all the following steps are working properly."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"docker >=20.10"),(0,o.kt)("li",{parentName:"ul"},"docker-compose >=2.2.1")),(0,o.kt)("h2",{id:"quick-start"},"Quick start"),(0,o.kt)("p",null,"The commands below would help to get the application up and running. It also will give a general feeling of how it works."),(0,o.kt)("p",null,"Before you continue, make sure the ",(0,o.kt)("inlineCode",{parentName:"p"},"/tmp/maestrojmeter")," folder is created and exists. The folder would be used to store all temporary data from JMeter and mostly used as the shared volume between Maestro containers and JMeter ones."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"mkdir -p /tmp/maestrojmeter\n")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Run application"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"docker-compose up\n")),(0,o.kt)("p",null,"As a result, you can navigate to ",(0,o.kt)("inlineCode",{parentName:"p"},"http://localhost:3000")," and explore the ",(0,o.kt)("a",{parentName:"p",href:"/maestro/docs/intro"},"list of features we have"),"."),(0,o.kt)("h2",{id:"jmeter-image"},"JMeter image"),(0,o.kt)("p",null,"Maestro doesn't provide any default JMeter image and allows the use of the one you already have."),(0,o.kt)("p",null,"To use your own docker image, open ",(0,o.kt)("inlineCode",{parentName:"p"},"docker-compose.yml")," file to add ",(0,o.kt)("inlineCode",{parentName:"p"},"JMETER_IMAGE_BASE_REPO"),"and ",(0,o.kt)("inlineCode",{parentName:"p"},"JMETER_IMAGE_BASE_VERSION")," to the Maestro agent application. The image would be used as a based one and allow you to have the same JMeter version along with all needed plugins that you already used. Maestro is only responsible for adding more data, such as test plans, custom data, etc there. The Dockerfile is available in ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Farfetch/maestro/blob/master/agent/jmeter/Dockerfile"},"GitHub"),"."))}d.isMDXComponent=!0}}]);