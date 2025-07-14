import express from 'express';
import axios from 'axios';

const router = express.Router();

// Home page with both forms
router.get('/', (req, res) => {
  res.render('index');
});

// Author search
router.post('/search-authors', async (req, res) => {
  const { author, title } = req.body;

  if (!author && !title) {
    return res.render('author-results', {
      authors: [],
      error: 'Please enter Author or Title.'
    });
  }

  try {
    const query = [];
    if (author) query.push(`author/${encodeURIComponent(author)}`);
    if (title) query.push(`title/${encodeURIComponent(title)}`);

    const url = `https://poetrydb.org/${query.join(';')}`;
    const response = await axios.get(url);
    const authors = [...new Set(response.data.map(poem => poem.author))];

    res.render('author-results', { authors, error: null });
  } catch (error) {
    res.render('author-results', {
      authors: [],
      error: 'No authors found or API error.'
    });
  }
});

// Poem search
router.post('/search-poems', async (req, res) => {
  const { author, title, lines } = req.body;

  if (!author && !title && !lines) {
    return res.render('results', {
      poems: [],
      error: 'Please enter at least one field.'
    });
  }

  try {
    const query = [];
    if (author) query.push(`author/${encodeURIComponent(author)}`);
    if (title) query.push(`title/${encodeURIComponent(title)}`);
    if (lines) query.push(`lines/${encodeURIComponent(lines)}`);

    const url = `https://poetrydb.org/${query.join(';')}`;
    const response = await axios.get(url);
    const poems = response.data;

    res.render('results', { poems, error: null });
  } catch (error) {
    res.render('results', {
      poems: [],
      error: 'No poems found or API error.'
    });
  }
});

// Individual poem page
router.get('/poem/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const response = await axios.get(`https://poetrydb.org/title/${encodeURIComponent(title)}`);
    const poem = response.data[0];
    res.render('poem', { poem });
  } catch (error) {
    res.send('Poem not found.');
  }
});

export default router;
