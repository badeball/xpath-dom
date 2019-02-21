import typescript from "rollup-plugin-typescript2";

import resolve from "rollup-plugin-node-resolve";

export default {
  plugins: [
    resolve(),
    typescript({
      include: [
        "*.ts+(|x)",
        "**/*.ts+(|x)",
        "node_modules/xpath-*/**/*"
      ]
    })
  ]
};
