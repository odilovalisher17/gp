"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, FormProvider } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ComboboxDemo } from "./ComboboxDemo";
import TableDDL from "./TableDDL";

const ddlSchema = z.object({
  column_id: z.number(),
  column_name: z.string(),
  data_type: z.string(),
  data_length: z.union([z.number(), z.string()]).nullable(),
  data_precision: z.union([z.number(), z.string()]).nullable(),
  data_scale: z.union([z.number(), z.string()]).nullable(),
  nullable: z.string(),
});

const formSchema = z
  .object({
    source_db: z.string(),
    source_schema: z.string(),
    source_table: z.string(),

    target_schema: z.string(),
    target_table: z.string(),
    target_table_created: z.boolean(),

    source_ddl: z.array(ddlSchema).optional(),
    ddl: z.array(ddlSchema).optional(),

    primary_keys: z.array(z.string()).optional(),
    distribution_keys: z.array(z.string()).optional(),
    partition: z.boolean(),
    partition_details: z
      .object({
        key: z.string().optional(),
        start: z.string().optional(),
        end: z.string().optional(),
        interval: z.string().optional(),
      })
      .optional(),
    with_config: z
      .object({
        appendoptimized: z.boolean(),
        orientation: z.string(),
        compresstype: z.string(),
        compresslevel: z.number().min(1).max(9),
      })
      .optional(),

    update_type: z.string(),
    key_column: z.string(),
    backfilling: z.boolean(),
    chunk_size: z.number(),
    conflict_cols: z.array(z.string()).min(1),
    conflict_action: z.string(),
    conflict_set: z.array(z.array(z.string()).min(2)).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      !data.target_table_created &&
      (!data.source_ddl || data.source_ddl.length === 0)
    ) {
      ctx.addIssue({
        path: ["source_ddl"],
        code: z.ZodIssueCode.custom,
        message: "Select at least one primary key",
      });
    }

    if (!data.target_table_created && (!data.ddl || data.ddl.length === 0)) {
      ctx.addIssue({
        path: ["ddl"],
        code: z.ZodIssueCode.custom,
        message: "Select at least one primary key",
      });
    }

    if (
      !data.target_table_created &&
      (!data.primary_keys || data.primary_keys.length === 0)
    ) {
      ctx.addIssue({
        path: ["primary_keys"],
        code: z.ZodIssueCode.custom,
        message: "Select at least one primary key",
      });
    }

    if (
      !data.target_table_created &&
      (!data.distribution_keys || data.distribution_keys.length === 0)
    ) {
      ctx.addIssue({
        path: ["distribution_keys"],
        code: z.ZodIssueCode.custom,
        message: "Select at least one distribution key",
      });
    }

    if (
      !data.target_table_created &&
      !data.partition &&
      data.partition_details.key
    ) {
      ctx.addIssue({
        path: ["partition_details"],
        code: z.ZodIssueCode.custom,
        message: "Select partition key",
      });
    }

    if (!data.target_table_created && !data.with_config) {
      ctx.addIssue({
        path: ["partition_details"],
        code: z.ZodIssueCode.custom,
        message: "Select partition key",
      });
    }

    if (
      data.conflict_action === "do_update" &&
      (!data.conflict_set ||
        data.conflict_set.length === 0 ||
        !data.conflict_set.every((cv) => cv.length === 2))
    ) {
      ctx.addIssue({
        path: ["conflict_set"],
        code: z.ZodIssueCode.custom,
        message: "Select conflict key",
      });
    }
  });

