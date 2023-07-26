const fs = require("fs");
const path = require("path");

const folderPath = "./src";
const usecasePath = /\\*\.usecase.ts$/i;
const useCasePattern = /class[\t ]+([a-zA-Z]+Usecase)[\t ]+extends/;

const importPattern =
  /import[ \t]+{([a-zA-Z \t,\n]+)}[ \t]+from[ \t]+['"]+([@a-zA-Z \t,\n\/\.-]+)['"]+/gm;

function getDomainFromPath(route) {
  const fragments = route.split("\\");
  return fragments[1];
}

function listFilesRecursive(directory) {
  const response = [];

  const entries = fs.readdirSync(directory, { withFileTypes: true });

  entries.forEach(function (entry) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const responseTemp = listFilesRecursive(fullPath);
      response.push(...responseTemp);
    } else {
      response.push(fullPath);
    }
  });
  return response;
}

const usecaseFiles = listFilesRecursive(`${folderPath}`).filter((f) =>
  usecasePath.test(f)
);
const usecasesContent = usecaseFiles.map((f) => fs.readFileSync(f).toString());

let i = 0;
let j = 0;
const resources = [];
for (const content of usecasesContent) {
  const file = usecaseFiles[i];
  const res = useCasePattern.exec(content);
  const domain = getDomainFromPath(usecaseFiles[i]);

  let match;
  const matches = [];

  while ((match = importPattern.exec(content)) !== null) {
    matches.push(match);
  }

  const fullMatches = [];

  for (const match of matches) {
    if (match[2].endsWith(".usecase")) {
      fullMatches.push({
        components: match[1].split(".").map((x) => x.trim()),
        path: match[2],
      });
    }
  }

  const badImplementations = [];
  for (const fullMatch of fullMatches) {
    const path = fullMatch.path;
    const folderExists = path.split("/").filter((x) => x == "..").length;

    const e = -folderExists - 1;

    const currentNewPath = file.split("\\").slice(0, e).join("\\");

    if (!currentNewPath.includes(domain)) {
      badImplementations.push(fullMatch);
    }
  }
  if (badImplementations.length > 0) {
    console.log();
    console.log("File: ", file);
    console.log("Domain: ", domain);
    console.log(
      "Bad Implementations: ",
      badImplementations.length,
      badImplementations
    );
    console.log(j);
    j++;
  }

  i++;
}
