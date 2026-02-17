"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Label } from "radix-ui";
import { Label } from "@/components/ui/label";
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

const dwhPersonalAccountsColumns = [
  {
    id: 1,
    name: "FILIAL_CODE",
    type: "VARCHAR2",
    length: 5,
    precision: null,
    scale: null,
    nullable: "N",
  },
  {
    id: 2,
    name: "ACCOUNT_CODE",
    type: "VARCHAR2",
    length: 20,
    precision: null,
    scale: null,
    nullable: "N",
  },
  {
    id: 3,
    name: "ACCOUNT_CO",
    type: "VARCHAR2",
    length: 20,
    precision: null,
    scale: null,
    nullable: "N",
  },
  {
    id: 4,
    name: "SALDO_IN",
    type: "NUMBER",
    length: 22,
    precision: 20,
    scale: 0,
    nullable: "N",
  },
  {
    id: 5,
    name: "SALDO_OUT",
    type: "NUMBER",
    length: 22,
    precision: 20,
    scale: 0,
    nullable: "N",
  },
  {
    id: 6,
    name: "SALDO_IN_EQV",
    type: "NUMBER",
    length: 22,
    precision: 20,
    scale: 0,
    nullable: "N",
  },
  {
    id: 7,
    name: "SALDO_OUT_EQV",
    type: "NUMBER",
    length: 22,
    precision: 20,
    scale: 0,
    nullable: "N",
  },
  {
    id: 8,
    name: "DOC_NUMB",
    type: "VARCHAR2",
    length: 20,
    precision: null,
    scale: null,
    nullable: "N",
  },
  {
    id: 9,
    name: "DOCUMENT_CODE",
    type: "NUMBER",
    length: 22,
    precision: 3,
    scale: 0,
    nullable: "N",
  },
  {
    id: 10,
    name: "BANK_CO",
    type: "VARCHAR2",
    length: 5,
    precision: null,
    scale: null,
    nullable: "N",
  },
  {
    id: 11,
    name: "PAYMENT_SUM_EQV",
    type: "NUMBER",
    length: 22,
    precision: 20,
    scale: 0,
    nullable: "N",
  },
  {
    id: 12,
    name: "DEBIT",
    type: "NUMBER",
    length: 22,
    precision: 20,
    scale: 0,
    nullable: "Y",
  },
  {
    id: 13,
    name: "CREDIT",
    type: "NUMBER",
    length: 22,
    precision: 20,
    scale: 0,
    nullable: "Y",
  },
  {
    id: 14,
    name: "DATE_LEAD",
    type: "DATE",
    length: 7,
    precision: null,
    scale: null,
    nullable: "Y",
  },
  {
    id: 15,
    name: "OPER_DAY",
    type: "DATE",
    length: 7,
    precision: null,
    scale: null,
    nullable: "N",
  },
  {
    id: 16,
    name: "CURRENCY_CODE",
    type: "VARCHAR2",
    length: 3,
    precision: null,
    scale: null,
    nullable: "N",
  },
  {
    id: 17,
    name: "CURRENCY_COURSE",
    type: "NUMBER",
    length: 22,
    precision: 20,
    scale: 2,
    nullable: "Y",
  },
  {
    id: 18,
    name: "EMPLOYEE_CODE",
    type: "NUMBER",
    length: 22,
    precision: 15,
    scale: 0,
    nullable: "Y",
  },
  {
    id: 19,
    name: "EMPLOYEE_NAME",
    type: "VARCHAR2",
    length: 80,
    precision: null,
    scale: null,
    nullable: "Y",
  },
  {
    id: 20,
    name: "CASH_SYMBOL",
    type: "VARCHAR2",
    length: 5,
    precision: null,
    scale: null,
    nullable: "Y",
  },
  {
    id: 21,
    name: "LEAD_ID",
    type: "NUMBER",
    length: 22,
    precision: 12,
    scale: 0,
    nullable: "N",
  },
  {
    id: 22,
    name: "ACC_ID",
    type: "NUMBER",
    length: 22,
    precision: 12,
    scale: 0,
    nullable: "N",
  },
  {
    id: 23,
    name: "DC_SIGN",
    type: "NUMBER",
    length: 22,
    precision: 1,
    scale: 0,
    nullable: "N",
  },
  {
    id: 24,
    name: "LOCAL_CODE",
    type: "VARCHAR2",
    length: 5,
    precision: null,
    scale: null,
    nullable: "Y",
  },
  {
    id: 25,
    name: "BRANCH_ID",
    type: "NUMBER",
    length: 22,
    precision: 5,
    scale: 0,
    nullable: "Y",
  },
  {
    id: 26,
    name: "CALENDAR_DAY",
    type: "DATE",
    length: 7,
    precision: null,
    scale: null,
    nullable: "Y",
  },
  {
    id: 27,
    name: "BXM_CODE",
    type: "VARCHAR2",
    length: 5,
    precision: null,
    scale: null,
    nullable: "Y",
  },
  {
    id: 28,
    name: "BXM_CODE_CO",
    type: "VARCHAR2",
    length: 5,
    precision: null,
    scale: null,
    nullable: "Y",
  },
  {
    id: 29,
    name: "BRANCH_ID_CO",
    type: "NUMBER",
    length: 22,
    precision: 5,
    scale: 0,
    nullable: "Y",
  },
  {
    id: 30,
    name: "LOCAL_CODE_CO",
    type: "VARCHAR2",
    length: 5,
    precision: null,
    scale: null,
    nullable: "Y",
  },
];

const ddlSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  length: z.union([z.number(), z.string()]).nullable(),
  precision: z.union([z.number(), z.string()]).nullable(),
  scale: z.union([z.number(), z.string()]).nullable(),
  nullable: z.string(),
});

const formSchema = z.object({
  source_db: z.string(),
  source_schema: z.string(),
  source_table: z.string(),

  target_schema: z.string(),
  target_table: z.string(),
  target_table_created: z.boolean(),

  ddl: z.array(ddlSchema),

  update_type: z.string(),
  key_column: z.string(),
  backfilling: z.boolean(),
  chunk_size: z.number(),
});

export function DagForm() {
  console.log(formSchema);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source_db: "IABS STBY",
      source_schema: "ibs",
      target_schema: "ibs",
      target_table_created: false,
      update_type: "increment",
      backfilling: true,
      chunk_size: 100_000,
      ddl: dwhPersonalAccountsColumns,
    },
  });

  function onSubmit(data) {
    console.log(data);
    // toast("You submitted the following values:", {
    //   description: (
    //     <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
    //       <code>{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    //   position: "bottom-right",
    //   classNames: {
    //     content: "flex flex-col gap-2",
    //   },
    //   style: {
    //     "--border-radius": "calc(var(--radius)  + 4px)",
    //   },
    // });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">New DAG</CardTitle>
        {/* <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription> */}
      </CardHeader>

      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="source_db"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-row">
                  <FieldLabel
                    htmlFor="form-rhf-demo-source-db"
                    className="!w-[10%]"
                  >
                    Source Database
                  </FieldLabel>

                  <Select
                    id="form-rhf-demo-source-db"
                    aria-invalid={fieldState.invalid}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>

                    <SelectContent align="end">
                      <SelectGroup>
                        <SelectItem value="IABS STBY">IABS STBY</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="source_schema"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-row">
                  <FieldLabel
                    htmlFor="form-rhf-demo-title"
                    className="!w-[10%]"
                  >
                    Source Schema
                  </FieldLabel>

                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Table's schema"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="source_table"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-row">
                  <FieldLabel
                    htmlFor="form-rhf-demo-title"
                    className="!w-[10%]"
                  >
                    Source Table
                  </FieldLabel>

                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Table name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="target_schema"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-row">
                  <FieldLabel
                    htmlFor="form-rhf-demo-source-db"
                    className="!w-[10%]"
                  >
                    Target Schema
                  </FieldLabel>

                  <Select
                    id="form-rhf-demo-source-db"
                    aria-invalid={fieldState.invalid}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a target table's schema" />
                    </SelectTrigger>

                    <SelectContent align="end">
                      <SelectGroup>
                        {/* <SelectLabel>Fruits</SelectLabel> */}
                        <SelectItem value="ibs">ibs</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="target_table"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-row">
                  <FieldLabel
                    htmlFor="form-rhf-demo-title"
                    className="!w-[10%]"
                  >
                    Target Table
                  </FieldLabel>

                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Table name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="target_table_created"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-row">
                  <FieldLabel
                    htmlFor="form-rhf-demo-title"
                    className="!w-[20%]"
                  >
                    Has table been created already?
                  </FieldLabel>

                  <div
                    className="flex gap-[20px]"
                    onClick={() => field.onChange((ch) => !ch)}
                  >
                    <div className="flex items-center">
                      <Checkbox
                        id="terms-checkbox"
                        name="terms-checkbox"
                        className="mr-[10px]"
                        checked={field.value === true}
                        readOnly
                      />
                      <Label>Yes</Label>
                    </div>

                    <div className="flex items-center">
                      <Checkbox
                        id="terms-checkbox"
                        name="terms-checkbox"
                        className="mr-[10px]"
                        checked={field.value === false}
                        readOnly
                      />
                      <Label>No</Label>
                    </div>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="ddl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-rhf-demo-title"
                    className="!w-[20%]"
                  >
                    Please check the columns order to match
                  </FieldLabel>

                  <div className="flex gap-[20px]">
                    <Table className="bg-[rgb(199,70,52)]">
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
                        {field.value.map((r) => (
                          <TableRow key={r.id}>
                            <TableCell className="font-medium">
                              {r.id}
                            </TableCell>
                            <TableCell>{r.name}</TableCell>
                            <TableCell>{r.type}</TableCell>
                            <TableCell>{r.length}</TableCell>
                            <TableCell>{r.precision}</TableCell>
                            <TableCell>{r.scale}</TableCell>
                            <TableCell>{r.nullable}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <Table className="bg-[rgb(0,135,118)]">
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
                        {field.value.map((r, rIdx) => (
                          <TableRow key={r.id}>
                            <TableCell className="font-medium">
                              {r.id}
                            </TableCell>
                            <TableCell>{r.name}</TableCell>
                            <TableCell>{r.type}</TableCell>

                            <TableCell className="py-[2px]">
                              <Input
                                value={r.length}
                                onChange={(e) => {
                                  const newValue = e.target.value;

                                  const updated = field.value.map(
                                    (item, index) =>
                                      index === rIdx
                                        ? { ...item, length: newValue }
                                        : item,
                                  );

                                  field.onChange(updated);
                                }}
                                className="!h-5"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={r.precision}
                                onChange={(e) => {
                                  const newValue = e.target.value;

                                  const updated = field.value.map(
                                    (item, index) =>
                                      index === rIdx
                                        ? { ...item, precision: newValue }
                                        : item,
                                  );

                                  field.onChange(updated);
                                }}
                                className="!h-5"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={r.scale}
                                onChange={(e) => {
                                  const newValue = e.target.value;

                                  const updated = field.value.map(
                                    (item, index) =>
                                      index === rIdx
                                        ? { ...item, scale: newValue }
                                        : item,
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

                                  const updated = field.value.map(
                                    (item, index) =>
                                      index === rIdx
                                        ? { ...item, nullable: newValue }
                                        : item,
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

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="update_type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-row">
                  <FieldLabel
                    htmlFor="form-rhf-demo-title"
                    className="!w-[10%]"
                  >
                    Update Type
                  </FieldLabel>

                  <div className="flex gap-[20px]">
                    <div className="flex items-center">
                      <Checkbox
                        id="terms-checkbox1"
                        name="terms-checkbox1"
                        className="mr-[10px]"
                        checked={field.value === "increment"}
                        onCheckedChange={() => field.onChange("increment")}
                      />
                      <Label>Increment</Label>
                    </div>

                    <div className="flex items-center">
                      <Checkbox
                        id="terms-checkbox2"
                        name="terms-checkbox2"
                        className="mr-[10px]"
                        checked={field.value === "change"}
                        onCheckedChange={() => field.onChange("change")}
                      />
                      <Label>Change</Label>
                    </div>

                    <div className="flex items-center">
                      <Checkbox
                        id="terms-checkbox3"
                        name="terms-checkbox3"
                        className="mr-[10px]"
                        checked={field.value === "fully"}
                        onCheckedChange={() => field.onChange("fully")}
                      />
                      <Label>Fully</Label>
                    </div>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="key_column"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-row">
                  <FieldLabel
                    htmlFor="form-rhf-demo-title"
                    className="!w-[10%]"
                  >
                    Key Column
                  </FieldLabel>

                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Key Column name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="backfilling"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-row">
                  <FieldLabel
                    htmlFor="form-rhf-demo-title"
                    className="!w-[10%]"
                  >
                    Backfilling
                  </FieldLabel>

                  <div
                    className="flex gap-[20px]"
                    onClick={() => field.onChange((ch) => !ch)}
                  >
                    <div className="flex items-center">
                      <Checkbox
                        id="terms-checkbox"
                        name="terms-checkbox"
                        className="mr-[10px]"
                        checked={field.value === true}
                      />
                      <Label>Yes</Label>
                    </div>

                    <div className="flex items-center">
                      <Checkbox
                        id="terms-checkbox"
                        name="terms-checkbox"
                        className="mr-[10px]"
                        checked={field.value === false}
                      />
                      <Label>No</Label>
                    </div>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="chunk_size"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-row">
                  <FieldLabel
                    htmlFor="form-rhf-demo-title"
                    className="!w-[10%]"
                  >
                    Chunk Size
                  </FieldLabel>

                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Chunk size of stream"
                    autoComplete="off"
                    type="number"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="w-[50%]"
          >
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo" className="w-[50%]">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
