import { useCardTilt } from '../../hooks/useCardTilt';
import './../sections/VoidMatrix.css';

export default function VoidCard({ 
    id,
    title, 
    subtitle, 
    statusText = "System Live",
    statusColor = "red",
    tag1,
    tag2,
    tag3,
    footerTitle,
    footerDesc,
    isVisible = true,
    children 
}) {
    const { wrapperRef, cardRef, isActive } = useCardTilt();

    return (
        <div 
            className={`card-wrapper ${isActive ? 'is-active' : ''}`} 
            ref={wrapperRef}
            id={id}
            style={{ 
                opacity: isVisible ? 1 : 0, 
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
            }}
        >
            <div className="glass-card" ref={cardRef}>
                {/* Content Header */}
                <div className="card-header">
                    <div className="status-indicator">
                        <div className={`status-light ${statusColor === 'amber' ? 'amber-light' : statusColor === 'cyan' ? 'cyan-light' : statusColor === 'violet' ? 'violet-light' : ''}`}></div>
                        <span className={`status-text dot-matrix ${statusColor === 'amber' ? 'text-amber' : statusColor === 'cyan' ? 'text-cyan' : statusColor === 'violet' ? 'text-violet' : ''}`}>
                            {statusText}
                        </span>
                    </div>
                    <h1 className="card-title dot-matrix">{title}</h1>
                    <p className="card-subtitle">{subtitle}</p>
                </div>

                {/* Main Visual/SVG Payload */}
                {children}

                {/* Footer Tags */}
                <div className="tags-container">
                    {tag1 && <button className="tag dot-matrix">{tag1}</button>}
                    {tag2 && <button className="tag dot-matrix">{tag2}</button>}
                    {tag3 && <button className="tag dot-matrix">{tag3}</button>}
                </div>

                <div className="card-footer">
                    <h3 className="footer-title">{footerTitle}</h3>
                    <p className="footer-desc">{footerDesc}</p>
                </div>
            </div>
        </div>
    );
}
