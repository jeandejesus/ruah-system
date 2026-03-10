export interface PackagePlan {
  _id?: string;
  key: number;
  title: string;
  subtitle?: string;
  price: number; // valor total
  installmentCount: number;
  installmentValue: number;
  highlight?: boolean;
}

export const RUAH_PACKAGES: PackagePlan[] = [
  {
    key: 1,
    title: '1 Modalidade',
    price: 479.4,
    installmentCount: 6,
    installmentValue: 79.9,
  },
  {
    key: 2,
    title: '2 Modalidades',
    price: 660,
    installmentCount: 6,
    installmentValue: 110,
    highlight: true,
  },
  {
    key: 3,
    title: 'CIA',
    price: 779.4,
    installmentCount: 6,
    installmentValue: 129.9,
  },
  {
    key: 4,
    title: 'Jazz Contemporâneo',
    price: 599.4,
    installmentCount: 6,
    installmentValue: 99.9,
  },
   {
    key: 5,
    title: 'plano de teste cartão ',
    price: 10,
    installmentCount: 6,
    installmentValue: 1,
  }
];
