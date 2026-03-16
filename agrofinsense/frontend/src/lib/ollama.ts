export const MODELS = { NARRATIVE: 'gemma3:4b', FAST: 'llama3.2:3b' };

export async function callOllamaText(
  model: 'gemma3:4b' | 'llama3.2:3b',
  prompt: string,
  temperature = 0.4
): Promise<string> {
  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false, options: { temperature } }),
    });
    if (!res.ok) throw new Error('Ollama HTTP ' + res.status);
    const data = await res.json();
    return data.response || 'No response from model.';
  } catch {
    return 'AI offline — please start Ollama with: ollama serve';
  }
}

export async function checkOllamaStatus(): Promise<{ available: boolean; models: string[] }> {
  try {
    const res = await fetch('http://localhost:11434/api/tags');
    const data = await res.json();
    return { available: true, models: data.models?.map((m: { name: string }) => m.name) || [] };
  } catch {
    return { available: false, models: [] };
  }
}
