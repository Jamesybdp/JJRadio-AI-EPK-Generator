import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot, Root } from 'react-dom/client';
import App from './App';
import type { EpkOutput } from './types';
import { generateEpk } from './services/apiService';

jest.mock('./services/apiService');

const mockGenerateEpk = generateEpk as jest.MockedFunction<typeof generateEpk>;

const mockResponse: EpkOutput = {
  status: 'EPK_READY',
  filename_slug: 'test-slug',
  deliverables: {
    artist_bio: 'A compelling artist bio.',
    one_sheet_summary: 'A concise summary.',
    social_captions: {
      instagram: 'IG caption',
      tiktok: 'TikTok caption',
      x_twitter: 'X caption'
    },
    cultural_dna_report: 'Cultural insights.'
  },
  submission_guidance: {
    strategic_opportunities: [
      {
        type: 'Sync Library',
        name: 'Def Jam Africa A&R',
        reasoning: 'Reasoning text.'
      }
    ],
    email_pitch_blurb: 'Email pitch text.'
  },
  feedback_loop_data: {
    ai_confidence_score: 0.9,
    training_data_tags: ['tag1'],
    lyric_radio_clean: true
  }
};

describe('App', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mockGenerateEpk.mockResolvedValue(mockResponse);
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    jest.clearAllMocks();
  });

  it('submits the form and displays the generated EPK', async () => {
    await act(async () => {
      root.render(<App />);
    });

    const setValue = (selector: string, value: string) => {
      const element = container.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement | null;
      expect(element).not.toBeNull();
      element!.value = value;
      element!.dispatchEvent(new Event('input', { bubbles: true }));
    };

    setValue('input[name="artist_name"]', 'Test Artist');
    setValue('input[name="track_title"]', 'Test Track');
    setValue('input[name="email"]', 'artist@example.com');
    setValue('textarea[name="lyrics_text"]', 'These are the lyrics.');

    const form = container.querySelector('form');
    expect(form).not.toBeNull();

    await act(async () => {
      form!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(mockGenerateEpk).toHaveBeenCalled();
    expect(container.textContent).toContain('A compelling artist bio.');
    expect(container.textContent).toContain('A concise summary.');
    expect(container.textContent).toContain('Cultural insights.');
  });
});
