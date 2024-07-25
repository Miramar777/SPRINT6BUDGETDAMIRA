export interface Budget {
  clientName: string;
  phone: string;
  email: string;
  seo: boolean;
  ads: boolean;
  web: boolean;
  webDetails: {
    pages: number;
    languages: number;
  };
  date: Date;
  totalCost: number;

}


