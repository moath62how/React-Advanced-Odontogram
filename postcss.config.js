import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const ROOT_SELECTOR = ".odontogram-root";

function splitSelectors(selectorList) {
  const selectors = [];
  let start = 0;
  let parentheses = 0;
  let brackets = 0;
  let quote = null;
  let escaped = false;

  for (let index = 0; index < selectorList.length; index += 1) {
    const character = selectorList[index];

    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === "\\") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = null;
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      continue;
    }
    if (character === "(") parentheses += 1;
    else if (character === ")") parentheses -= 1;
    else if (character === "[") brackets += 1;
    else if (character === "]") brackets -= 1;
    else if (character === "," && parentheses === 0 && brackets === 0) {
      selectors.push(selectorList.slice(start, index).trim());
      start = index + 1;
    }
  }

  selectors.push(selectorList.slice(start).trim());
  return selectors;
}

function scopeSelector(selector) {
  if (selector === ":root" || selector === "html" || selector === "body") {
    return ROOT_SELECTOR;
  }
  if (selector === "*") {
    return `${ROOT_SELECTOR}, ${ROOT_SELECTOR} *`;
  }
  if (selector.includes(ROOT_SELECTOR)) {
    return selector;
  }
  return `${ROOT_SELECTOR} ${selector}`;
}

const scopeOdontogramStyles = {
  postcssPlugin: "scope-odontogram-styles",
  Once(root) {
    root.walkRules((rule) => {
      let ancestor = rule.parent;
      while (ancestor && ancestor.type !== "root") {
        if (ancestor.type === "atrule" && /keyframes$/i.test(ancestor.name)) {
          return;
        }
        ancestor = ancestor.parent;
      }

      const selectors = splitSelectors(rule.selector);
      if (selectors.every((selector) => selector === "html" || selector === "body")) {
        rule.remove();
        return;
      }

      rule.selector = selectors.map(scopeSelector).join(", ");
    });
  },
};

export default {
  plugins: [tailwindcss(), autoprefixer(), scopeOdontogramStyles],
};
