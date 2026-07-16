const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// GET the most recent review + all its findings, for a given project
router.get('/project/:project_id', async (req, res) => {
  const { project_id } = req.params;

  // Get the review for this project
  const { data: reviews, error: reviewError } = await supabase
    .from('reviews')
    .select('*')
    .eq('project_id', project_id)
    .order('created_at', { ascending: false })
    .limit(1);

  if (reviewError) return res.status(400).json({ error: reviewError.message });
  if (!reviews || reviews.length === 0) {
    return res.status(404).json({ error: 'No review found for this project' });
  }

  const review = reviews[0];

  // Get all findings linked to that review
  const { data: findings, error: findingsError } = await supabase
    .from('review_findings')
    .select('*')
    .eq('review_id', review.id)
    .order('severity', { ascending: false });

  if (findingsError) return res.status(400).json({ error: findingsError.message });

  res.status(200).json({ review, findings });
});

module.exports = router;