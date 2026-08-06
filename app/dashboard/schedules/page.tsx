import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

const SchedulePage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 lg:gap-0">
        <div>
          <h1 className="lg:text-2xl text-md font-bold tracking-tight">
            Quản lý lịch trình
          </h1>
          <p className="lg:text-sm text-xs text-muted-foreground text-justify">
            Theo dõi danh sách lịch trình và trạng thái vận hành.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Thêm lịch trình mới
        </Button>
      </div>
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="rounded-t-lg rounded-b-none p-2">
          <TabsTrigger value="schedule">Lịch trình</TabsTrigger>
          <TabsTrigger value="maintenance">Đăng kiểm/Sửa chữa</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Lịch trình</CardTitle>
              <CardDescription>
                View your key metrics and recent project activity. Track
                progress across all your active projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              You have 12 active projects and 3 pending tasks.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and download your detailed reports. Export data in
                multiple formats for analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              You have 5 reports ready and available to export.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and options. Customize your
                experience to fit your needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Configure notifications, security, and themes.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchedulePage;
