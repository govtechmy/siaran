export function getRegion() {
  const region = process.env.AWS_REGION;

  if (region == null) {
    throw new Error("AWS region not found");
  }

  return region;
}
