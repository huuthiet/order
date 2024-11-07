export default function configuration() {
  return {
    port: parseInt(process.env.PORT, 10),
    NODE_ENV: process.env.NODE_ENV,
    version: process.env.VERSION,
  };
}
