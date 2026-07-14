const express = require('express');
   const router = express.Router();
   const supabase = require('../config/supabaseClient');

   // CREATE a new project (code submission)
   router.post('/', async (req, res) => {
     const { user_id, project_name, code_content, file_name, language } = req.body;

     if (!code_content || code_content.trim() === '') {
       return res.status(400).json({ error: 'No code was submitted' });
     }

     const { data, error } = await supabase
       .from('projects')
       .insert([{ user_id, project_name, code_content, file_name, language }])
       .select();

     if (error) return res.status(400).json({ error: error.message });
     res.status(201).json({ message: 'Code submitted successfully', project: data[0] });
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