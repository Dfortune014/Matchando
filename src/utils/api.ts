import { LAMBDA_CONFIG } from "./lambdaConfig";

// src/utils/api.ts

export const sendMatchEvent = async (eventData: {
  matchNumber: number;
  score: number;
  timeElapsed: number;
}) => {
  try {
    const payload = {
      eventType: "MATCH",
      data: {
        ...eventData,
        timestamp: new Date().toISOString(),
      },
    };

    console.log("Sending event payload:", payload); // Debug log

    const response = await fetch(
      "https://uz2pmhxgo4.execute-api.us-east-1.amazonaws.com/events",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add API key if required
          // 'x-api-key': process.env.REACT_APP_API_KEY
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      // Log the error response for debugging
      const errorText = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("API Response:", result); // Debug log
    return result;
  } catch (error) {
    console.error("Error sending match event:", error);
    // Don't throw the error to prevent game disruption
    return null;
  }
};

// Add a general event sending function
export const sendGameEvent = async (eventType: string, data: any) => {
  try {
    const payload = {
      eventType,
      data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
    };

    console.log("Sending game event:", payload); // Debug log

    const response = await fetch(
      "https://uz2pmhxgo4.execute-api.us-east-1.amazonaws.com/events",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add API key if required
          // 'x-api-key': process.env.REACT_APP_API_KEY
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("API Response:", result);
    return result;
  } catch (error) {
    console.error("Error sending game event:", error);
    return null;
  }
};
