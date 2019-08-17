document.addEventListener("click", _ =>
  document
    .querySelectorAll('[href^="https://circleci.com"]')
    .forEach(linkNode => linkNode.setAttribute("target", "_blank"))
);
