
/**
 * Represents the input data for an artist, used to generate an Electronic Press Kit (EPK).
 */
export interface ArtistInput {
  /** The name of the artist. */
  artist_name: string;
  /** The title of the track. */
  track_title: string;
  /** The artist's contact email. */
  email: string;
  /** The genre of the music. */
  genre: string;
  /** An array of tags describing the vibe of the music. */
  vibe_tags: string[];
  /** The full lyrics of the track. */
  lyrics_text: string;
  /** The artist's intent or message behind the track. */
  artist_intent: string;
  /** An explanation of any cultural references in the lyrics. */
  cultural_refs_explained: string;
  /** How the music connects to a local issue or opportunity. */
  problem_solving_connection: string;
  /** An array of links to the track on streaming platforms. */
  streaming_links: string[];
  /** A link to a sync library submission. */
  sync_submission_link: string;
  /** A link to a grant application. */
  grant_application_link: string;
}

/**
 * Represents the output data of a generated Electronic Press Kit (EPK).
 */
export interface EpkOutput {
  /** The status of the EPK generation. */
  status: "EPK_READY";
  /** A URL-friendly slug for the filename. */
  filename_slug: string;
  /** The main deliverables of the EPK. */
  deliverables: {
    /** A biography of the artist. */
    artist_bio: string;
    /** A one-sheet summary of the artist and track. */
    one_sheet_summary: string;
    /** Suggested social media captions. */
    social_captions: {
      /** Caption for Instagram. */
      instagram: string;
      /** Caption for TikTok. */
      tiktok: string;
      /** Caption for X/Twitter. */
      x_twitter: string;
    };
    /** A report on the cultural DNA of the track. */
    cultural_dna_report: string;
  };
  /** Guidance for submitting the EPK to various opportunities. */
  submission_guidance: {
    /** An array of strategic opportunities for the artist. */
    strategic_opportunities: Array<{
      /** The type of opportunity. */
      type: "Sync Library" | "Grant/Accelerator" | "Radio Station";
      /** The name of the opportunity. */
      name: string;
      /** The reasoning behind suggesting this opportunity. */
      reasoning: string;
    }>;
    /** A pre-written email pitch blurb. */
    email_pitch_blurb: string;
  };
  /** Data for internal feedback and training loops. */
  feedback_loop_data: {
    /** The AI's confidence score in the generated EPK. */
    ai_confidence_score: number;
    /** An array of tags used for training data. */
    training_data_tags: string[];
    /** Whether the lyrics are clean for radio play. */
    lyric_radio_clean: boolean;
  };
}
