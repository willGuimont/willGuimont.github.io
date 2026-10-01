+++
title = "Math Prelude Demo"
description = "Try the shared KaTeX commands for writing mathematics in blog posts."
[extra]
katex = true
styles = ["demo/math/playground.css"]
scripts = ["demo/math/playground.js"]
+++

The shared [KaTeX prelude](/math-prelude.js) groups reusable math commands by subject. Edit its definitions once to use them in every math-enabled post.

## Try a formula

Choose an example or edit the LaTeX directly. The preview uses the same prelude as math-enabled blog posts.

<div class="math-playground">
  <label for="math-example">Example</label>
  <select id="math-example">
    <option value="sets">Sets and notation</option>
    <option value="linear">Linear algebra</option>
    <option value="calculus">Calculus</option>
    <option value="lie">Lie algebra</option>
    <option value="probability">Probability</option>
  </select>
  <label for="math-source">LaTeX</label>
  <textarea id="math-source" rows="3" spellcheck="false">\set{x \in \R : \abs{x} < 1}</textarea>
  <div id="math-preview" class="math-playground-preview" aria-label="Rendered formula"></div>
  <p id="math-error" class="math-playground-error" role="status" aria-live="polite"></p>
</div>

## Command examples

### Sets and notation

`\R`, `\set{x}`, `\abs{x}`, and `\norm{x}`:

$$
\set{x \in \R : \abs{x} < 1}, \qquad \norm{v}^2 = \inner{v}{v}.
$$

### Linear algebra

`\mat{A}`, `\vect{x}`, `\trans`, and `\rank`:

$$
\mat{A}\trans\mat{A}\vect{x} = \vect{b}, \qquad \rank(\mat{A}) = 3.
$$

### Calculus

`\dd`, `\dv{f}{x}`, and `\pdv{f}{x}`:

$$
\int_0^1 f(x)\dd x, \qquad \dv{f}{x}, \qquad \pdv{f}{x}.
$$

### Lie algebra

`\SO`, `\so`, `\Exp`, and `\hatop{x}` (the superscript hat map):

$$
\omega \in \R^3, \qquad \hatop{\omega} \in \so(3), \qquad \Exp(\hatop{\omega}) \in \SO(3).
$$

### Probability

`\Prob`, `\Expect`, and `\Var`:

$$
\Prob(A \mid B) = \frac{\Prob(A \cap B)}{\Prob(B)}, \qquad \Var(X) = \Expect[(X - \Expect[X])^2].
$$

## Use it in a blog post

Add this to the post's TOML front matter:

```toml
[extra]
katex = true
```

Write `$\R^3$` for inline math or `$$\norm{v}^2 = \inner{v}{v}$$` for display math. Existing posts with `katex = true` use the same prelude automatically. KaTeX renders formulas in the browser, so use KaTeX-supported math commands rather than PDF preamble commands such as `\usepackage` or `\newcommand`.

## Command reference

| Category | Commands | Example |
| --- | --- | --- |
| Sets and notation | `\N`, `\Z`, `\Q`, `\R`, `\C`, `\set{x}`, `\abs{x}`, `\norm{x}`, `\inner{x}{y}`, `\card{A}` | `\set{x \in \R : \abs{x} < 1}` |
| Linear algebra | `\vect{v}`, `\mat{A}`, `\trans`, `\inv`, `\pinv`, `\rank`, `\nullity`, `\tr`, `\diag`, `\Span`, `\proj` | `\mat{A}\trans\mat{A}\vect{x}` |
| Calculus | `\dd`, `\dv{f}{x}`, `\pdv{f}{x}`, `\grad`, `\laplacian`, `\jac` | `\int_0^1 f(x)\dd x`, `\pdv{f}{x}` |
| Lie algebra | `\SO`, `\SE`, `\GL`, `\so`, `\se`, `\gl`, `\Exp`, `\Log`, `\Ad`, `\ad`, `\hatop{x}`, `\veeop{X}` | `\Exp(\hatop{\omega}) \in \SO(3)` |
| Probability | `\Prob`, `\Expect`, `\Var`, `\Cov`, `\KL`, `\ind` | `\Expect[X]`, `\Prob(A \mid B)` |

The `\trans`, `\inv`, and `\pinv` commands are postfix: write `\mat{A}\trans`, `\mat{A}\inv`, or `\mat{A}\pinv`. Put `\dd` before a variable. For higher or mixed derivatives, write the full fraction so its order is clear.

In the Lie algebra group, `\hatop{\omega}` renders as $\omega^{\wedge}$, and `\veeop{X}` renders as $X^{\vee}$. Both symbols denote maps and appear as superscripts.

These names adapt reusable math ideas in *Physics From Scratch* (`\set`, real numbers, nullity, derivatives). The forestry paper mainly defines acronyms, dataset constants, and document formatting, which are specific to that publication. The linear algebra, Lie algebra, and probability groups provide notation for future posts.
