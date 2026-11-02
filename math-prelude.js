// Shared KaTeX prelude for math-enabled pages. Edit the groups below to add notation.
// Macro arguments use #1, #2, etc.; keep the leading backslash in each macro name.
const mathPrelude = {
  // Sets and general notation
  sets: {
    "\\N": "\\mathbb{N}",
    "\\Z": "\\mathbb{Z}",
    "\\Q": "\\mathbb{Q}",
    "\\R": "\\mathbb{R}",
    "\\C": "\\mathbb{C}",
    "\\set": "\\left\\{#1\\right\\}",
    "\\abs": "\\left|#1\\right|",
    "\\norm": "\\left\\lVert#1\\right\\rVert",
    "\\inner": "\\left\\langle#1,#2\\right\\rangle",
    "\\card": "\\left|#1\\right|",
  },

  // Linear algebra
  linearAlgebra: {
    "\\vect": "\\boldsymbol{#1}",
    "\\mat": "\\mathbf{#1}",
    "\\trans": "^{\\mathsf{T}}",
    "\\inv": "^{-1}",
    "\\pinv": "^{\\dagger}",
    "\\rank": "\\operatorname{rank}",
    "\\nullity": "\\operatorname{nullity}",
    "\\tr": "\\operatorname{tr}",
    "\\diag": "\\operatorname{diag}",
    "\\Span": "\\operatorname{span}",
    "\\proj": "\\operatorname{proj}",
  },

  // Calculus and differential geometry
  calculus: {
    "\\dd": "\\mathop{}\\!\\mathrm{d}",
    "\\dv": "\\frac{\\mathrm{d} #1}{\\mathrm{d} #2}",
    "\\pdv": "\\frac{\\partial #1}{\\partial #2}",
    "\\grad": "\\nabla",
    "\\laplacian": "\\Delta",
    "\\jac": "\\mathrm{D}",
  },

  // Lie groups and Lie algebras
  lieAlgebra: {
    "\\SO": "\\mathrm{SO}",
    "\\SE": "\\mathrm{SE}",
    "\\GL": "\\mathrm{GL}",
    "\\so": "\\mathfrak{so}",
    "\\se": "\\mathfrak{se}",
    "\\gl": "\\mathfrak{gl}",
    "\\Exp": "\\operatorname{Exp}",
    "\\Log": "\\operatorname{Log}",
    "\\Ad": "\\operatorname{Ad}",
    "\\ad": "\\operatorname{ad}",
    "\\hatop": "{#1}^{\\wedge}",
    "\\veeop": "{#1}^{\\vee}",
  },

  // Probability and statistics
  probability: {
    "\\Prob": "\\mathbb{P}",
    "\\Expect": "\\mathbb{E}",
    "\\Var": "\\operatorname{Var}",
    "\\Cov": "\\operatorname{Cov}",
    "\\KL": "\\operatorname{KL}",
    "\\ind": "\\mathbb{1}",
  },
};

// Also expose the same definitions to interactive examples on math-enabled pages.
window.blogMathMacros = Object.assign({}, ...Object.values(mathPrelude));

document.addEventListener("DOMContentLoaded", () => {
  renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
    macros: window.blogMathMacros,
  });
});
