import alias from "module-alias";

export const register = (): void => {
  if (process.env.BUILD || process.env.NODE_ENV === "production") {
    alias.addAliases({
      src: "./src/",
      tests: "./tests/",
    });
  } else {
    alias.addAliases({
      src: "./src/",
      tests: "./tests/",
    });
  }
};
