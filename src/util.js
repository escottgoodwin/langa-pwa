export const langSwitch = (lang) => {
  if (lang === 'en'){
    return {language:'English', flag:'GB'}
  }
  if (lang === 'es'){
    return {language:'Spanish', flag: 'ES'}
  }
  if (lang === 'fr'){
    return {language:'French', flag: 'FR'}
  }
  if (lang === 'de'){
    return {language:'German', flag: 'DE'}
  }
}

export const sortDate = array => {
  return array.sort(function(a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a>b ? -1 : a<b ? 1 : 0;
  })
}

export const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
}

export const splitSentence = text => {
  return text.match( /[^\.!\?]+[\.!\?]+|[^\.!\?]+/g )
}
