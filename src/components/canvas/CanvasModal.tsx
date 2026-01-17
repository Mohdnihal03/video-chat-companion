import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import CanvasBoard from "@/components/canvas/CanvasBoard";
import { Toolbar } from "@/components/canvas/Toolbar";
import { PropertiesPanel } from "@/components/canvas/PropertiesPanel";
import { CanvasElement, CanvasState, createElement, ElementType, exportToBlob } from "@/lib/canvas-utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

// Constants
const HISTORY_LIMIT = 50;

interface CanvasModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CanvasModal: React.FC<CanvasModalProps> = ({ open, onOpenChange }) => {
    // Canvas State
    const [elements, setElements] = useState<CanvasElement[]>(() => {
        const saved = localStorage.getItem("canvas-modal-elements");
        return saved ? JSON.parse(saved) : [];
    });
    const [appState, setAppState] = useState<CanvasState>({
        offsetX: 0,
        offsetY: 0,
        scale: 1,
    });

    // Style State (Persisted defaults)
    const [currentStyle, setCurrentStyle] = useState<Partial<CanvasElement>>(() => {
        const isDark = document.documentElement.classList.contains("dark");
        return {
            stroke: isDark ? "#ffffff" : "#000000",
            fill: "transparent",
            strokeWidth: 2,
            strokeStyle: "solid",
            fillStyle: "hachure",
            roughness: 1,
            opacity: 100,
        };
    });

    const canvasRef = useRef<HTMLDivElement>(null);

    // Interaction State
    const [tool, setTool] = useState<ElementType>("rectangle");
    const [action, setAction] = useState<"drawing" | "moving" | "panning" | "none">("none");
    const [selectedElements, setSelectedElements] = useState<CanvasElement[]>([]);

