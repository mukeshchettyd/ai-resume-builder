/* ================================================================
   TemplateTabs — Template selector for resume preview
   ================================================================ */

const TEMPLATES = [
    { id: 'classic', label: 'Classic' },
    { id: 'modern', label: 'Modern' },
    { id: 'minimal', label: 'Minimal' },
]

function TemplateTabs({ selected, onSelect }) {
    return (
        <div className="template-tabs" id="template-tabs">
            <span className="template-tabs-label">Template</span>
            <div className="template-tabs-group">
                {TEMPLATES.map(t => (
                    <button
                        key={t.id}
                        className={`template-tab ${selected === t.id ? 'template-tab--active' : ''}`}
                        onClick={() => onSelect(t.id)}
                        id={`tab-${t.id}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default TemplateTabs
