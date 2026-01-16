import { MousePointer, Square, Circle, Minus, Pencil, Type, Diamond, Move, Undo, Redo, Download, Trash, Eraser, Sparkles, Image as ImageIcon } from "lucide-react";
import { ElementType } from "@/lib/canvas-utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface ToolbarProps {
    currentTool: ElementType;
    setTool: (tool: ElementType) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onExport: () => void;
    onClear: () => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const tools: { value: ElementType; icon: any; label: string; shortcut: string }[] = [
    { value: "selection", icon: MousePointer, label: "Selection", shortcut: "V" },
    { value: "rectangle", icon: Square, label: "Rectangle", shortcut: "R" },
    { value: "circle", icon: Circle, label: "Circle", shortcut: "C" },
    { value: "diamond", icon: Diamond, label: "Diamond", shortcut: "D" },
    { value: "line", icon: Minus, label: "Line", shortcut: "L" },
    { value: "pencil", icon: Pencil, label: "Pencil", shortcut: "P" },
    { value: "text", icon: Type, label: "Text", shortcut: "T" },
    { value: "eraser", icon: Eraser, label: "Eraser", shortcut: "E" },
    { value: "laser", icon: Sparkles, label: "Laser Pointer", shortcut: "Z" },
    { value: "image", icon: ImageIcon, label: "Insert Image", shortcut: "I" },
];

export function Toolbar({ currentTool, setTool, undo, redo, canUndo, canRedo, onExport, onClear, onImageUpload }: ToolbarProps) {
    return (
        <TooltipProvider>
            <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 bg-popover/80 backdrop-blur-md border border-border shadow-2xl rounded-full p-1.5 md:p-2 flex items-center gap-1 md:gap-2 z-50 animate-fade-in-up max-w-[95vw] overflow-x-auto">
                <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={onImageUpload}
                />
                <div className="flex items-center gap-0.5 md:gap-1 px-1 md:px-2">
                    {tools.map((tool) => (
                        <Tooltip key={tool.value}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        if (tool.value === 'image') {
                                            document.getElementById('image-upload')?.click();
                                        } else {
                                            setTool(tool.value);
                                        }
                                    }}
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full transition-all duration-200 ${currentTool === tool.value
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 scale-110"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                >
                                    <tool.icon className="w-4 h-4 md:w-5 md:h-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-popover border-border text-popover-foreground hidden md:block">
                                <p className="text-xs font-medium">
                                    {tool.label} <span className="text-muted-foreground ml-1">({tool.shortcut})</span>
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>

                <Separator orientation="vertical" className="h-4 md:h-6 bg-border" />

                <div className="flex items-center gap-0.5 md:gap-1 px-1 md:px-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={undo}
                                disabled={!canUndo}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30"
                            >
                                <Undo className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-popover border-border text-popover-foreground hidden md:block">
                            <p className="text-xs">Undo (Ctrl+Z)</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={redo}
                                disabled={!canRedo}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30"
                            >
                                <Redo className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-popover border-border text-popover-foreground hidden md:block">
                            <p className="text-xs">Redo (Ctrl+Y)</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <Separator orientation="vertical" className="h-4 md:h-6 bg-border" />

                <div className="flex items-center gap-0.5 md:gap-1 px-1 md:px-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onExport}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                                <Download className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-popover border-border text-popover-foreground hidden md:block">
                            <p className="text-xs">Export to PNG</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClear}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-popover border-border text-popover-foreground hidden md:block">
                            <p className="text-xs">Clear Canvas</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    );
}