export function DagForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source_db: "IABS STBY",
      source_schema: "ibs",
      target_schema: "ibs",
      target_table_created: true,
      update_type: "increment",
      backfilling: false,
      chunk_size: 100_000,
      // ddl: dwhPersonalAccountsColumns,
      primary_keys: [],
      distribution_keys: [],
      partition: false,
      partition_details: {
        key: undefined,
        start: "1991-01-01",
        end: "2050-01-01",
        interval: "1 month",
      },
      with_config: {
        appendoptimized: false,
        orientation: "row",
        compresstype: "zstd",
        compresslevel: 5,
      },
      conflict_action: "do_nothing",
      conflict_cols: [],
      conflict_set: [[]],
    },
  });
  const [openPrimaryKeys, setOpenPrimaryKeys] = React.useState(false);
  const [openDistributionKeys, setOpenDistributionKeys] = React.useState(false);
  const [openConflictCols, setOpenConflictCols] = React.useState(false);
  const [openConflictSet, setOpenConflictSet] = React.useState({
    0: { first: false, second: false },
  });
  const sourceddlColumns = form.watch("source_table");
  const ddlColumns = form.watch("ddl");
  const createTable = form.watch("target_table_created");
  const partition = form.watch("partition");
  const conflict_action = form.watch("conflict_action");

  React.useEffect(() => {
    fetch(
      `http://${import.meta.env.VITE_BACKEND_URL}/api/airflow/dag/create/initial-ddl?owner=IBS&table=${sourceddlColumns}`,
    )
      .then((res) => res.json())
      .then((data) => {
        form.setValue("source_ddl", data.ddl);
        form.setValue("ddl", data.suggested_ddl);
      });
  }, [sourceddlColumns]);

  function onSubmit(data) {
    console.log(data);
    fetch(`http://${import.meta.env.VITE_BACKEND_URL}/api/airflow/dag/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <FormProvider {...form}>
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

                    {/* <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Table name"
                    autoComplete="off"
                  /> */}
                    <ComboboxDemo field={field} form={form} />
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

              <Controller
                name="conflict_cols"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex-row">
                    <FieldLabel className="!w-[20%]">
                      Conflict Column(s)
                    </FieldLabel>

                    <Popover
                      open={openConflictCols}
                      onOpenChange={setOpenConflictCols}
                    >
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="!w-[80%]">
                          {field.value?.length
                            ? field.value.join(", ")
                            : "Select primary key(s)"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-60 p-0">
                        <Command>
                          <CommandInput placeholder="Search columns..." />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            {(ddlColumns?.map((c) => c.column_name) || []).map(
                              (option) => (
                                <CommandItem
                                  key={option}
                                  onSelect={() => {
                                    const newValue = field.value.includes(
                                      option,
                                    )
                                      ? field.value.filter((v) => v !== option)
                                      : [...field.value, option];
                                    field.onChange(newValue);
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={field.value?.includes(option)}
                                    readOnly
                                    className="mr-2"
                                  />
                                  {option}
                                </CommandItem>
                              ),
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="conflict_action"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex-row">
                    <FieldLabel
                      htmlFor="form-rhf-demo-source-db"
                      className="!w-[10%]"
                    >
                      Conflict Action
                    </FieldLabel>

                    <Select
                      aria-invalid={fieldState.invalid}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>

                      <SelectContent align="end">
                        <SelectGroup>
                          <SelectItem value="do_nothing">DO NOTHING</SelectItem>
                          <SelectItem value="do_update">DO UPDATE</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {conflict_action === "do_update" && (
                <Controller
                  name="conflict_set"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="flex-row"
                    >
                      <FieldLabel
                        htmlFor="form-rhf-demo-source-db"
                        className="!w-[10%]"
                      >
                        Conflict SET
                      </FieldLabel>

                      <div>
                        {field.value?.map((key, idx, arr) => (
                          <div className="flex items-center gap-[20px]">
                            <div>SET</div>
                            <Popover
                              open={openConflictSet[idx]?.first}
                              onOpenChange={() =>
                                setOpenConflictSet((prev) => ({
                                  ...prev,
                                  [idx]: {
                                    ...prev[idx],
                                    first: !prev[idx].first,
                                  },
                                }))
                              }
                            >
                              <PopoverTrigger asChild>
                                <Button variant="outline">
                                  {/* {field.value
                                ? field?.value?.join(", ")
                                : "Select primary key(s)"} */}
                                  {key[0]}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput placeholder="Search columns..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No results found.
                                    </CommandEmpty>
                                    {(
                                      ddlColumns?.map((c) => c.column_name) ||
                                      []
                                    ).map((option) => (
                                      <CommandItem
                                        key={option}
                                        onSelect={() => {
                                          const newValue = [...field.value];
                                          newValue[idx][0] = option;
                                          field.onChange(newValue);
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={key[0] === option}
                                          readOnly
                                          className="mr-2"
                                        />
                                        {option}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <div>=EXCLUDED. </div>
                            <Popover
                              // open={openConflictSet2}
                              // onOpenChange={setOpenConflictSet2}
                              open={openConflictSet[idx]?.second}
                              onOpenChange={() =>
                                setOpenConflictSet((prev) => ({
                                  ...prev,
                                  [idx]: {
                                    ...prev[idx],
                                    second: !prev[idx].second,
                                  },
                                }))
                              }
                            >
                              <PopoverTrigger asChild>
                                <Button variant="outline">
                                  {/* {field.value
                                ? field?.value?.join(", ")
                                : "Select primary key(s)"} */}
                                  {key[1]}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput placeholder="Search columns..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No results found.
                                    </CommandEmpty>
                                    {(
                                      ddlColumns?.map((c) => c.column_name) ||
                                      []
                                    ).map((option) => (
                                      <CommandItem
                                        key={option}
                                        onSelect={() => {
                                          const newValue = [...field.value];
                                          newValue[idx][1] = option;
                                          field.onChange(newValue);
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={key[1] === option}
                                          readOnly
                                          className="mr-2"
                                        />
                                        {option}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        ))}

                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            const newValue = [...field.value, []];

                            field.onChange(newValue);
                            setOpenConflictSet((s) => ({
                              ...s,
                              [Object.keys(s).length]: {
                                first: false,
                                second: false,
                              },
                            }));
                          }}
                        >
                          Add
                        </Button>
                      </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}

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

                    <div className="flex gap-[20px]">
                      <div className="flex items-center">
                        <Checkbox
                          id="terms-checkbox"
                          name="terms-checkbox"
                          className="mr-[10px]"
                          onCheckedChange={() => field.onChange(true)}
                          checked={field.value === true}
                        />
                        <Label>Yes</Label>
                      </div>

                      <div className="flex items-center">
                        <Checkbox
                          id="terms-checkbox"
                          name="terms-checkbox"
                          className="mr-[10px]"
                          onCheckedChange={() => field.onChange(false)}
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

              {!createTable && (
                <>
                  <Controller
                    name="source_ddl"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="form-rhf-demo-title"
                          className="!w-[20%]"
                        >
                          Please check the columns order to match
                        </FieldLabel>

                        <TableDDL field={field} />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="primary_keys"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="flex-row"
                      >
                        <FieldLabel htmlFor="primary_keys" className="!w-[20%]">
                          Primary Key(s)
                        </FieldLabel>

                        <Popover
                          open={openPrimaryKeys}
                          onOpenChange={setOpenPrimaryKeys}
                        >
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="!w-[80%]">
                              {field.value.length
                                ? field.value.join(", ")
                                : "Select primary key(s)"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 p-0">
                            <Command>
                              <CommandInput placeholder="Search columns..." />
                              <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                {(
                                  ddlColumns?.map((c) => c.column_name) || []
                                ).map((option) => (
                                  <CommandItem
                                    key={option}
                                    onSelect={() => {
                                      const newValue = field.value.includes(
                                        option,
                                      )
                                        ? field.value.filter(
                                            (v) => v !== option,
                                          )
                                        : [...field.value, option];
                                      field.onChange(newValue);
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={field.value.includes(option)}
                                      readOnly
                                      className="mr-2"
                                    />
                                    {option}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="distribution_keys"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="flex-row"
                      >
                        <FieldLabel
                          htmlFor="distribution_keys"
                          className="!w-[20%]"
                        >
                          Distribution Key(s)
                        </FieldLabel>

                        <Popover
                          open={openDistributionKeys}
                          onOpenChange={setOpenDistributionKeys}
                        >
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="!w-[80%]">
                              {field.value.length
                                ? field.value.join(", ")
                                : "Select distribution key(s)"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 p-0">
                            <Command>
                              <CommandInput placeholder="Search columns..." />
                              <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                {(
                                  ddlColumns?.map((c) => c.column_name) || []
                                ).map((option) => (
                                  <CommandItem
                                    key={option}
                                    onSelect={() => {
                                      const newValue = field.value.includes(
                                        option,
                                      )
                                        ? field.value.filter(
                                            (v) => v !== option,
                                          )
                                        : [...field.value, option];
                                      field.onChange(newValue);
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={field.value.includes(option)}
                                      readOnly
                                      className="mr-2"
                                    />
                                    {option}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="partition"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="flex-row"
                      >
                        <FieldLabel
                          htmlFor="form-rhf-demo-title"
                          className="!w-[10%]"
                        >
                          Partition
                        </FieldLabel>

                        <div className="flex gap-[20px]">
                          <div className="flex items-center">
                            <Checkbox
                              id="terms-checkbox"
                              name="terms-checkbox"
                              className="mr-[10px]"
                              onCheckedChange={() => field.onChange(true)}
                              checked={field.value === true}
                            />
                            <Label>Yes</Label>
                          </div>

                          <div className="flex items-center">
                            <Checkbox
                              id="terms-checkbox"
                              name="terms-checkbox"
                              className="mr-[10px]"
                              onCheckedChange={() => field.onChange(false)}
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

                  {partition && (
                    <Controller
                      name="partition_details"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="flex-row items-center"
                        >
                          Partition by range (
                          <Select
                            id="form-rhf-demo-source-db"
                            aria-invalid={fieldState.invalid}
                            onValueChange={(val) =>
                              field.onChange({
                                ...field.value,
                                key: val,
                              })
                            }
                            value={field.value.key}
                          >
                            <SelectTrigger className="!w-[10%]">
                              <SelectValue placeholder="Select a partition key" />
                            </SelectTrigger>

                            <SelectContent align="end">
                              <SelectGroup>
                                {(
                                  ddlColumns?.map((c) => c.column_name) || []
                                ).map((c) => (
                                  <SelectItem value={c} key={c}>
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          ) (START (
                          <Input
                            className="!w-fit"
                            value={field.value.start}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                start: e.target.value,
                              })
                            }
                            aria-invalid={fieldState.invalid}
                            placeholder="Start date"
                            autoComplete="off"
                          />
                          ) END (
                          <Input
                            className="!w-fit"
                            value={field.value.end}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                end: e.target.value,
                              })
                            }
                            aria-invalid={fieldState.invalid}
                            placeholder="End date"
                            autoComplete="off"
                          />
                          ) EVERY ( INTERVAL
                          <Input
                            className="!w-fit"
                            value={field.value.interval}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                interval: e.target.value,
                              })
                            }
                            aria-invalid={fieldState.invalid}
                            placeholder="Interval"
                            autoComplete="off"
                          />
                          )
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  )}

                  <Controller
                    name="with_config"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="flex-row items-center"
                      >
                        <FieldLabel
                          htmlFor="form-rhf-demo-title"
                          className="!w-[10%]"
                        >
                          Table Config
                        </FieldLabel>

                        <div className="grid grid-cols-[1fr_1fr_1fr_1fr]">
                          <div
                            className="flex items-center justify-center gap-[20px] border-[2px] px-[10px] py-[5px]"
                            onClick={() => field.onChange((ch) => !ch)}
                          >
                            <div>Append Optimized : </div>

                            <div className="flex items-center">
                              <Checkbox
                                id="terms-checkbox"
                                name="terms-checkbox"
                                className="mr-[10px]"
                                checked={field.value.appendoptimized === true}
                              />
                              <Label>True</Label>
                            </div>

                            <div className="flex items-center">
                              <Checkbox
                                id="terms-checkbox"
                                name="terms-checkbox"
                                className="mr-[10px]"
                                checked={field.value.appendoptimized === false}
                              />
                              <Label>False</Label>
                            </div>
                          </div>

                          <div className="flex items-center justify-center gap-[20px] border-[2px] px-[10px] py-[5px]">
                            <div className="w-full">Orientation : </div>

                            <Select
                              aria-invalid={fieldState.invalid}
                              onValueChange={field.onChange}
                              value={field.value.orientation}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>

                              <SelectContent align="end">
                                <SelectGroup>
                                  <SelectItem value="row">row</SelectItem>
                                  <SelectItem value="column">column</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-center gap-[20px] border-[2px] px-[10px] py-[5px]">
                            <div className="w-full">Compress Type : </div>

                            <Select
                              aria-invalid={fieldState.invalid}
                              onValueChange={field.onChange}
                              value={field.value.compresstype}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>

                              <SelectContent align="end">
                                <SelectGroup>
                                  <SelectItem value="zstd">zstd</SelectItem>
                                  <SelectItem value="zlib">zlib</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-center gap-[20px] border-[2px] px-[10px] py-[5px]">
                            <div className="w-full">Compress Level : </div>

                            <Input
                              className="!w-fit"
                              value={field.value.compresslevel}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  compresslevel: e.target.value,
                                })
                              }
                              aria-invalid={fieldState.invalid}
                              placeholder="compresslevel"
                              autoComplete="off"
                              type="number"
                              min={1}
                              max={9}
                            />
                          </div>
                        </div>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </>
              )}
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
    </FormProvider>
  );
}
