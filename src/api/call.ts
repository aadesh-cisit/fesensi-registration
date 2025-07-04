type RequestOptions<TBody = unknown> = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: TBody;
  headers?: Record<string, string>;
};

const apiCall = async <T = unknown, TBody = unknown>({
  url,
  method = "GET",
  body,
  headers = { "Content-Type": "application/json" },
}: RequestOptions<TBody>): Promise<T> => {
    const res = await fetch(`http://13.126.29.230/api/${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let errorObj: { message: string; status?: number } = { message: 'An error occurred.' };
    try {
      const errorJson = await res.json();
      errorObj = errorJson;
    } catch (e) {
      // fallback to text if not JSON
      const errorText = await res.text();
      errorObj = { message: errorText };
      console.log(e)
    }
    // Attach status for extra context
    errorObj.status = res.status;
    throw errorObj;
  }

  return res.json();
};

export default apiCall;
