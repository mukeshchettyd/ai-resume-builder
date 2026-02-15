/* ================================================================
   ColorPicker — Selection of accent colors for the resume
   ================================================================ */

const COLORS = [
    { name: 'Teal', value: 'hsl(168, 60%, 40%)' },
    { name: 'Navy', value: 'hsl(220, 60%, 35%)' },
    { name: 'Burgundy', value: 'hsl(345, 60%, 35%)' },
    { name: 'Forest', value: 'hsl(150, 50%, 30%)' },
    { name: 'Charcoal', value: 'hsl(0, 0%, 25%)' },
]

function ColorPicker({ selected, onSelect }) {
    return (
        <div className="color-picker">
            <h4 className="picker-label">Accent Color</h4>
            <div className="color-list">
                {COLORS.map(color => (
                    <button
                        key={color.value}
                        className={`color-swatch ${selected === color.value ? 'color-swatch--active' : ''}`}
                        title={color.name}
                        onClick={() => onSelect(color.value)}
                        style={{ '--swatch-color': color.value }}
                    />
                ))}
            </div>
        </div>
    )
}

export default ColorPicker
