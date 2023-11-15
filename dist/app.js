async function app() {
  /** @type string[] */
  const urls = (await chrome.storage.local.get("urls")).urls ?? [];
  console.log({ urls });

  document.addEventListener("click", () => {
    document.querySelectorAll("a").forEach((linkNode) => {
      const href = linkNode.getAttribute("href");
      if (urls.some((url) => href.match(url))) {
        console.log(`matched: ${href}`);
        linkNode.setAttribute("target", "_blank");
      } else {
        console.log(`not matched: ${href}`);
      }
    });
  });
}

app();
