const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Files to update - add all files that need updating here
const filesToUpdate = [
  'actions/analytics/getPeriods.ts',
  'actions/workflows/runWorkflow.ts',
  'actions/workflows/getWorkflowExecutionWithPhases.ts',
  'actions/workflows/getWorkflowExecutions.ts', 
  'actions/analytics/getStatsCardsValue.ts',
  'actions/analytics/getWorkflowExecutionStats.ts',
  'actions/workflows/deleteWorkflow.ts',
  'actions/workflows/updateWorkflow.ts',
  'actions/workflows/updateWorkflowCron.ts',
  'actions/workflows/publishWorkflow.ts',
  'actions/workflows/unpublishWorkflow.ts',
  'actions/workflows/removeWorkflowSchedule.ts',
  'actions/workflows/getWorkflowsForUser.ts',
  'actions/workflows/getWorkflowPhaseDetails.ts',
  'actions/workflows/duplicateWorkflow.ts',
  'actions/workflows/createWorkflow.ts',
  'actions/credentials/createCredential.ts',
  'actions/credentials/deleteCredential.ts',
  'actions/analytics/getCreditUsageInPeriod.ts',
  'actions/billing/getAvailableCredits.ts',
  'actions/billing/purchaseCredits.ts',
  'actions/billing/getUserPurchaseHistory.ts',
  'actions/billing/downloadInvoice.ts',
];

async function updateFiles() {
  try {
    for (const file of filesToUpdate) {
      const filePath = path.join(process.cwd(), file);
      const content = await readFile(filePath, 'utf8');
      
      // Replace Clerk auth imports with our custom auth
      const updatedContent = content.replace(
        /import\s+{\s*auth\s*}\s+from\s+["']@clerk\/nextjs\/server["'];?/g, 
        'import { auth } from "@/lib/auth";'
      );
      
      // Make sure to add 'await' before auth() calls since our custom auth() is async
      const finalContent = updatedContent.replace(
        /const\s+{\s*userId[^}]*}\s+=\s+auth\(\)/g,
        'const { userId } = await auth()'
      );
      
      await writeFile(filePath, finalContent, 'utf8');
      console.log(`Updated ${file}`);
    }
    
    console.log('All files updated successfully!');
  } catch (error) {
    console.error('Error updating files:', error);
  }
}

updateFiles();