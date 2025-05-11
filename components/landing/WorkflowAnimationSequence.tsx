"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskParamType, TaskType } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BrainCircuitIcon, 
  CheckIcon, 
  ChevronLeftIcon, 
  ChevronUpIcon, 
  ClockIcon,
  CoinsIcon,
  GlobeIcon, 
  GripVerticalIcon,
  PlayIcon,
  TrashIcon, 
  Edit3Icon,
  CheckCircle2Icon,
  TerminalIcon,
  MousePointerIcon,
  CopyIcon,
  UploadIcon
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import TooltipWrapper from "../TooltipWrapper";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  ReactFlow, 
  Background, 
  BackgroundVariant, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Position,
  Handle,
  Node,
  Edge,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Animation steps
enum AnimationStep {
  INITIAL = 0,
  ADD_LAUNCH_BROWSER = 1,
  ADD_NAVIGATE_URL = 2,
  NAVIGATE_URL_TYPING = 3,
  ADD_FILL_INPUT = 4,
  FILL_INPUT_SELECTOR_TYPING = 5,
  FILL_INPUT_VALUE_TYPING = 6,
  CONNECT_NODES = 7,
  EXECUTE_WORKFLOW = 8,
  SHOW_RESULTS = 9,
}

// Mouse cursor animation properties
interface MousePosition {
  x: number;
  y: number;
}

