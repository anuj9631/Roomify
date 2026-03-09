export const fetchAsDataUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // First use fetch to get the image
    fetch(url)
      .then((response) => {
        // Throw an error if the response fails
        if (!response.ok) {
          throw new Error(
            `Failed to fetch image: ${response.status} ${response.statusText}`
          );
        }
        // Convert the response into a blob
        return response.blob();
      })
      .then((blob) => {
        // Use FileReader to read the blob as a Data URL
        const reader = new FileReader();

        reader.onloadend = () => {
          // Resolve with the result
          resolve(reader.result as string);
        };

        reader.onerror = () => {
          // Reject on error
          reject(new Error("Failed to read blob as Data URL"));
        };

        reader.readAsDataURL(blob);
      })
      .catch((error) => {
        // Reject on any error
        reject(error);
      });
  });
};

