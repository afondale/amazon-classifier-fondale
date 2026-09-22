export type Sentiment = "positive" | "neutral" | "negative";

export const SENTIMENT_ORDER: Sentiment[] = ["negative", "neutral", "positive"];

export type ModelJson = {
  classes: Sentiment[];
  ngram_range: [number, number];
  lowercase: boolean;
  features: string[];
  idf: number[];
  coef: number[][];
  intercept: number[];
};

export type ClassifyResult = {
  sentiment: Sentiment;
  pNegative: number;
  pNeutral: number;
  pPositive: number;
  contributors: { term: string; score: number }[];
  explanation: string;
};

export type Sample = {
  title: string;
  text: string;
  actual: Sentiment;
  predicted: Sentiment;
  p_negative: number;
  p_neutral: number;
  p_positive: number;
  why: string;
};

export type BatchRow = {
  title: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  gold: Sentiment;
  predicted: Sentiment;
  p_negative: number;
  p_neutral: number;
  p_positive: number;
  correct: boolean;
  why: string;
};

export type ClassCounts = {
  n: number;
  correct: number;
  accuracy: number;
  pred_negative: number;
  pred_neutral: number;
  pred_positive: number;
  gold?: Sentiment;
};

export type Confusion3 = Record<Sentiment, Record<Sentiment, number>>;

export type ClassScores = {
  precision: number;
  recall: number;
  f1: number;
};

export type BatchFile = {
  n: number;
  sampling: string;
  gold_rule: string;
  features: string[];
  model_sees_rating: boolean;
  held_out_from_training: boolean;
  overall: {
    n: number;
    accuracy: number;
    correct: number;
    wrong: number;
    macro_f1: number;
    negative: ClassScores;
    neutral: ClassScores;
    positive: ClassScores;
    confusion: Confusion3;
  };
  majority_always_positive_accuracy: number;
  by_rating: Record<string, ClassCounts>;
  by_class: Record<Sentiment, ClassCounts>;
  rows: BatchRow[];
};

export type Metrics = {
  name: string;
  source: string;
  source_url: string;
  features_used: string[];
  label_rule: string;
  model: string;
  constraint: string;
  n_raw: number;
  n_empty_dropped: number;
  n_labeled: number;
  n_negative: number;
  n_neutral: number;
  n_positive: number;
  rating_counts: Record<string, number>;
  n_train: number;
  n_test: number;
  n_batch_holdout: number;
  split: string;
  classes: Sentiment[];
  test: {
    split: string;
    n: number;
    accuracy: number;
    macro_f1: number;
    negative: ClassScores;
    neutral: ClassScores;
    positive: ClassScores;
    confusion: Confusion3;
  };
  baseline_majority: {
    class: string;
    accuracy: number;
    macro_f1: number;
  };
  top_features: Record<Sentiment, { term: string; weight: number }[]>;
};
