/*@cc_on if (@_jscript_version < 9) {_d=document;eval('var document=_d');} @*/

/*  /js/default.v2.js */
var Cookie={get:function(name){var match=('; '+document.cookie+';').match('; '+encodeURIComponent(name)+'=(.*?);');return match?decodeURIComponent(match[1]):'';},set:function(name,value,expires,path,domain,secure){var buffer=encodeURIComponent(name)+'='+encodeURIComponent(value);if(typeof expires!='undefined' && expires>0)buffer+='; expires='+new Date(expires).toUTCString();if(typeof path!='undefined')buffer+='; path='+path;if(typeof domain!='undefined')buffer+='; domain='+domain;if(secure)buffer+='; secure';document.cookie=buffer;},expireInMonth:function(name,value){this.set(name,value,(new Date()).getTime()+1000*60*60*24*30,'/');}};
var Font={_defaultSize:14,_cookieName:'body_font_size',_set:function(size){size=parseInt(size);document.body.style.fontSize=size+'px';Cookie.expireInMonth(this._cookieName,size);},start:function(){this._set(Cookie.get(this._cookieName)||default_font_size);},reset:function(){this._set(default_font_size);},enlarge:function(){this._set(parseInt(document.body.style.fontSize)+2);},minify:function(){this._set(parseInt(document.body.style.fontSize)-2);},set:function(size){this._set(size);}};
var default_font_size='12px';function font_start(){Font.start();}
function font_default(){Font.reset();}
function font_larger(){Font.enlarge();}
function font_smaller(){Font.minify();}
function font_set(size){Font.set(size);}
function getCookie(name){return Cookie.get(name);}
function setCookie(name,value){Cookie.expireInMonth(name,value);}
function preloadImages(){var d=document,fn=function(img,src){img.src=src;return img;};if(!d.images)return;if(!d.MM_p)d.MM_p=[];for(var i=0,l=arguments.length;i<l;i++)
if(arguments[i].indexOf('#')!=0)d.MM_p.push(fn(new Image(),arguments[i]));}
function findObj(n,d){var p,i,x;if(!d)d=document;if((p=n.indexOf("?"))>0&&parent.frames.length){d=parent.frames[n.substring(p+1)].document;n=n.substring(0,p);}
if(!(x=d[n])&&d.all)x=d.all[n];for(i=0;!x&&i<d.forms.length;i++)
x=d.forms[i][n];for(i=0;!x&&d.layers&&i<d.layers.length;i++)
x=findObj(n,d.layers[i].document);return x;}
function swapImage(){var i,j=0,x,a=swapImage.arguments;document.sr=new Array;for(i=0;i<(a.length-2);i+=3)
if((x=findObj(a[i]))){document.sr[j++]=x;if(!x.oSrc)x.oSrc=x.src;x.src=a[i+2];}}
function swapImgRestore(){var i,x,a=document.sr;for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++)
x.src=x.oSrc;}
function display(obj){if(document.getElementById(obj).style.display=="none"){document.getElementById(obj).style.display="";}else{document.getElementById(obj).style.display="none";}}
function openWindow(url){location.href=url;}
function AllChecked(check,form,ele){if(!form)return;var cb=form.elements[ele];if(!cb)return;if(!cb.length){cb=[cb];}
for(var i=0;i<cb.length;i++){if(!cb[i].disabled){cb[i].checked=check;}}}
function hover(elm,f,g){var handler=(function(e){switch(e.type){case'mouseover':var p=e.relatedTarget||e.fromElement;do if(!p||p==this)return;while(p=p.parentNode);return f.call(this,e);case'mouseout':var p=e.relatedTarget||e.toElement;do if(!p||p==this)return;while(p=p.parentNode);return g.call(this,e);}}).bindAsEventListener(elm)
return $(elm).observe('mouseover',handler).observe('mouseout',handler);}
