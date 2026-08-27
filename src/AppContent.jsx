/**
 * AppContent — Bridge file that re-exports all tab components from legacy App.jsx
 * This allows the new App shell to lazy-load tabs while we migrate them
 */

// Re-export all tab components from the legacy App.jsx
export {
  OverviewTab,
  RAGTypesTab,
  PipelineTab,
  LangChainTab,
  LangGraphTab,
  CompareTab,
  PracticesTab,
  ProgressTab,
  FilteringTab,
  MultiAgentTab,
  VagueQuestionsTab,
  ContextGraphTab,
  ContextEngineeringTab,
  MemoryEngineeringTab,
  ClaudeWorkflowsTab,
  AIGlossaryTab,
  PowerFeaturesTab,
  ResearchFrontiersTab,
  ProductionRAGTab,
  RAGBeyondTab,
  HierarchicalRetrievalTab,
  RedesignWorkTab,
  ArchConceptsTab,
  ClassicalMLTab,
  HallucinationLoopTab,
  FiveAssetsTab,
  AIDataPlatformTab,
  QuestionParsingLoopTab,
  FourPDFsTab,
  HallucBricksTab,
  GenPatternsTab,
  TokenBillTab,
  HighScaleAgentsTab,
  ContextMeasureTab,
  UnhobblingTab,
  ActiveLearningTab,
  CompanyBrainTab,
  AIProductBuilderTab,
  AgentTasksTab,
  PromptMgmtTab,
  AgentDebuggingTab,
  AgentsAsToolsTab,
  NonProgCodingAgentsTab,
  MedallionArchTab,
  AITestDataBottleneckTab,
} from './App.jsx';

// New redesigned tabs (will replace legacy ones progressively)
export { OverviewTab as OverviewTabNew } from './tabs/OverviewTabNew.jsx';

// Also export the separate tab components
export { default as DocumentStructureTab } from './documentStructure/DocumentStructureTab.jsx';
export { default as CliAgentTab } from './cliAgents/CliAgentTab.jsx';
export { default as ThreeLayersTab } from './engineeringLayers/ThreeLayersTab.jsx';
export { default as InterviewPrepTab } from './tabs/InterviewPrepTab.jsx';
export { default as AgenticParsingTab } from './agenticParsing/AgenticParsingTab.jsx';
export { default as ZeroModelRouterTab } from './zeroModelRouter/ZeroModelRouterTab.jsx';
export { default as WorkflowLoopTab } from './workflowLoop/WorkflowLoopTab.jsx';
export { default as ProxyPointerTab } from './proxyPointer/ProxyPointerTab.jsx';
export { default as AgenticRAGTab } from './agenticRAG/AgenticRAGTab.jsx';
export { default as LLMEvalLayerTab } from './llmEvals/LLMEvalLayerTab.jsx';
export { default as KnowledgeBaseTab } from './knowledgeBase/KnowledgeBaseTab.jsx';
export { default as LoopEngineeringTab } from './loopEngineering/LoopEngineeringTab.jsx';
export { default as LLMFinetuningTab } from './llmFinetuning/LLMFinetuningTab.jsx';
export { default as LLMSamplingTab } from './llmSampling/LLMSamplingTab.jsx';
export { default as SelfAttentionTab } from './selfAttention/SelfAttentionTab.jsx';
export { default as VisionLanguageTab } from './visionLanguageModels/VisionLanguageTab.jsx';
export { default as DiffusionTab } from './diffusionModels/DiffusionTab.jsx';
export { default as SpeechVoiceTab } from './speechVoiceAI/SpeechVoiceTab.jsx';
export { default as ModelLandscapeTab } from './modelLandscape/ModelLandscapeTab.jsx';
export { default as PromptFundamentalsTab } from './promptEngineeringFundamentals/PromptFundamentalsTab.jsx';