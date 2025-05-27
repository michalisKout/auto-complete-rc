interface PersonProperties {
  created: string;
  edited: string;
  name: string;
  gender: string;
  skin_color: string;
  hair_color: string;
  height: string;
  eye_color: string;
  mass: string;
  homeworld: string;
  birth_year: string;
  url: string;
}

interface Person {
  properties: PersonProperties;
  _id: string;
  description: string;
  uid: string;
  __v: number;
}

interface PartnerDiscount {
  link: string;
  details: string;
}

interface Support {
  contact: string;
  donate: string;
  partnerDiscounts: {
    saberMasters: PartnerDiscount;
    heartMath: PartnerDiscount;
  };
}

interface Social {
  discord: string;
  reddit: string;
  github: string;
}

export interface ApiResponse {
  message: string;
  result: Person[];
  apiVersion: string;
  timestamp: string;
  support: Support;
  social: Social;
}
