"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { 
  BrainCircuit, 
  Code, 
  MousePointer, 
  Clock, 
  Shuffle,
  Zap,
  CheckCircle,
  LayoutDashboard,
  ChevronLeftIcon,
  PlayIcon,
  CheckIcon,
  UploadIcon
} from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { TaskMenuBtn } from "@/app/workflow/_components/TaskMenu";
import { TaskType } from "@/types/task";
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AppNode } from "@/types/appNode";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import NodeComponent from "@/app/workflow/_components/nodes/NodeComponent";
import DeletableEdge from "@/app/workflow/_components/edges/DeletableEdge";
import { WorkflowStatus } from "@/types/workflow";
import { FlowValidationContextProvider } from "../context/FlowValidationContext";
import { Separator } from "../ui/separator";
import Logo from "../Logo";
import { ModeToggle } from "../ThemeModeToggle";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1}

export default function FeatureSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const reactFlowId = useRef(`visual-editor-flow-${Math.random().toString(36).substring(2, 9)}`);
  
  // Create a wrapper component to use ReactFlow hooks inside Provider context
  function FlowContent() {
        
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();
    
    // Create a more detailed initial workflow with a properly positioned launch browser node
    const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
      nodes: [],
      edges: [],
    };
    
    // Create a launch browser node with proper position and data
    const launchBrowserNode = CreateFlowNode(
      TaskType.LAUNCH_BROWSER, 
      { x: 100, y: 100 }
    );
    
    // Set website URL input for the node to make it more realistic
    if (launchBrowserNode.data && launchBrowserNode.data.inputs) {
      launchBrowserNode.data.inputs["Website Url"] = "https://example.com";
    }
    
    initialFlow.nodes.push(launchBrowserNode);
    
    // Create a Navigate URL node connected to the browser node
    const navigateUrlNode = CreateFlowNode(
      TaskType.NAVIGATE_URL,
      { x: 900, y: 100 }
    );
    
    if (navigateUrlNode.data && navigateUrlNode.data.inputs) {
      navigateUrlNode.data.inputs["URL"] = "https://example.com/products";
    }
    
    initialFlow.nodes.push(navigateUrlNode);
    
    // Create an edge connecting the launch browser to navigate URL
    initialFlow.edges.push({
      id: `${launchBrowserNode.id}-${navigateUrlNode.id}`,
      source: launchBrowserNode.id,
      target: navigateUrlNode.id,
      sourceHandle: "Web page",
      targetHandle: "Web page",
      animated: true
    });
    
    // Create a static workflow definition
    const [workflow, setWorkflow] = useState({
      id: 'clwsy8v0o0000qf6z74o3eoyf',
      userId: '1',
      name: 'Web Scraping Demo',
      description: 'A sample workflow showing how to scrape product data',
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      executionPlan: null,
      creditsCost: 7, // 5 for launch + 2 for navigate
      cron: null,
      lastRunAt: null,
      lastRunId: null,
      lastRunStatus: null,
      nextRunAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      executions: []
    });

    useEffect(() => {
      try {
        const flow = JSON.parse(workflow.definition);
        if(!flow) {
          return;
        }
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        if(!flow.viewport) return;
        const { x = 0, y =  0, zoom = 10 } = flow.viewport;
        setViewport({ x, y, zoom });
      } catch (error) {
    
      }
    }, [workflow.definition, setEdges, setNodes, setViewport]);
    
    const onDragOver = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);
    
    const onDrop = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      const taskType = event.dataTransfer.getData("application/reactflow");
      if(typeof taskType === undefined || !taskType) {
        return;
      }
      const postion = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = CreateFlowNode(taskType as TaskType, postion);
      setNodes((nds) => nds.concat(newNode));
    }, [screenToFlowPosition, setNodes]);
    
    const onConnect = useCallback((connection: Connection) => {
      setEdges((eds) => addEdge({...connection, animated: true}, eds));
      if(!connection.targetHandle) return;
      const node = nodes.find((node) => node.id === connection.target);
      if(!node) return;
      const nodeInputs = node.data.inputs;
      delete nodeInputs[connection.targetHandle];
      updateNodeData(node.id, {
        inputs: nodeInputs,
      });
    }, [nodes, setEdges, updateNodeData]);
    
    const isValidConnection = useCallback((connection: Edge | Connection) => {
      if(connection.source === connection.target) return false;
      const source = nodes.find((node) => node.id === connection.source);
      const target = nodes.find((node) => node.id === connection.target);
      if(!source || !target){
        console.log('Invalid Connection: source or target not found');
        return false;
      }
      const sourceTask = TaskRegistry[source.data.type];
      const targetTask = TaskRegistry[target.data.type];
    
      const output = sourceTask.outputs.find((output) => output.name === connection.sourceHandle);
      const input = targetTask.inputs.find((input) => input.name === connection.targetHandle);
      if(input?.type !== output?.type) {
        console.error('Invalid Connection: input type and output type do not match');
        return false;
      }
      const hasCycle = (node: AppNode, visited = new Set()) => {
        if(visited.has(node.id)) return true;
        visited.add(node.id);
    
        for(const outgoer of getOutgoers(node, nodes, edges)) {
          if(outgoer.id === connection.source) return true;
          if(hasCycle(outgoer, visited)) return true;
        }
      };
    
      const detectedCycle = hasCycle(target);
      return !detectedCycle;
    }, [edges, nodes]);
    
    return (
      <div className='relative h-full w-full visual-editor-flow-wrapper'>
        <ReactFlow
          id={reactFlowId.current}
          className="visual-editor-reactflow"
          nodes={nodes}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          snapToGrid
          snapGrid={snapGrid}
          fitViewOptions={fitViewOptions}
          fitView
          onDragOver={onDragOver}
          onDrop={onDrop}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
        >
          <Controls position='top-left' fitViewOptions={fitViewOptions}/>
          <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
        </ReactFlow>
      </div>
    );
  }
  return (
    <section 
      ref={sectionRef}
      id="visual-editor"
      className="py-24 md:py-32 bg-gradient-to-b from-black to-zinc-900 relative overflow-hidden"
    >
      {/* Enhanced background effect with multiple layers */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(64,78,237,0.15)_0%,_rgba(0,0,0,0)_70%)]"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      />
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,_rgba(20,20,30,0.4)_100%)]"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >          <motion.span 
            className="block text-primary font-medium mb-4 uppercase tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            VISUAL WORKFLOW EDITOR
          </motion.span>
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Create Workflows Without Code
          </motion.h2>
          <motion.p 
            className="text-xl text-white/80 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our intuitive drag-and-drop editor lets you build powerful web scraping workflows visually. 
            Connect nodes, define actions, and extract structured data from any website—all without 
            writing a single line of code.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <BrainCircuit className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-white/90">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <MousePointer className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white/90">Drag & Drop</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-white/90">Fast Execution</span>
            </div>
          </motion.div>
        </motion.div>        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-7xl mx-auto mb-12"
        >
          <div className="w-full rounded-xl border overflow-hidden bg-background shadow-xl flex flex-col workflow-animation-container relative" 
               style={{ height: "740px" }}>            {/* Removed performance indicator overlay (moved to footer) */}
            <div className='flex flex-col w-full h-full'>
              {/* Top Navigation Bar */}
              <FlowValidationContextProvider>
                <ReactFlowProvider>
                  <div className='flex flex-col h-full w-full overflow-hidden'>
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
                      <Tabs value={"editor"} className='w-[300px]'>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger
                            value="editor"
                            className={cn("w-full", "data-[state=active]")}
                            onClick={(e) => e.preventDefault()}
                            style={{ pointerEvents: 'none' }}
                          >
                            Editor
                          </TabsTrigger>
                          <TabsTrigger
                            value="runs"
                            className={cn("w-full", "data-[state=active]")}
                            onClick={(e) => e.preventDefault()}
                            style={{ pointerEvents: 'none' }}
                          >
                            Runs
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <div className='flex gap-1 flex-1 justify-end'>
                        <Button variant={"outline"} className='flex items-center gap-2'>
                          <PlayIcon size={16}  className='stroke-orange-400'/>
                          Execute
                        </Button>
                        <Button
                          variant={"outline"} 
                          className='flex items-center gap-2'>
                          <CheckIcon size={16} className='stroke-green-400'/>
                          Save
                        </Button>
                        <Button variant={"outline"} className='flex items-center gap-2'>
                          <UploadIcon size={16}  className='stroke-green-400'/>
                          Publish
                        </Button>
                      </div>
                    </header>
                    <section className='flex h-full overflow-auto'>
                      <aside className='w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
                        <Accordion type="multiple" className='w-full' defaultValue={["extraction", "interactions", "timing", "results", "storage"]}>
                          <AccordionItem value='interactions'>
                            <AccordionTrigger className='font-bold'>
                              User interactions
                            </AccordionTrigger>
                            <AccordionContent className='flex flex-col gap-1'>
                              <TaskMenuBtn taskType={TaskType.NAVIGATE_URL} />
                              <TaskMenuBtn taskType={TaskType.FILL_INPUT} />
                              <TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
                              <TaskMenuBtn taskType={TaskType.SCROLL_TO_ELEMENT} />
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value='extraction'>
                            <AccordionTrigger className='font-bold'>
                              Data extraction
                            </AccordionTrigger>
                            <AccordionContent className='flex flex-col gap-1'>
                              <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
                              <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
                              <TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value='storage'>
                            <AccordionTrigger className='font-bold'>
                              Data storage
                            </AccordionTrigger>
                            <AccordionContent className='flex flex-col gap-1'>
                              <TaskMenuBtn taskType={TaskType.READ_PROPERTY_FROM_JSON} />
                              <TaskMenuBtn taskType={TaskType.ADD_PROPERTY_TO_JSON} />
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value='timing'>
                            <AccordionTrigger className='font-bold'>
                              Timing controls
                            </AccordionTrigger>
                            <AccordionContent className='flex flex-col gap-1'>
                              <TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value='results'>
                            <AccordionTrigger className='font-bold'>
                              Results delivery
                            </AccordionTrigger>
                            <AccordionContent className='flex flex-col gap-1'>
                              <TaskMenuBtn taskType={TaskType.DELIVER_VIA_WEBHOOK} />
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </aside>

                      <div className="flex-1 h-full relative">
                        {/* Live Preview indicator on the right side */}
                        <div className="absolute top-4 right-4 z-20">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/40 backdrop-blur-md border border-white/10">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-medium text-white/90">Live Preview</span>
                          </div>
                        </div>
                        <FlowContent />
                      </div>
                    </section>
                  </div>
                </ReactFlowProvider>
              </FlowValidationContextProvider>              <Separator />              <footer className='flex items-center justify-between p-2'>
                <Logo iconSize={16} fontSize="text-xl" href="/" />
              </footer>
            </div>
          </div>
        </motion.div>
        
        {/* Feature highlights */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <MousePointer className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Intuitive Interface</h3>
            <p className="text-white/70">Drag, drop, and connect nodes to create powerful workflows without any coding knowledge.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-blue-400/20 flex items-center justify-center mb-4">
              <BrainCircuit className="h-7 w-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Extraction</h3>
            <p className="text-white/70">Use built-in AI to identify and extract structured data from even the most complex websites.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-green-400/20 flex items-center justify-center mb-4">
              <CheckCircle className="h-7 w-7 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Instant Results</h3>
            <p className="text-white/70">Preview and validate your data in real-time before exporting to JSON, CSV, or your database.</p>
          </div>
        </motion.div>
          {/* Removed Call to action button */}
      </div>
    </section>
  );
}