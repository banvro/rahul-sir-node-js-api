const cors = require('cors')({ origin: true });
const youtubedl = require('youtube-dl-exec');

module.exports = async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).send({ error: 'Only GET requests are allowed' });
    }

    const { url } = req.query;

    if (!url) {
      return res.status(400).send({ error: 'YouTube URL is required' });
    }

    try {
      const output = await youtubedl(url, {
        dumpSingleJson: true,
        noWarnings: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true, // Ensures compatibility with Shorts
        format: 'best[ext=mp4]/best', // Ensure we fetch compatible formats
      });

      console.log('Available Formats:', output.formats); // Debug available formats
      if (output && output.formats) {
        res.status(200).send(output.formats); // Return available formats
      } else {
        res.status(400).send({ error: 'No formats found for this video' });
      }
    } catch (error) {
      console.error('Error fetching video info:', error.message);
      res.status(500).send({ error: 'Failed to process the video URL. Please try again later.' });
    }
  });
};
