import { FormEvent, useState } from "react";
import useSWR from "swr";
import logo from "./assets/icon-128.png";
import "./App.css";

function App() {
  const { data: urls, mutate } = useSWR("urls", async () => {
    const urls = await getUrls();
    return urls;
  });

  return (
    <main>
      <div>
        <img src={logo} className="logo" alt="GitHub Link Opener" />
      </div>
      <h1>Settings</h1>
      <UrlPatternList urls={urls ?? []} onDelete={deleteUrl(mutate)} />
      <AddUrlPatternForm saveUrl={saveUrl(mutate)} />
    </main>
  );
}

export default App;

function AddUrlPatternForm({
  saveUrl,
}: {
  saveUrl: (url: string) => Promise<void>;
}): JSX.Element {
  const [url, setUrl] = useState("");

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    setUrl(event.currentTarget.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (url) {
      saveUrl(url);
      setUrl("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="url-pattern">URL Pattern:</label>
      <input
        id="url-pattern"
        name="url-pattern"
        type="text"
        placeholder="^https://circleci.com"
        onChange={handleInput}
        value={url}
      />
      <button type="submit">Add</button>
    </form>
  );
}

function UrlPatternList({
  urls,
  onDelete,
}: {
  urls: string[];
  onDelete: (url: string) => Promise<void>;
}): JSX.Element {
  return (
    <ul>
      {urls.map((url) => (
        <li key={url}>
          <span>{url}</span>
          <button type="button" onClick={() => onDelete(url)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

const STORAGE_KEY = "urls";

const saveUrl = (mutate: () => void) => async (url: string) => {
  const urls = await getUrls();
  chrome.storage.local.set({ [STORAGE_KEY]: [...urls, url] });
  mutate();
};

async function getUrls(): Promise<string[]> {
  const urls = await chrome.storage.local.get(STORAGE_KEY);
  return urls[STORAGE_KEY] ?? [];
}

const deleteUrl = (mutate: () => void) => async (url: string) => {
  const urls = await getUrls();
  chrome.storage.local.set({
    [STORAGE_KEY]: urls.filter((u) => u !== url),
  });
  mutate();
};
