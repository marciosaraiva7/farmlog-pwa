export const fetchFarmData = async (clientId: string | undefined) => {
  if (!clientId) {
    throw new Error("ID do cliente não encontrado.");
  }

  const savedClient = localStorage.getItem("farmData");
  if (savedClient) {
    return [JSON.parse(savedClient)];
  }

  const response = await fetch(
    `https://farmlog-api.wr-agro.dev.br:3003/api/getFarm/${clientId}`,
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar os dados da fazenda.");
  }

  const data = await response.json();
  localStorage.setItem("farmData", JSON.stringify(data));
  return [data];
};

export const fetchAnnotations = async (userId: string | undefined) => {
  if (!userId) {
    throw new Error("ID do usuário não encontrado.");
  }

  const response = await fetch(
    `https://farmlog-api.wr-agro.dev.br:3003/api/getAnnotations?ByUser=${userId}`,
    {
      headers: {
        Accept: "*/*",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        Connection: "keep-alive",
        Origin: "http://localhost:5173",
        Referer: "http://localhost:5173/",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar anotações.");
  }

  return await response.json();
};

export const fetchFieldsByArea = async (areaId: string | undefined) => {
  if (!areaId) {
    throw new Error("ID da área não encontrado.");
  }

  const response = await fetch(
    `https://farmlog-api.wr-agro.dev.br:3003/api/getFields?ByArea=${areaId}`,
    {
      headers: {
        "User-Agent": "insomnia/2023.5.8",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar campos por área.");
  }

  return await response.json();
};
export const fetchAreasByFarm = async (farmId: string | undefined) => {
  if (!farmId) {
    throw new Error("ID da fazenda não encontrado.");
  }

  const response = await fetch(
    `https://farmlog-api.wr-agro.dev.br:3003/api/getAreas?ByFarm=${farmId}`,
    {
      headers: {
        "User-Agent": "insomnia/2023.5.8",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar áreas da fazenda.");
  }

  return await response.json();
};
