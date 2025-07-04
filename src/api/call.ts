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
    let errorObj: any = { message: 'An error occurred.' };
    try {
      const errorJson = await res.json();
      errorObj = errorJson;
    } catch (e) {
      // fallback to text if not JSON
      const errorText = await res.text();
      errorObj = { message: errorText };
    }
    // Attach status for extra context
    errorObj.status = res.status;
    throw errorObj;
  }

  return res.json();
};

export default apiCall;
