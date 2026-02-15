/* ================================================================
   TemplatePicker — Visual template selector with thumbnails
   ================================================================ */

const TEMPLATES = [
    {
        id: 'classic',
        label: 'Classic',
        description: 'Traditional & Serif',
        preview: (color) => (
            <div className="tpl-thumb-inner tpl-thumb--classic">
                <div className="tpl-thumb-header" style={{ borderBottomColor: color }}></div>
                <div className="tpl-thumb-line"></div>
                <div className="tpl-thumb-line"></div>
                <div className="tpl-thumb-section"></div>
                <div className="tpl-thumb-line"></div>
                <div className="tpl-thumb-line"></div>
            </div>
        )
    },
    {
        id: 'modern',
        label: 'Modern',
        description: 'Sidebar Layout',
        preview: (color) => (
            <div className="tpl-thumb-inner tpl-thumb--modern">
                <div className="tpl-thumb-sidebar" style={{ backgroundColor: color }}></div>
                <div className="tpl-thumb-main">
                    <div className="tpl-thumb-header"></div>
                    <div className="tpl-thumb-line"></div>
                    <div className="tpl-thumb-line"></div>
                    <div className="tpl-thumb-section"></div>
                    <div className="tpl-thumb-line"></div>
                </div>
            </div>
        )
    },
    {
        id: 'minimal',
        label: 'Minimal',
        description: 'Clean & Spaced',
        preview: (color) => (
            <div className="tpl-thumb-inner tpl-thumb--minimal">
                <div className="tpl-thumb-header"></div>
                <div className="tpl-thumb-line" style={{ width: '40%' }}></div>
                <div className="tpl-thumb-line"></div>
                <div className="tpl-thumb-line"></div>
                <div className="tpl-thumb-line"></div>
            </div>
        )
    }
]

function TemplatePicker({ selected, onSelect, accentColor }) {
    return (
        <div className="tpl-picker">
            <h4 className="picker-label">Select Template</h4>
            <div className="tpl-grid">
                {TEMPLATES.map(tpl => (
                    <button
                        key={tpl.id}
                        className={`tpl-card ${selected === tpl.id ? 'tpl-card--active' : ''}`}
                        onClick={() => onSelect(tpl.id)}
                    >
                        <div className="tpl-preview-box">
                            {tpl.preview(accentColor)}
                            {selected === tpl.id && (
                                <div className="tpl-checkmark">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <span className="tpl-name">{tpl.label}</span>
                        <span className="tpl-desc">{tpl.description}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default TemplatePicker
