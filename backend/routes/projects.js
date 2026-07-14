const express = require('express');
   const router = express.Router();
   const supabase = require('../config/supabaseClient');
   const { analyzeJavaScript } = require('../services/eslintAnalyzer');

   // CREATE a new project (code submission) + run static analysis + create a review
   router.post('/', async (req, res) => {
     const { user_id, project_name, code_content, file_name, language } = req.body;

     if (!code_content || code_content.trim() === '') {
       return res.status(400).json({ error: 'No code was submitted' });
     }

     // Step 1: Save the project
     const { data: projectData, error: projectError } = await supabase
       .from('projects')
       .insert([{ user_id, project_name, code_content, file_name, language }])
       .select();

     if (projectError) return res.status(400).json({ error: projectError.message });
     const project = projectData[0];

     // Step 2: Run static analysis (JavaScript only for now)
     let findings = [];
     if (language === 'javascript') {
       findings = await analyzeJavaScript(code_content);
     }

     // Step 3: Create a "review" record
     const { data: reviewData, error: reviewError } = await supabase
       .from('reviews')
       .insert([{
         project_id: project.id,
         review_type: 'static',
         overall_score: null, // we'll calculate this once AI review is added on Day 8
         summary: `${findings.length} issue(s) found by static analysis`,
       }])
       .select();

     if (reviewError) return res.status(400).json({ error: reviewError.message });
     const review = reviewData[0];

     // Step 4: Save each finding, linked to this review
     if (findings.length > 0) {
       const findingsToInsert = findings.map((f) => ({ ...f, review_id: review.id, file_name }));
       const { error: findingsError } = await supabase
         .from('review_findings')
         .insert(findingsToInsert);

       if (findingsError) return res.status(400).json({ error: findingsError.message });
     }

     res.status(201).json({
       message: 'Code submitted and analyzed successfully',
       project,
       review,
       findings,
     });
   });

   // GET all projects for a user
   router.get('/:user_id', async (req, res) => {
     const { user_id } = req.params;
     const { data, error } = await supabase
       .from('projects')
       .select('*')
       .eq('user_id', user_id)
       .order('created_at', { ascending: false });

     if (error) return res.status(400).json({ error: error.message });
     res.status(200).json(data);
   });

   module.exports = router;