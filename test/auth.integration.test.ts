import { login } from '../services/authService';
import { generateEpk } from '../services/geminiService';
import type { ArtistInput, EpkOutput } from '../types';

describe('authentication integration', () => {
  const artistInput: ArtistInput = {
    artist_name: 'Test Artist',
    track_title: 'Test Track',
    email: 'artist@example.com',
    genre: 'Hip Hop',
    vibe_tags: ['energetic'],
    lyrics_text: 'Sample lyrics',
    artist_intent: 'Share a story',
    cultural_refs_explained: 'Explanation',
    problem_solving_connection: 'Connection',
    streaming_links: ['https://example.com'],
    sync_submission_link: 'https://example.com/sync',
    grant_application_link: 'https://example.com/grant',
  };

  const epkResponse: EpkOutput = {
    status: 'EPK_READY',
    filename_slug: 'test-artist-test-track',
    deliverables: {
      artist_bio: 'Bio',
      one_sheet_summary: 'Summary',
      social_captions: {
        instagram: 'Insta caption',
        tiktok: 'TikTok caption',
        x_twitter: 'Twitter caption',
      },
      cultural_dna_report: 'Report',
    },
    submission_guidance: {
      strategic_opportunities: [
        {
          type: 'Sync Library',
          name: 'Sync Opportunity',
          reasoning: 'Fits style',
        },
      ],
      email_pitch_blurb: 'Pitch',
    },
    feedback_loop_data: {
      ai_confidence_score: 0.9,
      training_data_tags: ['tag'],
      lyric_radio_clean: true,
    },
  };

  beforeEach(() => {
    (globalThis as any).fetch = jest.fn();
  });

  it('persists the token from login and uses it for EPK generation requests', async () => {
    const fetchMock = globalThis.fetch as jest.Mock;

    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'abc123' }),
      })
    );

    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(epkResponse),
      })
    );

    await login({ email: 'user@example.com', password: 'password123' });
    const result = await generateEpk(artistInput);

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/login',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/generate-epk',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer abc123' }),
      })
    );

    expect(result).toEqual(epkResponse);
  });
});
