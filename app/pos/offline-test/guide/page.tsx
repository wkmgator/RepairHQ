import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InfoIcon, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "POS Offline Testing Guide - RepairHQ",
  description: "Comprehensive guide for testing the POS offline functionality",
}

export default function POSOfflineTestGuidePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">POS Offline Mode Testing Guide</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="testing">Testing Steps</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>POS Offline Mode Overview</CardTitle>
              <CardDescription>Understanding how the offline mode works in RepairHQ POS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                RepairHQ POS includes a robust offline mode that allows you to continue processing transactions even
                when your internet connection is unstable or unavailable. Here's how it works:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Local Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      When offline, transactions are securely stored in your browser's IndexedDB storage, which can hold
                      significant amounts of data.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Automatic Detection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      The system automatically detects your connection status and switches to offline mode when needed,
                      with no manual intervention required.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Seamless Sync</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      When your connection is restored, the system can automatically or manually sync pending
                      transactions to the server.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Important Note</AlertTitle>
                <AlertDescription>
                  While in offline mode, inventory quantities are not updated in real-time across devices. This means
                  that if multiple terminals are used, the same inventory item could be sold beyond its available
                  quantity. Reconciliation happens when transactions are synced.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Testing Guide</CardTitle>
              <CardDescription>Follow these steps to thoroughly test the offline functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">1. Preparation</h3>
                <div className="ml-6 space-y-2">
                  <p>• Ensure you have access to the POS system and the offline testing tool</p>
                  <p>• Make sure you have some inventory items available for testing</p>
                  <p>• Have a clear understanding of your current inventory quantities</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">2. Simulate Offline Mode</h3>
                <div className="ml-6 space-y-2">
                  <p>
                    • Navigate to the{" "}
                    <Link href="/pos/offline-test" className="text-blue-600 hover:underline">
                      Offline Testing Tool
                    </Link>
                  </p>
                  <p>• Enable "Simulation Mode" using the toggle switch</p>
                  <p>• Click "Toggle Status" to switch to offline mode</p>
                  <p>• Verify that the status indicator shows "Offline"</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">3. Process Transactions Offline</h3>
                <div className="ml-6 space-y-2">
                  <p>
                    • Navigate to the{" "}
                    <Link href="/pos" className="text-blue-600 hover:underline">
                      POS Screen
                    </Link>
                  </p>
                  <p>• Add items to the cart as you normally would</p>
                  <p>• Complete the checkout process</p>
                  <p>• You should see a notification that the transaction was saved offline</p>
                  <p>• Process 2-3 transactions to have a good sample for testing</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">4. Verify Local Storage</h3>
                <div className="ml-6 space-y-2">
                  <p>
                    • Return to the{" "}
                    <Link href="/pos/offline-test" className="text-blue-600 hover:underline">
                      Offline Testing Tool
                    </Link>
                  </p>
                  <p>• Verify that your transactions appear in the "Pending Offline Transactions" section</p>
                  <p>• Check that the transaction details are correct</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">5. Sync Transactions</h3>
                <div className="ml-6 space-y-2">
                  <p>• While still in the testing tool, toggle back to "Online" mode</p>
                  <p>• Click the "Sync Transactions" button</p>
                  <p>• Wait for the sync process to complete</p>
                  <p>• Verify the sync results show success for all transactions</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">6. Verify Server Data</h3>
                <div className="ml-6 space-y-2">
                  <p>
                    • Navigate to{" "}
                    <Link href="/pos/transactions" className="text-blue-600 hover:underline">
                      Transaction History
                    </Link>
                  </p>
                  <p>• Verify that all your offline transactions now appear in the history</p>
                  <p>• Check that inventory quantities have been properly updated</p>
                </div>
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success Criteria</AlertTitle>
                <AlertDescription>
                  Your test is successful if:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Transactions can be processed while offline</li>
                    <li>Transactions are stored locally</li>
                    <li>Transactions sync correctly when back online</li>
                    <li>Inventory is updated properly after sync</li>
                    <li>Receipts can be generated for offline transactions</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Common Issues</CardTitle>
              <CardDescription>Solutions for common problems encountered during offline mode testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Transactions Not Saving Offline</h3>
                <div className="ml-6 space-y-2">
                  <p className="font-medium">Possible causes:</p>
                  <ul className="list-disc pl-6">
                    <li>Browser storage is full or restricted</li>
                    <li>IndexedDB is not supported by your browser</li>
                    <li>Privacy mode/incognito is being used</li>
                  </ul>

                  <p className="font-medium mt-2">Solutions:</p>
                  <ul className="list-disc pl-6">
                    <li>Clear browser cache and storage</li>
                    <li>Use a modern browser (Chrome, Firefox, Edge)</li>
                    <li>Disable privacy mode</li>
                    <li>Check browser console for specific errors</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sync Failures</h3>
                <div className="ml-6 space-y-2">
                  <p className="font-medium">Possible causes:</p>
                  <ul className="list-disc pl-6">
                    <li>Unstable internet connection during sync</li>
                    <li>Server-side validation errors</li>
                    <li>Inventory conflicts (item sold out while offline)</li>
                    <li>Authentication token expired</li>
                  </ul>

                  <p className="font-medium mt-2">Solutions:</p>
                  <ul className="list-disc pl-6">
                    <li>Ensure stable internet before syncing</li>
                    <li>Check transaction details for invalid data</li>
                    <li>Refresh the page to update authentication</li>
                    <li>Try syncing transactions one by one</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Inventory Discrepancies</h3>
                <div className="ml-6 space-y-2">
                  <p className="font-medium">Possible causes:</p>
                  <ul className="list-disc pl-6">
                    <li>Multiple terminals selling the same items while offline</li>
                    <li>Inventory updates from other sources during offline period</li>
                    <li>Failed sync of some transactions</li>
                  </ul>

                  <p className="font-medium mt-2">Solutions:</p>
                  <ul className="list-disc pl-6">
                    <li>Perform inventory reconciliation after extended offline use</li>
                    <li>Check transaction history for missing transactions</li>
                    <li>Manually adjust inventory quantities if needed</li>
                  </ul>
                </div>
              </div>

              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Data Loss Prevention</AlertTitle>
                <AlertDescription>
                  If you're experiencing persistent issues with offline mode, do not clear browser data until you've
                  successfully synced or backed up your offline transactions. Contact support if you need assistance
                  recovering transaction data.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about the POS offline functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">How long can I operate in offline mode?</h3>
                <p className="ml-6">
                  You can operate in offline mode indefinitely, as long as you have sufficient storage space in your
                  browser. However, we recommend syncing as soon as possible to avoid potential inventory conflicts and
                  to ensure your data is backed up on the server.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Can I print receipts while offline?</h3>
                <p className="ml-6">
                  Yes, receipt printing works in offline mode for locally connected printers. Network printers may not
                  be accessible depending on the nature of your network outage.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">What happens if I clear my browser cache?</h3>
                <p className="ml-6">
                  Clearing your browser cache or data will erase any pending offline transactions that haven't been
                  synced. Always ensure you've synced your transactions before clearing browser data.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Can multiple terminals work offline simultaneously?</h3>
                <p className="ml-6">
                  Yes, multiple terminals can work offline simultaneously. However, be aware that inventory quantities
                  won't be synchronized between terminals until they reconnect and sync with the server. This could
                  potentially lead to overselling items.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Are there any features that don't work offline?</h3>
                <p className="ml-6">Some features that require server connectivity won't be available offline:</p>
                <ul className="list-disc pl-12">
                  <li>Customer creation/editing</li>
                  <li>Real-time inventory updates from other terminals</li>
                  <li>Cloud-based receipt storage</li>
                  <li>Online payment processing (credit card transactions may be stored for later processing)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">How do I know if I'm in offline mode?</h3>
                <p className="ml-6">
                  The POS interface displays a connection status indicator. When offline, you'll see an "Offline Mode"
                  badge at the top of the screen, and certain operations will show offline-specific messaging.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button asChild>
              <Link href="/pos/offline-test">
                Go to Testing Tool
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
