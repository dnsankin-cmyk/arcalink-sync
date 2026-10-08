/** Warn once per crossing of 95% of the actual account quota, not a fixed DB size. */
export function createStorageWarning({load,notify}) {
  let busy=false,disposed=false,warned=false,lastKey=null;
  return {
    dispose(){disposed=true;},
    async tick(){
      if(disposed||busy)return false;
      busy=true;
      try {
        const snapshot=await load();
        if(disposed||!snapshot)return false;
        const {used_bytes:used,limit_bytes:limit,key}=snapshot;
        if(!Number.isFinite(used)||used<0||!Number.isFinite(limit)||limit<=0||typeof key!=='string'||!key)return false;
        if(key!==lastKey){lastKey=key;warned=false;}
        if(used/limit<0.95){warned=false;return false;}
        if(warned)return false;
        const percent=(Math.round(used/limit*1000)/10).toLocaleString('ru-RU',{maximumFractionDigits:1});
        const size=n=>(n/1024/1024).toLocaleString('ru-RU',{maximumFractionDigits:1})+' МБ';
        notify('Хранилище ArcaLink заполнено на '+percent+'%. Занято '+size(used)+' из '+size(limit)+'. Свободно '+size(Math.max(0,limit-used))+'. Освободите место или увеличьте тариф.');
        warned=true;
        return true;
      }catch{return false;}
      finally{busy=false;}
    }
  };
}
