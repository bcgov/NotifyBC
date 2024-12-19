import{c as B}from"./chunk-4KE642ED-jZNy5bGT.js";import{p as P}from"./gitGraph-YCYPL57B-MEVJTYR7-DBJH2LAz.js";import{ar as S,m as i,as as u,at as v,h as T,t as x,aT as W,C as z,T as F,k as D,w as E,B as A,v as L,S as R}from"./mermaid.esm.min-hBNORSKk.js";import"./chunk-5ZJXQJOJ-BXIdNnff.js";import"./app-BLYWhP50.js";var w={packet:[]},$=structuredClone(w),Y=S.packet,H=i(()=>{let t=u({...Y,...v().packet});return t.showBits&&(t.paddingY+=10),t},"getConfig"),I=i(()=>$.packet,"getPacket"),M=i(t=>{t.length>0&&$.packet.push(t)},"pushWord"),N=i(()=>{T(),$=structuredClone(w)},"clear"),m={pushWord:M,getPacket:I,getConfig:H,clear:N,setAccTitle:F,getAccTitle:D,setDiagramTitle:E,getDiagramTitle:A,getAccDescription:L,setAccDescription:R},X=1e4,q=i(t=>{B(t,m);let e=-1,l=[],s=1,{bitsPerRow:n}=m.getConfig();for(let{start:a,end:r,label:p}of t.blocks){if(r&&r<a)throw new Error(`Packet block ${a} - ${r} is invalid. End must be greater than start.`);if(a!==e+1)throw new Error(`Packet block ${a} - ${r??a} is not contiguous. It should start from ${e+1}.`);for(e=r??a,x.debug(`Packet block ${a} - ${e} with label ${p}`);l.length<=n+1&&m.getPacket().length<X;){let[g,d]=K({start:a,end:r,label:p},s,n);if(l.push(g),g.end+1===s*n&&(m.pushWord(l),l=[],s++),!d)break;({start:a,end:r,label:p}=d)}}m.pushWord(l)},"populate"),K=i((t,e,l)=>{if(t.end===void 0&&(t.end=t.start),t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);return t.end+1<=e*l?[t,void 0]:[{start:t.start,end:e*l-1,label:t.label},{start:e*l,end:t.end,label:t.label}]},"getNextFittingBlock"),O={parse:i(async t=>{let e=await P("packet",t);x.debug(e),q(e)},"parse")},U=i((t,e,l,s)=>{let n=s.db,a=n.getConfig(),{rowHeight:r,paddingY:p,bitWidth:g,bitsPerRow:d}=a,h=n.getPacket(),o=n.getDiagramTitle(),k=r+p,c=k*(h.length+1)-(o?0:r),b=g*d+2,f=W(e);f.attr("viewbox",`0 0 ${b} ${c}`),z(f,c,b,a.useMaxWidth);for(let[y,C]of h.entries())V(f,C,y,a);f.append("text").text(o).attr("x",b/2).attr("y",c-k/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),V=i((t,e,l,{rowHeight:s,paddingX:n,paddingY:a,bitWidth:r,bitsPerRow:p,showBits:g})=>{let d=t.append("g"),h=l*(s+a)+a;for(let o of e){let k=o.start%p*r+1,c=(o.end-o.start+1)*r-n;if(d.append("rect").attr("x",k).attr("y",h).attr("width",c).attr("height",s).attr("class","packetBlock"),d.append("text").attr("x",k+c/2).attr("y",h+s/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(o.label),!g)continue;let b=o.end===o.start,f=h-2;d.append("text").attr("x",k+(b?c/2:0)).attr("y",f).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",b?"middle":"start").text(o.start),b||d.append("text").attr("x",k+c).attr("y",f).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(o.end)}},"drawWord"),_={draw:U},j={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},G=i(({packet:t}={})=>{let e=u(j,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),at={parser:O,db:m,renderer:_,styles:G};export{at as diagram};