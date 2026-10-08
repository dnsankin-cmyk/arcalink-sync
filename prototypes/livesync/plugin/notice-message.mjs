import {createMessageTranslator,normalizeLanguage} from './message-language.mjs';

// Notification wording is independent of the detailed log catalogue. Error
// captures are deliberately omitted; paths in file messages remain verbatim.
const messages=[
 ['OneShot Sync begin... (${mode})','Synchronisation started.','Синхронизация началась.'],
 ['Starting OneShot sync... (${mode})','Synchronisation started.','Синхронизация началась.'],
 ['Replication activated','Synchronisation started.','Синхронизация началась.'],
 ['Replication completed','Synchronisation completed.','Синхронизация завершена.'],
 ['Replication stopped for busy.','Synchronisation is already running.','Синхронизация уже выполняется.'],
 ['Replication callback error','Could not synchronise. Try again.','Не удалось выполнить синхронизацию. Повторите попытку.'],
 ['Replication error','Could not synchronise. Try again.','Не удалось выполнить синхронизацию. Повторите попытку.'],
 ['Replication denied','Access to synchronisation was denied. Sign in again.','Нет доступа к синхронизации. Повторно войдите в аккаунт.'],
 ['Connection failure detected: ${error}','Could not connect to the other device. Check the connection and try again.','Не удалось подключиться к другому устройству. Проверьте связь и повторите попытку.'],
 ['The managed P2P room could not be prepared or opened.','Could not connect to the other device. Try again.','Не удалось подключиться к другому устройству. Повторите попытку.'],
 ['Closing P2P Connection','Device connection closed.','Соединение с устройствами закрыто.'],
 ['P2P Sync is already running.','Device synchronisation is already running.','Обмен с устройствами уже выполняется.'],
 ['P2P Sync completed.','Device synchronisation completed.','Обмен с устройствами завершён.'],
 ['P2P Sync with ${name} have been started.','Device synchronisation started.','Обмен с устройством начался.'],
 ['P2P Replication has been requested to ${peer}','Requesting synchronisation with the other device…','Запрашиваем обмен со вторым устройством…'],
 ['P2P Requesting Authentication to ${peer}','Connecting to the other device…','Подключаемся ко второму устройству…'],
 ['P2P Replicating from ${peer}','Receiving changes from the other device…','Получаем изменения со второго устройства…'],
 ['P2P Replication has been done','Device synchronisation completed.','Обмен с устройствами завершён.'],
 ['P2P Replication from ${peer}\n${current} / ${total})','Receiving changes from the other device…','Получаем изменения со второго устройства…'],
 ['P2P Replication from ${peer} has been completed','Device synchronisation completed.','Обмен с устройствами завершён.'],
 ['P2P Replication from ${peer} has been cancelled','Device synchronisation cancelled.','Обмен с устройствами отменён.'],
 ['Replication from ${peer} is already in progress','Device synchronisation is already running.','Обмен с устройствами уже выполняется.'],
 ['Error while P2P replicating','Could not synchronise with the other device. Try again.','Не удалось выполнить обмен с другим устройством. Повторите попытку.'],
 ['Peer rejected the connection','The other device declined the connection. Allow synchronisation in its vault settings.','Другое устройство отклонило подключение. Разрешите обмен в его настройках хранилища.'],
 ['Tweak values are not matched','Sync settings differ between devices. Check both devices’ settings.','Настройки обмена на устройствах отличаются. Проверьте настройки обоих устройств.'],
 ['Error while syncing from the remote','Could not receive changes. Check the connection and try again.','Не удалось получить изменения. Проверьте связь и повторите попытку.'],
 ['Peer ${name} seems offline, skipped.','The other device is offline. Open Obsidian on it to synchronise.','Другое устройство недоступно. Откройте на нём Obsidian для обмена.'],
 ['No peers has been detected, waiting incoming other peers...','Waiting for the other device. Open Obsidian on it.','Ожидаем второе устройство. Откройте на нём Obsidian.'],
 ['No auto-sync peers found. Please set peers on the ${pane} pane.','No device is selected for automatic synchronisation. Open the vault settings.','Устройство для автоматического обмена не выбрано. Откройте настройки хранилища.'],
 ['P2P Sync replicator is not found, possibly not have been configured or enabled.','Device synchronisation is not configured. Open the vault settings.','Обмен с устройствами не настроен. Откройте настройки хранилища.'],
 ['Error while opening P2P connection','Could not connect to the other device. Try again.','Не удалось подключиться к другому устройству. Повторите попытку.'],
 ['Network Error: ${error}','Could not reach the server. Check your internet connection.','Не удалось связаться с сервером. Проверьте подключение к интернету.'],
 ['Failed to fetch','Could not reach the server. Check your internet connection.','Не удалось связаться с сервером. Проверьте подключение к интернету.'],
 ['Failed to fetch by API. ${error}','Could not reach the server. Try again later.','Не удалось связаться с сервером. Повторите попытку позже.'],
 ['The request may have failed. The reason sent by the server: ${error}','The server could not complete the request. Try again later.','Сервер не смог выполнить запрос. Повторите попытку позже.'],
 ['Error in Setting Save Event','Could not apply the settings. Try again.','Не удалось применить настройки. Повторите попытку.'],
 ['Failed to start: ${error}','Could not start synchronisation. Try restarting ArcaLink.','Не удалось запустить синхронизацию. Попробуйте перезапустить ArcaLink.'],
 ['Failed to initialise the encryption key, preventing replication.','Could not unlock the vault. Check the passphrase.','Не удалось открыть хранилище. Проверьте парольную фразу.'],
 ['Failed to reset KeyValueDB','Could not reset the local sync data. Try again.','Не удалось сбросить локальные данные синхронизации. Повторите попытку.'],
 ['Failed to open KeyValueDB','Could not open the local sync data. Try restarting ArcaLink.','Не удалось открыть локальные данные синхронизации. Попробуйте перезапустить ArcaLink.'],
 ['Failed to import ${path}: ${error}','Could not import ${path}. See the log for details.','Не удалось импортировать ${path}. Подробности доступны в журнале.'],
 ["Error scanning directory '${path}': ${error}",'Could not check the folder ${path}. See the log for details.','Не удалось проверить папку ${path}. Подробности доступны в журнале.'],
 ['Error processing ${event} event for ${path}: ${error}','Could not process changes to ${path}. See the log for details.','Не удалось обработать изменения файла ${path}. Подробности доступны в журнале.'],
 ['Failed to activate the selected P2P remote configuration: ${error}','Could not connect to the other device. Try again.','Не удалось подключиться к другому устройству. Повторите попытку.'],
 ['Checking for incomplete documents...','Checking note integrity…','Проверяем целостность заметок…'],
 ['No size mismatches found','Notes checked successfully.','Проверка заметок завершена.'],
 ['Found ${count} size mismatches','Some notes need checking. Open the recovery settings.','Некоторые заметки требуют проверки. Откройте настройки восстановления.'],
 ['Fast fetch progress: ${count}\nTotal bytes fetched: ${bytes}','Downloading notes…','Загружаем заметки…'],
 ['Resuming fast database fetch from sequence: ${seq}','Resuming note download…','Продолжаем загрузку заметок…'],
 ['Fast database fetch completed. Total documents in local database: ${count}','Note download completed.','Загрузка заметок завершена.'],
 ['Migrating existing remote configuration to sls+ format...','Updating connection settings…','Обновляем настройки подключения…'],
 ['Free: сигнальное соединение не подтверждено','Could not connect. Check your internet connection and try again.','Не удалось подключиться. Проверьте интернет и повторите попытку.'],
 ['Не удалось подготовить или открыть комнату прямого подключения устройств.','Could not connect to the other device. Try again.','Не удалось подключиться к другому устройству. Повторите попытку.'],
 ['Request failed, status ${status}','The server could not complete the request. Try again later.','Сервер не смог выполнить запрос. Повторите попытку позже.'],
 ['Invalid credentials','Could not sign in. Check your email and password.','Не удалось войти. Проверьте почту и пароль.'],
 ['Invalid client credentials','Sign in again to restore the connection.','Повторно войдите в аккаунт, чтобы восстановить подключение.'],
 ['Notification details are available in the log.','Notification details are available in the log.','Подробности уведомления доступны в журнале.'],
 ['Сбой ${operation}: ${error}','Could not complete the action. See the log for details.','Не удалось выполнить действие. Подробности доступны в журнале.'],
];
const translateNotice=createMessageTranslator(Object.fromEntries(messages.map(([source,def,ru])=>[source,{def,ru}])));
const stripPrefix=text=>text.replace(/^(?:(?:\[[^\]\n]+\]\s*)|(?:\(\d+\):\s*)|(?:⚠️\s*))+/u,'');
const technical=/\[StackTrace\]|\[CausedBy\]|\[LogCallStack\]|\b(?:TypeError|SyntaxError|ReferenceError|Error):|net::ERR_|\bHTTP\s*\d{3}\b/;

