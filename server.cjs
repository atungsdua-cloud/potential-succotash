async function main() {
  await import('./server/index.js');
}
main().catch(err => {
  console.error(err);
  process.exit(1);
});
