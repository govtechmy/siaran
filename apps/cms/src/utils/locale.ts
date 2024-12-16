function mapLocale(locale: string) {
  switch (locale) {
    case "en":
      return "en-MY";
    case "ms":
      return "ms-MY";
    default:
      return "ms-MY";
  }
}

export { mapLocale };
