
import React, { useState, useCallback, useEffect } from 'react';
import { generateEpk } from './services/geminiService';
import type { ArtistInput, EpkOutput } from './types';
import { InputField } from './components/InputField';
import { TextAreaField } from './components/TextAreaField';
import { ResultCard } from './components/ResultCard';
import { Loader } from './components/Loader';
import { SparklesIcon, AlienIcon } from './components/icons';

const App: React.FC = () => {
  const [formData, setFormData] = useState<ArtistInput>({
    artist_name: '',
    track_title: '',
    email: '',
    genre: '',
    vibe_tags: [],
    lyrics_text: '',
    artist_intent: '',
    cultural_refs_explained: '',
    problem_solving_connection: '',
    streaming_links: [],
    sync_submission_link: '',
    grant_application_link: '',
  });
  const [artistImage, setArtistImage] = useState<File | null>(null);
  const [artistImageUrl, setArtistImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [epkOutput, setEpkOutput] = useState<EpkOutput | null>(null);

  useEffect(() => {
    // Clean up the object URL to avoid memory leaks when the component unmounts or the URL changes.
    return () => {
      if (artistImageUrl) {
        URL.revokeObjectURL(artistImageUrl);
      }
    };
  }, [artistImageUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'vibe_tags' || name === 'streaming_links') {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(',').map((item) => item.trim()).filter(Boolean),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArtistImage(file);
      setArtistImageUrl(URL.createObjectURL(file));
    } else {
      setArtistImage(null);
      setArtistImageUrl(null);
    }
  };


  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lyrics_text || !formData.artist_name || !formData.track_title) {
        setError('Artist Name, Track Title, and Lyrics are required to fuel the cultural engine.');
        return;
    }
    setLoading(true);
    setError(null);
    setEpkOutput(null);

    try {
      const result = await generateEpk(formData);
      setEpkOutput(result);
      console.log("Feedback Loop Data (for internal use):", result.feedback_loop_data);
    } catch (err) {
      console.error(err);
      setError('The connection to the cultural engine failed. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-block bg-purple-500/20 p-4 rounded-full mb-4 border border-purple-400/50">
            <AlienIcon className="w-12 h-12 text-purple-400" />
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold text-purple-400 tracking-wider">
            JJRadio AI EPK Generator
          </h1>
          <p className="mt-2 text-lg text-cyan-300">
            Level Up Your Genius. Transform Your Art into Opportunity.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-orbitron text-2xl font-bold text-cyan-400 border-b-2 border-cyan-400/30 pb-2">Input Transmission</h2>
                <InputField label="Artist Name" name="artist_name" value={formData.artist_name} onChange={handleChange} required />
                <InputField label="Track Title" name="track_title" value={formData.track_title} onChange={handleChange} required />
                <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <InputField label="Artist Image" name="artist_image" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                <InputField label="Genre" name="genre" value={formData.genre} onChange={handleChange} placeholder="e.g., Afrobeats, Hip Hop, Amapiano" />
                <InputField label="Vibe Tags (comma-separated)" name="vibe_tags" value={formData.vibe_tags.join(', ')} onChange={handleChange} placeholder="e.g., ghetto gospel, battle rap" />
                <TextAreaField label="Lyrics" name="lyrics_text" value={formData.lyrics_text} onChange={handleChange} rows={8} required placeholder="Paste your full, accurate lyrics here. This is crucial for the cultural training loop." />
                <TextAreaField label="Artist's Intent" name="artist_intent" value={formData.artist_intent} onChange={handleChange} placeholder="What is the message or story behind your track?" />
                <TextAreaField label="Cultural References Explained" name="cultural_refs_explained" value={formData.cultural_refs_explained} onChange={handleChange} placeholder="e.g., 'Shumba: Lion in Shona', 'Gusheshe: A classic BMW, symbol of status'" />
                <TextAreaField label="Problem-Solving Connection" name="problem_solving_connection" value={formData.problem_solving_connection} onChange={handleChange} placeholder="How does your music connect to a local issue or opportunity?" />
                <InputField label="Streaming Links (comma-separated)" name="streaming_links" value={formData.streaming_links.join(', ')} onChange={handleChange} placeholder="Spotify, YouTube, etc." />
                <InputField label="Sync Library Submission Link" name="sync_submission_link" type="url" value={formData.sync_submission_link} onChange={handleChange} placeholder="https://example.com/submission" />
                <InputField label="Grant Application Link" name="grant_application_link" type="url" value={formData.grant_application_link} onChange={handleChange} placeholder="https://example.com/grant-application" />
                
                <button type="submit" disabled={loading} className="w-full font-orbitron flex items-center justify-center gap-2 text-lg font-bold bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:text-gray-500 disabled:cursor-not-allowed text-white py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105">
                    {loading ? 'Analyzing...' : 'Generate EPK'}
                    {!loading && <SparklesIcon className="w-5 h-5" />}
                </button>
            </form>
            {error && <p className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 backdrop-blur-sm">
            <h2 className="font-orbitron text-2xl font-bold text-cyan-400 border-b-2 border-cyan-400/30 pb-2 mb-6">EPK Kit Output</h2>
            {loading && <Loader />}
            {epkOutput && (
              <div className="space-y-6 animate-fade-in">
                {artistImageUrl && (
                  <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 relative shadow-lg">
                    <h3 className="font-orbitron text-xl font-semibold text-cyan-300 mb-3">Artist Image</h3>
                    <div className="flex justify-center">
                      <img src={artistImageUrl} alt={formData.artist_name || 'Artist preview'} className="rounded-lg max-h-60 w-auto object-cover shadow-md border-2 border-purple-500/50" />
                    </div>
                  </div>
                )}
                <ResultCard title="Artist Bio" content={epkOutput.deliverables.artist_bio} />
                <ResultCard title="One-Sheet Summary" content={epkOutput.deliverables.one_sheet_summary} />
                <ResultCard title="Cultural DNA Report" content={epkOutput.deliverables.cultural_dna_report} />
                
                <div className="space-y-4">
                    <h3 className="font-orbitron text-xl font-semibold text-cyan-300">Social Media Captions</h3>
                    <ResultCard title="Instagram" content={epkOutput.deliverables.social_captions.instagram} isSub />
                    <ResultCard title="TikTok" content={epkOutput.deliverables.social_captions.tiktok} isSub />
                    <ResultCard title="X / Twitter" content={epkOutput.deliverables.social_captions.x_twitter} isSub />
                </div>
                
                 <div className="space-y-4">
                    <h3 className="font-orbitron text-xl font-semibold text-cyan-300">Submission Guidance</h3>
                    <ResultCard title="Email Pitch Blurb" content={epkOutput.submission_guidance.email_pitch_blurb} />
                     <div>
                        <h4 className="font-orbitron text-lg font-semibold text-cyan-400 mb-2">Strategic Opportunities</h4>
                        <div className="space-y-3">
                        {epkOutput.submission_guidance.strategic_opportunities.map((opp, index) => (
                            <div key={index} className="bg-gray-900/70 p-4 rounded-md border border-gray-700">
                                <p className="font-bold text-purple-400">{opp.name} <span className="text-xs font-normal bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full ml-2">{opp.type}</span></p>
                                <p className="text-sm text-gray-300 mt-1">{opp.reasoning}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-700 text-xs text-gray-500">
                  <p><strong>Disclaimer:</strong> The information provided, especially regarding grants and sync opportunities, is for strategic guidance only. All legal and financial decisions should be made in consultation with a qualified professional.</p>
                </div>

              </div>
            )}
            {!loading && !epkOutput && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <SparklesIcon className="w-16 h-16 mb-4 text-gray-600"/>
                    <p className="font-orbitron text-lg">Your generated EPK will appear here.</p>
                    <p>Feed the machine your data to begin the process.</p>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
