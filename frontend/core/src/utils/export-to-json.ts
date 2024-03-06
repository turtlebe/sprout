export function exportToJson(filename, jsonObject) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonObject));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', filename + '.json');
  document.body.appendChild(link); // required for firefox
  link.click();
  link.remove();
}
