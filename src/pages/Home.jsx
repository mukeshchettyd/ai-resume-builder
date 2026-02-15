import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className="landing">
            <div className="landing-content">
                <span className="landing-eyebrow">AI Resume Builder</span>
                <h1 className="landing-headline">Build a Resume<br />That Gets Read.</h1>
                <p className="landing-subtext">
                    Craft a professional, ATS-optimized resume in minutes.
                    Clean design. Smart structure. Zero guesswork.
                </p>
                <Link to="/builder" className="btn btn-primary landing-cta" id="cta-start-building">
                    Start Building
                </Link>
                <div className="landing-features">
                    <div className="landing-feature-item">
                        <span className="landing-feature-icon">✍</span>
                        <span className="landing-feature-label">Build</span>
                        <span className="landing-feature-desc">Structured form</span>
                    </div>
                    <div className="landing-feature-divider"></div>
                    <div className="landing-feature-item">
                        <span className="landing-feature-icon">👁</span>
                        <span className="landing-feature-label">Preview</span>
                        <span className="landing-feature-desc">Live rendering</span>
                    </div>
                    <div className="landing-feature-divider"></div>
                    <div className="landing-feature-item">
                        <span className="landing-feature-icon">✓</span>
                        <span className="landing-feature-label">Ship</span>
                        <span className="landing-feature-desc">Clean output</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
