export type FormFieldType = "text" | "number" | "textarea" | "select" | "switch"

export interface FormFieldOption {
  label: string
  value: string
}

export interface FormField {
  name: string
  label: string
  type: FormFieldType
  required?: boolean
  placeholder?: string
  helpText?: string
  options?: FormFieldOption[]
  step?: number
  defaultChecked?: boolean
}

export type ParsedFormValues = Record<
  string,
  string | number | boolean | undefined
>

/**
 * Lit un FormData natif (soumission non contrôlée) et le convertit selon le
 * type de chaque champ. Les noms de champs sont censés correspondre
 * exactement aux clés des DTO d'entrée du domain (Create.../Update... Input,
 * doc section 5) — l'appelant caste le résultat plutôt que de dupliquer un
 * mapping par champ.
 */
export function parseFormValues(
  fields: FormField[],
  formData: FormData,
): ParsedFormValues {
  const values: ParsedFormValues = {}
  for (const field of fields) {
    if (field.type === "switch") {
      values[field.name] = formData.get(field.name) != null
      continue
    }
    const raw = formData.get(field.name)
    const str = typeof raw === "string" ? raw.trim() : ""
    if (str === "") {
      values[field.name] = undefined
      continue
    }
    values[field.name] = field.type === "number" ? Number(str) : str
  }
  return values
}

/** Sous-ensemble d'un jeu de champs de création utilisable en modification (REF-008 : les références structurelles ne sont pas incluses). */
export function updatableFields(
  createFields: FormField[],
  structuralFieldNames: string[],
): FormField[] {
  return createFields.filter(
    (field) => !structuralFieldNames.includes(field.name),
  )
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return "Une erreur inattendue est survenue."
}
