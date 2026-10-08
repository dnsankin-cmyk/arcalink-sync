// UTF-16 indices match CodeMirror/Y.Text; never split surrogate pairs.
export function textChange(before,after){let from=0;while(from<before.length&&from<after.length&&before[from]===after[from])from++;
 if(from>0&&/[\uD800-\uDBFF]/.test(before[from-1]))from--;
 let end=before.length,to=after.length;while(end>from&&to>from&&before[end-1]===after[to-1]){end--;to--;}
 if(end<before.length&&/[\uDC00-\uDFFF]/.test(before[end])){end++;to++;}
 return {from,remove:end-from,insert:after.slice(from,to)};}
