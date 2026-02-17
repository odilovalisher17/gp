import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ClusterStructure = () => {
  return (
    <div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Cluster Structure</CardTitle>
          {/* <CardDescription>
            Enter your email below to login to your account
          </CardDescription> */}
        </CardHeader>

        <CardContent>
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            {/* <TableHeader>
              <TableRow>
                <TableHead>Total Number of physical servers</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader> */}

            <TableBody>
              <TableRow>
                <TableCell>Total Number of physical servers</TableCell>
                <TableCell>3</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Number of segments</TableCell>
                <TableCell>6</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pr-[30px]">
                  Number of segments on each segment host
                </TableCell>
                <TableCell>3</TableCell>
              </TableRow>
            </TableBody>
            {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter> */}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClusterStructure;
