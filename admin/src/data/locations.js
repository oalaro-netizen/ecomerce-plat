import { Country, State, City } from 'country-state-city';

const countries = Country.getAllCountries().map(c => ({ label: c.name, code: c.isoCode }));
const stateList = State.getAllStates();

// Nigeria LGAs complete
const nigerianLGAs = {
  Abia:["Aba North","Aba South","Arochukwu","Bende","Isiala Ngwa North","Isiala Ngwa South","Isuikwuato","Osisioma","Umuahia North","Umuahia South","Umunezechi","Ukwa East","Ukwa West"],
  Adamawa:["Demsa","Fufore","Ganye","Gombi","Guyuk","Hong","Jada","Lamurde","Madagali","Michika","Mubi North","Mubi South","Numan","Shelleng","Toungo","Yola North","Yola South"],
  "Akwa Ibom":["Abak","Eket","Essen Udim","Etinan","Ibeno","Ibesikpo Asutan","Ibiono Ibom","Ika","Ikot Abasi","Ikot Ekpene","Ini","Itu","Mbo","Mkpat Enin","Nsit Atai","Nsit Ibom","Nsit Ubium","Okobo","Onna","Oron","Oruk Anam","Udung Uko","Uruan","Urue-Offong/Oruko","Uyo","Victor"],
  Anambra:["Aguata","Anambra East","Anambra West","Anaocha","Awka North","Awka South","Ayamelum","Dunukofia","Ekwusigo","Ihiala","Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North","Onitsha South","Orumba North","Orumba South","Oyi"],
  Bauchi:["Alkaleri","Bauchi","Damban","Dass","Gamawa","Ganjuwa","Garkida","Itas/Gadau","Jamare","Katagum","Kirfi","Misau","Ningi","Pardari","Shira","Tafawa Balewa","Toro","Zaki"],
  Bayelsa:["Brass","Ekeremor","Kolokuma/Opokuma","Niger Delta","Ogbia","Sagosha","Sere-Yeh","Southern Ijaw","Yenagoa"],
  Benue:["Ado","Agatu","Apa","Buruku","Gboko","Guma","Gwer East","Gwer West","Katsina-Ala","Konshisha","Kwande","Laisha","Logo","Makurdi","Obi","Ogbadibo","Ohimini","Oju","Okpokwu","Otukpo","Tarka","Ukum","Urb-Ct?"],
  Borno:["Abadam","Askira/Uba","Bama","Bayo","Biu","Chibok","Damboa","Dikwa","Gubio","Guzamala","Gwoza","Hawul","Jere","Kaga","Kalmalo","Kisira","Konduga","Kukawa","Kwaya Kusar","Maga","Maiduguri","Marte","Montay","Ngala","Nganzai","Shani","Tarmuwa","Tedu","Waza","Wulgo"],
  "Cross River":["Abi","Akamkpa","Akpabuyo","Biase","Boki","Calabar Municipal","Calabar South","Akamkpa?","Central Bassey","Etung","Akamkpa","Odukpani","Yakurr","Yakuur","Akamkpa"],
  Delta:["Anioma?","Aniocha North","Aniocha South","Bomadi","Burutu","Ethiope East","Ethiope West","Iceshi","Isoko North","Isoko South","Ndokwa East","Ndokwa West","Okpe","Oshimili North","Oshimili South","Patani","Sapele","Udu","Ughelli North","Ughelli South","Ukew","Ukwuani","Uvwie","Warri North","Warri South","Warri South West","Wetland?"],
  Ebonyi:["Abakaliki","Afikpo North","Afikpo South","Izzi","Ohaozara","Onicha","Ishielu","Izzi","Ohaukwu","Sever","Ezza North","Ezza South","Ikwo","Ivo","Ose","Abakaliki","Afikpo","Izzi","Ohaozara","Onicha","Ishielu","Izzi","Ohaukwu","Sever","Ezza North","Ezza South","Ikwo","Ivo","Ose"],
  Edo:["Akoko Edo","Egor","Esan Central","Esan North-East","Esan South-East","Esan West","Etsako Central","Etsako East","Oredo","Ovia North-East","Ovia South-West","Owan East","Owan West","Oredo","Sapela?","Uhunmwonde","Uvwie?","Igueben","Irrua","Ekpoma?"],
  Ekiti:["Ado-Ekiti","Aiyekire (Gbonyin)","Ekiti East","Ekiti South-West","Emure","Gbona","Ijero","Ikere","Ikole","Ekiti","Omuo","Orolesu","Aikede?"],
  Enugu:["Aninri","Awgu","Enugu East","Enugu North","Enugu South","Ezeagu","Igbo Etiti","Igbo Eze North","Enugu South","Isi Uzo","Nkanu East","Nkanu West","Nsukka","Oji River","Udenu","Udi","Uzo-Uwani","Enugu"],
  Gombe:["Akko","Balanga","Billiri","Dukku","Funakaye","Gombe","Kaltungo","Kwami","Nafada","Shongom","Yamaltu/Deba"],
  Imo:["Aboh Mbaise","Ahiazu Mbaise","Ehime Mbano","Ezinihitte","Isiala Mbano","Isu","Mbaitoli","Nwangele","Obowo","Oguta","Ohaji/Egbema","Owerri Municipal","Owerri North","Owerri West","Unuimo?","Ogberika","Aboh","Ahiazu","Mbaitoli"],
  Jigawa:["Babura","Biriniwa","Birnin Kudu","Gagarawa","Gumel","Gwaram","Hadejia","Jahun","Kazaure","Kiri Kasama","Kiyawa","Maigatari","Malam Madori","Kafur","Ringim","Roni","Sule Tankarkar","Taquba","Wari","Jirgi?"],
  Kaduna:["Birnin Gwari","Chikun","Giwa","Igabi","Ikara","Jaba","Jema'a","Kachia","Kaduna North","Kaduna South","Kagarko","Kajuru","Kaura","Kauru","Kubau","Kuduna","Lafanawa","Lere","Makarfi","Sabon Gari","Sanga","Soba","Zangon Kataf","Zaria"],
  Kano:["Ajingi","Albasu","Bebeji","Bici","Bunkure","Dala","Dambatta","Dawaki Tofa","Dawaki","Fagge","Gabasawa","Garko","Garun Mallam","Gaya","Gwarzo","Gwale","Kabo","Karaye","Kibiya","Kura","Madobi","Makoda","Minjibir","Nasara GRA","Rano","Rimi Gado","Rimin Gado","Shanono","Sumaila","Takai","Tarauni","Tumbunchi","Wudil"],
  Katsina:["Batsari","Bindawa","Jibia","Kafur","Kaita","Malumfashi","Mani","Daura","Dutsin-Ma","Kusada","Funtua","Ingawa","Jibia","Dandume","Zuregi","Safana","Batagarawa","Charanchi","Kankara","Rimi","Kankara?"],
  Kebbi:["Arewa Dandoke","Argungu","Augie","Bagudo","Birnin Kebbi","Bunza","Danko/Wassagge","Fakete","Jega","Kalgo","Kamba","Kaugama","Kere","Kokari","Maigana","Sakaba","Shanga","Suru","Wasagu/Danko","Yauri","Zuru","Kebbi"],
  Kogi:["Adavi","Ajaokuta","Ankpa","Bassa","Dekina","Ibaji","Idah","Igalamela-Odolam","Ijumu","Kabba/Bunu","Kabba","Kainji","Kogi","Lokoja","Mopa-Muro","Ofu","Ogaminya","Olamaboro","Omala","Yagba East","Yagba West","Ijumu","Ajaokuta","Adavi","Bassa","Dekina","Idah","Ibaji","Igalamela","Ijumu","Kabba","Kainji","Lokoja","Mopa","Ofu","Ogaminya","Olamaboro","Omala"],
  Kwara:["Asa","Baruten","Edu","Ekiti","Ifelodun","Ilorin East","Ilorin South","Ilorin West","Irepodun","Isin","Kaiama","Moro","Offa","Oke Ero","Oyun","Patigi"],
  Lagos:["Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Apapa","Badagry","Egbade","Ifako-Ijaiye","Ikeja","Ikorodu","Kosofe","Lagos Island","Ojo","Ogun","Oshodi-Isolo","Shomolu","Somolu","Surulere"],
  Nasarawa:["Akwanga","Doma","Keffi","Kokona","Lafia","Nasarawa","Nasarawa Eggon","Nas"],
  Niger:["Agaie","Agwara","Bida","Edati","Gbako","Gurara","Katcha","Lapai","Lavun","Magama","Magaia","Mashegu","Matsena","Minna","Moula","New Bussa","Paikoro","Rafi","Riga","Sakaba","Sheriki","Suleja","Wawa","Worri"],
  Ogun:["Abeokuta North","Abeokuta South","Ado-Odo/Ota","Egbado?","Egbema","Ewekoro","Fagbo","Ifo","Ijebu East","Ijebu North","Ijebu North East","Ijebu Ode","Ijebu Oru","Ikenne","Imeko Afon","Ipokia","Obafemi Owode","Odogbolu","Ogun Waterside","Remo","Sagamu","Shagamu","Yewa North","Yewa South"],
  Ondo:["Akoko North-East","Akoko North-West","Akoko South-East","Akoko South-West","Akure North","Akure South","Ese Odo","Idanre","Ifedore","Ifeloju","Okitipupa","Ondo East","Ondo West","Ose","Owo","Okitipupa","Ilaje","Irele","Odigbo","Ilaje","Okitipupa"],
  Osun:["Aiyedaade","Aiyedire","Atakunmosa East","Atakunmosa West","Boluwaduro","Boripe","Ede North","Ede South","Egbedore","Ejigbo","Ifedayo","Ife Central","Ife East","Ife North","Ife South","Ifedayo","Ilesa East","Ilesa West","Irewole","Isokan","Iwo","Obokun","Oduram","Olorunda","Oriade","Ola Oni","Osogbo","Olorunda"],
  Oyo:["Afijio","Akinyele","Atisbo","Ibadan North","Ibadan North-East","Ibadan North-West","Ibadan South-East","Ibadan South-West","Ibarapa Central","Ibarapa East","Ibarapa North","Ido","Irepo","Iseyin","Itesseyo","Itesiwaju","Iwoye","Ogbomosho","Ogbomoso South","Ogo Oluwa","Olorunsogo","Oluyole","Ona Ara","Oreope","Oriade","Oyo East","Oyo West","Saki East","Saki West","Surulere"],
  Plateau:["Barka","Bassa","Bokkos","Jos East","Jos North","Jos South","Langtang North","Langtang South","Manga","Mikang","Pankshin","Qua'an Pan","Riyom","Shendam","Wase"],
  Rivers:["Abua/Odual","Ahoada East","Ahoada West","Akuku-Toru","Asari-Toru","Asenkota","Bonny","Degema","Eleme","Emohua","Etche","Gokana","Ikwerre","Obio/Akpor","Ogba/Egbema/Ndoni","Ogu/Bolo","Okrika","Omoku","Opobo/Nkoro","Oyigbo","Port Harcourt","Tai","Gokana","Obio/Akpor"],
  Sokoto:["Binji","Bodinga","Dange-Shuni","Gada","Goronyo","Gudu","Gwadabawa","Illela","Isa","Kebbe","Kware","Rabah","Sabon Birni","Shagari","Silame","Sokoto North","Sokoto South","Tambuwal","Tangaza","Wamako","Wurno","Wamako"],
  Taraba:["Ardo Kola","Bali","Donga","Gashaka","Gashuaka","Ibi","Jalingo","Karim Lamido","Lau","Sardauna","Takum","Uba","Wukari","Zing"],
  Yobe:["Bade","Bursari","Damaturu","Fika","Fune","Gashua","Gunnuruwa","Guzamala","Karasuwa","Machina","Nangere","Nguru","Potiskum","Tarmuwa","Yunusari","Yusufari"],
  Zamfara:["Anka","Bakura","Birnin Magaji/Kiyawa","Bukkuyum","Bungudu","Chafe","Gummi","Gusau","Kaura Namoda","Maradun","Maru","Mukhtar Khalaf","Shinkafi","Talata Mafara","Zurmi"],
  "Federal Capital Territory (FCT)":["Abuja Municipal","Abuja FEMA","Bwari","Gwagwalada","Kuje","Abaji"]
};

