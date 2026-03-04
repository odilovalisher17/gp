import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";

const TableDDL = ({ field }) => {
  const { control, watch, setValue } = useFormContext();
  const suggestedDDL = watch("ddl");
  // const [DDLs, setDDLs] = useState({});

  return (
    <div className="flex gap-[20px]">
      <Table className="bg-[rgba(199,70,52,0.3)]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Column ID</TableHead>
            <TableHead>Column name</TableHead>
            <TableHead>Column Type</TableHead>
            <TableHead>Data Length</TableHead>
            <TableHead>Data Precision</TableHead>
            <TableHead>Data Scale</TableHead>
            <TableHead>Nullable</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {field.value?.map((r) => (
            <TableRow key={r.column_id}>
              <TableCell className="font-medium">{r.column_id}</TableCell>
              <TableCell>{r.column_name}</TableCell>
              <TableCell>{r.data_type}</TableCell>
              <TableCell>{r.data_length}</TableCell>
              <TableCell>{r.data_precision}</TableCell>
              <TableCell>{r.data_scale}</TableCell>
              <TableCell>{r.nullable}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Table className="bg-[rgba(0,135,118,0.3)]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Column ID</TableHead>
            <TableHead>Column name</TableHead>
            <TableHead>Column Type</TableHead>
            <TableHead>Data Length</TableHead>
            <TableHead>Data Precision</TableHead>
            <TableHead>Data Scale</TableHead>
            <TableHead>Nullable</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suggestedDDL?.map((r, rIdx) => (
            <TableRow key={r.column_id}>
              <TableCell className="font-medium">{r.column_id}</TableCell>
              <TableCell>{r.column_name}</TableCell>
              <TableCell>{r.data_type}</TableCell>

              <TableCell className="py-[2px]">
                <Input
                  value={r.data_length}
                  onChange={(e) => {
                    const newValue = e.target.value * 1;

                    const updated = suggestedDDL.map((item, index) =>
                      index === rIdx
                        ? { ...item, data_length: newValue }
                        : item,
                    );

                    setValue("ddl", updated);
                  }}
                  className="!h-5"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={r.data_precision}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    const updated = field.value.map((item, index) =>
                      index === rIdx ? { ...item, precision: newValue } : item,
                    );

                    field.onChange(updated);
                  }}
                  className="!h-5"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={r.data_scale}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    const updated = field.value.map((item, index) =>
                      index === rIdx ? { ...item, scale: newValue } : item,
                    );

                    field.onChange(updated);
                  }}
                  className="!h-5"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={r.nullable}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    const updated = field.value.map((item, index) =>
                      index === rIdx ? { ...item, nullable: newValue } : item,
                    );

                    field.onChange(updated);
                  }}
                  className="!h-5"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableDDL;
