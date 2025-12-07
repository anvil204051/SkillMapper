import nextConfig from "eslint-config-next"

const [coreConfig, typescriptConfig, ignoreConfig] = nextConfig

const config = [
  {
    ...coreConfig,
    rules: {
      ...coreConfig.rules,
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
      "react-hooks/purity": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  typescriptConfig,
  {
    ...ignoreConfig,
    ignores: [...(ignoreConfig?.ignores || []), "pnpm-lock.yaml"],
  },
]

export default config

