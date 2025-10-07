export function contemXSS(texto) {
  const blacklist = [
    "<script", "</script>", "onerror", "onload","<img", "<svg", "javascript:", "data:text/html"
  ];
  return blacklist.some((tag) => texto.toLowerCase().includes(tag));
}
