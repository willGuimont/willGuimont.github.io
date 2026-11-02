document.addEventListener("DOMContentLoaded", () => {
  const examples = {
    sets: String.raw`\set{x \in \R : \abs{x} < 1}`,
    linear: String.raw`\mat{A}\trans\mat{A}\vect{x} = \vect{b}`,
    calculus: String.raw`\int_0^1 f(x)\dd x = \frac{1}{2}`,
    lie: String.raw`\Exp(\hatop{\omega}) \in \SO(3)`,
    probability: String.raw`\Var(X) = \Expect[(X - \Expect[X])^2]`,
  };
  const select = document.querySelector("#math-example");
  const source = document.querySelector("#math-source");
  const preview = document.querySelector("#math-preview");
  const error = document.querySelector("#math-error");

  function render() {
    try {
      katex.render(source.value, preview, {
        displayMode: true,
        throwOnError: true,
        macros: window.blogMathMacros,
      });
      error.textContent = "";
    } catch (cause) {
      preview.replaceChildren();
      error.textContent = cause.message;
    }
  }

  select.addEventListener("change", () => {
    source.value = examples[select.value];
    render();
  });
  source.addEventListener("input", render);
  render();
});
