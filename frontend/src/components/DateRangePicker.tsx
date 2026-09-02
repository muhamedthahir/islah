interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (startDate: string, endDate: string) => void
}

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <label>
        From{' '}
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChange(e.target.value, endDate)}
        />
      </label>
      <label>
        To{' '}
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChange(startDate, e.target.value)}
        />
      </label>
    </div>
  )
}
