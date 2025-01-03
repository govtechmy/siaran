type ConditionOperator =
  | "equals"
  | "greater_than"
  | "greater_than_equal"
  | "less_than"
  | "less_than_equal"
  | "contains"
  | "exists"
  | "in"
  | "not_in"
  | "exists";

type ConditionFieldPressRelease =
  | "relatedAgency"
  | "type"
  | "date_published"
  | "title"
  | "content.plain"
  | "content.markdown";

type ConditionFieldUser = "email";

type ConditionField = ConditionFieldPressRelease | ConditionFieldUser;

type ConditionValueBasedOnField<T> = T extends "relatedAgency"
  ? string[]
  : string;

type SingleConditionOperator<T extends ConditionField> = {
  [K in ConditionOperator]: Record<K, ConditionValueBasedOnField<T>> &
    Partial<Record<Exclude<ConditionOperator, K>, never>>;
}[ConditionOperator];

type SingleConditionClause = {
  [K in ConditionField]: Record<K, SingleConditionOperator<K>> &
    Partial<Record<Exclude<ConditionField, K>, never>>;
}[ConditionField];

type SingleAndClause = {
  and: SinglePossibleClause | SinglePossibleClause[];
};

type SingleOrClause = {
  or: SinglePossibleClause | SinglePossibleClause[];
};

export type SinglePossibleClause =
  | SingleConditionClause
  | SingleAndClause
  | SingleOrClause;

export function whereClause(clause: SinglePossibleClause) {
  const result = where(clause);

  return Object.entries(result)
    .filter(([key, value]) => {
      return value !== undefined && value !== null && value != "";
    })
    .reduce((current, [key, value]) => ({ ...current, [key]: value }), {});
}

function where(
  clause: SinglePossibleClause,
  prefix: string = "",
  result: Record<string, unknown> = {},
  index: number = 0,
): Record<string, unknown> {
  if ("and" in clause) {
    if (Array.isArray(clause.and)) {
      return clause.and.reduce(
        (acc, current, currentIndex) => ({
          ...acc,
          ...where(
            current,
            `${prefix}[and][${currentIndex}]`,
            result,
            index + 1,
          ),
        }),
        {},
      );
    }

    return where(clause.and, `${[prefix]}[and][${index}]`, result, index + 1);
  } else if ("or" in clause) {
    if (Array.isArray(clause.or)) {
      return clause.or.reduce(
        (acc, current, currentIndex) => ({
          ...acc,
          ...where(
            current,
            `${prefix}[or][${currentIndex}]`,
            result,
            index + 1,
          ),
        }),
        {},
      );
    }

    return where(clause.or, `${[prefix]}[or][${index}]`, result, index + 1);
  } else {
    // Assuming we have a clause like the following:
    //   { relatedAgency: { equals: "mof" } }

    // Access the field name in the clause (e.g. "relatedAgency")
    const field = Object.keys(clause)[0] as ConditionField;

    // Check that the field exists
    if (clause[field] !== undefined) {
      // Access the operator in the clause (e.g. "equals")
      const operator = Object.keys(clause[field])[0] as ConditionOperator;

      // The right-hand side of the operator
      const value = clause[field][operator];

      // Use special syntax for array
      if (Array.isArray(value)) {
        value.forEach((item, itemIndex) => {
          result[`where${prefix}[${field}][${operator}][${itemIndex}]`] = item;
        });
      } else {
        result[`where${prefix}[${field}][${operator}]`] = value;
      }
    }
  }

  return result;
}