    // History State
    const [history, setHistory] = useState<CanvasElement[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Text Editing State
    const [editingElementId, setEditingElementId] = useState<string | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // Move/Drag State
    const [moveStart, setMoveStart] = useState({ x: 0, y: 0 });
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Laser State (Ref for performance)
    const laserPathRef = useRef<{ x: number; y: number; time: number }[]>([]);

    // Pinch Zoom State
    const lastPinchDistance = useRef<number | null>(null);

    // UI State
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

    // --- Effects ---

    useLayoutEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Initial History Setup
    useEffect(() => {
        if (historyIndex === 0 && history[0].length === 0 && elements.length > 0) {
            setHistory([elements]);
        }
    }, []);

    // Auto-save
    useEffect(() => {
        localStorage.setItem("canvas-modal-elements", JSON.stringify(elements));
    }, [elements]);

    // Focus Text Area
    useEffect(() => {
        if (editingElementId && textAreaRef.current) {
            textAreaRef.current.focus();
            textAreaRef.current.select();
        }
    }, [editingElementId]);

    // --- Helpers ---

    const getClientCoordinates = (e: React.MouseEvent) => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                clientX: e.clientX - rect.left,
                clientY: e.clientY - rect.top
            };
        }
        return { clientX: e.clientX, clientY: e.clientY };
    }

    const pushToHistory = (newElements: CanvasElement[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        if (newHistory.length > HISTORY_LIMIT) {
            newHistory.shift();
        }
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setElements(history[newIndex]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setElements(history[newIndex]);
        }
    };

    // --- Element Management ---

    const updateElement = (id: string, updates: Partial<CanvasElement>) => {
        setElements(prevElements => {
            const elementsCopy = [...prevElements];
            const index = elementsCopy.findIndex(el => el.id === id);
            if (index === -1) return prevElements;
            elementsCopy[index] = { ...elementsCopy[index], ...updates };
            return elementsCopy;
        });

        const { x, y, width, height, type, id: _id, points, text, groupId, seed, angle, ...styleUpdates } = updates as any;
        if (Object.keys(styleUpdates).length > 0) {
            setCurrentStyle(prev => ({ ...prev, ...styleUpdates }));
        }
    };

    const deleteElement = (id: string) => {
        const newElements = elements.filter(el => el.id !== id);
        setElements(newElements);
        setSelectedElements(prev => prev.filter(el => el.id !== id));
        pushToHistory(newElements);
    };

    const duplicateElement = (id: string) => {
        if (id === 'mult') {
            const newEls: CanvasElement[] = [];
            selectedElements.forEach(el => {
                const newEl = { ...el, id: crypto.randomUUID(), x: el.x + 20, y: el.y + 20 };
                newEls.push(newEl);
            });
            const newElements = [...elements, ...newEls];
            setElements(newElements);
            setSelectedElements(newEls);
            pushToHistory(newElements);
        } else {
            const el = elements.find(el => el.id === id);
            if (!el) return;
            const newEl = { ...el, id: crypto.randomUUID(), x: el.x + 20, y: el.y + 20 };
            const newElements = [...elements, newEl];
            setElements(newElements);
            setSelectedElements([newEl]);
            pushToHistory(newElements);
        }
    };

    const bringToFront = (id: string) => {
        let itemsToMove = selectedElements;
        if (id !== 'mult') {
            const el = elements.find(el => el.id === id);
            if (el) itemsToMove = [el];
        }

        const idsToMove = itemsToMove.map(el => el.id);
        const others = elements.filter(el => !idsToMove.includes(el.id));
        const newElements = [...others, ...elements.filter(el => idsToMove.includes(el.id))];

        setElements(newElements);
        pushToHistory(newElements);
    };

    const sendToBack = (id: string) => {
        let itemsToMove = selectedElements;
        if (id !== 'mult') {
            const el = elements.find(el => el.id === id);
            if (el) itemsToMove = [el];
        }

        const idsToMove = itemsToMove.map(el => el.id);
        const others = elements.filter(el => !idsToMove.includes(el.id));
        const newElements = [...elements.filter(el => idsToMove.includes(el.id)), ...others];

        setElements(newElements);
        pushToHistory(newElements);
    };

    const groupElements = () => {
        if (selectedElements.length < 2) return;
        const groupId = crypto.randomUUID();
        const newElements = elements.map(el => {
            if (selectedElements.some(sel => sel.id === el.id)) {
                return { ...el, groupId };
            }
            return el;
        });
        setElements(newElements);

        const updatedSelection = newElements.filter(el => selectedElements.some(sel => sel.id === el.id));
        setSelectedElements(updatedSelection);
        pushToHistory(newElements);
    };

    const ungroupElements = () => {
        const groupIds = new Set(selectedElements.map(el => el.groupId).filter(Boolean));
        if (groupIds.size === 0) return;

        const newElements = elements.map(el => {
            if (groupIds.has(el.groupId)) {
                const { groupId, ...rest } = el;
                return rest;
            }
            return el;
        });
        setElements(newElements);
        const ids = selectedElements.map(el => el.id);
        setSelectedElements(newElements.filter(el => ids.includes(el.id)));
        pushToHistory(newElements);
    };

    // --- Event Handlers ---

    const handleTextSubmit = () => {
        if (editingElementId) {
            const text = textAreaRef.current?.value;
            if (text && text.trim() !== "") {
                updateElement(editingElementId, { text });
                pushToHistory([...elements]);
            } else {
                deleteElement(editingElementId);
            }
            setEditingElementId(null);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const { clientX, clientY } = getClientCoordinates(e);

        if (editingElementId) return;

        if (e.button === 1) {
            setAction("panning");
            setPanStart({ x: clientX, y: clientY });
            return;
        }

        const canvasX = (clientX - appState.offsetX) / appState.scale;
        const canvasY = (clientY - appState.offsetY) / appState.scale;

        if (tool === "selection") {
            const clickedElement = [...elements].reverse().find(el => {
                const x = el.x;
                const y = el.y;
                const width = el.width;
                const height = el.height;
                const minX = Math.min(x, x + width);
                const maxX = Math.max(x, x + width);
                const minY = Math.min(y, y + height);
                const maxY = Math.max(y, y + height);
                return canvasX >= minX && canvasX <= maxX && canvasY >= minY && canvasY <= maxY;
            });

            if (clickedElement) {
                if (clickedElement.type === "text" && e.detail === 2) {
                    setEditingElementId(clickedElement.id);
                    return;
                }

                let newSelection = [];

                if (e.shiftKey) {
                    if (selectedElements.find(el => el.id === clickedElement.id)) {
                        const groupId = clickedElement.groupId;
                        if (groupId) {
                            newSelection = selectedElements.filter(el => el.groupId !== groupId);
                        } else {
                            newSelection = selectedElements.filter(el => el.id !== clickedElement.id);
                        }
                    } else {
                        const groupId = clickedElement.groupId;
                        if (groupId) {
                            const groupPeers = elements.filter(el => el.groupId === groupId);
                            const all = [...selectedElements, ...groupPeers];
                            const ids = new Set(all.map(x => x.id));
                            newSelection = Array.from(ids).map(id => all.find(x => x.id === id)!);
                        } else {
                            newSelection = [...selectedElements, clickedElement];
                        }
                    }
                } else {
                    if (selectedElements.find(el => el.id === clickedElement.id)) {
                        newSelection = selectedElements;
                    } else {
                        const groupId = clickedElement.groupId;
                        if (groupId) {
                            newSelection = elements.filter(el => el.groupId === groupId);
                        } else {
                            newSelection = [clickedElement];
                        }
                    }
                }

                setSelectedElements(newSelection);

                if (newSelection.length > 0) {
                    const last = newSelection[newSelection.length - 1];
                    const { stroke, fill, strokeWidth, strokeStyle, fillStyle, roughness, opacity } = last;
                    setCurrentStyle({ stroke, fill, strokeWidth, strokeStyle, fillStyle, roughness, opacity });
                }

                setAction("moving");
                setMoveStart({ x: canvasX, y: canvasY });
            } else {
                if (!e.shiftKey) {
                    setSelectedElements([]);
                }
                setAction("panning");
                setPanStart({ x: clientX, y: clientY });
            }
            return;
        }

        if (tool === "image") return;

        if (tool === "eraser" || tool === "laser") {
            setAction("drawing");
            return;
        }

        const id = crypto.randomUUID();
        const newElement = createElement(id, canvasX, canvasY, tool, currentStyle);

        if (tool === "pencil") {
            newElement.points = [{ x: canvasX, y: canvasY }];
        } else if (tool === "text") {
            newElement.text = "";
            setElements(prev => [...prev, newElement]);
            setEditingElementId(id);
            setAction("none");
            return;
        }

        setElements((prev) => [...prev, newElement]);
        setSelectedElements([newElement]);
        setAction("drawing");
        setMoveStart({ x: canvasX, y: canvasY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = getClientCoordinates(e);

        if (action === "panning") {
            const dx = clientX - panStart.x;
            const dy = clientY - panStart.y;
            setAppState(prev => ({ ...prev, offsetX: prev.offsetX + dx, offsetY: prev.offsetY + dy }));
            setPanStart({ x: clientX, y: clientY });
            return;
        }

        const canvasX = (clientX - appState.offsetX) / appState.scale;
        const canvasY = (clientY - appState.offsetY) / appState.scale;

        if (action === "moving" && selectedElements.length > 0) {
            const dx = canvasX - moveStart.x;
            const dy = canvasY - moveStart.y;

            const updatedElements = elements.map(el => {
                if (selectedElements.some(sel => sel.id === el.id)) {
                    let newX = el.x + dx;
                    let newY = el.y + dy;

                    if (el.type === "pencil" && el.points) {
                        const newPoints = el.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
                        return { ...el, x: newX, y: newY, points: newPoints };
                    }

                    return { ...el, x: newX, y: newY };
                }
                return el;
            });

            setElements(updatedElements);
            const updatedSelection = updatedElements.filter(el => selectedElements.some(sel => sel.id === el.id));
            setSelectedElements(updatedSelection);

            setMoveStart({ x: canvasX, y: canvasY });
            return;
        }

        if (action === "drawing") {
            if (tool === "laser") {
                laserPathRef.current.push({ x: canvasX, y: canvasY, time: Date.now() });
                return;
            }

            if (tool === "eraser") {
                const erasedElement = [...elements].reverse().find(el => {
                    const x = el.x;
                    const y = el.y;
                    const width = el.width;
                    const height = el.height;
                    const minX = Math.min(x, x + width);
                    const maxX = Math.max(x, x + width);
                    const minY = Math.min(y, y + height);
                    const maxY = Math.max(y, y + height);
                    return canvasX >= minX && canvasX <= maxX && canvasY >= minY && canvasY <= maxY;
                });

                if (erasedElement) {
                    deleteElement(erasedElement.id);
                }
                return;
            }

            const index = elements.length - 1;
            if (index < 0) return;

            const elementsCopy = [...elements];
            const currentElement = { ...elementsCopy[index] };

            if (tool === "rectangle" || tool === "diamond" || tool === "circle") {
                currentElement.width = canvasX - currentElement.x;
                currentElement.height = canvasY - currentElement.y;
            } else if (tool === "line" || tool === "arrow") {
                currentElement.width = canvasX - currentElement.x;
                currentElement.height = canvasY - currentElement.y;
            } else if (tool === "pencil" && currentElement.points) {
                currentElement.points.push({ x: canvasX, y: canvasY });
            }

            elementsCopy[index] = currentElement;
            setElements(elementsCopy);
        }
    };

    const handleMouseUp = () => {
        if (action === "drawing" || action === "moving") {
            pushToHistory(elements);
        }
        setAction("none");
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            lastPinchDistance.current = distance;
            return;
        }

        const touch = e.touches[0];
        const mouseEvent = {
            ...touch,
            clientX: touch.clientX,
            clientY: touch.clientY,
            button: 0,
            detail: 0,
            shiftKey: false,
            ctrlKey: false,
            metaKey: false,
            altKey: false,
            preventDefault: () => { },
            stopPropagation: () => { },
        } as unknown as React.MouseEvent;
        handleMouseDown(mouseEvent);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && lastPinchDistance.current !== null) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);

            const diff = distance - lastPinchDistance.current;
            const newScale = Math.min(Math.max(appState.scale + diff * 0.005, 0.1), 10);

            setAppState(prev => ({ ...prev, scale: newScale }));
            lastPinchDistance.current = distance;
            return;
        }

        const touch = e.touches[0];
        const mouseEvent = {
            ...touch,
            clientX: touch.clientX,
            clientY: touch.clientY,
            preventDefault: () => { },
            stopPropagation: () => { },
        } as unknown as React.MouseEvent;
        handleMouseMove(mouseEvent);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (e.touches.length < 2) {
            lastPinchDistance.current = null;
        }
        handleMouseUp();
    };

    const handleWheel = (e: React.WheelEvent) => {
        const scaleAdjustment = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(appState.scale + scaleAdjustment, 0.1), 10);
        setAppState(prev => ({ ...prev, scale: newScale }));
    };

    const handleExport = async () => {
        const blob = await exportToBlob(elements, windowSize.width, windowSize.height);
        if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "canvas-notes.png";
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleClear = () => {
        setIsClearDialogOpen(true);
    };

    const confirmClear = () => {
        setElements([]);
        setSelectedElements([]);
        pushToHistory([]);
        localStorage.removeItem("canvas-modal-elements");
        setIsClearDialogOpen(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const src = event.target?.result as string;
                const id = crypto.randomUUID();
                const x = (windowSize.width / 2 - appState.offsetX) / appState.scale - 100;
                const y = (windowSize.height / 2 - appState.offsetY) / appState.scale - 100;

                const newEl = createElement(id, x, y, "image", { width: 200, height: 200, src, stroke: "transparent", fill: "transparent" });

                setElements(prev => [...prev, newEl]);
                setSelectedElements([newEl]);
                pushToHistory([...elements, newEl]);
                setTool("selection");
            };
            reader.readAsDataURL(file);
        }
    };

    // Keyboard Shortcuts
    useEffect(() => {
        if (!open) return; // Only active when modal is open

        const handleKeyDown = (e: KeyboardEvent) => {
            if (editingElementId) return;

            if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
                switch (e.key.toLowerCase()) {
                    case 'v': setTool('selection'); setSelectedElements([]); break;
                    case 'r': setTool('rectangle'); setSelectedElements([]); break;
                    case 'c': setTool('circle'); setSelectedElements([]); break;
                    case 'd': setTool('diamond'); setSelectedElements([]); break;
                    case 'l': setTool('line'); setSelectedElements([]); break;
                    case 'p': setTool('pencil'); setSelectedElements([]); break;
                    case 't': setTool('text'); setSelectedElements([]); break;
                    case 'e': setTool('eraser'); setSelectedElements([]); break;
                    case 'z': setTool('laser'); setSelectedElements([]); break;
                }
            }

            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                if (e.shiftKey) redo(); else undo();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                redo();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
                e.preventDefault();
                if (e.shiftKey) ungroupElements(); else groupElements();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                if (selectedElements.length > 0) duplicateElement('mult');
            } else if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedElements.length > 0) {
                    const ids = selectedElements.map(el => el.id);
                    const newElements = elements.filter(el => !ids.includes(el.id));
                    setElements(newElements);
                    setSelectedElements([]);
                    pushToHistory(newElements);
                }
            } else if (e.key === 'Escape') {
                onOpenChange(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, undo, redo, selectedElements, elements, editingElementId, onOpenChange]);

    const isGroupSelected = selectedElements.length > 0 && selectedElements.some(el => el.groupId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full h-[100dvh] max-w-full max-h-[100dvh] md:max-w-[90vw] md:w-[90vw] md:h-[85vh] md:max-h-[85vh] p-0 gap-0 border-0 md:border">
                <div ref={canvasRef} className="h-full w-full relative overflow-hidden bg-background text-foreground touch-none md:rounded-lg" onWheel={handleWheel}>
                    {/* Background Gradient */}
                    <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-100 transition-opacity duration-500 rounded-lg">
                        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 dark:bg-purple-900/10 blur-[120px]" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-900/10 blur-[120px]" />
                    </div>

                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-50 hover:bg-destructive/20 rounded-full"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    <Toolbar
                        currentTool={tool}
                        setTool={(t) => { setTool(t); setSelectedElements([]); }}
                        undo={undo}
                        redo={redo}
                        canUndo={historyIndex > 0}
                        canRedo={historyIndex < history.length - 1}
                        onExport={handleExport}
                        onClear={handleClear}
                        onImageUpload={handleImageUpload}
                    />

                    <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Clear Canvas?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your drawing.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmClear} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Clear Canvas
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <PropertiesPanel
                        element={selectedElements.length > 0 ? selectedElements[selectedElements.length - 1] : (currentStyle as CanvasElement)}
                        updateElement={(id, updates) => {
                            if (selectedElements.length > 0) {
                                const selectedIds = selectedElements.map(el => el.id);
                                setElements(prev => prev.map(el =>
                                    selectedIds.includes(el.id) ? { ...el, ...updates } : el
                                ));
                                setSelectedElements(prev => prev.map(el => selectedIds.includes(el.id) ? { ...el, ...updates } : el));
                                setCurrentStyle(prev => ({ ...prev, ...updates }));
                            } else {
                                setCurrentStyle(prev => ({ ...prev, ...updates }));
                            }
                        }}
                        deleteElement={(id) => deleteElement(selectedElements.length > 1 ? 'mult' : id)}
                        duplicateElement={(id) => duplicateElement(selectedElements.length > 1 ? 'mult' : id)}
                        bringToFront={(id) => bringToFront(selectedElements.length > 1 ? 'mult' : id)}
                        sendToBack={(id) => sendToBack(selectedElements.length > 1 ? 'mult' : id)}
                        groupElements={groupElements}
                        ungroupElements={ungroupElements}
                        selectedCount={selectedElements.length}
                        isGroupSelected={!!isGroupSelected}
                    />

                    {/* Text Input Overlay */}
                    {editingElementId && (() => {
                        const el = elements.find(e => e.id === editingElementId);
                        if (!el) return null;

                        const left = el.x * appState.scale + appState.offsetX;
                        const top = el.y * appState.scale + appState.offsetY;
                        const fontSize = (el.strokeWidth * 10 + 10) * appState.scale;

                        return (
                            <textarea
                                ref={textAreaRef}
                                className="fixed bg-transparent border border-dashed border-primary outline-none resize-none overflow-hidden z-[100] p-0 m-0 leading-none shadow-none"
                                style={{
                                    left: `${left}px`,
                                    top: `${top - fontSize * 0.1}px`,
                                    fontSize: `${fontSize}px`,
                                    fontFamily: "'Virgil', sans-serif",
                                    minWidth: "100px",
                                    minHeight: "1.5em",
                                    color: el.stroke,
                                    whiteSpace: "pre"
                                }}
                                defaultValue={el.text}
                                onBlur={handleTextSubmit}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        e.currentTarget.blur();
                                    }
                                }}
                            />
                        );
                    })()}

                    <CanvasBoard
                        elements={elements}
                        appState={appState}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        width={typeof window !== 'undefined' && window.innerWidth < 768 ? windowSize.width : windowSize.width * 0.9}
                        height={typeof window !== 'undefined' && window.innerWidth < 768 ? windowSize.height : windowSize.height * 0.85}
                        laserPathRef={laserPathRef}
                    />

                    {/* Zoom Controls */}
                    <div className="absolute bottom-4 right-4 md:bottom-4 md:right-4 flex items-center gap-2 bg-black/80 backdrop-blur border border-white/10 p-1.5 rounded-full z-50 shadow-xl">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-full hover:bg-white/10 text-white/70"
                            onClick={() => setAppState(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.1) }))}
                        >
                            <span className="text-xl font-medium leading-none mb-1">−</span>
                        </Button>
                        <div className="w-12 text-center text-xs font-mono text-white/80 select-none">
                            {Math.round(appState.scale * 100)}%
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-full hover:bg-white/10 text-white/70"
                            onClick={() => setAppState(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 10) }))}
                        >
                            <span className="text-xl font-medium leading-none mb-1">+</span>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
