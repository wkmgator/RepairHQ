import { ChatWidget } from "@/components/chat-widget"

export default function PricingPage() {
  return (
    <div>
      <h1>Pricing</h1>
      <p>Choose the plan that's right for you.</p>

      {/* Chat Widget */}
      <ChatWidget
        companyName="RepairHQ"
        primaryColor="#2563eb"
        welcomeMessage="Questions about pricing? I can help you choose the perfect plan and get started with RepairHQ!"
      />
    </div>
  )
}
