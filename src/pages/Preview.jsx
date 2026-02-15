import { useState } from 'react'
import { Link } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import TemplateTabs from '../components/TemplateTabs'

const STORAGE_KEY = 'resumeBuilderData'
const TEMPLATE_KEY = 'resumeBuilderTemplate'

const EMPTY_STATE = {
    personal: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: '',
    links: { github: '', linkedin: '' },
}

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return EMPTY_STATE
}

function loadTemplate() {
    try {
        return localStorage.getItem(TEMPLATE_KEY) || 'classic'
    } catch { return 'classic' }
}

function saveTemplate(tpl) {
    localStorage.setItem(TEMPLATE_KEY, tpl)
}

function Preview() {
    const [data] = useState(() => loadData())
    const [template, setTemplate] = useState(() => loadTemplate())

    const handleTemplateChange = (tpl) => {
        setTemplate(tpl)
        saveTemplate(tpl)
    }

    const hasData =
        data.personal.name ||
        data.summary ||
        data.education.length > 0 ||
        data.experience.length > 0

    return (
        <div className="preview-page" id="preview-page">
            <div className="preview-page-header">
                <h1 className="preview-page-title">Resume Preview</h1>
                <Link to="/builder" className="btn btn-secondary btn-sm" id="btn-back-to-builder">
                    ← Edit in Builder
                </Link>
            </div>

            {!hasData && (
                <div className="card" style={{ textAlign: 'center', padding: '64px 32px', marginBottom: '32px' }}>
                    <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginBottom: '16px' }}>
                        No resume data yet. Start building to see your preview.
                    </p>
                    <Link to="/builder" className="btn btn-primary" id="btn-go-to-builder">
                        Start Building
                    </Link>
                </div>
            )}

            <TemplateTabs selected={template} onSelect={handleTemplateChange} />

            <ResumePreview data={data} template={template} />
        </div>
    )
}

export default Preview
