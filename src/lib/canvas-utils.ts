import { Drawable } from "roughjs/bin/core";
import { getStroke } from "perfect-freehand";

export type ElementType =
    | "selection"
    | "rectangle"
    | "circle"
    | "diamond"
    | "line"
    | "arrow"
    | "pencil"
    | "text"
    | "eraser"
    | "laser"
    | "image";

export type StrokeStyle = "solid" | "dashed" | "dotted";
export type FillStyle = "solid" | "hachure" | "zigzag" | "cross-hatch";

export interface CanvasElement {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    stroke: string;
    fill?: string;
    strokeWidth: number;
    strokeStyle: StrokeStyle;
    fillStyle: FillStyle;
    opacity: number;
    roughness: number;
    angle: number;
    seed: number;
    points?: { x: number; y: number }[];
    text?: string;
    groupId?: string;
    src?: string;
}

export interface CanvasState {
    offsetX: number;
    offsetY: number;
    scale: number;
}

export const createElement = (
    id: string,
    x: number,
    y: number,
    type: ElementType,
    options: Partial<CanvasElement> = {}
): CanvasElement => {
    return {
        id,
        x,
        y,
        width: 0,
        height: 0,
        type,
        stroke: "#000000",
        strokeWidth: 2,
        strokeStyle: "solid",
        fillStyle: "hachure",
        opacity: 100,
        roughness: 1,
        angle: 0,
        seed: Math.floor(Math.random() * 2 ** 31),
        ...options,
    };
};

export const getSvgPathFromStroke = (stroke: number[][]) => {
    if (!stroke.length) return "";

    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ["M", ...stroke[0], "Q"]
    );

    d.push("Z");
    return d.join(" ");
};

export const renderElement = (rc: any, ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    if (element.type === "rectangle") {
        rc.rectangle(element.x, element.y, element.width, element.height, {
            seed: element.seed,
            stroke: element.stroke,
            strokeWidth: element.strokeWidth,
            fill: element.fill,
            fillStyle: element.fillStyle,
            roughness: element.roughness,
            strokeLineDash: element.strokeStyle === "dashed" ? [10, 5] : element.strokeStyle === "dotted" ? [2, 5] : undefined,
        });
    } else if (element.type === "circle") {
        rc.ellipse(
            element.x + element.width / 2,
            element.y + element.height / 2,
            element.width,
            element.height,
            {
                seed: element.seed,
                stroke: element.stroke,
                strokeWidth: element.strokeWidth,
                fill: element.fill,
                fillStyle: element.fillStyle,
                roughness: element.roughness,
                strokeLineDash: element.strokeStyle === "dashed" ? [10, 5] : element.strokeStyle === "dotted" ? [2, 5] : undefined,
            }
        );
    } else if (element.type === "diamond") {
        const x = element.x;
        const y = element.y;
        const w = element.width;
        const h = element.height;
        rc.polygon(
            [
                [x + w / 2, y],
                [x + w, y + h / 2],
                [x + w / 2, y + h],
                [x, y + h / 2],
            ],
            {
                seed: element.seed,
                stroke: element.stroke,
                strokeWidth: element.strokeWidth,
                fill: element.fill,
                fillStyle: element.fillStyle,
                roughness: element.roughness,
                strokeLineDash: element.strokeStyle === "dashed" ? [10, 5] : element.strokeStyle === "dotted" ? [2, 5] : undefined,
            }
        );
    } else if (element.type === "line") {
        rc.line(
            element.x, element.y, element.x + element.width, element.y + element.height,
            {
                seed: element.seed,
                stroke: element.stroke,
                strokeWidth: element.strokeWidth,
                roughness: element.roughness,
                strokeLineDash: element.strokeStyle === "dashed" ? [10, 5] : element.strokeStyle === "dotted" ? [2, 5] : undefined,
            }
        );
    } else if (element.type === "arrow") {
        rc.line(
            element.x, element.y, element.x + element.width, element.y + element.height,
            {
                seed: element.seed,
                stroke: element.stroke,
                strokeWidth: element.strokeWidth,
                roughness: element.roughness,
                strokeLineDash: element.strokeStyle === "dashed" ? [10, 5] : element.strokeStyle === "dotted" ? [2, 5] : undefined,
            }
        );
        const angle = Math.atan2(element.height, element.width);
        const headLength = 20;
        const endX = element.x + element.width;
        const endY = element.y + element.height;

        const x1 = endX - headLength * Math.cos(angle - Math.PI / 6);
        const y1 = endY - headLength * Math.sin(angle - Math.PI / 6);
        const x2 = endX - headLength * Math.cos(angle + Math.PI / 6);
        const y2 = endY - headLength * Math.sin(angle + Math.PI / 6);

        rc.line(endX, endY, x1, y1, { seed: element.seed, stroke: element.stroke, strokeWidth: element.strokeWidth, roughness: element.roughness });
        rc.line(endX, endY, x2, y2, { seed: element.seed, stroke: element.stroke, strokeWidth: element.strokeWidth, roughness: element.roughness });

    } else if (element.type === "pencil" && element.points) {
        const stroke = getStroke(element.points, {
            size: element.strokeWidth * 4 + 4,
            thinning: 0.5,
            smoothing: 0.5,
            streamline: 0.5,
        });
        const pathData = getSvgPathFromStroke(stroke);
        const path = new Path2D(pathData);
        ctx.fillStyle = element.stroke;
        ctx.fill(path);
    } else if (element.type === "text" && element.text) {
        ctx.font = `${element.strokeWidth * 10 + 10}px 'Virgil', sans-serif`;
        ctx.fillStyle = element.stroke;
        ctx.fillText(element.text, element.x, element.y);
    } else if (element.type === "image" && element.src) {
        const img = new Image();
        img.src = element.src;
        // Draw directly if loaded, otherwise we might need a better loading strategy.
        // For now, assuming standard browser caching/loading behavior.
        // Ideally we should pre-load or use a React state for images, but this is a utils function.
        // We'll rely on the fact that if it's in the canvas, it's likely loaded.
        // But to be safe, we can check if it's complete.
        if (img.complete) {
            ctx.drawImage(img, element.x, element.y, element.width, element.height);
        } else {
            img.onload = () => {
                // This will trigger a re-render from outside eventually if state updates,
                // but just drawing here won't persist if the canvas is cleared next frame.
                // We really rely on the react component to force re-renders.
                ctx.drawImage(img, element.x, element.y, element.width, element.height);
            }
        }
    }
}

export const exportToBlob = async (
    elements: CanvasElement[],
    width: number,
    height: number
): Promise<Blob | null> => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const rough = (await import("roughjs")).default;
    const rc = rough.canvas(canvas);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    elements.forEach(element => {
        renderElement(rc, ctx, element);
    });

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        });
    });
};
