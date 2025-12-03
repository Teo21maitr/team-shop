/**
 * ChristmasAnimation Component
 * Displays a delightful Christmas-themed Easter egg animation.
 * Triggered when user adds "Chat" to a list containing "Un gentil bibou".
 */
import { useEffect, useState } from 'react';
import './ChristmasAnimation.css';

export default function ChristmasAnimation({ isActive, onComplete }) {
    const [animationPhase, setAnimationPhase] = useState('idle');

    useEffect(() => {
        if (isActive) {
            // Start animation sequence
            setAnimationPhase('appearing');

            // After 5 seconds, start fade out
            const fadeTimer = setTimeout(() => {
                setAnimationPhase('fading');
            }, 5000);

            // After fade completes (6.5 seconds total), notify parent
            const completeTimer = setTimeout(() => {
                setAnimationPhase('idle');
                if (onComplete) {
                    onComplete();
                }
            }, 6500);

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(completeTimer);
            };
        }
    }, [isActive, onComplete]);

    if (!isActive || animationPhase === 'idle') {
        return null;
    }

    return (
        <div
            className={`christmas-animation-overlay ${animationPhase}`}
            aria-hidden="true"
        >
            {/* Snowflakes */}
            <div className="snowflakes" aria-hidden="true">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="snowflake"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                        }}
                    >
                        ❄️
                    </div>
                ))}
            </div>

            {/* Cat in Gift Box */}
            <div className="gift-box-container">
                <div className="gift-box">🎁</div>
                <div className="cat">🐱</div>
            </div>

            {/* Message */}
            <div className="christmas-message">
                <p>Ton bibou t'offre un petit chat pour Noël</p>
            </div>
        </div>
    );
}