function getFirstLevel(countryCode) {
  const list = State.getAllStates().filter(s => s.countryCode === countryCode);
  return list.map(s => ({ label: s.name, code: s.isoCode }));
}

function getSecondLevel(countryCode, stateCode) {
  if (countryCode === 'NG') {
    const st = State.getAllStates().find(s => s.isoCode === stateCode && s.countryCode === 'NG');
    const stateName = st ? st.name : stateCode;
    return (nigerianLGAs[stateName] || []).map((l, i) => ({ label: l, code: String(i) }));
  }
  const cities = City.getCitiesOfState(countryCode, stateCode);
  return cities.map(c => ({ label: c.name, code: c.name }));
}

export { getFirstLevel, getSecondLevel };
export const labelMap = {
  NG: { first: 'State', second: 'Local Government Area' },
  US: { first: 'State', second: 'County' },
  GB: { first: 'Country/Region', second: 'County / Local Authority' },
  CA: { first: 'Province / Territory', second: 'County / Regional Municipality' },
  AU: { first: 'State / Territory', second: 'Local Government Area' },
  IN: { first: 'State / Union Territory', second: 'District' },
  GH: { first: 'Region', second: 'District / Municipal / Metropolitan Assembly' },
  KE: { first: 'County', second: 'Sub-county' },
  ZA: { first: 'Province', second: 'District Municipality / Local Municipality' },
};
export { countries, nigerianLGAs };
