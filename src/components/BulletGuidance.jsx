/* ================================================================
   BulletGuidance — Inline bullet discipline guidance
   Shows subtle suggestions under Experience/Project description fields.
   Non-blocking. Guidance only.
   ================================================================ */

import { analyzeBullets } from '../utils/bulletGuidance'

function BulletGuidance({ text }) {
    if (!text || !text.trim()) return null

    const analysis = analyzeBullets(text)
    const issues = analysis.filter(b => b.suggestions.length > 0)

    if (issues.length === 0) return null

    return (
        <div className="bullet-guidance" id="bullet-guidance">
            {issues.map((bullet, i) => (
                <div className="bullet-guidance-row" key={i}>
                    <span className="bullet-guidance-line">
                        "{bullet.line.length > 50 ? bullet.line.slice(0, 50) + '…' : bullet.line}"
                    </span>
                    {bullet.suggestions.map((s, j) => (
                        <span className="bullet-guidance-hint" key={j}>→ {s}</span>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default BulletGuidance
