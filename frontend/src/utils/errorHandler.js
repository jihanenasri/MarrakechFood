export function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    "Erreur inconnue"
  );
}