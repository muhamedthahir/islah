import type { Channel, TextResponse, Video } from '../types'

const BASE_URL = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${body}`)
  }
  return (await response.json()) as T
}

export function listChannels(): Promise<Channel[]> {
  return request('/channels')
}

export function syncChannelVideos(
  channelId: string,
  startDate: string,
  endDate: string,
): Promise<Video[]> {
  return request(`/channels/${channelId}/sync`, {
    method: 'POST',
    body: JSON.stringify({ start_date: startDate, end_date: endDate }),
  })
}

export function listVideos(
  channelId: string,
  startDate: string,
  endDate: string,
): Promise<Video[]> {
  const params = new URLSearchParams({
    channel_id: channelId,
    start_date: startDate,
    end_date: endDate,
  })
  return request(`/videos?${params.toString()}`)
}

export function fetchTranscript(videoId: string): Promise<Video> {
  return request(`/videos/${videoId}/transcript`, { method: 'POST' })
}

export function getTranscript(videoId: string): Promise<TextResponse> {
  return request(`/videos/${videoId}/transcript`)
}

export function generateArticle(videoId: string): Promise<Video> {
  return request(`/videos/${videoId}/article`, { method: 'POST' })
}

export function getArticle(videoId: string): Promise<TextResponse> {
  return request(`/videos/${videoId}/article`)
}
