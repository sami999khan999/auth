function normalizePythonError(raw: string): string {
  try {
    const regex = /'([^']+)'\s*:\s*\[ErrorDetail\(string='([^']+)'/g;
    const matches: string[] = [];
    let m: RegExpExecArray | null;

    while ((m = regex.exec(raw)) !== null) {
      matches.push(m[1] + ": " + m[2]);
    }

    return matches.length ? matches.join(", ") : raw;
  } catch {
    return raw;
  }
}

function parseApiError(rawError: any): string {
  if (typeof rawError === "object" && rawError !== null) {
    return Object.entries(rawError)
      .map(
        ([field, msgs]) =>
          `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : String(msgs)}`
      )
      .join(", ");
  }

  const text = String(rawError);
  if (text.trim().startsWith("{")) {
    try {
      const obj = JSON.parse(text);
      return parseApiError(obj);
    } catch {
      return normalizePythonError(text);
    }
  }

  return text;
}

export default parseApiError;
