import moment = require('moment');

export function getTime() {
  const time = moment().format('HH:mm:ss');
  console.log(time)
  return `${time}`
}
