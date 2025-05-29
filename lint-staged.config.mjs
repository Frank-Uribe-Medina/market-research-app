export default {
  "*.ts?(x)": () => [
    "npm run lint:fix",
    "npm run check:format",
    "npm run check:types",
    "npm run test",
  ],
};
