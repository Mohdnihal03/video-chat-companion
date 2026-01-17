import React, { useLayoutEffect, useRef } from "react";
import rough from "roughjs";
import { CanvasElement, CanvasState, renderElement, getSvgPathFromStroke } from "@/lib/canvas-utils";
import { getStroke } from "perfect-freehand";

interface CanvasBoardProps {
    elements: CanvasElement[];
    appState: CanvasState;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onTouchStart?: (e: React.TouchEvent) => void;
    onTouchMove?: (e: React.TouchEvent) => void;
    onTouchEnd?: (e: React.TouchEvent) => void;
    width: number;
    height: number;
    laserPathRef?: React.MutableRefObject<{ x: number; y: number; time: number }[]>;
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({
    elements,
    appState,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    width,
    height,
    laserPathRef,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);

    // Main Render Loop (Background + Elements)
    useLayoutEffect(() => {
        // ... (lines 32-76)
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Save context for transform
        ctx.save();

        // Apply transform (pan/zoom)
        ctx.translate(appState.offsetX, appState.offsetY);
        ctx.scale(appState.scale, appState.scale);

        // Draw Dot Grid
        const gridGap = 20;
        const startX = Math.floor(-appState.offsetX / appState.scale / gridGap) * gridGap;
        const startY = Math.floor(-appState.offsetY / appState.scale / gridGap) * gridGap;
        const endX = startX + (width / appState.scale) + gridGap;
        const endY = startY + (height / appState.scale) + gridGap;

        const isDark = document.documentElement.classList.contains("dark");
        ctx.fillStyle = isDark ? "#ffffff" : "#000000";
        ctx.globalAlpha = isDark ? 0.05 : 0.1;

        for (let x = startX; x < endX; x += gridGap) {
            for (let y = startY; y < endY; y += gridGap) {
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1;

        const rc = rough.canvas(canvas);

        elements.forEach((element) => {
            renderElement(rc, ctx, element);
        });

        ctx.restore();
    }, [elements, appState, width, height]);

    // Overlay Render Loop (Laser)
    useLayoutEffect(() => {
        // ... (lines 80-132)
        const canvas = overlayRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const renderOverlay = () => {
            ctx.clearRect(0, 0, width, height);

            if (laserPathRef && laserPathRef.current.length > 0) {
                const now = Date.now();
                // Prune old points
                laserPathRef.current = laserPathRef.current.filter(p => now - p.time < 1000);

                if (laserPathRef.current.length > 1) {
                    ctx.save();
                    ctx.translate(appState.offsetX, appState.offsetY);
                    ctx.scale(appState.scale, appState.scale);

                    const points = laserPathRef.current.map(p => [p.x, p.y, 0.5]);
                    const stroke = getStroke(points as any, {
                        size: 16,
                        thinning: 0.7,
                        smoothing: 0.5,
                        streamline: 0.5,
                        easing: (t) => t,
                        start: { taper: true, cap: true },
                        end: { taper: true, cap: true }
                    });

                    const pathData = getSvgPathFromStroke(stroke);
                    const path = new Path2D(pathData);

                    ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Glow
                    ctx.shadowColor = "red";
                    ctx.shadowBlur = 20;
                    ctx.fill(path);

                    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // Core
                    ctx.shadowBlur = 5;
                    ctx.fill(path);

                    ctx.restore();
                }
            }

            animationFrameId = requestAnimationFrame(renderOverlay);
        };

        renderOverlay();
        return () => cancelAnimationFrame(animationFrameId);
    }, [width, height, appState, laserPathRef]);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 touch-none block bg-transparent"
                width={width}
                height={height}
                style={{ pointerEvents: 'none' }}
            />
            {/* Overlay Canvas deals with interactions */}
            <canvas
                ref={overlayRef}
                className="absolute top-0 left-0 touch-none block bg-transparent"
                width={width}
                height={height}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{ cursor: "crosshair" }}
            />
        </>
    );
};

export default CanvasBoard;
