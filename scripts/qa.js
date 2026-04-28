const { execSync } = require("node:child_process");

function run(command) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit" });
}

run("npm.cmd run db:init");
run("npm.cmd run lint");
run("npm.cmd run build");

console.log("\nQA passed.");
