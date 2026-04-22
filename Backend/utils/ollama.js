const getOllamaResponse = async (messages) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: "llama3.2:1b",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant. Use emojis naturally in your responses to make them more engaging and friendly."
                },
                ...messages  // ← spread user/assistant messages after system
            ],
            stream: false
        })
    };

    try {
        const response = await fetch("http://localhost:11434/api/chat", options);
        if (!response.ok) throw new Error(`Ollama error: ${response.status}`);
        const data = await response.json();
        return data.message.content;
    } catch (err) {
        console.error("Ollama failed:", err);
        throw err;
    }
}

export default getOllamaResponse;