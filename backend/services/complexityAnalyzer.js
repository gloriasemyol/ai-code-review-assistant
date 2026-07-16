const acorn = require("acorn");
const walk = require("acorn-walk");

// Counts "decision points" inside one chunk of code (a whole file, or one function)
// Cyclomatic complexity starts at 1 (one possible path through the code)
// and goes up by 1 every time the code could branch a different way.
function countComplexity(node) {
  let complexity = 1;

  walk.simple(node, {
    IfStatement() { complexity++; },
    ForStatement() { complexity++; },
    ForInStatement() { complexity++; },
    ForOfStatement() { complexity++; },
    WhileStatement() { complexity++; },
    DoWhileStatement() { complexity++; },
    CatchClause() { complexity++; },
    ConditionalExpression() { complexity++; }, // ternary: a ? b : c
    LogicalExpression(n) {
      if (n.operator === "&&" || n.operator === "||") complexity++;
    },
    SwitchCase(n) {
      if (n.test) complexity++; // don't count the "default" case
    },
  });

  return complexity;
}

function analyzeComplexity(codeString) {
  let ast;
  try {
    ast = acorn.parse(codeString, { ecmaVersion: "latest", sourceType: "module" });
  } catch (err) {
    return { error: "Could not parse code: " + err.message };
  }

  let functionCount = 0;
  let classCount = 0;
  const functionComplexities = [];

  walk.simple(ast, {
    FunctionDeclaration(node) {
      functionCount++;
      functionComplexities.push({
        name: node.id ? node.id.name : "anonymous",
        complexity: countComplexity(node),
      });
    },
    FunctionExpression(node) {
      functionCount++;
      functionComplexities.push({
        name: node.id ? node.id.name : "anonymous",
        complexity: countComplexity(node),
      });
    },
    ArrowFunctionExpression(node) {
      functionCount++;
      functionComplexities.push({
        name: "arrow function",
        complexity: countComplexity(node),
      });
    },
    ClassDeclaration() { classCount++; },
    ClassExpression() { classCount++; },
  });

  const linesOfCode = codeString.split("\n").filter((line) => line.trim() !== "").length;

  return {
    file_complexity: countComplexity(ast),
    function_complexity: functionComplexities,
    number_of_functions: functionCount,
    number_of_classes: classCount,
    lines_of_code: linesOfCode,
  };
}

module.exports = { analyzeComplexity };