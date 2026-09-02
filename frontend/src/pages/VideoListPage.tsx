import { useEffect, useState } from 'react'
import { listChannels, listVideos, syncChannelVideos } from '../api/client'
import { ArticleViewerModal } from '../components/ArticleViewerModal'
import { DateRangePicker } from '../components/DateRangePicker'
import { VideoRow } from '../components/VideoRow'
import type { Channel, Video } from '../types'

function defaultStartDate(): string {
  const date = new Date()
  date.setDate(date.getDate() - 30)
  return date.toISOString().slice(0, 10)
}

function defaultEndDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function VideoListPage() {
  const [channel, setChannel] = useState<Channel | null>(null)
  const [startDate, setStartDate] = useState(defaultStartDate())
  const [endDate, setEndDate] = useState(defaultEndDate())
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewer, setViewer] = useState<{ title: string; text: string } | null>(null)

  useEffect(() => {
    listChannels()
      .then((channels) => {
        if (channels.length > 0) setChannel(channels[0])
        else setError('No default channel configured on the backend yet.')
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
  }, [])

  async function handleLoadVideos() {
    if (!channel) return
    setLoading(true)
    setError(null)
    try {
      const startIso = `${startDate}T00:00:00Z`
      const endIso = `${endDate}T23:59:59Z`
      await syncChannelVideos(channel.channel_id, startIso, endIso)
      setVideos(await listVideos(channel.channel_id, startIso, endIso))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  function handleVideoUpdate(updated: Video) {
    setVideos((prev) => prev.map((v) => (v.video_id === updated.video_id ? updated : v)))
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>{channel ? channel.title : 'Loading channel…'}</h1>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(s, e) => {
            setStartDate(s)
            setEndDate(e)
          }}
        />
        <button disabled={!channel || loading} onClick={handleLoadVideos}>
          {loading ? 'Loading…' : 'Load Videos'}
        </button>
      </div>

      {error && <p style={{ color: 'salmon' }}>{error}</p>}

      {videos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Published</th>
              <th>Transcript</th>
              <th>Article</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <VideoRow
                key={video.video_id}
                video={video}
                onUpdate={handleVideoUpdate}
                onView={(title, text) => setViewer({ title, text })}
              />
            ))}
          </tbody>
        </table>
      )}

      {viewer && (
        <ArticleViewerModal
          title={viewer.title}
          text={viewer.text}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  )
}