export function createNoticeFormatter(translate) {
 return (message,language,{allowFallback=true}={})=>{
  if(typeof message!=='string'||!message.trim())return message;
  if(!['ru','def'].includes(normalizeLanguage(language)))return translate(message,language);
  if(/^[\[{]/.test(message.trim())){
   try{const data=JSON.parse(message);if(data&&typeof data==='object')return translateNotice('Notification details are available in the log.',language);}catch{/* A module prefix or a normal message. */}
  }
  const raw=stripPrefix(message.trim()),english=stripPrefix(translate(raw,'en'));
  // Convert a translated engine message back to its template before replacing
  // diagnostic captures. Translation never recurses into filenames or note text.
  const friendly=translateNotice(english,language);
  if(friendly!==english)return friendly;
  if(technical.test(raw))return translateNotice('Сбой действия: ошибка',language);
  const nested=raw.match(/^(Не удалось[^:\n]+|Ошибка[^:\n]+|Сбой[^:\n]+):\s*(.+)$/);
  if(nested&&/^[A-Za-z]/.test(nested[2]))return translateNotice(/войти/i.test(nested[1])?'Invalid credentials':'Сбой действия: ошибка',language);
  if(raw.includes('\n'))return raw.split('\n').map(line=>createNoticeFormatter(translate)(line,language,{allowFallback})).join('\n');
  const localized=translate(raw,language);
  if(normalizeLanguage(language)==='ru'&&allowFallback&&localized===raw&&/^[A-Za-z][A-Za-z ]{3,}/.test(raw)){
   return /error|fail|invalid|denied|unavailable/i.test(raw)
    ? 'Не удалось выполнить действие. Повторите попытку. Подробности доступны в журнале.'
    : 'Уведомление ArcaLink. Подробности доступны в журнале.';
  }
  return localized;
 };
}
