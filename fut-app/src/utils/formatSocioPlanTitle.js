const TIER_TITLE_MAP = [
  { match: "diamante", title: "SOCIO DIAMANTE" },
  { match: "ouro", title: "SOCIO OURO" },
  { match: "prata", title: "SOCIO PRATA" },
];

export const formatSocioPlanTitle = (value) => {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return raw;
  }

  const normalized = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const matched = TIER_TITLE_MAP.find(({ match }) => normalized.includes(match));
  return matched ? matched.title : raw.toUpperCase();
};

export default formatSocioPlanTitle;
