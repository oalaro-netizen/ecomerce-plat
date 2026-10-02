export const countries = [
  { label: "Nigeria", code: "NG" },
  { label: "United Kingdom", code: "GB" },
  { label: "United States", code: "US" },
  { label: "Canada", code: "CA" },
  { label: "Germany", code: "DE" },
];

export const nigeriaStates = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara","Federal Capital Territory (FCT)"
];

export const nigerianLGAs = {
  "Kwara": ["Asa","Baruten","Edu","Ilorin East","Ilorin South","Ilorin West","Irepodun","Isin","Kaiama","Moro","Offa","Oke Ero","Oyun","Pategi"],
  "Lagos": ["Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Apapa","Badagry","Egbade","Ifako-Ijaiye","Ikeja","Ikorodu","Kosofe","Lagos Island","Ojo","Ogun","Oshodi-Isolo","Shomolu","Somolu","Surulere"],
  "Oyo": ["Afijio","Akinyele","Atisbo","Atisbo","Ibadan North","Ibadan North-East","Ibadan North-West","Ibadan South-East","Ibadan South-West","Ibarapa Central","Ibarapa East","Ibarapa North","Ido","Irepo","Iseyin","Itesseyo","Itesiwaju","Iwoye","Ogbomosho","Ogbomoso South","Ogo Oluwa","Olorunsogo","Oluyole","Ona Ara","Oreope","Oriade","Oyo East","Oyo West","Saki East","Saki West","Surulere"],
  "Kaduna": ["Birnin Gwari","Chikun","Giwa","Igabi","Ikara","Jaba","Jema'a","Kachia","Kaduna North","Kaduna South","Kagarko","Kajuru","Kaura","Kauru","Kubau","Kuduna","Lafanawa","Lere","Makarfi","Sabon Gari","Sanga","Soba","Zangon Kataf","Zaria"],
  "Kano": ["Ajingi","Albasu","Bebeji","Bici","Bunkure","Dala","Dambatta","Dawaki Tofa","Dawaki","Fagge","Gabasawa","Garko","Garun Mallam","Gaya","Gwarzo","Gwale","Kabo","Karaye","Kibiya","Kura","Madobi","Makoda","Minjibir","Nasara GRA","Rano","Rimi Gado","Rimin Gado","Shanono","Sumaila","Takai","Tarauni","Tumbunchi","Wudil"],
};

export const defaultLGAs = {
  "Abia": ["Aba North","Aba South","Arochukwu","Bende","Isiala Ngwa North","Isiala Ngwa South","Isuikwuato","Osisioma","Umuahia North","Umuahia South","Umunezechi","Ukwa East","Ukwa West"],
  "Adamawa": ["Demsa","Fufore","Ganye","Gombi","Guyuk","Hong","Jada","Lamurde","Madagali","Michika","Mubi North","Mubi South","Numan","Shelleng","Toungo","Yola North","Yola South"],
  "Akwa Ibom": ["Abak","Eket","Essen Udim","Etinan","Ibeno","Ibesikpo Asutan","Ibiono Ibom","Ika","Ikot Abasi","Ikot Ekpene","Ini","Itu","Mbo","Mkpat Enin","Nsit Atai","Nsit Ibom","Nsit Ubium","Okobo","Onna","Oron","Oruk Anam","Udung Uko","Uruan","Urue-Offong/Oruko","Uyo","Victor"],
  "Anambra": ["Aguata","Anambra East","Anambra West","Anaocha","Awka North","Awka South","Ayamelum","Dunukofia","Ekwusigo","Ihiala","Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North","Onitsha South","Orumba North","Orumba South","Oyi","Ayamelum"],
};

// Fill missing with generic sample for demo purposes if needed; but use above
export function getLGAs(state) {
  if (nigerianLGAs[state]) return nigerianLGAs[state];
  if (defaultLGAs[state]) return defaultLGAs[state];
  return ["Area 1","Area 2","Area 3","Area 4"];
}
