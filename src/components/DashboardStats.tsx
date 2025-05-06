
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Chart from "./Chart";

// Mock data for charts
const caseBacklogData = [
  { state: "Maharashtra", count: 450 },
  { state: "Delhi", count: 380 },
  { state: "Karnataka", count: 320 },
  { state: "Tamil Nadu", count: 290 },
  { state: "Uttar Pradesh", count: 410 }
];

const monthlyFilingsData = [
  { month: "Jan", filings: 245, disposals: 210 },
  { month: "Feb", filings: 267, disposals: 230 },
  { month: "Mar", filings: 285, disposals: 245 },
  { month: "Apr", filings: 230, disposals: 235 },
  { month: "May", filings: 275, disposals: 250 },
  { month: "Jun", filings: 290, disposals: 240 },
];

const courtTypeData = [
  { type: "District", backlog: 580 },
  { type: "High Courts", backlog: 320 },
  { type: "Supreme Court", backlog: 110 },
  { type: "Consumer", backlog: 230 },
  { type: "Family", backlog: 185 }
];

const DashboardStats = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pending Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lawxpert-navy dark:text-lawxpert-gold">
              47,582
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Case Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lawxpert-navy dark:text-lawxpert-gold">
              15.4 <span className="text-lg">months</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              -0.8 months from previous quarter
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disposal Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lawxpert-navy dark:text-lawxpert-gold">
              87.3%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="backlog" className="w-full">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
          <TabsTrigger value="backlog">Case Backlog</TabsTrigger>
          <TabsTrigger value="filings">Filing vs Disposal</TabsTrigger>
          <TabsTrigger value="court">Court Types</TabsTrigger>
        </TabsList>
        
        <TabsContent value="backlog" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Chart 
              type="bar"
              data={caseBacklogData}
              title="Case Backlog by State"
              subtitle="Top 5 states with highest case backlog"
              xKey="state"
              yKey="count"
              height={350}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="filings" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Chart 
              type="line"
              data={monthlyFilingsData}
              title="Case Filings vs Disposals (6 Months)"
              subtitle="Monthly trends of new cases filed vs cases disposed"
              xKey="month"
              yKey="filings"
              height={350}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="court" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Chart 
              type="pie"
              data={courtTypeData}
              title="Backlog by Court Type"
              subtitle="Distribution of pending cases across different court types"
              xKey="type"
              yKey="backlog"
              height={350}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardStats;
