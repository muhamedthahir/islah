export interface Channel {
  channel_id: string
  title: string
  thumbnail_url: string | null
  created_at: string
}

export type TranscriptStatus = 'none' | 'fetched' | 'unavailable'
export type ArticleStatus = 'none' | 'generated'

export interface Video {
  video_id: string
  channel_id: string
  title: string
  description: string
  published_at: string
  thumbnail_url: string | null
  transcript_status: TranscriptStatus
  transcript_s3_key: string | null
  article_status: ArticleStatus
  article_s3_key: string | null
  created_at: string
  updated_at: string
}

export interface TextResponse {
  text: string
}
