import * as babel from "babel-core";
import globby from "globby";
import path from "path";
import { buildPreset } from "babel-preset-es2015";
import fs from "fs-extra";

const iconBasePath = "./node_modules/react-icons";

const builds = [
  {
    output: "es",
    babel: {
      presets: [
        [
          buildPreset,
          {
            loose: true,
            modules: false
          }
        ],
        "stage-1",
        "react"
      ],
      plugins: [
        [
          "transform-runtime",
          {
            helpers: true,
            polyfill: true,
            regenerator: false
          }
        ]
      ]
    }
  },
  {
    output: "lib",
    babel: {
      presets: [
        [
          buildPreset,
          {
            loose: true,
            modules: "commonjs"
          }
        ],
        "stage-1",
        "react"
      ],
      plugins: [
        [
          "transform-runtime",
          {
            helpers: true,
            polyfill: true,
            regenerator: false
          }
        ],
        "add-module-exports"
      ]
    }
  }
];

(async () => {
  const iconPaths = await globby(
    ["fa", "go", "io", "md", "ti"].map(icon => path.join(iconBasePath, icon))
  );
  //   console.log(JSON.stringify(paths, null, 2));
  builds.forEach(config => {
    iconPaths.forEach(file => {
      const result = babel.transformFileSync(file, {
        babelrc: false,
        ...config.babel
      });
      const output = file.replace("node_modules/react-icons", config.output);
      console.log(`${file} -> ${output}`);
      fs.outputFileSync(output, result.code);
    });
  });
})();
