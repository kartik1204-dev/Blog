const parseJwtPayload = (token) => {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const normalizedBase64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = normalizedBase64.padEnd(
      normalizedBase64.length + ((4 - (normalizedBase64.length % 4)) % 4),
      "="
    );

    const payloadJson = atob(paddedBase64);
    return JSON.parse(payloadJson);
  } catch (error) {
    return null;
  }
};

export const hasValidToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) {
    localStorage.removeItem("token");
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const isValid = payload.exp > nowInSeconds;

  if (!isValid) {
    localStorage.removeItem("token");
  }

  return isValid;
};
