const { ESLint } = require("eslint");
const path = require("path");

async function analyzeJavaScript(codeString) {
  const eslint = new ESLint({
    useEslintrc: true,
    overrideConfigFile: path.join(__dirname, "../.eslintrc.json"),
  });

  try {
    // ESLint needs to "lint text" rather than a real file, so we give it a fake filename
    const results = await eslint.lintText(codeString, {
      filePath: "submitted-code.js",
    });

    // results[0].messages is the list of problems found
    const findings = results[0].messages.map((msg) => ({
      severity: msg.severity === 2 ? "High" : "Medium",
      issue: msg.ruleId || "Syntax Error",
      explanation: msg.message,
      line_number: msg.line,
      suggested_fix: null, // static tools don't suggest fixes — that's the AI's job later
    }));

    return findings;
  } catch (err) {
    // Gracefully handles syntax parsing crashes (e.g. missing brackets, completely invalid js)
    return [{
      severity: "High",
      issue: "Parse Error",
      explanation: "The code could not be parsed. Check for major syntax errors.",
      line_number: null,
      suggested_fix: null,
    }];
  }
}

module.exports = { analyzeJavaScript };