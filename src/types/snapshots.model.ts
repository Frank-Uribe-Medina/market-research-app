export interface BrightDataResponseShape {
  readonly status: string
  readonly snapshot_id: string
  readonly dataset_id: string
  readonly records: number
  readonly errors: number
  readonly collection_duration: number
}
