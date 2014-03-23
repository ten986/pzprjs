/*! @license candle.js v0.2.5 (c) 2011-2014 sabo2, MIT license
 *   https://bitbucket.org/sabo2/candle */
!function(){if(!window.Candle){var a=document,b=2*Math.PI,c=[],d=[],e=function(){for(var a=[],b=256;512>b;b++)a[b-256]=b.toString(16).substr(1);return a}(),f={version:"0.2.5",wrapper:{},addWrapper:function(a,b){a=a.replace(/\s+/g,"");var c=a.indexOf(":"),d="";c>=0&&(d=a.substr(c+1),a=a.substr(0,c));var e=function(){this.initialize&&this.initialize.apply(this,arguments)};if(d&&this.wrapper[d]){var f=this.wrapper[d];for(var g in f.prototype)e.prototype[g]=f.prototype[g]}for(var g in b)e.prototype[g]=b[g];e.prototype.constructor=e;var h={body:e,name:a,base:d};this.wrapper[h.name]=h.body},_order:[],enable:{},addTypes:function(a){this._order.push(a),this.enable[a]=!0,this.current||(this.current=a)},TypeList:function(a){for(var b=0;b<f._order.length;b++)this[f._order[b]]=f._order[b]===a},current:"",select:function(a){return this.enable[a]?(this.current=a,!0):!1},ME:null,initME:function(){var b=a.createElement("div");b.style.display="inline",b.style.position="absolute",b.style.left="-9000px",b.innerHTML="",a.body.appendChild(b),this.ME=b},color:c,parse:function(a){if(!c[a])if("rgb("===a.substr(0,4)){var b=a.match(/\d+/g);c[a]=["#",e[b[0]],e[b[1]],e[b[2]]].join("")}else c[a]=a;return c[a]},parsecolorrev:function(a){if(a.match(/\#([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])/)){var b=parseInt(RegExp.$1,16).toString(),c=parseInt(RegExp.$2,16).toString(),d=parseInt(RegExp.$3,16).toString();return["rgb(",b,",",c,",",d,")"].join("")}return a},getRectSize:function(a){return{width:a.offsetWidth||a.clientWidth,height:a.offsetHeight||a.clientHeight}},_counter:-1,getcanvasid:function(){return this._counter++,"_candle_canvas_"+this._counter},_initializing:0,initAllElements:function(){for(var b=a.getElementsByTagName("candle"),c=0;c<b.length;c++)this.start(b[c].id)},start:function(b,c,d){var e=a.getElementById(this.EL_ID_HEADER+b);if(e)return this.readyflag[b]===!0&&d(e.parentNode.getContext("2d")),void 0;this.ME||this.initME();var f=c;if(this.enable[f]||(f=this.current),this.enable[f]){this._initializing++,this.readyflag[b]=!1;var g=new this.wrapper[f](b),h=this;g&&d&&(h.isready(b)?d(g):setTimeout(function(){return h.isready(b)?(d(g),void 0):(setTimeout(arguments.callee,20),void 0)},20))}},readyflag:{},isready:function(a){return!!this.readyflag[a]},allready:function(){return 0===this._initializing},debugmode:!1,onload:function(){this.createCSS(),this.initAllElements()},sheet:null,createCSS:function(){if(!this.sheet){var b=a.getElementsByTagName("head")[0];if(b){var c=a.createElement("style");c.setAttribute("type","text/css"),b.appendChild(c)}else a.write("<style></style>");this.sheet=a.styleSheets[a.styleSheets.length-1];for(var e=0;e<d.length;e++)this.addCSS(d[e][0],d[e][1]);d=[]}},addCSS:function(a,b){if(this.sheet){var c=this.sheet;c.insertRule?c.insertRule(a+"{"+b+"}",c.cssRules.length):c.addRule&&c.addRule(a,b,-1)}else d.push(a,b)}};window.addEventListener?window.addEventListener("load",function(){f.onload()},!1):window.attachEvent&&window.attachEvent("onload",function(){f.onload()}),a.createElement("candle"),f.createCSS(),window.Candle=f,f.addWrapper("wrapperbase",{initialize:function(a){this.fillStyle="black",this.strokeStyle="black",this.lineWidth=1,this.font="14px system",this.textAlign="center",this.textBaseline="middle",this.canvas=null,this.idname=a,this.canvasid=f.getcanvasid(),this.child=null,this.currentLayerId="_empty",this.isedgearray={_empty:!1},this.isedge=!1}}),f.addWrapper("vector:wrapperbase",{initialize:function(a){f.wrapper.wrapperbase.prototype.initialize.call(this,a),this.vid="",this.elements=[],this.lastElement=null,this.target=null,this.cpath=[],this.lastpath=""},initElement:function(){},afterInit:function(){var a=this.canvas,b=(this.child,f.getRectSize(a)),c=this;a.style.overflow="hidden",f.debugmode&&(a.style.backgroundColor="#efefef",a.style.border="solid 1px silver"),a.getContext=function(){return c},a.toDataURL=function(){return null},a.toBlob=function(){return null},this.target=this.child,this.rect(0,0,b.width,b.height),this.addVectorElement(!1,!1),this.setLayer(),f._initializing--,f.readyflag[this.idname]=!0},initTarget:function(){},clear:function(){this.resetElement()},resetElement:function(){this.vid="",this.elements=[],this.lastElement=null,this.initTarget()},setLayer:function(a){if(this.initTarget(),a){var b=[this.canvasid,"layer",a].join("_"),c=this.getLayerById(b);c||(c=this.createLayer(b)),this.target=c}this.currentLayerId=a?a:"_empty",this.setLayerEdge()},setLayerEdge:function(){this.isedge=void 0!==this.isedgearray[this.currentLayerId]?this.isedgearray[this.currentLayerId]:this.isedgearray._empty},getLayerById:function(){},createLayer:function(){return null},setRendering:function(){},setUnselectable:function(){},getContextElement:function(){return this.child},getLayerElement:function(){return this.target},changeSize:function(a,b){this.canvas.style.width=a+"px",this.canvas.style.height=b+"px",this.changeChildSize(this.canvas.firstChild,a,b)},changeChildSize:function(){},beginPath:function(){this.cpath=[],this.lastpath=""},closePath:function(){this.cpath.push(this.PATH_CLOSE),this.lastpath=this.PATH_CLOSE},moveTo:function(a,b){this.cpath.push(this.PATH_MOVE,a,b),this.lastpath=this.PATH_MOVE},lineTo:function(a,b){this.lastpath!==this.PATH_LINE&&this.cpath.push(this.PATH_LINE),this.cpath.push(a,b),this.lastpath=this.PATH_LINE},rect:function(a,b,c,d){this.cpath.push(this.PATH_MOVE,a,b,this.PATH_LINE,a+c,b,a+c,b+d,a,b+d,this.PATH_CLOSE),this.lastpath=this.PATH_CLOSE},arc:function(a,c,d,e,f,g){var h,i,j,k;f-e>=b?(h=a+d,i=c,j=a+d,k=c):(h=a+d*Math.cos(e),i=c+d*Math.sin(e),j=a+d*Math.cos(f),k=c+d*Math.sin(f)),f-e>=b&&(i+=.125);var l=e>f^Math.abs(f-e)>Math.PI,m=g^l?1:0,n=0==m^l?1:0;this.cpath.push(this.PATH_MOVE,h,i,this.PATH_ARCTO,d,d,0,m,n,j,k),this.lastpath=this.PATH_ARCTO},fill:function(){this.addVectorElement(!0,!1)},stroke:function(){this.addVectorElement(!1,!0)},shape:function(){this.addVectorElement(!0,!0)},fillRect:function(a,b,c,d){var e=this.cpath;this.cpath=[],this.rect(a,b,c,d),this.addVectorElement(!0,!1),this.cpath=e},strokeRect:function(a,b,c,d){var e=this.cpath;this.cpath=[],this.rect(a,b,c,d),this.addVectorElement(!1,!0),this.cpath=e},shapeRect:function(a,b,c,d){var e=this.cpath;this.cpath=[],this.rect(a,b,c,d),this.addVectorElement(!0,!0),this.cpath=e},fillText:function(){},drawImage:function(){},translate:function(){},setLinePath:function(){for(var a=arguments,b=a.length,c=b-(1|b?1:2),d=[],e=0;c>e;e+=2)d[e>>1]=[a[e],a[e+1]];this.setLinePath_com.call(this,d),a[b-1]&&this.cpath.push(this.PATH_CLOSE)},setOffsetLinePath:function(){for(var a=arguments,b=a.length,c=b-(1|b?1:2),d=[],e=0;c-2>e;e+=2)d[e>>1]=[a[e+2]+a[0],a[e+3]+a[1]];this.setLinePath_com.call(this,d),a[b-1]&&this.cpath.push(this.PATH_CLOSE)},setLinePath_com:function(a){this.cpath=[];for(var b=0,c=a.length;c>b;b++)this.cpath.push(0===b?this.PATH_MOVE:this.PATH_LINE),this.cpath.push(a[b][0],a[b][1])},setDashSize:function(){},strokeLine:function(a,b,c,d){var e=this.cpath;this.cpath=[this.PATH_MOVE,a,b,this.PATH_LINE,c,d],this.addVectorElement(!1,!0),this.cpath=e},strokeDashedLine:function(a,b,c,d,e){var f=this.cpath;this.cpath=[this.PATH_MOVE,a,b,this.PATH_LINE,c,d],this.addVectorElement(!1,!0),this.setDashSize(e),this.cpath=f},strokeCross:function(a,b,c){var d=this.cpath;this.cpath=[this.PATH_MOVE,a-c,b-c,this.PATH_LINE,a+c,b+c,this.PATH_MOVE,a-c,b+c,this.PATH_LINE,a+c,b-c],this.addVectorElement(!1,!0),this.cpath=d},fillCircle:function(a,c,d){var e=this.cpath;this.cpath=[],this.arc(a,c,d,0,b,!1),this.cpath.push(this.PATH_CLOSE),this.addVectorElement(!0,!1),this.cpath=e},strokeCircle:function(a,c,d){var e=this.cpath;this.cpath=[],this.arc(a,c,d,0,b,!1),this.cpath.push(this.PATH_CLOSE),this.addVectorElement(!1,!0),this.cpath=e},shapeCircle:function(a,c,d){var e=this.cpath;this.cpath=[],this.arc(a,c,d,0,b,!1),this.cpath.push(this.PATH_CLOSE),this.addVectorElement(!0,!0),this.cpath=e},addVectorElement:function(){}}),function(){var b="http://www.w3.org/2000/svg",c="http://www.w3.org/1999/xlink";if(document.createElementNS&&document.createElementNS(b,"svg").suspendRedraw){var d=" M",e=" L",g=" A",h=" z",i="fill",j="stroke",k="stroke-width",l="shape-rendering",m="none",n={left:"start",center:"middle",right:"end"},o={top:-.7,hanging:-.6,middle:-.25,alphabetic:0,bottom:.1};f.addTypes("svg"),f.addWrapper("svg:vector",{initialize:function(a){f.wrapper.vector.prototype.initialize.call(this,a),this.use=new f.TypeList("svg"),this.PATH_MOVE=d,this.PATH_LINE=e,this.PATH_CLOSE=h,this.PATH_ARCTO=g,this.initElement()},initElement:function(){var d=this.canvas=a.getElementById(this.idname),e=f.getRectSize(this.canvas),g=a.createElementNS(b,"svg");g.setAttribute("xmlns",b),g.setAttribute("xmlns:xlink",c),g.setAttribute("id",this.canvasid),g.setAttribute("font-size","10"),g.setAttribute("font-family","sans-serif"),g.setAttribute("width",e.width),g.setAttribute("height",e.height),g.setAttribute("viewBox",[0,0,e.width,e.height].join(" ")),d.appendChild(g),this.child=g,this.afterInit(),d.toDataURL=function(){return"data:image/svg+xml;base64,"+window.btoa(g.outerHTML||(new XMLSerializer).serializeToString(g))},d.toBlob=function(){return new Blob([g.outerHTML||(new XMLSerializer).serializeToString(g)],{type:"image/svg+xml"})}},initTarget:function(){this.target=a.getElementById(this.canvasid)},clear:function(){for(var a=this.canvas.firstChild,b=a.firstChild;b;)a.removeChild(b),b=a.firstChild;this.resetElement()},setLayerEdge:function(){},createLayer:function(c){var d=a.createElementNS(b,"g");return d.setAttribute("id",c),this.target.appendChild(d),d},getLayerById:function(b){return a.getElementById(b)},setRendering:function(a){this.target.setAttribute(l,a)},setUnselectable:function(a){a=void 0===a?!0:!!a,this.canvas.style.MozUserSelect=a?"none":"text",this.canvas.style.WebkitUserSelect=a?"none":"text",this.canvas.style.userSelect=a?"none":"text"},changeChildSize:function(a,b,c){a.setAttribute("width",b),a.setAttribute("height",c);var d=a.getAttribute("viewBox").split(/ /);a.setAttribute("viewBox",[d[0],d[1],b,c].join(" "))},fillText:function(c,d,e){var g=!!this.vid&&!!this.elements[this.vid],h=f.ME;h.style.font=this.font,h.innerHTML=c;var j=e-h.offsetHeight*o[this.textBaseline.toLowerCase()],k=g?this.elements[this.vid]:a.createElementNS(b,"text");if(k.setAttribute("x",d),k.setAttribute("y",j),k.setAttribute(i,f.parse(this.fillStyle)),k.setAttribute("text-anchor",n[this.textAlign.toLowerCase()]),this.font.match(/(.+\s)?([0-9]+)px (.+)$/)){var l=RegExp.$1,m=RegExp.$2,p=RegExp.$3;k.setAttribute("font-size",m),p.match(/^sans\-serif$/i)?k.removeAttribute("font-family"):k.setAttribute("font-family",p),l.match(/(italic|oblique)/)?k.setAttribute("font-style",RegExp.$1):k.removeAttribute("font-style"),l.match(/(bold|bolder|lighter|[1-9]00)/)?k.setAttribute("font-weight",RegExp.$1):k.removeAttribute("font-weight")}else k.setAttribute("font",this.font);g?k.replaceChild(a.createTextNode(c),k.firstChild):(k.appendChild(a.createTextNode(c)),this.target.appendChild(k),this.lastElement=k),!g&&this.vid&&(this.elements[this.vid]=this.lastElement,this.vid="")},drawImage:function(d,e,f,g,h,i,j,k,l){void 0===g&&(g=d.width,h=d.height),void 0===i&&(i=e,e=0,j=f,f=0,k=g,l=h);var m=!!this.vid&&!!this.elements[this.vid],n=m?this.elements[this.vid]:a.createElementNS(b,"svg");n.setAttribute("viewBox",[e,f,g,h].join(" ")),n.setAttribute("x",i),n.setAttribute("y",j),n.setAttribute("width",k),n.setAttribute("height",l);var o=m?n.firstChild:a.createElementNS(b,"image");o.setAttributeNS(null,"width",d.width),o.setAttributeNS(null,"height",d.height),o.setAttributeNS(c,"xlink:href",d.src),m||(n.appendChild(o),this.target.appendChild(n),this.lastElement=n),!m&&this.vid&&(this.elements[this.vid]=this.lastElement,this.vid="")},translate:function(a,b){var c=this.canvas.firstChild,d=c.getAttribute("viewBox").split(/ /);d[0]=-a,d[1]=-b,c.setAttribute("viewBox",d.join(" "))},setDashSize:function(a){this.lastElement&&this.lastElement.setAttribute("stroke-dasharray",a.join(" "))},addVectorElement:function(c,d){var e=this.cpath.join(" "),g=a.createElementNS(b,"path");g.setAttribute("d",e),g.setAttribute(i,c?f.parse(this.fillStyle):m),g.setAttribute(j,d?f.parse(this.strokeStyle):m),d&&g.setAttribute(k,this.lineWidth),this.target.appendChild(g),this.lastElement=g,this.vid&&(this.elements[this.vid]=this.lastElement,this.vid="")}})}}(),function(){if(document.createElement("canvas").getContext){if(window.CanvasRenderingContext2D){var c=CanvasRenderingContext2D.prototype;c.setLineDash||("mozDash"in c?c.setLineDash=function(a){this.mozDash=a}:"webkitLineDash"in c&&(c.setLineDash=function(a){this.webkitLineDash=a}))}f.addTypes("canvas"),f.addWrapper("canvas:wrapperbase",{initialize:function(a){f.wrapper.wrapperbase.prototype.initialize.call(this,a),this.context=null,this.use=new f.TypeList("canvas"),this.x0=0,this.y0=0,this.initElement()},initElement:function(){var b=this.canvas=a.getElementById(this.idname),c=f.getRectSize(b),d=a.createElement("canvas");d.id=this.canvasid,d.width=c.width,d.height=c.height,d.style.width=c.width+"px",d.style.height=c.height+"px",b.appendChild(d),this.child=d,this.afterInit()},afterInit:function(){var a=this.canvas,b=this.child,c=this;a.style.overflow="hidden",f.debugmode&&(a.style.backgroundColor="#efefef",a.style.border="solid 1px silver"),a.getContext=function(){return c},a.toDataURL=function(a){return a?b.toDataURL(a):b.toDataURL()},a.toBlob=function(){try{return b.toBlob()}catch(a){}b.toDataURL().match(/data:(.*);base64,(.*)/);for(var c=window.atob(RegExp.$2),d=c.length,e=new Uint8Array(d),f=0;d>f;f++)e[f]=c.charCodeAt(f);return new Blob([e.buffer],{type:RegExp.$1})},b.toBlob=b.toBlob||b.msToBlob,this.setLayer(),this.context=this.child.getContext("2d"),f._initializing--,f.readyflag[this.idname]=!0},clear:function(){this.setProperties(),this.context.setTransform(1,0,0,1,0,0),this.context.translate(this.x0,this.y0);var a=f.getRectSize(this.canvas);this.context.clearRect(0,0,a.width,a.height)},setLayer:function(a){this.currentLayerId=a?a:"_empty",this.isedge=void 0!==this.isedgearray[this.currentLayerId]?this.isedgearray[this.currentLayerId]:this.isedgearray._empty,this.setEdgeStyle(a)},setEdgeStyle:function(){var a=this.canvas.style;"imageRendering"in a&&(a.imageRendering="",this.isedge&&(a.imageRendering="pixelated",a.imageRendering||(a.imageRendering="-webkit-optimize-contrast"),a.imageRendering||(a.imageRendering="-moz-crisp-edges"),a.imageRendering||(a.imageRendering="-o-crisp-edges")))},setRendering:function(a){this.isedgearray[this.currentLayerId]="crispEdges"===a,this.isedge=this.isedgearray[this.currentLayerId],this.setEdgeStyle(this.currentLayerId)},setUnselectable:function(a){a=void 0===a?!0:!!a;var b=this.canvas.style;b.MozUserSelect=b.WebkitUserSelect=b.userSelect=a?"none":"text"},getContextElement:function(){return this.child},getLayerElement:function(){return this.child},changeSize:function(a,b){var c=this.canvas;c.style.width=a+"px",c.style.height=b+"px";var d=this.child,e=parseInt(d.style.left),f=parseInt(d.style.top);a+=0>e?-e:0,b+=0>f?-f:0,d.style.width=a+"px",d.style.height=b+"px",d.width=a,d.height=b},setProperties:function(){var a=this.context;a.fillStyle=this.fillStyle,a.strokeStyle=this.strokeStyle,a.lineWidth=this.lineWidth,a.font=this.font,a.textAlign=this.textAlign,a.textBaseline=this.textBaseline},beginPath:function(){this.context.beginPath()},closePath:function(){this.context.closePath()},moveTo:function(a,b){this.context.moveTo(a,b)},lineTo:function(a,b){this.context.lineTo(a,b)},rect:function(a,b,c,d){this.context.rect(a,b,c,d)},arc:function(a,b,c,d,e,f){this.context.arc(a,b,c,d,e,f)},fill:function(){this.setProperties(),this.context.fill()},stroke:function(){this.setProperties(),this.context.stroke()},shape:function(){this.setProperties(),this.context.fill(),this.context.stroke()},fillRect:function(a,b,c,d){this.setProperties(),this.context.fillRect(a,b,c,d)},strokeRect:function(a,b,c,d){this.setProperties(),this.context.strokeRect(a,b,c,d)},shapeRect:function(a,b,c,d){this.setProperties(),this.context.fillRect(a,b,c,d),this.context.strokeRect(a,b,c,d)},fillText:function(a,b,c){this.setProperties(),this.context.fillText(a,b,c)},drawImage:function(){this.context.drawImage.apply(this.context,arguments)},translate:function(a,b){this.x0=a,this.y0=b,this.context.translate(a,b)},setLinePath:function(){for(var a=arguments,b=a.length,c=b-(1|b?1:2),d=[],e=0;c>e;e+=2)d[e>>1]=[a[e],a[e+1]];this.setLinePath_com.call(this,d),a[b-1]&&this.context.closePath()},setOffsetLinePath:function(){for(var a=arguments,b=a.length,c=b-(1|b?1:2)-2,d=[],e=0;c>e;e+=2)d[e>>1]=[a[e+2]+a[0],a[e+3]+a[1]];this.context.beginPath(),this.setLinePath_com.call(this,d),a[b-1]&&this.context.closePath()},setLinePath_com:function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];0===b?this.context.moveTo(d[0],d[1]):this.context.lineTo(d[0],d[1])}},setDashSize:function(){},strokeLine:function(a,b,c,d){var e=this.context;this.setProperties(),e.beginPath(),e.moveTo(a,b),e.lineTo(c,d),e.stroke()},strokeDashedLine:function(a,b,c,d,e){{var f=this;this.context}this.strokeDashedLine=this.context.setLineDash?function(a,b,c,d,e){var g=f.context;f.setProperties(),g.beginPath(),g.moveTo(a,b),g.lineTo(c,d),g.setLineDash(e),g.stroke(),g.setLineDash([])}:function(a,b,c,d,e){e.length%2===1&&(e=e.concat(e));var g=Math.sqrt((c-a)*(c-a)+(d-b)*(d-b)),h=0,i=0,j=(d-b)/(c-a),k=j*j+1,l=f.context;for(f.setProperties(),l.beginPath(),l.moveTo(a,b);g>h;){var m=Math.sqrt(h*h/k),n=a+m,o=b+j*m;0===(1&i)?l.moveTo(n,o):l.lineTo(n,o),h+=e[i],i++,i>=e.length&&(i=0)}l.stroke()},this.strokeDashedLine(a,b,c,d,e)},strokeCross:function(a,b,c){var d=this.context;this.setProperties(),d.beginPath(),d.moveTo(a-c,b-c),d.lineTo(a+c,b+c),d.moveTo(a-c,b+c),d.lineTo(a+c,b-c),d.stroke()},fillCircle:function(a,c,d){var e=this.context;this.setProperties(),e.beginPath(),e.arc(a,c,d,0,b,!1),e.fill()},strokeCircle:function(a,c,d){var e=this.context;this.setProperties(),e.beginPath(),e.arc(a,c,d,0,b,!1),e.stroke()},shapeCircle:function(a,c,d){var e=this.context;this.setProperties(),e.beginPath(),e.arc(a,c,d,0,b,!1),e.fill(),e.stroke()}})}}(),function(){try{document.namespaces.add("v","urn:schemas-microsoft-com:vml")}catch(c){return}var d="<v:shape",e="<v:group",g="<v:image",h="<v:textpath",i="<v:polyline",j='<v:path textpathok="t" />',k="",l=">",m=" />",n="</v:group>",o="</v:polyline>",p=' path="',q=' points="',r=' style="',s=' string="',t=' coordsize="100,100"',u=' fillcolor="',v=' strokecolor="',w=' strokeweight="',x='"',y=' stroked="f" filled="t"',z=' on="t" xscale="t"',A="font:",B="v-text-align:",C=";",D=" m",E=" l",F=" x",G=" ?",H=" ns",I=" nf",J={left:0,center:.5,right:1},K={top:-.7,hanging:-.66,middle:-.3,alphabetic:0,bottom:.1},L=10,M=L/2,N="behavior: url(#default#VML);",O=N+" position:absolute; width:10px; height:10px;";f.addCSS("v\\:shape",O),f.addCSS("v\\:group",O),f.addCSS("v\\:polyline",O),f.addCSS("v\\:image",O),f.addCSS("v\\:path",N),f.addCSS("v\\:textpath",N),f.addCSS("v\\:stroke",N),f.addTypes("vml"),f.addWrapper("vml:vector",{initialize:function(a){f.wrapper.vector.prototype.initialize.call(this,a),this.use=new f.TypeList("vml"),this.PATH_MOVE=D,this.PATH_LINE=E,this.PATH_CLOSE=F,this.PATH_ARCTO=G,this.initElement()},initElement:function(){var b=this.canvas=a.getElementById(this.idname);b.style.display="block",b.style.position="relative";var c=f.getRectSize(this.canvas),d=a.createElement("div");d.id=this.canvasid,d.style.position="absolute",d.style.left="-2px",d.style.top="-2px",d.style.width=c.width+"px",d.style.height=c.height+"px",this.canvas.appendChild(d),this.child=d,this.afterInit()},initTarget:function(){this.target=a.getElementById(this.canvasid)},clear:function(){for(var a=this.canvas.firstChild,b=a.firstChild;b;)a.removeChild(b),b=a.firstChild;this.resetElement()},createLayer:function(b){var c=a.createElement("div");return c.id=b,c.unselectable=k?"on":"",c.style.position="absolute",c.style.left="0px",c.style.top="0px",this.target.appendChild(c),c},getLayerById:function(b){return a.getElementById(b)},setRendering:function(a){this.isedgearray[this.currentLayerId]="crispEdges"===a,this.isedge=this.isedgearray[this.currentLayerId]},setUnselectable:function(a){a=void 0===a?!0:!!a,k=a?' unselectable="on"':"",this.canvas.unselectable=a?"on":"",this.child.unselectable=a?"on":""},changeChildSize:function(a,b,c){a.style.width=b+"px",a.style.height=c+"px"},moveTo:function(a,b){this.cpath.push(this.PATH_MOVE,this.ePos(a,!0),this.ePos(b,!0)),this.lastpath=this.PATH_MOVE},lineTo:function(a,b){this.lastpath!==this.PATH_LINE&&this.cpath.push(this.PATH_LINE),this.cpath.push(this.ePos(a,!0),this.ePos(b,!0)),this.lastpath=this.PATH_LINE},rect:function(a,b,c,d){a=this.ePos(a,!0),b=this.ePos(b,!0),c=this.eLen(c),d=this.eLen(d),this.cpath.push(this.PATH_MOVE,a,b,this.PATH_LINE,a+c,b,a+c,b+d,a,b+d,this.PATH_CLOSE),this.lastpath=this.PATH_CLOSE},arc:function(a,c,d,e,f,g){var h,i,j,k;f-e>=b?(h=a+d,i=c,j=a+d,k=c):(h=a+d*Math.cos(e),i=c+d*Math.sin(e),j=a+d*Math.cos(f),k=c+d*Math.sin(f)),a=a*L-M|0,c=c*L-M|0,d=d*L|0,h=h*L-M|0,i=i*L-M|0,j=j*L-M|0,k=k*L-M|0;var l=g?"at":"wa";f-e>=b&&(h+=1),this.cpath.push(l,a-d,c-d,a+d,c+d,h,i,j,k),this.lastpath=l},fillText:function(a,b,c){var d=!!this.vid&&!!this.elements[this.vid],g=f.ME;b=b*L-M|0,c=c*L-M|0,g.style.font=this.font,g.innerHTML=a;var k=c-(g.offsetHeight*K[this.textBaseline.toLowerCase()]*L-M)|0,p=g.offsetWidth*L-M|0,v=b-p*J[this.textAlign.toLowerCase()]|0;if(d){var w=this.elements[this.vid];w.fillcolor=f.parse(this.fillStyle),w.lastChild.style.font=this.font,w.lastChild.string=a}else{var D=[e,t,l,i,q,[v,k,v+p,k].join(","),x,y,u,f.parse(this.fillStyle),x,l,j,h,z,s,a,x,r,A,this.font,C,B,this.textAlign,C,x,m,o,n];this.target.insertAdjacentHTML("BeforeEnd",D.join("")),this.lastElement=this.target.lastChild.lastChild}!d&&this.vid&&(this.elements[this.vid]=this.lastElement,this.vid="")},drawImage:function(a,b,c,d,e,f,h,i,j){void 0===d&&(d=a.width,e=a.height),void 0===f&&(f=b,b=0,h=c,c=0,i=d,j=e);var k,l=!!this.vid&&!!this.elements[this.vid];if(l)k=this.elements[this.vid],k.src=a.src;else{var n=[g,' src="',a.src,x,t,m];this.target.insertAdjacentHTML("BeforeEnd",n.join("")),this.lastElement=this.target.lastChild,k=this.lastElement}k.style.left=f,k.style.top=h,k.style.width=i,k.style.height=j,k.cropleft=b/a.width,k.croptop=c/a.height,k.cropright=1-(b+d)/a.width,k.cropbottom=1-(c+e)/a.height,!l&&this.vid&&(this.elements[this.vid]=this.lastElement,this.vid="")},translate:function(a,b){var c=this.canvas.firstChild;c.style.position="absolute",c.style.left=a+"px",c.style.top=b+"px"},setLinePath_com:function(a){this.cpath=[];for(var b=0,c=a.length;c>b;b++)this.cpath.push(0===b?this.PATH_MOVE:this.PATH_LINE),this.cpath.push(this.ePos(a[b][0],!0),this.ePos(a[b][1],!0))},setDashSize:function(b){if(this.lastElement){var c=a.createElement("v:stroke");c.dashstyle=b[0]<=2?"ShortDash":b[0]<=5?"Dash":"LongDash",this.lastElement.appendChild(c)}},strokeLine:function(a,b,c,d){a=this.ePos(a,!0),b=this.ePos(b,!0),c=this.ePos(c,!0),d=this.ePos(d,!0),f.wrapper.vector.prototype.strokeLine.call(this,a,b,c,d)},strokeDashedLine:function(a,b,c,d,e){a=this.ePos(a,!0),b=this.ePos(b,!0),c=this.ePos(c,!0),d=this.ePos(d,!0),f.wrapper.vector.prototype.strokeDashedLine.call(this,a,b,c,d,e)},strokeCross:function(a,b,c){a=this.ePos(a,!0),b=this.ePos(b,!0),c=this.eLen(c),f.wrapper.vector.prototype.strokeCross.call(this,a,b,c)},ePos:function(a,b){return a=b?a+(a>0?.5:-.5)-(this.lineWidth%2===1?.5:0)|0:a+(a>0?.5:-.5)|0,a*L-M|0},eLen:function(a){return a*L|0},addVectorElement:function(a,b){var c=this.cpath.join(" ");c=[c,a?"":I,b?"":H].join("");var e=[d,k,t,p,c,x];a&&e.push(u,f.parse(this.fillStyle),x),b&&e.push(v,f.parse(this.strokeStyle),x,w,this.lineWidth,"px",x),e.push(m),this.target.insertAdjacentHTML("BeforeEnd",e.join("")),this.lastElement=this.target.lastChild,this.vid&&(this.elements[this.vid]=this.lastElement,this.vid="")}})}()}}();