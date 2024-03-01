export type AvailabilityZoneType = "a" | "c";

export const availabilityZones = {
  a: "ap-northeast-1a",
  c: "ap-northeast-1c",
} as const satisfies Record<AvailabilityZoneType, string>;
