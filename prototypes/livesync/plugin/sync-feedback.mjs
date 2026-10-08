// A generic provider refusal is not evidence of a failed parameter request.
// Only the seed preflight may report parameterFailure; this reporter uses
// confirmed account/quota diagnostics and discards stale asynchronous results.
export function createSyncFeedback({diagnose,notify}) {
 let generation=0,message='',notice;
 return {
  get messages(){return message?[message]:[];},
  clear(){generation++;message='';notice?.hide();notice=undefined;},
  report(result,prominent=true){
   generation++;
   if(result!==message){notice?.hide();notice=undefined;message=result;}
   if(prominent&&!notice)notice=notify(result);
  },
  async failed(){
   const attempt=++generation,result=await diagnose();
   if(attempt!==generation||!result)return;
   this.report(result);
  }
 };
}
export function syncLampState({errors,status,offline,paused,automaticOff}) {
 return errors.length||/ERRORED|FAILED/.test(status)?'error':offline?'offline':paused?'idle':/STARTED|JOURNAL/.test(status)?'active':automaticOff?'idle':/CONNECTED|PAUSED|COMPLETED/.test(status)?'ready':'idle';
}
