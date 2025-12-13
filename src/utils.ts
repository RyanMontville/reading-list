export async function loadData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error Fetching ${url}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error(error);
  }
}

export function createHeader(heading: string, headerText: string) {
    const header = document.createElement(heading);
    header.textContent = headerText;
    return header;
}