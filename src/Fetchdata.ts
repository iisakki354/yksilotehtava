async function fetchData<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('HTTP error: ' + response.status);
    }
    const json = await response.json();
    return json as T;
  }

  export { fetchData };
