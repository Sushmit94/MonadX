// Story Protocol API Client
// Defines the base URL and a helper function for API calls.

// Default to a local development endpoint if not set in environment variables
export const STORY_API_BASE_URL = 'https://api.storyprotocol.net';

/**
 * Fetches data from the Story Protocol API.
 *
 * @param endpoint The API endpoint to call (e.g., '/assets').
 * @param options Optional fetch options (method, headers, body, etc.).
 * @returns A promise that resolves to the JSON response.
 * @throws An error if the network response is not ok.
 */
export async function fetchFromStoryAPI(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${STORY_API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Add any default headers here, like an API key if required
    // 'X-API-Key': process.env.STORY_PROTOCOL_API_KEY,
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // Try to parse the error response for more details
      const errorBody = await response.text();
      console.error('Story Protocol API Error:', errorBody);
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    // Handle cases where response might be empty
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json();
    } else {
      return response.text();
    }
  } catch (error) {
    console.error(`Failed to fetch from Story API endpoint: ${endpoint}`, error);
    throw error;
  }
}
