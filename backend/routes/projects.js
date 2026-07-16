const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { analyzeJavaScript } = require('../services/eslintAnalyzer');
const { analyzeCodeWithAI, generateDocumentation } = require('../services/aiAnalyzer');
const { analyzeComplexity } = require('../services/complexityAnalyzer');

router.post('/', async (req, res) => {
  const { user_id, project_name, code_content, file_name, language } = req.body;
  if (!code_content || code_content.trim() === '') {
    return res.status(400).json({ error: 'No code was submitted' });
  }

  // --- UUID SAFETY NET CHANGER ---
  let activeUserId = user_id;
  if (activeUserId === "test-user-123" || !activeUserId) {
    activeUserId = "512a783e-2ff1-4074-8ed0-0641eabfe018"; // Swaps placeholder for your real UUID automatically!
  }

  try {
    // Insert project using the corrected activeUserId
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert([{ user_id: activeUserId, project_name, code_content, file_name, language }])
      .select();

    if (projectError) return res.status(400).json({ error: projectError.message });
    const project = projectData[0];

    // Prepare analysis promises
    const staticAnalysisPromise = language === 'javascript'
      ? analyzeJavaScript(code_content)
      : Promise.resolve([]);

    const aiAnalysisPromise = analyzeCodeWithAI(code_content, language);
    const docsPromise = generateDocumentation(code_content, language);

    // Resolve all promises concurrently
    const [staticFindings, aiResult, documentation] = await Promise.all([
      staticAnalysisPromise,
      aiAnalysisPromise,
      docsPromise,
    ]);

    // Complexity analysis (JavaScript only for now)
    const complexityMetrics = language === 'javascript'
      ? analyzeComplexity(code_content)
      : null;

    // Combine static analysis issues and AI findings
    const allFindings = [
      ...staticFindings.map((f) => ({ ...f, file_name })),
      ...(aiResult.findings || []).map((f) => ({ ...f, file_name })),
    ];

    // Insert review, including the generated documentation string
    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .insert([{
        project_id: project.id,
        review_type: 'combined',
        overall_score: aiResult.overall_score ?? null,
        summary: aiResult.summary || `Static: ${staticFindings.length} issue(s) found.`,
        complexity_metrics: complexityMetrics,
        documentation: documentation, // Newly added field
      }])
      .select();

    if (reviewError) return res.status(400).json({ error: reviewError.message });
    const review = reviewData[0];

    // Batch insert findings if there are any
    if (allFindings.length > 0) {
      const findingsToInsert = allFindings.map((f) => ({
        review_id: review.id,
        file_name: f.file_name,
        severity: f.severity,
        issue: f.issue,
        explanation: f.explanation,
        line_number: f.line_number || null,
        suggested_fix: f.suggested_fix || null,
      }));

      const { error: findingsError } = await supabase
        .from('review_findings')
        .insert(findingsToInsert);

      if (findingsError) return res.status(400).json({ error: findingsError.message });
    }

    res.status(201).json({
      message: 'Code submitted and analyzed successfully!',
      project,
      review,
      findings: allFindings,
    });
  } catch (globalError) {
    res.status(500).json({ error: globalError.message });
  }
});

// GET all projects for a user
router.get('/:user_id', async (req, res) => {
  let { user_id } = req.params;
  
  // Apply fallback matching here too in case old dashboard parameters come through
  if (user_id === "test-user-123") {
    user_id = "512a783e-2ff1-4074-8ed0-0641eabfe018";
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
});

module.exports = router;