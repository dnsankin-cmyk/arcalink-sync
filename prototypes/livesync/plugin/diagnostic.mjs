export const parameterFailure='Не удалось получить параметры синхронизации с сервера. Проверьте соединение и повторите синхронизацию. Причина не обязательно связана с ключом шифрования.';
function size(bytes){const unit=bytes>=1024**3?'GiB':'MiB',value=bytes/(unit==='GiB'?1024**3:1024**2);return value.toLocaleString('ru-RU',{maximumFractionDigits:1})+' '+unit;}
export function diagnosticMessage(status,data={}){
 if(status===401)return 'Сессия подключения недействительна или отозвана. На вкладке «Аккаунт» нажмите «Войти», затем выберите хранилище на вкладке «Хранилища» и нажмите «Подключить».';
 if(status===403)return 'Сервер запретил доступ. Обновите плагин и повторно войдите на вкладке «Аккаунт». Затем выберите хранилище на вкладке «Хранилища» и нажмите «Подключить». Если ошибка остаётся, обратитесь в поддержку.';
 if(status!==200)return null;
 if(data.free_space_low)return 'Сервер приостановил запись: недостаточно свободного места. Локальные заметки сохранены. Обратитесь в поддержку.';
 if(Number.isFinite(data.used_bytes)&&Number.isFinite(data.limit_bytes)&&data.limit_bytes>0&&data.used_bytes>=data.limit_bytes)return 'Синхронизация ограничена: хранилище заполнено ('+size(data.used_bytes)+' из '+size(data.limit_bytes)+'). Сервер отклоняет запись новых изменений. Локальные заметки сохранены. Освободите место или обратитесь в поддержку для увеличения лимита.';
 return null;
}
