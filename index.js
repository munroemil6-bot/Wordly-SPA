const form = document.getElementById("searchForm");
const input = document.getElementById("wordInput");

const wordEl = document.getElementById("word");
const phoneticEl = document.getElementById("phonetic");
const definitionEl = document.getElementById("definition");
const exampleEl = document.getElementById("example");
const synonymsEl = document.getElementById("synonyms");
const audioEl = document.getElementById("audio");
const errorEl = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const word = input.value.trim();

  if (!word) {
    errorEl.textContent = "please enter a word";
    return;
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      throw new Error("word not found");
    }

    const data = await response.json();
    const entry = data[0];

    errorEl.textContent = "";

    wordEl.textContent = entry.word;
    phoneticEl.textContent = entry.phonetic || "no phonetic available";

    definitionEl.textContent =
      "definition: " + entry.meanings[0].definitions[0].definition;

    exampleEl.textContent =
      "example: " +
      (entry.meanings[0].definitions[0].example || "no example");

    synonymsEl.textContent =
      "synonyms: " +
      (entry.meanings[0].definitions[0].synonyms?.join(", ") || "none");

    audioEl.src = entry.phonetics[0]?.audio || "";

  } catch (err) {
    errorEl.textContent = "error: " + err.message;
  }
});