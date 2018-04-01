class Abbreviations {
  constructor() {
    this.eliteserieAbbr = {
      Kristiansund: "KBK",
      Molde: "MFK",
      Lillestrøm: "LSK",
      Sandefjord: "SAN",
      "Sarpsborg 08": "S08",
      Stabæk: "STB",
      Strømsgodset: "SIF",
      Haugesund: "FKH",
      Tromsø: "TIL",
      Brann: "BRA",
      Rosenborg: "RBK",
      Odd: "ODD",
      Vålerenga: "VIF",
      Start: "STA",
      Ranheim: "RAN",
      "Bodø/Glimt": "B/G"
    };

    this.obosligaAbbr = {
      Aalesund: "AaFK",
      Notodden: "NOT",
      Tromsdalen: "TRO",
      Åsane: "ÅSA",
      Florø: "FLO",
      Jerv: "JER",
      Mjøndalen: "MJØ",
      HamKam: "HAM",
      Sogndal: "SOG",
      Strømmen: "STR",
      "Sandnes Ulf": "ULF",
      "Nest-Sotra": "NEST",
      "Ullensaker/Kisa": "UKI",
      Viking: "VIK",
      Levanger: "LEV",
      Kongsvinger: "KON"
    };
  }

  getAbbreviations = (name, league) => {
    if (league.toLowerCase() === "eliteserien") {
      const abbrev = this.eliteserieAbbr[name];
      if (abbrev) return abbrev;

      throw new Error(`Could not find abbreviation for ${name}`);
    } else if (league.toLowerCase() === "obosligaen") {
      const abbrev = this.obosligaAbbr[name];
      if (abbrev) return abbrev;

      throw new Error(`Could not find abbreviation for ${name}`);
    }

    throw new Error(
      `${league} is an invalid league. Use Eliteserien or Obosligaen`
    );
  };
}

export default Abbreviations;
