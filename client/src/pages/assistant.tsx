import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import FinancialChat from "@/components/financial-chat";

export default function Assistant() {
  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto pb-20 md:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Financial Assistant</h1>
        <p className="text-gray-500">
          Ask questions and get personalized financial advice from our AI-powered assistant.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Investment Advice</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Get personalized investment recommendations based on your financial situation and goals.
            </p>
            <div className="mt-4 text-sm">
              Try asking:
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>How should I invest $10,000?</li>
                <li>Are index funds good for beginners?</li>
                <li>What's a good investment strategy for my age?</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Budgeting Help</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Learn how to create and stick to a budget that helps you achieve your financial goals.
            </p>
            <div className="mt-4 text-sm">
              Try asking:
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>How can I reduce my monthly expenses?</li>
                <li>What's a good budgeting strategy for me?</li>
                <li>How much should I be saving each month?</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Debt Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Get strategies to effectively manage and pay down your debt faster.
            </p>
            <div className="mt-4 text-sm">
              Try asking:
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>What's the best way to pay off my credit card debt?</li>
                <li>Should I pay off debt or invest first?</li>
                <li>How can I improve my credit score?</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Chat with your Financial Assistant</h2>
        <FinancialChat />
      </div>
    </div>
  );
}
