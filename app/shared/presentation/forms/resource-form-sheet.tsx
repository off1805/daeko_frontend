"use client"

import * as React from "react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import { Switch } from "~/components/ui/switch"
import {
  parseFormValues,
  type FormField,
  type ParsedFormValues,
} from "~/shared/presentation/forms/form-field"

interface ResourceFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  fields: FormField[]
  initialValues?: object
  submitLabel?: string
  isSubmitting?: boolean
  error?: string | null
  onSubmit: (values: ParsedFormValues) => void
}

/**
 * Formulaire générique de création/modification pour une ressource du
 * référentiel : soumission non contrôlée (FormData natif) — les noms de
 * champs correspondent aux clés des DTO d'entrée du domain, donc aucun
 * état contrôlé par champ n'est nécessaire ici (doc section 5).
 */
export function ResourceFormSheet({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initialValues,
  submitLabel = "Enregistrer",
  isSubmitting,
  error,
  onSubmit,
}: ResourceFormSheetProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(parseFormValues(fields, new FormData(event.currentTarget)))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <form
          key={open ? "open" : "closed"}
          onSubmit={handleSubmit}
          className="flex h-full flex-col"
        >
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description ? (
              <SheetDescription>{description}</SheetDescription>
            ) : null}
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6">
            {fields.map((field) => {
              const initial = (initialValues as Record<string, unknown> | undefined)?.[
                field.name
              ]

              if (field.type === "switch") {
                return (
                  <div
                    key={field.name}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border/60 p-3"
                  >
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      {field.helpText ? (
                        <span className="text-[0.7rem] text-muted-foreground">
                          {field.helpText}
                        </span>
                      ) : null}
                    </div>
                    <Switch
                      id={field.name}
                      name={field.name}
                      defaultChecked={
                        typeof initial === "boolean"
                          ? initial
                          : (field.defaultChecked ?? false)
                      }
                    />
                  </div>
                )
              }

              if (field.type === "select") {
                return (
                  <div key={field.name} className="flex flex-col gap-1.5">
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required ? (
                        <span className="text-destructive">*</span>
                      ) : null}
                    </Label>
                    <Select
                      name={field.name}
                      defaultValue={initial != null ? String(initial) : null}
                      required={field.required}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue
                          placeholder={field.placeholder ?? "Sélectionner…"}
                        >
                          {(current: string | null) =>
                            current == null
                              ? (field.placeholder ?? "Sélectionner…")
                              : (field.options?.find((o) => o.value === current)
                                  ?.label ?? current)
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.helpText ? (
                      <span className="text-[0.7rem] text-muted-foreground">
                        {field.helpText}
                      </span>
                    ) : null}
                  </div>
                )
              }

              if (field.type === "textarea") {
                return (
                  <div key={field.name} className="flex flex-col gap-1.5">
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required ? (
                        <span className="text-destructive">*</span>
                      ) : null}
                    </Label>
                    <textarea
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      defaultValue={initial != null ? String(initial) : ""}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full rounded-md border border-input bg-input/20 px-2 py-1.5 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
                    />
                  </div>
                )
              }

              return (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required ? (
                      <span className="text-destructive">*</span>
                    ) : null}
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type === "number" ? "number" : "text"}
                    step={field.step}
                    required={field.required}
                    defaultValue={initial != null ? String(initial) : ""}
                    placeholder={field.placeholder}
                  />
                  {field.helpText ? (
                    <span className="text-[0.7rem] text-muted-foreground">
                      {field.helpText}
                    </span>
                  ) : null}
                </div>
              )
            })}

            {error ? (
              <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                {error}
              </div>
            ) : null}
          </div>

          <SheetFooter className="flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement…" : submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
