import { useState } from 'react'
import { fetchTranscript, generateArticle, getArticle, getTranscript } from '../api/client'
import type { Video } from '../types'

interface VideoRowProps {
  video: Video
  onUpdate: (video: Video) => void
  onView: (title: string, text: string) => void
}

export function VideoRow({ video, onUpdate, onView }: VideoRowProps) {
  const [busy, setBusy] = useState<'transcript' | 'article' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFetchTranscript() {
    setBusy('transcript')
    setError(null)
    try {
      onUpdate(await fetchTranscript(video.video_id))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(null)
    }
  }

  async function handleGenerateArticle() {
    setBusy('article')
    setError(null)
    try {
      onUpdate(await generateArticle(video.video_id))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(null)
    }
  }

  async function handleViewTranscript() {
    const { text } = await getTranscript(video.video_id)
    onView(`Transcript: ${video.title}`, text)
  }

  async function handleViewArticle() {
    const { text } = await getArticle(video.video_id)
    onView(`Article: ${video.title}`, text)
  }

  return (
    <tr>
      <td>
        {video.thumbnail_url && (
          <img src={video.thumbnail_url} alt="" width={80} />
        )}
      </td>
      <td>{video.title}</td>
      <td>{new Date(video.published_at).toLocaleDateString()}</td>
      <td>
        {video.transcript_status === 'none' && (
          <button disabled={busy !== null} onClick={handleFetchTranscript}>
            {busy === 'transcript' ? 'Fetching…' : 'Fetch Transcript'}
          </button>
        )}
        {video.transcript_status === 'fetched' && (
          <button onClick={handleViewTranscript}>View Transcript</button>
        )}
        {video.transcript_status === 'unavailable' && <span>Unavailable</span>}
      </td>
      <td>
        {video.transcript_status === 'fetched' && video.article_status === 'none' && (
          <button disabled={busy !== null} onClick={handleGenerateArticle}>
            {busy === 'article' ? 'Generating…' : 'Generate Article'}
          </button>
        )}
        {video.article_status === 'generated' && (
          <button onClick={handleViewArticle}>View Article</button>
        )}
      </td>
      {error && (
        <td style={{ color: 'salmon' }}>
          {error}
        </td>
      )}
    </tr>
  )
}
