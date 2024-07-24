import BackButton from "@/components/system/BackButton";
import { Hoa } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { ButtonGroup } from "@chakra-ui/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncomeStatement } from "./income-statement";
import { CashFlowStatement } from "./cash-flow-statement";
import { BalanceSheet } from "./balance-sheet";

interface FinancialReportsProps {
  hoaInfo: Hoa;
  finance: any;
  year: string;
  month: string;
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({
  hoaInfo,
  finance,
  year,
  month,
}) => {
  // Page Title and Description
  const pageTitle = `HOA Financial Reports`;
  const pageDescription = `Generate and access financial reports of the Homeowners' Association.`;

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <BackButton />
          </ButtonGroup>
        }
      />

      <Tabs defaultValue="income">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="income">Income Statements</TabsTrigger>
          <TabsTrigger value="cashFlow">Cash Flow Statements</TabsTrigger>
          <TabsTrigger value="balanceSheet">Balance Sheets</TabsTrigger>
        </TabsList>
        <TabsContent value="income">
          <IncomeStatement
            hoaInfo={hoaInfo}
            finance={finance}
            year={year}
            month={month}
          />
        </TabsContent>
        <TabsContent value="cashFlow">
          <CashFlowStatement
            hoaInfo={hoaInfo}
            finance={finance}
            year={year}
            month={month}
          />
        </TabsContent>
        <TabsContent value="balanceSheet">
          <BalanceSheet
            hoaInfo={hoaInfo}
            finance={finance}
            year={year}
            month={month}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default FinancialReports;
