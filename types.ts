
export interface ArtistInput {
  artist_name: string;
  track_title: string;
  email: string;
  genre: string;
  vibe_tags: string[];
  lyrics_text: string;
  artist_intent: string;
  cultural_refs_explained: string; // Kept as string for form simplicity
  problem_solving_connection: string;
  streaming_links: string[];
  sync_submission_link: string;
  grant_application_link: string;
}

export interface EpkOutput {
  status: "EPK_READY";
  filename_slug: string;
  deliverables: {
    artist_bio: string;
    one_sheet_summary: string;
    social_captions: {
      instagram: string;
      tiktok: string;
      x_twitter: string;
    };
    cultural_dna_report: string;
  };
  submission_guidance: {
    strategic_opportunities: Array<{
      type: "Sync Library" | "Grant/Accelerator" | "Radio Station";
      name: string;
      reasoning: string;
    }>;
    email_pitch_blurb: string;
  };
  feedback_loop_data: {
    ai_confidence_score: number;
    training_data_tags: string[];
    lyric_radio_clean: boolean;
  };
}
