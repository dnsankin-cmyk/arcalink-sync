const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const placeholder = /\$\{([^}]+)\}/g;
export function normalizeLanguage(language) {
  const lang=String(language||'en').toLowerCase();
  if(lang==='en'||lang==='def'||lang.startsWith('en-'))return 'def';
  if(['zh-cn','zh-hans'].includes(lang))return 'zh';
  if(['zh-hk','zh-mo','zh-hant'].includes(lang))return 'zh-tw';
  return lang==='zh-tw'?lang:lang.split('-')[0];
}
/** Translate complete messages/templates. Captures are user data and stay verbatim. */
export function createMessageTranslator(catalog) {
  const exact=new Map(),patterns=[],cache=new Map();
  for(const [key,translations] of Object.entries(catalog).reverse()) {
    const entry={def:key,...translations};
    for(const source of new Set([key,...Object.values(entry)])) {
      if(typeof source!=='string'||!source)continue;
      const names=[...source.matchAll(placeholder)].map(m=>m[1]);
      if(!names.length){exact.set(source,{...entry,...exact.get(source)});continue;}
      const pieces=source.split(placeholder),parts=[];
      for(let i=0;i<pieces.length;i+=2){parts.push(escape(pieces[i]));if(i+1<pieces.length)parts.push('([\\s\\S]*?)');}
      patterns.push({regex:new RegExp('^'+parts.join('')+'$'),names,entry,specificity:source.replace(placeholder,'').length});
    }
  }
  patterns.sort((a,b)=>b.specificity-a.specificity);
  function translate(text,language) {
    if(typeof text!=='string'||!text)return text;
    const lang=normalizeLanguage(language),cacheKey=lang+'\0'+text;
    if(cache.has(cacheKey))return cache.get(cacheKey);
    const direct=exact.get(text);
    let translated=direct?(direct[lang]||direct.def):null;
    let templateFallback=null;
    if(translated===null)for(const {regex,names,entry} of patterns){
      const match=text.match(regex);if(!match)continue;
      const values=Object.fromEntries(names.map((name,i)=>[name,match[i+1]]));
      const result=(entry[lang]||entry.def).replace(placeholder,(token,name)=>values[name]??token);
      if(entry[lang]){translated=result;break;}
      if(templateFallback===null)templateFallback=result;
    }
    if(translated===null)translated=templateFallback;
    if(translated===null){
      const trimmed=text.trim();
      if(trimmed!==text)translated=text.replace(trimmed,()=>translate(trimmed,lang));
      else if(text.includes('\n'))translated=text.split('\n').map(line=>translate(line,lang)).join('\n');
      else {
        // Module and repetition prefixes are presentation, not part of the message key.
        const prefix=text.match(/^(\[[^\]\n]+\]\s*|\(\d+\):|(?:⚠️)+\s*)(.+)$/);
        translated=prefix?prefix[1]+translate(prefix[2],lang):text;
      }
    }
    if(cache.size>=500)cache.clear();cache.set(cacheKey,translated);return translated;
  }
  return translate;
}
