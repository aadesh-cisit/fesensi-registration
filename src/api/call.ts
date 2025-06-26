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
  console.log("Making API call to:", url, "with method:", method, "and body:", body);
    const res = await fetch(`http://13.126.29.230/api/${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  console.log(res)
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }

  return res.json();
};

export default apiCall;
