const pathUrl = () => {
  let frontPart = ''
  const { pathname } = window.location
  const canonicalValues: string[] = ["af-ZA","sq-AL","ar-DZ","ar-BH","ar-EG","ar-IQ","ar-JO","ar-LB","ar-LY","ar-MA","ar-OM","ar-QA","ar-SA","ar-SY","ar-TN","ar-AE","ar-YE","hy-AM","az-AZ","eu-ES","be-BY","bn-IN","bs-BA","bg-BG","ca-ES","zh-CN","zh-HK","zh-MO","zh-SG","zh-TW","hr-HR","cs-CZ","da-DK","nl-BE","nl-NL","en-AU","en-BZ","en-CA","en-IE","en-JM","en-NZ","en-PH","en-ZA","en-TT","en-VI","en-GB","en-US","en-ZW","et-EE","fo-FO","fi-FI","fr-BE","fr-CA","fr-FR","fr-LU","fr-MC","fr-CH","gl-ES","ka-GE","de-AT","de-DE","de-LI","de-LU","de-CH","el-GR","gu-IN","he-IL","hi-IN","hu-HU","is-IS","id-ID","it-IT","it-CH","ja-JP","kn-IN","kk-KZ","kok-IN","ko-KR","lv-LV","lt-LT","mk-MK","ms-BN","ms-MY","ml-IN","mt-MT","mr-IN","mn-MN","se-NO","nb-NO","nn-NO","fa-IR","pl-PL","pt-BR","pt-PT","pa-IN","ro-RO","ru-RU","sr-BA","sr-CS","sk-SK","sl-SI","es-AR","es-BO","es-CL","es-CO","es-CR","es-DO","es-EC","es-SV","es-GT","es-HN","es-MX","es-NI","es-PA","es-PY","es-PE","es-PR","es-ES","es-UY","es-VE","sw-KE","sv-FI","sv-SE","ta-IN","te-IN","th-TH","tn-ZA","tr-TR","uk-UA","uz-UZ","vi-VN","cy-GB","xh-ZA"]
  for (let i = 0; i < canonicalValues.length; i++) {
    if (pathname?.includes(`/${canonicalValues[i]}`.toLowerCase())) {
      frontPart = `/${canonicalValues[i].toLowerCase()}`
    }
  }
  return frontPart

}

export default pathUrl
