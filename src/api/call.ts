type RequestOptions = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

const apiCall = async <T = any>({

  url,
  method = "GET",
  body,
  headers = { "Content-Type": "application/json" },
}: RequestOptions): Promise<T> => {
    const res = await fetch(`http://13.126.29.230/api/${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let errorMessage = 'An error occurred.';
    try {
      const errorJson = await res.json();
      errorMessage = errorJson.message || errorMessage;
    } catch (e) {
      // fallback to text if not JSON
      const errorText = await res.text();
      // Try to extract message from text if possible
      const match = errorText.match(/"message"\s*:\s*"([^"]+)"/);
      if (match) {
        errorMessage = match[1];
      } else {
        errorMessage = errorText;
      }
    }
    throw new Error(errorMessage);
  }

  return res.json();
};

export default apiCall;
