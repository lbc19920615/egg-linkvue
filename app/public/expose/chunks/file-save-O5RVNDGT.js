import"./chunk-E423KAYL.js";var o=async(s,e=[{}],i=null,p=!1)=>{Array.isArray(e)||(e=[e]),e[0].fileName=e[0].fileName||"Untitled";let c=[];if(e.forEach((a,t)=>{c[t]={description:a.description||"",accept:{}},a.mimeTypes?(t===0&&a.mimeTypes.push(s.type),a.mimeTypes.map(r=>{c[t].accept[r]=a.extensions||[]})):c[t].accept[s.type]=a.extensions||[]}),i)try{await i.getFile()}catch(a){if(i=null,p)throw a}let l=i||await window.showSaveFilePicker({suggestedName:e[0].fileName,id:e[0].id,startIn:e[0].startIn,types:c,excludeAcceptAllOption:e[0].excludeAcceptAllOption||!1}),n=await l.createWritable();return await n.write(s),await n.close(),l};export{o as default};
// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