// Custom node component for our workflow nodes
const FlowNode = ({ data }: { data: any }) => {
  return (
    <div className="rounded-md bg-background border-2 border-separate w-[220px] text-xs gap-1 flex flex-col">
      <div className="flex items-center gap-2 p-1">
        {data.icon}
        <div className="flex justify-between items-center w-full">
          <p className="text-xs font-bold uppercase text-muted-foreground">
            {data.title}
          </p>
          <div className="flex gap-1 items-center">
            {data.isEntryPoint && <Badge variant="outline" className="text-[9px] px-1 py-0 h-auto">Entry</Badge>}
            <Badge className="gap-1 flex items-center text-[9px] px-1 py-0 h-auto">
              <CoinsIcon size={12} />
              {data.credits}
            </Badge>
          </div>
        </div>
      </div>

      {/* Input params */}
      <div className="flex flex-col">
        {data.params.map((param: any) => (
          <div key={param.id} className="p-1 border-t flex items-center relative">
            <Handle
              type="target"
              position={Position.Left}
              id={param.id}
              className={cn(
                "!w-3 !h-3 !-left-[5px] !border-2 !border-background",
                param.type === TaskParamType.BROWSER_INSTANCE ? "!bg-sky-400" : 
                param.type === TaskParamType.STRING ? "!bg-amber-400" : "!bg-rose-400"
              )}
              isConnectable={!param.connected && data.step >= AnimationStep.CONNECT_NODES}
            />
            <div className="flex-1 ml-1">
              <p className="text-[10px] text-muted-foreground mb-0">{param.name}:</p>
              {param.value && !param.connected ? (
                <Input 
                  value={param.value}
                  className={cn(
                    "h-6 text-[10px] min-h-0",
                    param.isTyping && "border-primary animate-pulse"
                  )}
                  readOnly
                />
              ) : !param.value && !param.connected ? (
                <Input 
                  value=""
                  placeholder="Enter value..."
                  className="h-6 text-[10px] min-h-0 text-muted-foreground"
                  readOnly
                />
              ) : (
                <div className="h-6 flex items-center text-[10px] text-muted-foreground italic px-1 border rounded-md bg-muted">
                  Connected
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Output params */}
      <div className="flex flex-col">
        {data.outputs.map((output: any) => (
          <div key={output.id} className="p-1 border-t flex items-center justify-between relative">
            <div className="flex-1"></div>
            <p className="text-[10px] text-muted-foreground">{output.name}</p>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              className={cn(
                "!w-3 !h-3 !-right-[5px] !border-2 !border-background",
                output.type === TaskParamType.BROWSER_INSTANCE ? "!bg-sky-400" : 
                output.type === TaskParamType.STRING ? "!bg-amber-400" : "!bg-rose-400"
              )}
              isConnectable={data.step >= AnimationStep.CONNECT_NODES}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Define node types for ReactFlow
const nodeTypes = {
  flowNode: FlowNode,
};

const WorkflowAnimationSequence = () => {
  const [step, setStep] = useState<AnimationStep>(AnimationStep.INITIAL);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"editor" | "runs">("editor");
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedNodeType, setDraggedNodeType] = useState<TaskType | null>(null);
  const [typingValue, setTypingValue] = useState<string>("");
  const [typingUrl, setTypingUrl] = useState<string>("");
  const [selectorTypingValue, setSelectorTypingValue] = useState<string>("");
  const [valueTypingValue, setValueTypingValue] = useState<string>("");
  const [clickEffects, setClickEffects] = useState<{[key: string]: boolean}>({});
  const [animationCompleted, setAnimationCompleted] = useState<boolean>(false);
  const [pendingConnection, setPendingConnection] = useState<{source: string, sourceHandle: string, target: string, targetHandle: string} | null>(null);
  
  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const mouseAnimationControls = useAnimation();
  const nodeAnimationControls = useAnimation();
  const taskNavigateUrlRef = useRef<HTMLButtonElement>(null);
  const taskFillInputRef = useRef<HTMLButtonElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const executeButtonRef = useRef<HTMLButtonElement>(null);
  const [draggedNodePosition, setDraggedNodePosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Reset animation state for a new cycle
  const resetAnimation = useCallback(() => {
    setStep(AnimationStep.INITIAL);
    setActiveTab("editor");
    setTypingValue("");
    setSelectorTypingValue("");
    setValueTypingValue("");
    setIsDragging(false);
    setDraggedNodeType(null);
    setAnimationCompleted(false);
    
    // Reset ReactFlow nodes and edges
    setNodes([]);
    setEdges([]);
    
    // Clear any hanging timeouts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, [setNodes, setEdges]);
  
  // Handle animation reset when user toggles autoplay
  useEffect(() => {
    if (autoPlay && animationCompleted) {
      resetAnimation();
    }
  }, [autoPlay, animationCompleted, resetAnimation]);
  
  // Animation for typing URL with visual feedback
  const typeUrl = async (text: string, delay: number = 50) => {
    setTypingUrl(""); // Clear any previous text
    
    // First, update the node to show it's being typed in
    updateNodeData('navigate-url', {
      params: [
        { 
          id: 'browser-in', 
          name: 'Web page', 
          type: TaskParamType.BROWSER_INSTANCE,
          connected: false,
          value: ''
        },
        { 
          id: 'url', 
          name: 'URL', 
          type: TaskParamType.STRING,
          value: "",
          isTyping: true
        }
      ]
    });
    
    let typed = "";
    for (let i = 0; i < text.length; i++) {
      typed += text[i];
      setTypingUrl(typed);
      
      // Update the node with each character to show real-time typing
      updateNodeData('navigate-url', {
        params: [
          { 
            id: 'browser-in', 
            name: 'Web page', 
            type: TaskParamType.BROWSER_INSTANCE,
            connected: false,
            value: ''
          },
          { 
            id: 'url', 
            name: 'URL', 
            type: TaskParamType.STRING,
            value: typed,
            isTyping: true
          }
        ]
      });
      
      // Variable delay to make typing feel more natural
      const charDelay = Math.random() * 30 + delay; 
      await new Promise(resolve => setTimeout(resolve, charDelay));
    }
    
    // After typing is done, keep isTyping true for a moment to show the completion effect
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Then set isTyping to false to stop animation
    updateNodeData('navigate-url', {
      params: [
        { 
          id: 'browser-in', 
          name: 'Web page', 
          type: TaskParamType.BROWSER_INSTANCE,
          connected: false,
          value: ''
        },
        { 
          id: 'url', 
          name: 'URL', 
          type: TaskParamType.STRING,
          value: typed,
          isTyping: false
        }
      ]
    });
    
    return typed;
  };

  // Animation for typing effect - improved to show gradual typing with visual feedback
  const typeText = async (text: string, delay: number = 50) => {
    setTypingValue(""); // Clear any previous text
    
    // First, update the node to show it's being typed in
    if (step === AnimationStep.NAVIGATE_URL_TYPING) {
      updateNodeData('navigate-url', {
        params: [
          { 
            id: 'browser-in', 
            name: 'Web page', 
            type: TaskParamType.BROWSER_INSTANCE,
            connected: false,
            value: ''
          },
          { 
            id: 'url', 
            name: 'URL', 
            type: TaskParamType.STRING,
            value: "",
            isTyping: true
          }
        ]
      });
    }
    
    let typed = "";
    for (let i = 0; i < text.length; i++) {
      typed += text[i];
      setTypingValue(typed);
      
      // Update the node with each character to show real-time typing
      if (step === AnimationStep.NAVIGATE_URL_TYPING) {
        updateNodeData('navigate-url', {
          params: [
            { 
              id: 'browser-in', 
              name: 'Web page', 
              type: TaskParamType.BROWSER_INSTANCE,
              connected: false,
              value: ''
            },
            { 
              id: 'url', 
              name: 'URL', 
              type: TaskParamType.STRING,
              value: typed,
              isTyping: true
            }
          ]
        });
      }
      
      // Variable delay to make typing feel more natural
      const charDelay = Math.random() * 30 + delay; 
      await new Promise(resolve => setTimeout(resolve, charDelay));
    }
    
    // After typing is done, keep isTyping true for a moment to show the completion effect
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Then set isTyping to false to stop animation
    if (step === AnimationStep.NAVIGATE_URL_TYPING) {
      updateNodeData('navigate-url', {
        params: [
          { 
            id: 'browser-in', 
            name: 'Web page', 
            type: TaskParamType.BROWSER_INSTANCE,
            connected: false,
            value: ''
          },
          { 
            id: 'url', 
            name: 'URL', 
            type: TaskParamType.STRING,
            value: typed,
            isTyping: false
          }
        ]
      });
    }
    
    return typed;
  };

  // Animation for typing selector and value inputs separately
  const typeSelector = async (text: string, delay: number = 40) => {
    setSelectorTypingValue(""); // Clear any previous text
    
    // Set isTyping to true for selector
    updateNodeData('fill-input', {
      params: [
        { 
          id: 'browser-in', 
          name: 'Web page', 
          type: TaskParamType.BROWSER_INSTANCE,
          connected: false,
          value: ''
        },
        { 
          id: 'selector', 
          name: 'Selector', 
          type: TaskParamType.STRING,
          value: "",
          isTyping: true
        },
        { 
          id: 'value', 
          name: 'Value',
          type: TaskParamType.STRING,
          value: '',
          isTyping: false
        }
      ]
    });
    
    let typed = "";
    for (let i = 0; i < text.length; i++) {
      typed += text[i];
      setSelectorTypingValue(typed);
      
      // Update the node with each character
      updateNodeData('fill-input', {
        params: [
          { 
            id: 'browser-in', 
            name: 'Web page', 
            type: TaskParamType.BROWSER_INSTANCE,
            connected: false,
            value: ''
          },
          { 
            id: 'selector', 
            name: 'Selector', 
            type: TaskParamType.STRING,
            value: typed,
            isTyping: true
          },
          { 
            id: 'value', 
            name: 'Value',
            type: TaskParamType.STRING,
            value: '',
            isTyping: false
          }
        ]
      });
      
      // Variable delay to make typing feel more natural
      const charDelay = Math.random() * 30 + delay; 
      await new Promise(resolve => setTimeout(resolve, charDelay));
    }
    
    // After typing is done, keep isTyping true for a moment
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Turn off isTyping
    updateNodeData('fill-input', {
      params: [
        { 
          id: 'browser-in', 
          name: 'Web page', 
          type: TaskParamType.BROWSER_INSTANCE,
          connected: false,
          value: ''
        },
        { 
          id: 'selector', 
          name: 'Selector', 
          type: TaskParamType.STRING,
          value: typed,
          isTyping: false
        },
        { 
          id: 'value', 
          name: 'Value',
          type: TaskParamType.STRING,
          value: '',
          isTyping: false
        }
      ]
    });
    
    return typed;
  };
  
  // Separate typing function for value input
  const typeValue = async (text: string, delay: number = 60) => {
    setValueTypingValue(""); // Clear any previous text
    
    // Set isTyping to true for value field
    updateNodeData('fill-input', {
      params: [
        { 
          id: 'browser-in', 
          name: 'Web page', 
          type: TaskParamType.BROWSER_INSTANCE,
          connected: false,
          value: ''
        },
        { 
          id: 'selector', 
          name: 'Selector', 
          type: TaskParamType.STRING,
          value: selectorTypingValue || "#search-input",
          isTyping: false
        },
        { 
          id: 'value', 
          name: 'Value',
          type: TaskParamType.STRING,
          value: '',
          isTyping: true
        }
      ]
    });
    
    let typed = "";
    for (let i = 0; i < text.length; i++) {
      typed += text[i];
      setValueTypingValue(typed);
      
      // Update the node with each character
      updateNodeData('fill-input', {
        params: [
          { 
            id: 'browser-in', 
            name: 'Web page', 
            type: TaskParamType.BROWSER_INSTANCE,
            connected: false,
            value: ''
          },
          { 
            id: 'selector', 
            name: 'Selector', 
            type: TaskParamType.STRING,
            value: selectorTypingValue || "#search-input",
            isTyping: false
          },
          { 
            id: 'value', 
            name: 'Value',
            type: TaskParamType.STRING,
            value: typed,
            isTyping: true
          }
        ]
      });
      
      // Variable delay to make typing feel more natural
      const charDelay = Math.random() * 30 + delay; 
      await new Promise(resolve => setTimeout(resolve, charDelay));
    }
    
    // After typing is done, keep isTyping true for a moment
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Turn off isTyping
    updateNodeData('fill-input', {
      params: [
        { 
          id: 'browser-in', 
          name: 'Web page', 
          type: TaskParamType.BROWSER_INSTANCE,
          connected: false,
          value: ''
        },
        { 
          id: 'selector', 
          name: 'Selector', 
          type: TaskParamType.STRING,
          value: selectorTypingValue || "#search-input",
          isTyping: false
        },
        { 
          id: 'value', 
          name: 'Value',
          type: TaskParamType.STRING,
          value: typed,
          isTyping: false
        }
      ]
    });
    
    return typed;
  };
  
  // Animation for mouse movement with precise coordinate handling
  const animateMouseTo = async (target: { x: number, y: number }, duration: number = 0.5) => {
    // Get component boundaries
    const componentRect = document.querySelector('.workflow-animation-container')?.getBoundingClientRect();
    
    if (!componentRect) {
      return; // Don't move if we can't determine boundaries
    }
    
    // For dragging node preview positioning
    if (isDragging) {
      setDraggedNodePosition({
        x: target.x,
        y: target.y
      });
    }
    
    // Use direct coordinates for more accurate positioning
    await mouseAnimationControls.start({
      x: target.x,
      y: target.y,
      transition: { duration, ease: "easeInOut" }
    });
    
    setMousePosition({
      x: target.x,
      y: target.y
    });
  };
  
  // Create a new node in ReactFlow
  const createNode = (type: TaskType, position: { x: number, y: number }, id: string) => {
    const newNode: Node = {
      id,
      type: 'flowNode',
      position,
      data: {
        title: type === TaskType.LAUNCH_BROWSER ? 'Launch browser' : 
               type === TaskType.NAVIGATE_URL ? 'Navigate URL' : 
               'Fill input',
        icon: type === TaskType.LAUNCH_BROWSER || type === TaskType.NAVIGATE_URL ? 
              <GlobeIcon size={16} className="stroke-blue-400" /> : 
              <Edit3Icon size={16} className="stroke-orange-400" />,
        credits: 1,
        isEntryPoint: type === TaskType.LAUNCH_BROWSER,
        step,
        params: type === TaskType.LAUNCH_BROWSER ? [] : 
                type === TaskType.NAVIGATE_URL ? [
                  { 
                    id: 'browser-in', 
                    name: 'Web page', 
                    type: TaskParamType.BROWSER_INSTANCE,
                    connected: false,
                    value: ''
                  },
                  { 
                    id: 'url', 
                    name: 'URL', 
                    type: TaskParamType.STRING,
                    value: typingUrl || '',
                    isTyping: type === TaskType.NAVIGATE_URL && step === AnimationStep.ADD_NAVIGATE_URL
                  }
                ] : [
                  { 
                    id: 'browser-in', 
                    name: 'Web page', 
                    type: TaskParamType.BROWSER_INSTANCE,
                    connected: false,
                    value: ''
                  },
                  { 
                    id: 'selector', 
                    name: 'Selector', 
                    type: TaskParamType.STRING,
                    value: selectorTypingValue || '',
                    isTyping: type === TaskType.FILL_INPUT && step === AnimationStep.FILL_INPUT_SELECTOR_TYPING
                  },
                  { 
                    id: 'value', 
                    name: 'Value',
                    type: TaskParamType.STRING,
                    value: valueTypingValue || '',
                    isTyping: type === TaskType.FILL_INPUT && step === AnimationStep.FILL_INPUT_VALUE_TYPING
                  }
                ],
        outputs: [{ 
          id: 'browser-out', 
          name: type === TaskType.LAUNCH_BROWSER ? 'Browser' : 'Web page', 
          type: TaskParamType.BROWSER_INSTANCE
        }]
      }
    };
    
    return newNode;
  };
  
  // Update node data programmatically
  const updateNodeData = useCallback((nodeId: string, newData: Partial<any>) => {
    setNodes(nds => nds.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...newData
          }
        };
      }
      return node;
    }));
  }, [setNodes]);

  // Add visual click effect to an element
  const addClickEffect = async (elementId: string) => {
    setClickEffects(prev => ({ ...prev, [elementId]: true }));
    await new Promise(resolve => setTimeout(resolve, 300));
    setClickEffects(prev => ({ ...prev, [elementId]: false }));
  };
  
  // Safe setTimeout that creates a reference we can clean up
  const safeSetTimeout = (callback: () => void, delay: number) => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    animationTimeoutRef.current = setTimeout(() => {
      callback();
      animationTimeoutRef.current = null;
    }, delay);
  };
  
  // Handle the animation sequence
  useEffect(() => {
    if (!autoPlay) return;
    
    const runAnimationStep = async () => {
      try {
        switch (step) {
          case AnimationStep.INITIAL:
            // Reset initial state
            setActiveTab("editor");
            setTypingValue("");
            setSelectorTypingValue("");
            setValueTypingValue("");
            setIsDragging(false);
            setDraggedNodeType(null);
            setNodes([]);
            setEdges([]);
            
            // Add Launch Browser node - positioning in far upper-left corner
            setNodes([
              createNode(TaskType.LAUNCH_BROWSER, { x: 25, y: 25 }, 'launch-browser')
            ]);

            if (taskNavigateUrlRef.current && editorWrapperRef.current) {
              const rect = taskNavigateUrlRef.current.getBoundingClientRect();
              await animateMouseTo({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
              }, 0.5);
            }
            
            safeSetTimeout(() => {
              setStep(AnimationStep.ADD_NAVIGATE_URL);
            }, 1000);
            break;
            
          case AnimationStep.ADD_NAVIGATE_URL:
            // Position mouse over task button
            if (taskNavigateUrlRef.current && editorWrapperRef.current) {
              await animateMouseTo({
                x: 65,
                y: 140
              }, 0.7);

              const buttonCenter = {
                x: 475,
                y: 250
              };

              setIsDragging(true);
              setDraggedNodeType(TaskType.NAVIGATE_URL);

              await animateMouseTo(buttonCenter, 0.6);
              await new Promise(resolve => setTimeout(resolve, 200));
              // Move to drop location with a natural arc path
              const navigateUrlDropPos = { x: 100, y: 125 };
              // Add intermediate points for more natural mouse movement
              
              setTypingUrl("");
              // Create the Navigate URL node in ReactFlow
              setNodes(nodes => [...nodes, createNode(TaskType.NAVIGATE_URL, navigateUrlDropPos, 'navigate-url')]);
              setIsDragging(false);
              setDraggedNodeType(null);

              // Move cursor to URL input field
              await new Promise(resolve => setTimeout(resolve, 300));
              await animateMouseTo({
                x: 475,
                y: 350
              }, 0.5);
              await addClickEffect("execute");
              // Type URL text with natural speed
              await typeUrl("https://example.com", 100);
              
              // Update the node with the typed URL
              updateNodeData('navigate-url', {
                params: [
                  { 
                    id: 'browser-in', 
                    name: 'Web page', 
                    type: TaskParamType.BROWSER_INSTANCE,
                    connected: false,
                    value: ''
                  },
                  { 
                    id: 'url', 
                    name: 'URL', 
                    type: TaskParamType.STRING,
                    value: "https://example.com",
                    isTyping: false
                  }
                ]
              });

            }
            safeSetTimeout(() => {
              setStep(AnimationStep.ADD_FILL_INPUT);
            }, 1000);
            break;

            
          case AnimationStep.ADD_FILL_INPUT:
            // Move cursor to the Fill Input task button
            if (taskFillInputRef.current) {
              await animateMouseTo({
                x: 65,
                y: 175
              }, 0.6);

              const buttonCenter = {
                x: 850,
                y: 425
              };

              setIsDragging(true);
              setDraggedNodeType(TaskType.FILL_INPUT);

              setSelectorTypingValue("");
              setValueTypingValue("");
              await animateMouseTo(buttonCenter, 0.8);
              await new Promise(resolve => setTimeout(resolve, 200));

              const fillInputDropPos = { x: 360, y: 275 };
              setNodes(nodes => [...nodes, createNode(TaskType.FILL_INPUT, fillInputDropPos, 'fill-input')]);
              
              setIsDragging(false);
              setDraggedNodeType(null);

              await new Promise(resolve => setTimeout(resolve, 300));
              await animateMouseTo({
                x: 850,
                y: 540
              }, 0.5);
              await addClickEffect("execute");

              await typeSelector("#search-input", 40);
              
              // Update the node with selector value
              updateNodeData('fill-input', {
                params: [
                  { 
                    id: 'browser-in', 
                    name: 'Web page', 
                    type: TaskParamType.BROWSER_INSTANCE,
                    connected: false,
                    value: ''
                  },
                  { 
                    id: 'selector', 
                    name: 'Selector', 
                    type: TaskParamType.STRING,
                    value: "#search-input",
                    isTyping: false
                  },
                  { 
                    id: 'value', 
                    name: 'Value',
                    type: TaskParamType.STRING,
                    value: '',
                    isTyping: true
                  }
                ]
              });

              await new Promise(resolve => setTimeout(resolve, 300));
              await animateMouseTo({
                x: 850,
                y: 595
              }, 0.5);
              await addClickEffect("execute");
              await typeValue("search term", 60);
              
              // Update the node with value
              updateNodeData('fill-input', {
                params: [
                  { 
                    id: 'browser-in', 
                    name: 'Web page', 
                    type: TaskParamType.BROWSER_INSTANCE,
                    connected: false,
                    value: ''
                  },
                  { 
                    id: 'selector', 
                    name: 'Selector', 
                    type: TaskParamType.STRING,
                    value: "#search-input",
                    isTyping: false
                  },
                  { 
                    id: 'value', 
                    name: 'Value',
                    type: TaskParamType.STRING,
                    value: "search term",
                    isTyping: false
                  }
                ]
              });
            }
            
            safeSetTimeout(() => {
              setStep(AnimationStep.CONNECT_NODES);
            }, 1000);
            break;
            
          case AnimationStep.CONNECT_NODES:
            // Connect Launch Browser to Navigate URL
            // Update nodes to enable connection interaction
            setNodes(nodes => nodes.map(node => ({
              ...node,
              data: {
                ...node.data,
                step: AnimationStep.CONNECT_NODES
              }
            })));
            
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Move to Launch Browser output handle
            await animateMouseTo({
              x: 525,
              y: 140
            }, 0.9);
            
            // Start dragging connection
            setIsDragging(true);
            
            // Move to Navigate URL input handle
            await animateMouseTo({
              x: 375,
              y: 290
            }, 0.6);
            
            // Complete connection
            setIsDragging(false);
            
            // Add edge in ReactFlow
            setEdges(eds => addEdge({
              id: 'edge-1',
              source: 'launch-browser',
              sourceHandle: 'browser-out',
              target: 'navigate-url',
              targetHandle: 'browser-in',
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#38bdf8'
              },
              style: {
                stroke: '#38bdf8',
                strokeWidth: 2
              }
            }, eds));
            
            // Update Navigate URL node to show connected input
            updateNodeData('navigate-url', {
              params: [
                { 
                  id: 'browser-in', 
                  name: 'Web page', 
                  type: TaskParamType.BROWSER_INSTANCE,
                  connected: true,
                  value: ''
                },
                { 
                  id: 'url', 
                  name: 'URL', 
                  type: TaskParamType.STRING,
                  value: "https://example.com",
                  isTyping: false
                }
              ]
            });
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Connect Navigate URL to Fill Input
            // Move to Navigate URL output handle
            await animateMouseTo({
              x: 625,
              y: 390
            }, 0.4);
            
            // Start dragging connection
            setIsDragging(true);
            
            // Move to Fill Input input handle
            await animateMouseTo({
              x: 700,
              y: 475
            }, 0.6);
            
            // Complete connection
            setIsDragging(false);
            
            // Add edge in ReactFlow
            setEdges(eds => addEdge({
              id: 'edge-2',
              source: 'navigate-url',
              sourceHandle: 'browser-out',
              target: 'fill-input',
              targetHandle: 'browser-in',
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#38bdf8'
              },
              style: {
                stroke: '#38bdf8',
                strokeWidth: 2
              }
            }, eds));
            
            // Update Fill Input node to show connected input
            updateNodeData('fill-input', {
              params: [
                { 
                  id: 'browser-in', 
                  name: 'Web page', 
                  type: TaskParamType.BROWSER_INSTANCE,
                  connected: true,
                  value: ''
                },
                { 
                    id: 'selector', 
                    name: 'Selector', 
                    type: TaskParamType.STRING,
                    value: "#search-input",
                    isTyping: false
                },
                { 
                  id: 'value', 
                  name: 'Value',
                  type: TaskParamType.STRING,
                  value: "search term",
                  isTyping: false
                }
              ]
            });

            safeSetTimeout(() => {
              setStep(AnimationStep.EXECUTE_WORKFLOW);
            }, 800);
            break;
          case AnimationStep.EXECUTE_WORKFLOW:
            // Move mouse to execute button
            if (executeButtonRef.current) {
              const buttonCenter = {
                x: 775,
                y: 25
              };
              
              await animateMouseTo(buttonCenter, 0.4);
              
              // Visual click effect
              await addClickEffect("execute");
              executeButtonRef.current.classList.add("scale-95", "opacity-70");
              await new Promise(resolve => setTimeout(resolve, 300));
              executeButtonRef.current.classList.remove("scale-95", "opacity-70");
              executeButtonRef.current.classList.add("bg-orange-100", "dark:bg-orange-900/30");
              
              // Pause before switching tabs
              await new Promise(resolve => setTimeout(resolve, 800));
              
              // Switch to runs tab
              setActiveTab("runs");
              
              // Move mouse to view results
              await new Promise(resolve => setTimeout(resolve, 500));
              await animateMouseTo({
                x: window.innerWidth / 2,
                y: 200
              }, 0.8);
            }
            
            safeSetTimeout(() => {
              setStep(AnimationStep.SHOW_RESULTS);
            }, 2000);
            break;
            
          case AnimationStep.SHOW_RESULTS:
            // Show completed results
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Reset for loop by removing visual artifacts
            if (executeButtonRef.current) {
              executeButtonRef.current.classList.remove("bg-orange-100", "dark:bg-orange-900/30");
            }
            
            // Mark animation as completed to trigger reset on next cycle
            setAnimationCompleted(true);
            
            safeSetTimeout(() => {
              resetAnimation();
            }, 2000);
            break;
        }
      } catch (error) {
        console.error("Animation error:", error);
        // Recover from errors by resetting
        resetAnimation();
      }
    };
    
    if (!animationCompleted) {
      runAnimationStep();
    }
    
    // Clean up function
    return () => {
      mouseAnimationControls.stop();
      nodeAnimationControls.stop();
      
      // Clear any pending timeouts
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, [step, autoPlay, mouseAnimationControls, nodeAnimationControls, animationCompleted, resetAnimation, setNodes, setEdges, updateNodeData]);

  return (
    <div className="w-full rounded-lg border overflow-hidden bg-background shadow-md flex flex-col workflow-animation-container relative">
      {/* Mouse cursor overlay positioned on top of everything */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
        <motion.div
          className="pointer-events-none"
          animate={mouseAnimationControls}
          initial={{ x: 0, y: 0 }}
        >
          <div className="relative">
            <MousePointerIcon 
              size={24} 
              className={cn(
                "text-black dark:text-white drop-shadow-md", 
                isDragging && "text-blue-500"
              )}
            />
            {/* Show click circle effect */}
            <div className={cn(
              "absolute top-0 left-0 w-6 h-6 rounded-full bg-blue-400 -z-10 transition-all duration-300",
              Object.values(clickEffects).some(v => v) 
                ? "opacity-30 scale-100" 
                : "opacity-0 scale-0"
            )}></div>
          </div>
        </motion.div>
      </div>
      
      {/* Top Navigation Bar */}
      <header className='flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10'>
        <div className='flex gap-1 flex-1'>
            <Button variant={"ghost"} size={"icon"}>
              <ChevronLeftIcon size={20} />
            </Button>
            <div>
              <p className='font-bold text-ellipsis truncate'>Workflow Editor</p>
              <p className='text-xs text-muted-foreground truncate text-ellipsis'>Sample Workflow</p>
            </div>
        </div>
        <div className="w-[300px]">
          <Tabs value={activeTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="editor"
                className={cn("w-full", activeTab === "editor" ? "data-[state=active]" : "")}
                onClick={(e) => e.preventDefault()}
                style={{ pointerEvents: 'none' }}
              >
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="runs"
                className={cn("w-full", activeTab === "runs" ? "data-[state=active]" : "")}
                onClick={(e) => e.preventDefault()}
                style={{ pointerEvents: 'none' }}
              >
                Runs
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className='flex gap-1 flex-1 justify-end'>
            <Button 
              ref={executeButtonRef}
              variant={"outline"} 
              className={cn(
                'flex items-center gap-2 transition-all duration-200',
                clickEffects["execute"] && "scale-95 opacity-70",
                step === AnimationStep.EXECUTE_WORKFLOW && "ring-2 ring-orange-400"
              )}
            >
                <PlayIcon size={16} className='stroke-orange-400'/>
                Execute
            </Button>
            <Button 
              variant={"outline"} 
              className='flex items-center gap-2'
            >
              <CheckIcon size={16} className='stroke-green-400'/>
              Save
            </Button>
            <Button variant={"outline"} className='flex items-center gap-2'>
              <UploadIcon size={16} className='stroke-green-400'/>
              Publish
            </Button>
        </div>
      </header>
      
      <section className='flex h-full overflow-hidden relative' ref={editorWrapperRef}>
        <div className="flex h-[600px] w-full overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "editor" ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="flex w-full h-full"
              >
                {/* Task Menu Sidebar */}
                <aside className='w-[250px] min-w-[250px] max-w-[250px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
                  <Accordion type="multiple" className='w-full' defaultValue={["extraction", "interactions", "timing", "results", "storage"]}>
                    <AccordionItem value='interactions'>
                      <AccordionTrigger className='font-bold'>
                        User interactions
                      </AccordionTrigger>
                      <AccordionContent className='flex flex-col gap-1'>
                        <Button 
                          ref={taskNavigateUrlRef}
                          variant="secondary"
                          className={cn(
                            'flex justify-between items-center gap-2 border w-full text-sm transition-all duration-150',
                            step === AnimationStep.ADD_NAVIGATE_URL && 'ring-2 ring-primary animate-pulse'
                          )}
                        >
                          <div className='flex gap-2 items-center'>
                            <GlobeIcon size={16} className="stroke-blue-400" />
                            Navigate URL
                          </div>
                          <Badge className='gap-2 flex items-center text-xs' variant="outline">
                            <CoinsIcon size={14} />
                            1
                          </Badge>
                        </Button>
                        <Button 
                          ref={taskFillInputRef}
                          variant="secondary"
                          className={cn(
                            'flex justify-between items-center gap-2 border w-full text-sm transition-all duration-150',
                            step === AnimationStep.ADD_FILL_INPUT && 'ring-2 ring-primary animate-pulse'
                          )}
                        >
                          <div className='flex gap-2 items-center'>
                            <Edit3Icon size={16} className="stroke-orange-400" />
                            Fill Input
                          </div>
                          <Badge className='gap-2 flex items-center text-xs' variant="outline">
                            <CoinsIcon size={14} />
                            1
                          </Badge>
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                    {/* Other accordion items */}
                    <AccordionItem value='extraction'>
                      <AccordionTrigger className='font-bold'>
                          Data extraction
                      </AccordionTrigger>
                      <AccordionContent className='flex flex-col gap-1'>
                        <Button variant={"secondary"} className='flex justify-between items-center gap-2 border w-full text-sm'>
                          <div className='flex gap-2 items-center'>
                            <TerminalIcon size={16} className="stroke-purple-400" />
                            Page to HTML
                          </div>
                          <Badge className='gap-2 flex items-center text-xs' variant="outline">
                            <CoinsIcon size={14} />
                            1
                          </Badge>
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </aside>
                
                {/* Flow Editor Canvas with ReactFlow */}
                <div 
                  ref={dropZoneRef}
                  className="flex-1 h-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 w-full h-full z-10">
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      nodeTypes={nodeTypes}
                      fitView={false}
                      defaultViewport={{ x: 0, y: 0, zoom: 1.25 }}
                      preventScrolling={false}
                      nodesDraggable={false}
                      nodesConnectable={false}
                      elementsSelectable={false}
                      zoomOnScroll={false}
                      panOnScroll={false}
                      panOnDrag={false}
                    >
                      <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
                    </ReactFlow>
                  </div>

                  {/* Dragging connection line visualization */}
                  {isDragging && step === AnimationStep.CONNECT_NODES && pendingConnection && (
                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1000 }}>
                      <path
                        d={`M${mousePosition.x - 10},${mousePosition.y} L${mousePosition.x},${mousePosition.y}`}
                        stroke="#38bdf8"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="3,3"
                        className="animate-pulse"
                      />
                    </svg>
                  )}

                  {/* Improved Dragged Node Preview with perfect cursor alignment */}
                  {isDragging && draggedNodeType && step !== AnimationStep.CONNECT_NODES && (
                    <motion.div 
                      className="absolute pointer-events-none z-40 transform-gpu"
                      animate={{
                        x: mousePosition.x - 300,
                        y: mousePosition.y - 75,
                        transition: {
                          type: "tween",
                          duration: 0.05,
                          ease: "linear"
                        }
                      }}
                      initial={{
                        x: mousePosition.x - 300,
                        y: mousePosition.y - 75,
                      }}
                      style={{
                        opacity: 0.95,
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                      }}
                    >
                      <div className="rounded-md bg-background border-2 border-primary/60 border-dashed w-[180px] text-xs gap-1 flex flex-col p-1">
                        <div className="flex items-center gap-2 p-1">
                          {draggedNodeType === TaskType.NAVIGATE_URL ? 
                            <GlobeIcon size={16} className="stroke-blue-400" /> : 
                            <Edit3Icon size={16} className="stroke-orange-400" />
                          }
                          <p className="text-xs font-bold uppercase text-muted-foreground">
                            {draggedNodeType === TaskType.NAVIGATE_URL ? "Navigate URL" : "Fill Input"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="runs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col w-full overflow-auto p-4"
              >
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg">Latest Execution Results</h3>
                    <Badge className={cn(
                      "px-2 py-1",
                      step < AnimationStep.SHOW_RESULTS ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : 
                      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    )}>
                      {step < AnimationStep.SHOW_RESULTS ? "Running" : "Completed"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <ExecutionNode
                      title="Launch browser"
                      icon={<GlobeIcon size={16} className="stroke-blue-400" />}
                      status={step >= AnimationStep.SHOW_RESULTS ? "complete" : "complete"}
                      output={step >= AnimationStep.EXECUTE_WORKFLOW ? "Browser launched successfully" : ""}
                      expanded={step >= AnimationStep.EXECUTE_WORKFLOW}
                    />
                    
                    <ExecutionNode
                      title="Navigate URL"
                      icon={<GlobeIcon size={16} className="stroke-blue-400" />}
                      status={step >= AnimationStep.SHOW_RESULTS ? "complete" : step >= AnimationStep.EXECUTE_WORKFLOW ? "running" : "pending"}
                      output={step >= AnimationStep.SHOW_RESULTS ? "Navigated to https://example.com" : ""}
                      expanded={step >= AnimationStep.SHOW_RESULTS}
                    />
                    
                    <ExecutionNode
                      title="Fill input"
                      icon={<Edit3Icon size={16} className="stroke-orange-400" />}
                      status={step >= AnimationStep.SHOW_RESULTS ? "complete" : "pending"}
                      output={step >= AnimationStep.SHOW_RESULTS ? "Input field filled with 'search term'" : ""}
                      expanded={step >= AnimationStep.SHOW_RESULTS}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      
      <div className="px-3 py-2 text-xs border-t flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs py-1 px-3 rounded-md font-medium flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M12 9V13M12 17H12.01M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Demonstration - similar to actual product
          </div>
        </div>
        <button 
          onClick={() => setAutoPlay(!autoPlay)} 
          className="text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          {autoPlay ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4H8V20H6V4ZM16 4H18V20H16V4Z" fill="currentColor"/>
              </svg>
              Pause Animation
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4L18 12L6 20V4Z" fill="currentColor"/>
              </svg>
              Play Animation
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Execution Result Node for the Runs tab
interface ExecutionNodeProps {
  title: string;
  icon: React.ReactNode;
  status: "pending" | "running" | "complete" | "failed";
  output?: string;
  expanded?: boolean;
}

const ExecutionNode: React.FC<ExecutionNodeProps> = ({
  title,
  icon,
  status,
  output,
  expanded = false
}) => {
  const statusColors = {
    pending: "text-gray-400",
    running: "text-yellow-500 animate-pulse",
    complete: "text-green-500",
    failed: "text-red-500",
  };
  
  const StatusIcon = () => {
    switch (status) {
      case "pending":
        return <ClockIcon className={`h-5 w-5 ${statusColors[status]}`} />;
      case "running":
        return (
          <div className={`h-5 w-5 ${statusColors[status]}`}>
            <span className="animate-spin inline-block h-5 w-5 border-2 border-current rounded-full border-b-transparent" />
          </div>
        );
      case "complete":
        return <CheckCircle2Icon className={`h-5 w-5 ${statusColors[status]}`} />;
      case "failed":
        return <div className={`h-5 w-5 ${statusColors[status]}`}>⨯</div>;
    }
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-muted/30">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-sm">{title}</span>
        </div>
        <StatusIcon />
      </div>
      
      <AnimatePresence>
        {expanded && output && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 border-t bg-card/50"
          >
            <p className="text-xs text-muted-foreground mb-1">Output:</p>
            <div className="p-2 rounded bg-muted text-xs">{output}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkflowAnimationSequence;