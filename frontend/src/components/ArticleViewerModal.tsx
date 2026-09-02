interface ArticleViewerModalProps {
  title: string
  text: string
  onClose: () => void
}

export function ArticleViewerModal({ title, text, onClose }: ArticleViewerModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          color: 'black',
          maxWidth: '700px',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: '1.5rem',
          borderRadius: '8px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <h2>{title}</h2>
          <button onClick={onClose}>Close</button>
        </div>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{text}</pre>
      </div>
    </div>
  )
}
