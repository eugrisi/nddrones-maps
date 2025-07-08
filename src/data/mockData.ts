export interface Reseller {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  position: [number, number];
  type: string;
  website?: string;
  description?: string;
}

export const mockResellers: Reseller[] = [
  {
    id: 1,
    name: "DroneShop SP",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    phone: "(11) 99999-9999",
    email: "contato@droneshopsp.com.br",
    position: [-23.5505, -46.6333],
    type: "Loja Física e Online",
    website: "https://droneshopsp.com.br",
    description: "Especializada em drones DJI e FPV"
  },
  {
    id: 2,
    name: "Rio Drones",
    address: "Rua das Laranjeiras, 500 - Rio de Janeiro, RJ",
    phone: "(21) 88888-8888",
    email: "vendas@riodrones.com.br",
    position: [-22.9068, -43.1729],
    type: "Assistência Técnica",
    description: "Manutenção e reparo especializado"
  },
  {
    id: 3,
    name: "Minas Drone Center",
    address: "Av. Afonso Pena, 3000 - Belo Horizonte, MG",
    phone: "(31) 77777-7777",
    email: "info@minasdronecenter.com.br",
    position: [-19.9167, -43.9345],
    type: "Loja Física",
    description: "Maior variedade de drones em MG"
  },
  {
    id: 4,
    name: "Sul Drones",
    address: "Rua XV de Novembro, 800 - Curitiba, PR",
    phone: "(41) 66666-6666",
    email: "atendimento@suldrones.com.br",
    position: [-25.4284, -49.2733],
    type: "Cursos e Treinamento",
    description: "Cursos de pilotagem e certificação"
  },
  {
    id: 5,
    name: "Nordeste Sky",
    address: "Av. Boa Viagem, 2000 - Recife, PE",
    phone: "(81) 55555-5555",
    email: "contato@nordestesky.com.br",
    position: [-8.1148, -34.9042],
    type: "Aluguel de Drones",
    description: "Aluguel para eventos e filmagens"
  },
  {
    id: 6,
    name: "Centro-Oeste Drones",
    address: "Av. das Nações, 1500 - Brasília, DF",
    phone: "(61) 44444-4444",
    email: "vendas@centrooesteidrones.com.br",
    position: [-15.7942, -47.8822],
    type: "Loja Online",
    description: "Entrega para todo o Centro-Oeste"
  }
];