import { CanvasElement, StrokeStyle, FillStyle } from "@/lib/canvas-utils";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { AlignCenter, AlignLeft, AlignRight, BringToFront, SendToBack, Trash2, Copy, Layers, Group, Ungroup } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertiesPanelProps {
    element: CanvasElement | null;
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;
    deleteElement: (id: string) => void;
    duplicateElement: (id: string) => void;
    bringToFront: (id: string) => void;
    sendToBack: (id: string) => void;
    groupElements: () => void;
    ungroupElements: () => void;
    selectedCount: number;
    isGroupSelected?: boolean;
}

const strokeStyles: { value: StrokeStyle, label: string }[] = [
    { value: "solid", label: "Solid" },
    { value: "dashed", label: "Dashed" },
    { value: "dotted", label: "Dotted" }
];

const fillStyles: { value: FillStyle, label: string }[] = [
    { value: "solid", label: "Solid" },
    { value: "hachure", label: "Sketch" },
    { value: "zigzag", label: "Zigzag" },
    { value: "cross-hatch", label: "Cross" }
];

export function PropertiesPanel({ element, updateElement, deleteElement, duplicateElement, bringToFront, sendToBack, groupElements, ungroupElements, selectedCount, isGroupSelected }: PropertiesPanelProps) {
    if (!element) return null;

    const isMultiple = selectedCount > 1;

    return (
        <div className="fixed bottom-20 md:bottom-auto md:top-24 left-0 md:left-4 right-0 md:right-auto w-full md:w-72 bg-black/80 backdrop-blur-md border-t md:border border-white/10 shadow-2xl rounded-t-xl md:rounded-xl p-3 md:p-4 z-40 md:z-50 animate-slide-in-left overflow-y-auto max-h-[60vh] md:max-h-[80vh]">
            <div className="flex items-center justify-between mb-3 md:mb-4 border-b border-white/10 pb-2">
                <h3 className="text-xs md:text-sm font-semibold text-white flex items-center gap-2">
                    <Layers className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    {selectedCount > 0 ? (isMultiple ? `${selectedCount} Selected` : 'Properties') : 'Defaults'}
                </h3>
                <div className="flex gap-1">
                    {(isMultiple || isGroupSelected) && (
                        <>
                            {isMultiple && (
                                <Button variant="ghost" size="icon" className="h-5 w-5 md:h-6 md:w-6 text-white/70 hover:text-white" onClick={groupElements} title="Group (Ctrl+G)">
                                    <Group className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                </Button>
                            )}

                            {isGroupSelected && (
                                <Button variant="ghost" size="icon" className="h-5 w-5 md:h-6 md:w-6 text-white/70 hover:text-white" onClick={ungroupElements} title="Ungroup (Ctrl+Shift+G)">
                                    <Ungroup className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                </Button>
                            )}
                        </>
                    )}

                    {selectedCount > 0 && (
                        <>
                            <Button variant="ghost" size="icon" className="h-5 w-5 md:h-6 md:w-6 text-white/70 hover:text-white" onClick={() => duplicateElement(element?.id || 'mult')} title="Duplicate">
                                <Copy className="h-2.5 w-2.5 md:h-3 md:w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-5 w-5 md:h-6 md:w-6 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => deleteElement(element?.id || 'mult')} title="Delete">
                                <Trash2 className="h-2.5 w-2.5 md:h-3 md:w-3" />
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {element && (
                <div className="space-y-4 md:space-y-6">
                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                        <div className="space-y-1.5 md:space-y-2">
                            <Label className="text-[10px] md:text-xs text-white/60">Stroke</Label>
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <input
                                    type="color"
                                    value={element.stroke}
                                    onChange={(e) => updateElement(element.id, { stroke: e.target.value })}
                                    className="w-6 h-6 md:w-8 md:h-8 rounded border-0 p-0 cursor-pointer bg-transparent"
                                />
                                <span className="text-[9px] md:text-xs font-mono text-white/50">{element.stroke}</span>
                            </div>
                        </div>

                        <div className="space-y-1.5 md:space-y-2">
                            <Label className="text-[10px] md:text-xs text-white/60">Fill</Label>
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <input
                                    type="color"
                                    value={element.fill || "#000000"}
                                    onChange={(e) => updateElement(element.id, { fill: e.target.value })}
                                    className="w-6 h-6 md:w-8 md:h-8 rounded border-0 p-0 cursor-pointer bg-transparent"
                                />
                                <span className="text-[9px] md:text-xs font-mono text-white/50">{element.fill || "None"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Styles */}
                    <div className="space-y-2 md:space-y-3">
                        <Label className="text-[10px] md:text-xs text-white/60">Stroke Style</Label>
                        <div className="flex gap-1 bg-white/5 p-0.5 md:p-1 rounded-lg">
                            {strokeStyles.map(style => (
                                <button
                                    key={style.value}
                                    onClick={() => updateElement(element.id, { strokeStyle: style.value })}
                                    className={`flex-1 text-[9px] md:text-[10px] py-1 md:py-1.5 rounded-md transition-all ${element.strokeStyle === style.value
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                        <Label className="text-[10px] md:text-xs text-white/60">Fill Style</Label>
                        <div className="grid grid-cols-2 gap-1 bg-white/5 p-0.5 md:p-1 rounded-lg">
                            {fillStyles.map(style => (
                                <button
                                    key={style.value}
                                    onClick={() => updateElement(element.id, { fillStyle: style.value })}
                                    className={`text-[9px] md:text-[10px] py-1 md:py-1.5 rounded-md transition-all ${element.fillStyle === style.value
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-3 md:space-y-4">
                        <div className="space-y-1.5 md:space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-[10px] md:text-xs text-white/60">Stroke Width</Label>
                                <span className="text-[9px] md:text-xs text-white/40">{element.strokeWidth}px</span>
                            </div>
                            <Slider
                                min={1}
                                max={20}
                                step={1}
                                value={[element.strokeWidth]}
                                onValueChange={(val) => updateElement(element.id, { strokeWidth: val[0] })}
                                className="[&_.relative]:bg-white/20 [&_.absolute]:bg-primary"
                            />
                        </div>

                        <div className="space-y-1.5 md:space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-[10px] md:text-xs text-white/60">Roughness</Label>
                                <span className="text-[9px] md:text-xs text-white/40">{element.roughness}</span>
                            </div>
                            <Slider
                                min={0}
                                max={5}
                                step={0.1}
                                value={[element.roughness]}
                                onValueChange={(val) => updateElement(element.id, { roughness: val[0] })}
                                className="[&_.relative]:bg-white/20 [&_.absolute]:bg-primary"
                            />
                        </div>

                        <div className="space-y-1.5 md:space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-[10px] md:text-xs text-white/60">Opacity</Label>
                                <span className="text-[9px] md:text-xs text-white/40">{element.opacity}%</span>
                            </div>
                            <Slider
                                min={10}
                                max={100}
                                step={5}
                                value={[element.opacity]}
                                onValueChange={(val) => updateElement(element.id, { opacity: val[0] })}
                                className="[&_.relative]:bg-white/20 [&_.absolute]:bg-primary"
                            />
                        </div>
                    </div>

                    {/* Layer Controls */}
                    {selectedCount > 0 && (
                        <div className="pt-2 border-t border-white/10 flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 text-[10px] md:text-xs bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-1 md:gap-2 h-7 md:h-8" onClick={() => bringToFront(element.id)}>
                                <BringToFront className="w-2.5 h-2.5 md:w-3 md:h-3" /> Front
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 text-[10px] md:text-xs bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-1 md:gap-2 h-7 md:h-8" onClick={() => sendToBack(element.id)}>
                                <SendToBack className="w-2.5 h-2.5 md:w-3 md:h-3" /> Back
                            </Button>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
