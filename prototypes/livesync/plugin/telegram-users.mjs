export function telegramUserLabel(link) {
 const username=String(link.telegram_username||'').trim().replace(/^@/,'');
 const id=String(link.telegram_user_id||link.telegram_chat_id||'');
 return username?'@'+username+(id?' · ID '+id:''):'Пользователь Telegram · ID '+id;
}
export function telegramUserDescription(link,restriction='') {
 const parts=['Привязан'];
 const timestamp=Date.parse(link.linked_at);
 if(Number.isFinite(timestamp))parts.push('Дата привязки: '+new Date(timestamp).toLocaleString('ru-RU'));
 if(restriction)parts.push('Приём ограничен именем @'+restriction.replace(/^@/,''));
 parts.push('Сообщения поступают во все выбранные хранилища.');
 return parts.join('\n');
}
