// RAL Classic — the painted-front palette Mebo offers through Global Design.
//
// This is the complete list frontmdf.ro publishes for painted MDF fronts
// (213 shades). Codes and names are the official RAL Classic ones (Dutch and
// English); the hex values are screen approximations only — RAL does not
// publish binding sRGB values, and every page that shows these says so.
// NCS shades are available on request but are not listed here.

export type RalColor = {
  code: string;
  hex: string;
  nl: string;
  en: string;
};

// Colour families follow the first digit of the code.
export const RAL_GROUPS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
export type RalGroup = (typeof RAL_GROUPS)[number];

export const RAL_COLORS: readonly RalColor[] = [
  // 1xxx — yellows and beiges
  { code: "1000", hex: "#CCC58F", nl: "Groenbeige", en: "Green beige" },
  { code: "1001", hex: "#D1BC8A", nl: "Beige", en: "Beige" },
  { code: "1002", hex: "#D2B773", nl: "Zandgeel", en: "Sand yellow" },
  { code: "1003", hex: "#F7BA0B", nl: "Signaalgeel", en: "Signal yellow" },
  { code: "1004", hex: "#E2B007", nl: "Goudgeel", en: "Golden yellow" },
  { code: "1005", hex: "#C89F04", nl: "Honinggeel", en: "Honey yellow" },
  { code: "1006", hex: "#E1A100", nl: "Maisgeel", en: "Maize yellow" },
  { code: "1007", hex: "#E79C00", nl: "Narcissengeel", en: "Daffodil yellow" },
  { code: "1011", hex: "#AF8A54", nl: "Bruinbeige", en: "Brown beige" },
  { code: "1012", hex: "#D9C022", nl: "Citroengeel", en: "Lemon yellow" },
  { code: "1013", hex: "#E9E5CE", nl: "Parelwit", en: "Oyster white" },
  { code: "1014", hex: "#DFCEA1", nl: "Ivoorkleurig", en: "Ivory" },
  { code: "1015", hex: "#EADEBD", nl: "Licht ivoorkleurig", en: "Light ivory" },
  { code: "1016", hex: "#EAF044", nl: "Zwavelgeel", en: "Sulfur yellow" },
  { code: "1017", hex: "#F4B752", nl: "Saffraangeel", en: "Saffron yellow" },
  { code: "1018", hex: "#F3E03B", nl: "Zinkgeel", en: "Zinc yellow" },
  { code: "1019", hex: "#A4957D", nl: "Grijsbeige", en: "Grey beige" },
  { code: "1020", hex: "#9A9464", nl: "Olijfgeel", en: "Olive yellow" },
  { code: "1021", hex: "#EEC900", nl: "Koolzaadgeel", en: "Rape yellow" },
  { code: "1023", hex: "#F0CA00", nl: "Verkeersgeel", en: "Traffic yellow" },
  { code: "1024", hex: "#B89C50", nl: "Okergeel", en: "Ochre yellow" },
  { code: "1026", hex: "#F5FF00", nl: "Briljantgeel", en: "Luminous yellow" },
  { code: "1027", hex: "#A38C15", nl: "Kerriegeel", en: "Curry" },
  { code: "1028", hex: "#FFAB00", nl: "Meloengeel", en: "Melon yellow" },
  { code: "1032", hex: "#DDB20F", nl: "Bremgeel", en: "Broom yellow" },
  { code: "1033", hex: "#FAAB21", nl: "Dahliageel", en: "Dahlia yellow" },
  { code: "1034", hex: "#EDAB56", nl: "Pastelgeel", en: "Pastel yellow" },
  { code: "1035", hex: "#A29985", nl: "Parelmoer beige", en: "Pearl beige" },
  { code: "1036", hex: "#927549", nl: "Parelmoer goud", en: "Pearl gold" },
  { code: "1037", hex: "#EEA205", nl: "Zonnegeel", en: "Sun yellow" },

  // 2xxx — oranges
  { code: "2000", hex: "#DD7907", nl: "Geeloranje", en: "Yellow orange" },
  { code: "2001", hex: "#BE4E20", nl: "Roodoranje", en: "Red orange" },
  { code: "2002", hex: "#C63927", nl: "Vermiljoen", en: "Vermilion" },
  { code: "2003", hex: "#FA842B", nl: "Pasteloranje", en: "Pastel orange" },
  { code: "2004", hex: "#E75B12", nl: "Zuiver oranje", en: "Pure orange" },
  { code: "2005", hex: "#FF2300", nl: "Briljantoranje", en: "Luminous orange" },
  { code: "2007", hex: "#FFA421", nl: "Briljant lichtoranje", en: "Luminous bright orange" },
  { code: "2008", hex: "#F3752C", nl: "Licht roodoranje", en: "Bright red orange" },
  { code: "2009", hex: "#E15501", nl: "Verkeersoranje", en: "Traffic orange" },
  { code: "2010", hex: "#D4652F", nl: "Signaaloranje", en: "Signal orange" },
  { code: "2011", hex: "#EC7C25", nl: "Dieporanje", en: "Deep orange" },
  { code: "2012", hex: "#DB6A50", nl: "Zalmoranje", en: "Salmon orange" },
  { code: "2013", hex: "#954527", nl: "Parelmoer oranje", en: "Pearl orange" },

  // 3xxx — reds
  { code: "3000", hex: "#AB2524", nl: "Vuurrood", en: "Flame red" },
  { code: "3001", hex: "#A02128", nl: "Signaalrood", en: "Signal red" },
  { code: "3002", hex: "#A1232B", nl: "Karmijnrood", en: "Carmine red" },
  { code: "3003", hex: "#8D1D2C", nl: "Robijnrood", en: "Ruby red" },
  { code: "3004", hex: "#701F29", nl: "Purperrood", en: "Purple red" },
  { code: "3005", hex: "#5E2028", nl: "Wijnrood", en: "Wine red" },
  { code: "3007", hex: "#402225", nl: "Zwartrood", en: "Black red" },
  { code: "3009", hex: "#703731", nl: "Oxiderood", en: "Oxide red" },
  { code: "3011", hex: "#7E292C", nl: "Bruinrood", en: "Brown red" },
  { code: "3012", hex: "#CB8D73", nl: "Beigerood", en: "Beige red" },
  { code: "3013", hex: "#9C322E", nl: "Tomaatrood", en: "Tomato red" },
  { code: "3014", hex: "#D47479", nl: "Oudroze", en: "Antique pink" },
  { code: "3015", hex: "#E1A6AD", nl: "Lichtroze", en: "Light pink" },
  { code: "3016", hex: "#AC4034", nl: "Koraalrood", en: "Coral red" },
  { code: "3017", hex: "#D3545F", nl: "Bleekrood", en: "Rose" },
  { code: "3018", hex: "#D14152", nl: "Aardbeirood", en: "Strawberry red" },
  { code: "3020", hex: "#C1121C", nl: "Verkeersrood", en: "Traffic red" },
  { code: "3022", hex: "#D56D56", nl: "Zalmrood", en: "Salmon pink" },
  { code: "3024", hex: "#F70000", nl: "Briljantrood", en: "Luminous red" },
  { code: "3026", hex: "#FF0000", nl: "Briljant lichtrood", en: "Luminous bright red" },
  { code: "3027", hex: "#B42041", nl: "Frambozenrood", en: "Raspberry red" },
  { code: "3028", hex: "#E72512", nl: "Zuiver rood", en: "Pure red" },
  { code: "3031", hex: "#AC323B", nl: "Oriëntrood", en: "Orient red" },
  { code: "3032", hex: "#711521", nl: "Parelmoer robijnrood", en: "Pearl ruby red" },
  { code: "3033", hex: "#B24C43", nl: "Parelmoer roze", en: "Pearl pink" },

  // 4xxx — violets
  { code: "4001", hex: "#8A5A83", nl: "Roodlila", en: "Red lilac" },
  { code: "4002", hex: "#933D50", nl: "Roodviolet", en: "Red violet" },
  { code: "4003", hex: "#D15B8F", nl: "Heideviolet", en: "Heather violet" },
  { code: "4004", hex: "#691639", nl: "Bordeauxviolet", en: "Claret violet" },
  { code: "4005", hex: "#83639D", nl: "Blauwlila", en: "Blue lilac" },
  { code: "4006", hex: "#992572", nl: "Verkeerspurper", en: "Traffic purple" },
  { code: "4007", hex: "#4A203B", nl: "Purperviolet", en: "Purple violet" },
  { code: "4008", hex: "#904684", nl: "Signaalviolet", en: "Signal violet" },
  { code: "4009", hex: "#A38995", nl: "Pastelviolet", en: "Pastel violet" },
  { code: "4010", hex: "#C63678", nl: "Telemagenta", en: "Telemagenta" },
  { code: "4011", hex: "#8773A1", nl: "Parelmoer violet", en: "Pearl violet" },
  { code: "4012", hex: "#6B6880", nl: "Parelmoer bramen", en: "Pearl blackberry" },

  // 5xxx — blues
  { code: "5000", hex: "#384C70", nl: "Violetblauw", en: "Violet blue" },
  { code: "5001", hex: "#1F4764", nl: "Groenblauw", en: "Green blue" },
  { code: "5002", hex: "#2B2C7C", nl: "Ultramarijnblauw", en: "Ultramarine blue" },
  { code: "5003", hex: "#2A3756", nl: "Saffierblauw", en: "Sapphire blue" },
  { code: "5004", hex: "#1D1F2A", nl: "Zwartblauw", en: "Black blue" },
  { code: "5005", hex: "#154889", nl: "Signaalblauw", en: "Signal blue" },
  { code: "5007", hex: "#41678D", nl: "Briljantblauw", en: "Brilliant blue" },
  { code: "5008", hex: "#313C48", nl: "Grijsblauw", en: "Grey blue" },
  { code: "5009", hex: "#2E5978", nl: "Azuurblauw", en: "Azure blue" },
  { code: "5010", hex: "#13447C", nl: "Gentiaanblauw", en: "Gentian blue" },
  { code: "5011", hex: "#232C3F", nl: "Staalblauw", en: "Steel blue" },
  { code: "5012", hex: "#3481B8", nl: "Lichtblauw", en: "Light blue" },
  { code: "5013", hex: "#232D53", nl: "Kobaltblauw", en: "Cobalt blue" },
  { code: "5014", hex: "#6C7C98", nl: "Duifblauw", en: "Pigeon blue" },
  { code: "5015", hex: "#2874B2", nl: "Hemelsblauw", en: "Sky blue" },
  { code: "5017", hex: "#0E518D", nl: "Verkeersblauw", en: "Traffic blue" },
  { code: "5018", hex: "#21888F", nl: "Turkooisblauw", en: "Turquoise blue" },
  { code: "5019", hex: "#1A5784", nl: "Capriblauw", en: "Capri blue" },
  { code: "5020", hex: "#0B4151", nl: "Oceaanblauw", en: "Ocean blue" },
  { code: "5021", hex: "#07737A", nl: "Waterblauw", en: "Water blue" },
  { code: "5022", hex: "#2F2A5A", nl: "Nachtblauw", en: "Night blue" },
  { code: "5023", hex: "#4D668E", nl: "Verblauw", en: "Distant blue" },
  { code: "5024", hex: "#6A93B0", nl: "Pastelblauw", en: "Pastel blue" },
  { code: "5025", hex: "#296478", nl: "Parelmoer gentiaanblauw", en: "Pearl gentian blue" },
  { code: "5026", hex: "#102C54", nl: "Parelmoer nachtblauw", en: "Pearl night blue" },

  // 6xxx — greens
  { code: "6000", hex: "#327662", nl: "Patinagroen", en: "Patina green" },
  { code: "6001", hex: "#28713E", nl: "Smaragdgroen", en: "Emerald green" },
  { code: "6002", hex: "#276235", nl: "Loofgroen", en: "Leaf green" },
  { code: "6003", hex: "#4B573E", nl: "Olijfgroen", en: "Olive green" },
  { code: "6004", hex: "#0E4243", nl: "Blauwgroen", en: "Blue green" },
  { code: "6005", hex: "#0F4336", nl: "Mosgroen", en: "Moss green" },
  { code: "6006", hex: "#20372B", nl: "Grijsolijf", en: "Grey olive" },
  { code: "6007", hex: "#25342B", nl: "Flessengroen", en: "Bottle green" },
  { code: "6008", hex: "#23322D", nl: "Bruingroen", en: "Brown green" },
  { code: "6009", hex: "#1F3A2C", nl: "Dennengroen", en: "Fir green" },
  { code: "6010", hex: "#4C9141", nl: "Grasgroen", en: "Grass green" },
  { code: "6011", hex: "#6C7C59", nl: "Resedagroen", en: "Reseda green" },
  { code: "6012", hex: "#303D3A", nl: "Zwartgroen", en: "Black green" },
  { code: "6013", hex: "#7D8471", nl: "Rietgroen", en: "Reed green" },
  { code: "6014", hex: "#474135", nl: "Geelolijf", en: "Yellow olive" },
  { code: "6015", hex: "#3D403A", nl: "Zwartolijf", en: "Black olive" },
  { code: "6016", hex: "#026A52", nl: "Turkooisgroen", en: "Turquoise green" },
  { code: "6017", hex: "#468641", nl: "Meigroen", en: "May green" },
  { code: "6018", hex: "#48A43F", nl: "Geelgroen", en: "Yellow green" },
  { code: "6019", hex: "#B7D9B1", nl: "Pastelgroen", en: "Pastel green" },
  { code: "6020", hex: "#354733", nl: "Chroomoxidegroen", en: "Chrome green" },
  { code: "6021", hex: "#86A47C", nl: "Bleekgroen", en: "Pale green" },
  { code: "6022", hex: "#3E3C32", nl: "Bruinolijf", en: "Olive drab" },
  { code: "6024", hex: "#008754", nl: "Verkeersgroen", en: "Traffic green" },
  { code: "6025", hex: "#53753C", nl: "Varengroen", en: "Fern green" },
  { code: "6026", hex: "#005D52", nl: "Opaalgroen", en: "Opal green" },
  { code: "6027", hex: "#81C0BB", nl: "Lichtgroen", en: "Light green" },
  { code: "6028", hex: "#2D5546", nl: "Pijnboomgroen", en: "Pine green" },
  { code: "6029", hex: "#007243", nl: "Mintgroen", en: "Mint green" },
  { code: "6032", hex: "#0F8558", nl: "Signaalgroen", en: "Signal green" },
  { code: "6033", hex: "#478A84", nl: "Mintturkoois", en: "Mint turquoise" },
  { code: "6034", hex: "#7FB0B2", nl: "Pastelturkoois", en: "Pastel turquoise" },
  { code: "6035", hex: "#1B542C", nl: "Parelmoer groen", en: "Pearl green" },
  { code: "6036", hex: "#005D4C", nl: "Parelmoer opaalgroen", en: "Pearl opal green" },
  { code: "6037", hex: "#25E712", nl: "Zuiver groen", en: "Pure green" },
  { code: "6038", hex: "#00F700", nl: "Briljantgroen", en: "Luminous green" },

  // 7xxx — greys
  { code: "7000", hex: "#7E8B92", nl: "Pelsgrijs", en: "Squirrel grey" },
  { code: "7001", hex: "#8F999F", nl: "Zilvergrijs", en: "Silver grey" },
  { code: "7002", hex: "#817F68", nl: "Olijfgrijs", en: "Olive grey" },
  { code: "7003", hex: "#7A7B6D", nl: "Mosgrijs", en: "Moss grey" },
  { code: "7004", hex: "#9EA0A1", nl: "Signaalgrijs", en: "Signal grey" },
  { code: "7005", hex: "#6B716F", nl: "Muisgrijs", en: "Mouse grey" },
  { code: "7006", hex: "#756F61", nl: "Beigegrijs", en: "Beige grey" },
  { code: "7008", hex: "#746643", nl: "Kakigrijs", en: "Khaki grey" },
  { code: "7009", hex: "#5B6259", nl: "Groengrijs", en: "Green grey" },
  { code: "7010", hex: "#575D57", nl: "Zeildoekgrijs", en: "Tarpaulin grey" },
  { code: "7011", hex: "#555D61", nl: "IJzergrijs", en: "Iron grey" },
  { code: "7012", hex: "#596163", nl: "Bazaltgrijs", en: "Basalt grey" },
  { code: "7013", hex: "#555548", nl: "Bruingrijs", en: "Brown grey" },
  { code: "7015", hex: "#51565C", nl: "Leigrijs", en: "Slate grey" },
  { code: "7016", hex: "#373F43", nl: "Antracietgrijs", en: "Anthracite grey" },
  { code: "7021", hex: "#2E3234", nl: "Zwartgrijs", en: "Black grey" },
  { code: "7022", hex: "#4B4D46", nl: "Ombergrijs", en: "Umbra grey" },
  { code: "7023", hex: "#818479", nl: "Betongrijs", en: "Concrete grey" },
  { code: "7024", hex: "#474A50", nl: "Grafietgrijs", en: "Graphite grey" },
  { code: "7026", hex: "#374447", nl: "Granietgrijs", en: "Granite grey" },
  { code: "7030", hex: "#939388", nl: "Steengrijs", en: "Stone grey" },
  { code: "7031", hex: "#5D6970", nl: "Blauwgrijs", en: "Blue grey" },
  { code: "7032", hex: "#B9B9A8", nl: "Kiezelgrijs", en: "Pebble grey" },
  { code: "7033", hex: "#818979", nl: "Cementgrijs", en: "Cement grey" },
  { code: "7034", hex: "#939176", nl: "Geelgrijs", en: "Yellow grey" },
  { code: "7035", hex: "#CBD0CC", nl: "Lichtgrijs", en: "Light grey" },
  { code: "7036", hex: "#9A9697", nl: "Platinagrijs", en: "Platinum grey" },
  { code: "7037", hex: "#7C7F7E", nl: "Stofgrijs", en: "Dusty grey" },
  { code: "7038", hex: "#B4B8B0", nl: "Agaatgrijs", en: "Agate grey" },
  { code: "7039", hex: "#6B695F", nl: "Kwartsgrijs", en: "Quartz grey" },
  { code: "7040", hex: "#9DA3A6", nl: "Venstergrijs", en: "Window grey" },
  { code: "7042", hex: "#8F9695", nl: "Verkeersgrijs A", en: "Traffic grey A" },
  { code: "7043", hex: "#4E5451", nl: "Verkeersgrijs B", en: "Traffic grey B" },
  { code: "7044", hex: "#CAC4B0", nl: "Zijdegrijs", en: "Silk grey" },
  { code: "7045", hex: "#909598", nl: "Telegrijs 1", en: "Telegrey 1" },
  { code: "7046", hex: "#82898E", nl: "Telegrijs 2", en: "Telegrey 2" },
  { code: "7047", hex: "#D0D0D0", nl: "Telegrijs 4", en: "Telegrey 4" },
  { code: "7048", hex: "#898176", nl: "Parelmoer muisgrijs", en: "Pearl mouse grey" },

  // 8xxx — browns
  { code: "8000", hex: "#887142", nl: "Groenbruin", en: "Green brown" },
  { code: "8001", hex: "#9C6B30", nl: "Okerbruin", en: "Ochre brown" },
  { code: "8002", hex: "#7B5141", nl: "Signaalbruin", en: "Signal brown" },
  { code: "8003", hex: "#80542F", nl: "Leembruin", en: "Clay brown" },
  { code: "8004", hex: "#8F4E35", nl: "Koperbruin", en: "Copper brown" },
  { code: "8007", hex: "#6F4A2F", nl: "Reebruin", en: "Fawn brown" },
  { code: "8008", hex: "#6F4F28", nl: "Olijfbruin", en: "Olive brown" },
  { code: "8011", hex: "#5A3A29", nl: "Notenbruin", en: "Nut brown" },
  { code: "8012", hex: "#673831", nl: "Roodbruin", en: "Red brown" },
  { code: "8014", hex: "#49392D", nl: "Sepiabruin", en: "Sepia brown" },
  { code: "8015", hex: "#633A34", nl: "Kastanjebruin", en: "Chestnut brown" },
  { code: "8016", hex: "#4C2F26", nl: "Mahoniebruin", en: "Mahogany brown" },
  { code: "8017", hex: "#44322D", nl: "Chocoladebruin", en: "Chocolate brown" },
  { code: "8019", hex: "#3F3A3A", nl: "Grijsbruin", en: "Grey brown" },
  { code: "8022", hex: "#211F20", nl: "Zwartbruin", en: "Black brown" },
  { code: "8023", hex: "#A65E2F", nl: "Oranjebruin", en: "Orange brown" },
  { code: "8024", hex: "#79553C", nl: "Beigebruin", en: "Beige brown" },
  { code: "8025", hex: "#755C49", nl: "Bleekbruin", en: "Pale brown" },
  { code: "8028", hex: "#4E3B31", nl: "Terrabruin", en: "Terra brown" },
  { code: "8029", hex: "#763C28", nl: "Parelmoer koper", en: "Pearl copper" },

  // 9xxx — whites, blacks and metallics
  { code: "9001", hex: "#F3EBD8", nl: "Crèmewit", en: "Cream" },
  { code: "9002", hex: "#E7EBDA", nl: "Grijswit", en: "Grey white" },
  { code: "9003", hex: "#F4F4F4", nl: "Signaalwit", en: "Signal white" },
  { code: "9004", hex: "#2E3032", nl: "Signaalzwart", en: "Signal black" },
  { code: "9005", hex: "#0E0E10", nl: "Gitzwart", en: "Jet black" },
  { code: "9006", hex: "#A5A5A5", nl: "Blank aluminiumkleurig", en: "White aluminium" },
  { code: "9007", hex: "#8F8F8F", nl: "Grijs aluminiumkleurig", en: "Grey aluminium" },
  { code: "9010", hex: "#F7F6F0", nl: "Zuiver wit", en: "Pure white" },
  { code: "9011", hex: "#27292B", nl: "Grafietzwart", en: "Graphite black" },
  { code: "9016", hex: "#F6F8F6", nl: "Verkeerswit", en: "Traffic white" },
  { code: "9017", hex: "#1C1C1C", nl: "Verkeerszwart", en: "Traffic black" },
  { code: "9018", hex: "#CFD3CD", nl: "Papyruswit", en: "Papyrus white" },
  { code: "9022", hex: "#9C9C9C", nl: "Parelmoer lichtgrijs", en: "Pearl light grey" },
  { code: "9023", hex: "#828282", nl: "Parelmoer donkergrijs", en: "Pearl dark grey" },
];

export function ralGroup(code: string): RalGroup {
  return code[0] as RalGroup;
}

export function ralByCode(code: string): RalColor {
  const color = RAL_COLORS.find((c) => c.code === code);
  if (!color) throw new Error(`Unknown RAL code: ${code}`);
  return color;
}

export function ralName(color: RalColor, locale: string): string {
  return locale === "nl" ? color.nl : color.en;
}

// Codes coming back from a URL (?kleuren=9010,7016) — keep only real ones.
export function parseRalCodes(value: string | null | undefined): RalColor[] {
  if (!value) return [];
  const seen = new Set<string>();
  const out: RalColor[] = [];
  for (const raw of value.split(",")) {
    const code = raw.trim();
    if (seen.has(code)) continue;
    const color = RAL_COLORS.find((c) => c.code === code);
    if (color) {
      seen.add(code);
      out.push(color);
    }
  }
  return out;
}
