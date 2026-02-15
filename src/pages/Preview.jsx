import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import TemplateTabs from '../components/TemplateTabs'
import { generatePlainText, copyToClipboard, getExportWarnings } from '../utils/exportUtils'

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
    const [copyStatus, setCopyStatus] = useState('')
    const [showWarning, setShowWarning] = useState(false)

    const handleTemplateChange = (tpl) => {
        setTemplate(tpl)
        saveTemplate(tpl)
    }

    const warnings = getExportWarnings(data)

    const hasData =
        data.personal.name ||
        data.summary ||
        data.education.length > 0 ||
        data.experience.length > 0

    // ---- Print ----
    const handlePrint = useCallback(() => {
        if (warnings.length > 0) {
            setShowWarning(true)
            // Don't block — proceed after showing warning
            setTimeout(() => {
                window.print()
            }, 100)
        } else {
            window.print()
        }
    }, [warnings])

    // ---- Copy as Text ----
    const handleCopyText = useCallback(async () => {
        if (warnings.length > 0) {
            setShowWarning(true)
        }

        const text = generatePlainText(data)
        try {
            await copyToClipboard(text)
            setCopyStatus('copied')
            setTimeout(() => setCopyStatus(''), 2500)
        } catch {
            setCopyStatus('error')
            setTimeout(() => setCopyStatus(''), 2500)
        }
    }, [data, warnings])

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

            {/* ---- Export Actions ---- */}
            {hasData && (
                <div className="export-bar" id="export-bar">
                    <div className="export-bar-left">
                        <TemplateTabs selected={template} onSelect={handleTemplateChange} />
                    </div>
                    <div className="export-bar-right">
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={handleCopyText}
                            id="btn-copy-text"
                        >
                            {copyStatus === 'copied' ? '✓ Copied' : copyStatus === 'error' ? '✕ Failed' : 'Copy as Text'}
                        </button>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handlePrint}
                            id="btn-print-pdf"
                        >
                            Print / Save as PDF
                        </button>
                    </div>
                </div>
            )}

            {/* ---- Validation Warning ---- */}
            {showWarning && warnings.length > 0 && (
                <div className="export-warning" id="export-warning">
                    <span className="export-warning-icon">⚠</span>
                    <div className="export-warning-content">
                        <span className="export-warning-title">Your resume may look incomplete.</span>
                        <ul className="export-warning-list">
                            {warnings.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    </div>
                    <button
                        className="export-warning-dismiss"
                        onClick={() => setShowWarning(false)}
                        aria-label="Dismiss warning"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* ---- Template Tabs (shown here only if no data — export bar has them otherwise) ---- */}
            {!hasData && <TemplateTabs selected={template} onSelect={handleTemplateChange} />}

            {/* ---- Resume Preview (printable region) ---- */}
            <div id="printable-resume">
                <ResumePreview data={data} template={template} />
            </div>
        </div>
    )
}

export default Preview
