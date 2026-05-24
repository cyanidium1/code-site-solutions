import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { ignores: ["raw_design/**", ".next/**", "node_modules/**"] },
  {
    // Phase 1 endpoint: error on inline `style={{}}` props.
    // Dynamic CSS custom properties (--foo) are allowed but the lint rule
    // cannot distinguish them from static styles — legitimate dynamic-var
    // usages have a per-line `// eslint-disable-next-line react/forbid-dom-props`
    // comment explaining the dynamic value. Promoted from warn to error in
    // Session 8 (S8.4) after the migration is complete.
    rules: {
      "react/forbid-dom-props": [
        "error",
        {
          forbid: [
            {
              propName: "style",
              message:
                "Inline static styles are forbidden. Use Tailwind utilities or a primitive from @/components/ui. " +
                "Dynamic CSS custom properties (style={{ '--x': value }}) are allowed but require an `// eslint-disable-next-line react/forbid-dom-props` comment with the reason.",
            },
          ],
        },
      ],
    },
  },
];

export default config;
