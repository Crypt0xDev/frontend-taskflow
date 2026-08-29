"use client";

import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";

import type { Category } from "../type";

type Option = { id: number | null; name: string };

export function UiCategoryCombobox({
  id,
  categories,
  value,
  onChange,
}: {
  id?: string;
  categories: Category[];
  value: number | null;
  onChange: (id: number | null) => void;
}) {
  const options: Option[] = [
    { id: null, name: "Sin categoría" },
    ...categories.map((c) => ({ id: c.id, name: c.name })),
  ];
  const selected = options.find((o) => o.id === value) ?? options[0];

  return (
    <Combobox
      items={options}
      value={selected}
      onValueChange={(option: Option | null) => onChange(option?.id ?? null)}
      itemToStringLabel={(option: Option) => option.name}
      itemToStringValue={(option: Option) => option.name}
    >
      <ComboboxInput id={id} placeholder="Sin categoría" />
      <ComboboxContent>
        <ComboboxEmpty>Sin resultados.</ComboboxEmpty>
        <ComboboxList>
          {(option: Option) => (
            <ComboboxItem key={option.id ?? "none"} value={option}>
              {option.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
